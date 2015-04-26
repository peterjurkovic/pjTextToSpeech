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

