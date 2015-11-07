/**
 * Created by jeffreyrichardson on 11/7/15.
 */
'use strict';
describe("musicapp.controllers", function() {

  var $scope;

  // load the module for our app
  beforeEach(module('musicapp'));

  // disable template caching
  beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value('$ionicTemplateCache', function(){} );
    $urlRouterProvider.deferIntercept();
  }));


  // Artists list controller
  describe("ArtistListCtrl", function() {
    var ArtistListCtrl, controller, MusicFac, $rootScope, MusicFacMock, $scope, getArtists;

    // instantiate the controller and mocks for every test
    beforeEach(inject(function($controller, _MusicFac_, _$rootScope_, $q) {
        MusicFac = _MusicFac_;
        getArtists = $q.defer();
        $rootScope = _$rootScope_;

      MusicFacMock = {
        getArtists: jasmine.createSpy('getArtists spy').and.returnValue(getArtists.promise)
      };

      // instantiate LoginController
      controller = $controller('ArtistListCtrl', {
        'MusicFac': MusicFacMock,
        '$scope': $rootScope.$new()
      });

      $rootScope = _$rootScope_;

    }));


    it("should have a populated list with bands", function() {
      getArtists.resolve();
      $rootScope.$digest();
      expect(MusicFacMock.getArtists).toHaveBeenCalled();
    });

  });



});
