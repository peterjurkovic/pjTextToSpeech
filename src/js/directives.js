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

