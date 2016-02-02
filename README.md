# pjTextToSpeech [![Build Status](https://travis-ci.org/peterjurkovic/pjTextToSpeech.svg?branch=master)](https://travis-ci.org/peterjurkovic/pjTextToSpeech.svg?branch=master)


pjTextToSpeach a simple Text-2-Speach AngularJS module, based on Google Text-to-Speach API.This particular implementation depends on back-end side script which forwarding requests to the Google TTS API. The advantage of this solution is that generated files are cached in predefined folder and Google API is requested only once. 

**[See Demo](http://tts.peterjurkovic.com/index.html)**

[![Text-2-Speech example](http://tts.peterjurkovic.com/tts.png)](http://tts.peterjurkovic.com/)

## Instalation

1. Install via [Bower](http://bower.io/):
  ```
  bower install pjTextToSpeech --save
  ```

## Integration
Include pjTextToSpeech resource file with the [Bootstrap CSS](http://getbootstrap.com/): (it is not required but styling is based on bootstrap classes).:
```
<link rel="stylesheet" href="bootstrap.min.css">
<script src="pjTextToSpeech.min.js"></script>
```
 Include pjTextToSpeach as a dependency in your app module:
 ```
 var app = angular.module('TTSApp', ['pjTts']);
 ```
 Place tts element into your HTML:
 ```
<body>
<tts tts-text="Hello world" tts-lang="en" ></tts>
...
</body>
 ```

Inject TTSConfig in your controller and setup back-end url for calling generated audio files:
 ```
app.controller('YourController', function( TTSConfig){
    TTSConfig.url = 'http://tts.dev/tts-backend/index.php';
}
 ```
  See the [back-end](https://github.com/peterjurkovic/pjTextToSpeach/tree/master/tts-backend) integration example.
 
## Usage without directive

The module don't require `tts` directive. The other usage is injecting `TTSAudio` object e.g inside your controller and calling API directly.
 
 ```
 app.controller('YourController',
    function($scope, $log, TTSConfig, TTSAudio, TTS_EVENTS){

    TTSConfig.url = 'http://tts.dev/tts-backend/index.php';
    var tts = new TTSAudio();
    tts.speak({
        text : 'Hello word',
        lang : 'en'
    });

    // triggered after speaking
    $scope.$on(TTS_EVENTS.SUCCESS, function(){
        $log.info('Successfully done!')
    });

    $scope.$on(TTS_EVENTS.ERROR, function(){
        $log.info('An unexpected error has occurred');
    });

    // triggered before speaking
    $scope.$on(TTS_EVENTS.PENDING, function(text){
        $log.info('Speaking: ' + text);
    });
}
```
 ## Animated bootstrap button
 
 The bootstrap button are static by default. If you want achieve effect like in this demo page you have to add following CSS into your page. 
 
```
.glyphicon-refresh{
    animation: spin .7s infinite linear;
    -animation: spin .7s infinite linear;
    -webkit-animation: spin2 .7s infinite linear;
}

@-webkit-keyframes spin2 {
    from {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    from { transform: scale(1) rotate(0deg);}
    to { transform: scale(1) rotate(360deg);}
}
```
