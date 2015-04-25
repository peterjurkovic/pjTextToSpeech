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
                text : '=',
                lang : '='
            },
            link : function(scope){

                scope.tts = false;
                scope.speak = function(){
                    if(!scope.tts){
                        scope.tts = new TTSAudio();
                    }

                    scope.tts.speak({
                        text : scope.text,
                        lang : scope.lang
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
            var isSupported = angular.isFunction($window.Audio);

            var that = this,
                isLoaded = false,
                watcher = false,
                cachedVal = null,
                audio = isSupported ? new $window.Audio() : false;

            that.$pending = false;
            that.$hasError= false;


            // public methods

            that.speak = function(params){

                function play(){
                    $timeout(function(){
                        audio.play();
                        if(!watcher){
                            watcher = $interval(function(){
                                that.$pending = isLoaded && !audio.paused;
                                if(!that.$pending){
                                    $rootScope.$broadcast(TTS_EVENTS.SUCCESS);
                                    that.clean();
                                }
                            }, 50);
                        }
                    },1);
                }

                function handleSuccess(res){
                    audio.src = res.data.path;
                    play();
                    isLoaded = true;
                    that.$hasError = false;
                }

                function handleError(res){
                    that.$hasError = true;
                    $rootScope.$broadcast(TTS_EVENTS.FAILED);
                }

                function getCurrentVal(){
                    return params.text +"#"+ params.lang;
                }



                if(!isSupported){
                    $log.warn('HTML5 audio is not supported.');
                    return;
                }

                if(!isLoaded || cachedVal !== getCurrentVal()){
                    that.clean();
                    $rootScope.$broadcast(TTS_EVENTS.PENDING);
                    that.$pending = true;
                    cachedVal = getCurrentVal();
                    AudioLoaderService.load(params)
                    .then( handleSuccess, handleError );
                }else{
                    play();
                }


            };

            that.clean = function(){
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
