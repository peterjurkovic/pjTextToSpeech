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
    .service('AudioLoaderService' , ['$http', 'TTSConfig', '$window', function( $http, TTSConfig, $window) {

        this.load = function( params ){
            params.token = $window.Token()(params.text);
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


var Token = function(){


    var cM = function(a) {
        return function() {
            return a
        }
    };
    var of = "=";
    var dM = function(a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2),
                d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
                d = b.charAt(c + 1) == Tb ? a >>> d : a << d;
            a = b.charAt(c) == Tb ? a + d & 4294967295 : a ^ d;
        }
        return a
    };

    var eM = null;
    var cb = 0;
    var k = "";
    var Vb = "+-a^+6";
    var Ub = "+-3^+b+-f";
    var t = "a";
    var Tb = "+";
    var dd = ".";

    return function(a) {
        var b;
        if (null === eM) {
            var c = cM(String.fromCharCode(84)); // char 84 is T
            b = cM(String.fromCharCode(75)); // char 75 is K
            c = [c(), c()];
            c[1] = b();
            // So basically we're getting window.TKK
            eM = Number(window[c.join(b())]) || 0
        }
        b = eM;

        // All this does is convert turn d into the byte values of the utf-8 representation of a
        var d = cM(String.fromCharCode(116)),
            c = cM(String.fromCharCode(107)),
            d = [d(), d()];
        d[1] = c();
        for (var c = cb + d.join(k) +
            of, d = [], e = 0, f = 0; f < a.length; f++) {
            var g = a.charCodeAt(f);

            (128 > g ? d[e++] = g : (2048 > g ? d[e++] = g >> 6 | 192 : (55296 == (g & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (g = 65536 + ((g & 1023) << 10) + (a.charCodeAt(++f) & 1023), d[e++] = g >> 18 | 240, d[e++] = g >> 12 & 63 | 128) : d[e++] = g >> 12 | 224, d[e++] = g >> 6 & 63 | 128), d[e++] = g & 63 | 128));
        }
        // So now utf8(d) == a


        a = b || 0;
        for (e = 0; e < d.length; e++) a += d[e], a = dM(a, Vb);
        a = dM(a, Ub);
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return a.toString() + dd + (a ^ b);
    };

}