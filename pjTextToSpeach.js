'use strict';

angular.module('pjTts.directives', ['pjTts.factories'])
.directive('tts', ['$log', 'TTSAudio',
    function($log, TTSAudio) {
        return {
            restrict: 'E',
            template:   '<div class="pj-tts" ng-click="speak()"><button class="btn btn-primary">'+
                        '<span ng-if="tts.$pending" class="glyphicon glyphicon glyphicon-refresh"></span>'+
                        '<span ng-if="!tts.$pending" class="glyphicon glyphicon-volume-down"></span>'+
                        '</button></div>',
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
            var isSupported = isAuditoSupported();

            var self = this,
                isLoaded = false,
                watcher = false,
                cachedVal = null,
                audio = isSupported ? new $window.Audio() : false;

            self.$pending = false;
            self.$hasError= false;

            // private methods

            function isAuditoSupported(){
                if(typeof $window.Audio === 'undefined'){
                    return false;
                }
                try{
                    new $window.Audio();
                    return true;
                }catch(e){}
                return false;
            }

            // public methods

            self.speak = function(params){

                function play(){
                    $timeout(function(){
                        audio.play();
                        if(!watcher){
                            watcher = $interval(function(){
                                self.$pending = isLoaded && !audio.paused;
                                if(!self.$pending){
                                    $rootScope.$broadcast(TTS_EVENTS.SUCCESS);
                                    self.clean();
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



                if(!isSupported){
                    $log.warn('HTML5 audio is not supported.');
                    return;
                }

                if(!angular.isDefined(params) || !params.text.length){
                    $log.warn('Nothing to speak');
                    return;
                }

                // prevent sends duplicate requests
                if(!isLoaded || cachedVal !== getCurrentVal()){
                    self.clean();
                    $rootScope.$broadcast(TTS_EVENTS.PENDING);
                    self.$pending = true;
                    cachedVal = getCurrentVal();
                    AudioLoaderService.load(params)
                    .then( handleSuccess, handleError );
                }else{
                    play();
                }


            };

            self.clean = function(){
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
    url : 'http://drilapp.dev/api/v1/tts'
})
.constant('TTS_EVENTS', {
        PENDING: 'tts-pending',
        SUCCESS: 'tts-success',
        FAILED: 'tts-failed'
});
