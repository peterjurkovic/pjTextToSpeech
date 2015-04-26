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
