'use strict';

describe('TTS directive', function() {

    var element,
        $scope,
        compiled;

    beforeEach( module('pjTts') );

    beforeEach(inject(function ($rootScope, $compile){

        element = angular.element(
            '<tts tts-text="Hello world" tts-lang="en"></tts>'
        );

        $scope = $rootScope.$new();
        compiled = $compile(element)($scope);
        $scope.$digest();

        var AudioLoaderServiceMock = {
            load : function(){
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise();
            }
        };
    }));



    it('should create volume down button', function() {
        expect(compiled.find('span').length).toBe(1);
        expect(compiled.find('span').hasClass("glyphicon-volume-down")).toBe(true);
    });


});
