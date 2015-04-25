'use strict';

angular.module('pjTts.directives', ['pjTts.factories'])
.directive('tts', ['$log', '$window', '$timeout',
    function($log, $window, $timeout) {
        return {
            restrict: 'EA',
            replace : true,
            template:
            '',
             link : function(scope, element){
               
            }
        };
    }
]);

