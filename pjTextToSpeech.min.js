"use strict";angular.module("pjTts.directives",["pjTts.factories"]).directive("tts",["TTSAudio",function(a){return{restrict:"E",template:'<button ng-click="speak()" class="pj-tts btn btn-primary"><span ng-class="tts.$pending && \'glyphicon-refresh\' || \'glyphicon-volume-down\'" class="glyphicon "></span></button>',scope:{ttsText:"@",ttsLang:"@"},link:function(b){b.tts=!1,b.speak=function(){b.tts||(b.tts=new a),b.tts.speak({text:b.ttsText,lang:b.ttsLang})},b.$on("$destroy",function(){b.tts&&b.tts.clear()})}}}]),angular.module("pjTts.factories",[]).factory("TTSAudio",["$log","$timeout","$interval","$window","AudioLoaderService","$rootScope","TTS_EVENTS",function(a,b,c,d,e,f,g){return function(){var h=this,i=!1,j=!1,k=null;h.$pending=!1,h.$hasError=!1,h.isAudioSupported=function(){if("undefined"==typeof d.Audio)return!1;try{return new d.Audio,!0}catch(a){}return!1};var l=h.isAudioSupported()?new d.Audio:!1;h.speak=function(d){function m(){b(function(){l.play(),j||(j=c(function(){h.$pending=i&&!l.paused,h.$pending||(f.$broadcast(g.SUCCESS),h.clear())},50))},1)}function n(a){l.src=a.data.path,i=!0,m(),h.$hasError=!1}function o(a){h.$hasError=!0,f.$broadcast(g.FAILED)}function p(){return d.text+"#"+d.lang}if(!h.isAudioSupported())return void a.warn("HTML5 audio is not supported.");if(!angular.isDefined(d)||!d.text.length){var q="Nothing to speak";return a.warn(q),void f.$broadcast(g.FAILED,q)}i&&k===p()?m():(h.clear(),f.$broadcast(g.PENDING,d.text),h.$pending=!0,k=p(),e.load(d).then(n,o))},h.clear=function(){j&&(c.cancel(j),j=!1)}}}]).service("AudioLoaderService",["$http","TTSConfig","$window",function(a,b,c){this.load=function(d){return d.token=c.Token()(d.text),a({url:b.url,method:"GET",params:d})}}]),angular.module("pjTts",["pjTts.directives","pjTts.factories"]).value("TTSConfig",{url:""}).constant("TTS_EVENTS",{PENDING:"tts-pending",SUCCESS:"tts-success",FAILED:"tts-failed"});var Token=function(){var a=function(a){return function(){return a}},b="=",c=function(a,b){for(var c=0;c<b.length-2;c+=3){var d=b.charAt(c+2),d=d>=i?d.charCodeAt(0)-87:Number(d),d=b.charAt(c+1)==j?a>>>d:a<<d;a=b.charAt(c)==j?a+d&4294967295:a^d}return a},d=null,e=0,f="",g="+-a^+6",h="+-3^+b+-f",i="a",j="+",k=".";return function(i){var j;if(null===d){var l=a(String.fromCharCode(84));j=a(String.fromCharCode(75)),l=[l(),l()],l[1]=j(),d=Number(window[l.join(j())])||0}j=d;var m=a(String.fromCharCode(116)),l=a(String.fromCharCode(107)),m=[m(),m()];m[1]=l();for(var l=e+m.join(f)+b,m=[],n=0,o=0;o<i.length;o++){var p=i.charCodeAt(o);128>p?m[n++]=p:(2048>p?m[n++]=p>>6|192:(55296==(64512&p)&&o+1<i.length&&56320==(64512&i.charCodeAt(o+1))?(p=65536+((1023&p)<<10)+(1023&i.charCodeAt(++o)),m[n++]=p>>18|240,m[n++]=p>>12&63|128):m[n++]=p>>12|224,m[n++]=p>>6&63|128),m[n++]=63&p|128)}for(i=j||0,n=0;n<m.length;n++)i+=m[n],i=c(i,g);return i=c(i,h),0>i&&(i=(2147483647&i)+2147483648),i%=1e6,i.toString()+k+(i^j)}};

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