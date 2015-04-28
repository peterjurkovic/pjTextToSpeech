'use strict';

angular.module('pjTts.directives', ['pjTts.factories'])
.directive('tts', ['TTSAudio',
    function(TTSAudio) {
        return {
            restrict: 'E',
            template:   '<button ng-click="speak()" class="pj-tts btn btn-primary">'+
                        '<span ng-class="tts.$pending && \'glyphicon-refresh\' || \'glyphicon-volume-down\'" class="glyphicon "></span>'+
                        '</button>',
            scope : {
                ttsText : '@',
                ttsLang : '@'
            },
            link : function(scope){

                scope.tts = false;
                scope.speak = function(){
                    if(!scope.tts){
                        scope.tts = new TTSAudio();
                    }

                    scope.tts.speak({
                        text : scope.ttsText,
                        lang : scope.ttsLang
                    });
                };

                 scope.$on('$destroy', function(){
                     if(scope.tts){
                         scope.tts.clear();
                     }
                 });
            }
        };
    }
]);


'use strict';

angular.module('pjTts.factories', [])
    .factory('TTSAudio' , ['$log', '$timeout', '$interval', '$window', 'AudioLoaderService', '$rootScope', 'TTS_EVENTS',
        function($log, $timeout, $interval, $window, AudioLoaderService, $rootScope, TTS_EVENTS) {
        return function(){

            var self = this,
                isLoaded = false,
                watcher = false,
                cachedVal = null;

            self.$pending = false;
            self.$hasError= false;

            // private methods

            self.isAudioSupported = function(){
                if(typeof $window.Audio === 'undefined'){
                    return false;
                }
                try{
                    new $window.Audio();
                    return true;
                }catch(e){}
                return false;
            };

            var audio =  self.isAudioSupported() ? new $window.Audio() : false;

            self.speak = function(params){

                function play(){
                    $timeout(function(){
                        audio.play();
                        if(!watcher){
                            watcher = $interval(function(){
                                self.$pending = isLoaded && !audio.paused;
                                if(!self.$pending){
                                    $rootScope.$broadcast(TTS_EVENTS.SUCCESS);
                                    self.clear();
                                }
                            }, 50);
                        }
                    },1);
                }

                function handleSuccess(res){
                    audio.src = res.data.path;
                    isLoaded = true;
                    play();
                    self.$hasError = false;
                }

                function handleError(res){
                    self.$hasError = true;
                    $rootScope.$broadcast(TTS_EVENTS.FAILED);
                }

                function getCurrentVal(){
                    return params.text +"#"+ params.lang;
                }

                if(!self.isAudioSupported()){
                    $log.warn('HTML5 audio is not supported.');
                    return;
                }

                if(!angular.isDefined(params) || !params.text.length){
                    var e = 'Nothing to speak';
                    $log.warn(e);
                    $rootScope.$broadcast(TTS_EVENTS.FAILED, e);
                    return;
                }

                // prevent sends duplicate requests
                if(!isLoaded || cachedVal !== getCurrentVal()){
                    self.clear();
                    $rootScope.$broadcast(TTS_EVENTS.PENDING, params.text);
                    self.$pending = true;
                    cachedVal = getCurrentVal();
                    AudioLoaderService.load(params)
                    .then( handleSuccess, handleError );
                }else{
                    play();
                }


            };

            self.clear = function(){
              if(watcher){
                  $interval.cancel( watcher );
                  watcher = false;
              }
            };
        };
    }])
    .service('AudioLoaderService' , ['$http', 'TTSConfig', function( $http, TTSConfig) {

        this.load = function( params ){
            return $http({
                url : TTSConfig.url,
                method : 'GET',
                params : params
            });

        };

    }]);
'use strict';

angular.module('pjTts', [
        'pjTts.directives',
        'pjTts.factories'
    ]
)
.value('TTSConfig', {
    url : ''
})
.constant('TTS_EVENTS', {
        PENDING: 'tts-pending',
        SUCCESS: 'tts-success',
        FAILED: 'tts-failed'
});
