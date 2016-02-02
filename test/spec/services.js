'use strict';

describe('TTS services', function() {

    var $httpBackend,
        $rootScope,
        fakeUrl = /.*/,
        fakeAudio = {
            path: "data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
        };

    beforeEach(module('pjTts'));

    beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        var TTSConfig = $injector.get('TTSConfig');


        $httpBackend.whenGET(fakeUrl).respond(fakeAudio);
    }));



    describe('TTSAudio', function() {
        var TTSAudio,
            ttsAudio;

        beforeEach(inject(function($injector){
            TTSAudio = $injector.get('TTSAudio');
            ttsAudio = new TTSAudio();
            spyOn(ttsAudio, "isAudioSupported").and.callFake(function(){return true});

        }));

        it('initial values should be set', function() {
            expect(ttsAudio.$pending).toBe(false);
            expect(ttsAudio.$hasError).toBe(false);
        });


        it('should speek', function() {
            ttsAudio.speak({text : 'test', lang : 'en'});
            expect(ttsAudio.$pending).toBe(true);
            $httpBackend.flush();
            expect(ttsAudio.$hasError).toBe(false);
        });

    });


    describe('AudioLoaderService', function() {
        var AudioLoaderService,
            $window;

        beforeEach(inject(function(_AudioLoaderService_, _$window_ ){
            AudioLoaderService = _AudioLoaderService_;
            $window = _$window_;
            spyOn($window, 'Token');
        
        }));

        it('should be defined', function(){
            expect(AudioLoaderService).toBeDefined();
        });

        
    });

    // TODO more tests
});
