# pjTextToSpeech [![Build Status](https://travis-ci.org/peterjurkovic/pjTextToSpeech.svg?branch=master)](https://travis-ci.org/peterjurkovic/pjTextToSpeech.svg?branch=master)


pjTextToSpeach a simple Text-2-Speach AngularJS module, based on Google Text-to-Speach API.This particular implementation depends on back-end side script which forwarding requests to the Google TTS API. The advantage of this solution is that generated files are cached in predefined folder and Google API is requested only once. 

* The notification message is positioned absolute (to the center of screen)
* Only one message is shown in given time (other additional messages are in the queue)
* Bootstrap icons integrated

**[See Demo](http://tts.peterjurkovic.com/)**

![Text-2-Speech example](http://tts.peterjurkovic.com/tts.png)

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
 
 
 
 
 
