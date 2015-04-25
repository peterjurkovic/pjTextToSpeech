
'user strict';

var app = angular.module('TTSApp', ['pjTts']);

app.controller('TTSCtrl', function( $scope, TTS_EVENTS, $log, TTSConfig){

    console.log(TTSConfig);

    TTSConfig.url = 'http://tts.peterjurkovic.com/tts-backend/index.php';

    $scope.tts = {
        text : 'Hello word',
        lang : 'en'
    };

    $scope.langList =  [
        {"code":"en","name":"English","nativeName":"English"},
        {"code":"cs","name":"Czech","nativeName":"česky, čeština"},
        {"code":"nl","name":"Dutch","nativeName":"Nederlands, Vlaams"},
        {"code":"fi","name":"Finnish","nativeName":"suomi, suomen kieli"},
        {"code":"fr","name":"French","nativeName":"français, langue française"},
        {"code":"de","name":"German","nativeName":"Deutsch"},
        {"code":"it","name":"Italian","nativeName":"Italiano"},
        {"code":"pl","name":"Polish","nativeName":"polski"},
        {"code":"sk","name":"Slovak","nativeName":"slovenčina"},
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




