
'user strict';

var app = angular.module('TTSApp', ['pjTts']);

app.controller('TTSCtrl', function( $scope, TTS_EVENTS, $log, TTSConfig){

    console.log(TTSConfig);

    $scope.tts = {
        text : 'Hello word',
        lang : 'en'
    };

    $scope.langList =  [
        {"code":"hr","name":"Croatian","nativeName":"hrvatski"},
        {"code":"cs","name":"Czech","nativeName":"česky, čeština"},
        {"code":"da","name":"Danish","nativeName":"dansk"},
        {"code":"nl","name":"Dutch","nativeName":"Nederlands, Vlaams"},
        {"code":"en","name":"English","nativeName":"English"},
        {"code":"et","name":"Estonian","nativeName":"eesti, eesti keel"},
        {"code":"fi","name":"Finnish","nativeName":"suomi, suomen kieli"},
        {"code":"fr","name":"French","nativeName":"français, langue française"},
        {"code":"de","name":"German","nativeName":"Deutsch"},
        {"code":"el","name":"Greek, Modern","nativeName":"Ελληνικά"},
        {"code":"it","name":"Italian","nativeName":"Italiano"},
        {"code":"pl","name":"Polish","nativeName":"polski"},
        {"code":"sk","name":"Slovak","nativeName":"slovenčina"},
        {"code":"sl","name":"Slovene","nativeName":"slovenščina"},
        {"code":"es","name":"Spanish","nativeName":"español, castellano"},
        {"code":"sv","name":"Swedish","nativeName":"svenska"}
    ];

    $scope.$on(TTS_EVENTS.PENDING, function(){
        $log.info('Successfully done!')
    });

    $scope.$on(TTS_EVENTS.ERROR, function(){
        $log.info('An unexpected error occurred');
    });

    $scope.$on(TTS_EVENTS.PENDING, function(){
        $log.info('Speaking ...');
    });
});




