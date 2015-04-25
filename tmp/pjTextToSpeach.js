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
                    scope.tts.speak(scope.text, scope.lang, new Date().getTime());
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
    .factory('TTSAudio' , ['$log', '$timeout', '$interval', '$window', 'AudioLoaderService',
        function($log, $timeout, $interval, $window, AudioLoaderService ) {
        return function(){
            var isSupported = angular.isFunction($window.Audio);

            var that = this,
                isLoaded = false,
                watcher = false,
                stemp = null,
                audio = isSupported ? new $window.Audio() : false;

            that.$pending = false;
            that.$hasError= false;


            // public methods

            that.speak = function(text, lang, id){

                function play(){
                    $timeout(function(){
                        audio.play();
                        if(!watcher){
                            watcher = $interval(function(){
                                that.$pending = isLoaded && !audio.paused;
                            }, 100);
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
                }



                if(!isSupported){
                    $log.warn('HTML5 audio is not supported.');
                    return;
                }

                if(!isLoaded || stemp !== text +""+ lang){
                    that.clean();
                    that.$pending = true;
                    stemp = text +""+ lang;
                    AudioLoaderService.load({text: text, lang: lang, id : id})
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
    .service('AudioLoaderService' , ['$log', '$http', 'TTSConfig', function($log, $http, TTSConfig) {

        this.load = function( params ){
            $log.info('loading audio file path: ' + TTSConfig.url);
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
});
