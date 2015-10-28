// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'musicapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'musicapp.services' is found in services.js
// 'musicapp.controllers' is found in controllers.js
angular.module('musicapp', ['ionic', 'angularMoment', 'angularSoundManager', 'musicapp.controllers', 'musicapp.services',  'auth0', 'angular-storage', 'angular-jwt'])

.run(function($ionicPlatform, $rootScope, $state, $ionicModal, auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.isAndroid = ionic.Platform.isAndroid();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    // This hooks all auth events to check everything as soon as the app starts
    auth.hookEvents();
  });


  // Variables and functions for the music player

  $rootScope.currentTrack = null;
  $rootScope.currentTrackDetails = null;
  $rootScope.musicPlaying = false;
  $rootScope.musicPlayer = {};

  $rootScope.createModal = function(i, trackId){

    if(!$rootScope.musicPlayer.album){
      $rootScope.musicPlayer.title = $rootScope.musicPlayer.playlist[i].title.label;
    }else{
      $rootScope.musicPlayer.title = $rootScope.musicPlayer.playlist[i].trackName;
    }

    $rootScope.musicPlayer.trackId = trackId;

    $ionicModal.fromTemplateUrl('templates/music-modal.html', {
      scope: $rootScope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.modal = modal;
      $rootScope.openModal();
    });
  }

  $rootScope.openModal = function() {
    $rootScope.modal.show();
  };
  $rootScope.closeModal = function() {
    $rootScope.modal.hide();
  };


  $rootScope.hasFooter = function(){
    if($rootScope.musicPlaying){
      return 'has-footer'
    }
  }
})

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider, jwtInterceptorProvider) {


    jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
      var idToken = store.get('token');
      var refreshToken = store.get('refreshToken');
      // If no token return null
      if (!idToken || !refreshToken) {
        return null;
      }
      // If token is expired, get a new one
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          store.set('token', idToken);
          return idToken;
        });
      } else {
        return idToken;
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', { // Notice: this state name matches the loginState property value to set in authProvider.init({...}) below...
      url: '/login',
      templateUrl: 'templates/login.tpl.html',
      controller: 'LoginCtrl',
    })
    // Your app states
    .state('userInfo', {
      url: '/userInfo',
      templateUrl: 'templates/user-info.tpl.html',
      controller: 'UserInfoCtrl',
      data: {
        // This tells Auth0 that this state requires the user to be logged in.
        // If the user isn't logged in and he tries to access this state
        // he'll be redirected to the login page
        requiresLogin: true
      }
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.music', {
    url: '/music',
    views: {
      'tab-music': {
        templateUrl: 'templates/tab-music.html',
        controller: 'MusicListCtrl'
      }
    }
  })

    .state('tab.music-detail', {
      url: '/music/:trackId',
      views: {
        'tab-music': {
          templateUrl: 'templates/music-detail.html',
          controller: 'MusicDetailCtrl'
        }
      }
    })

    .state('tab.artist', {
      url: '/artist',
      views: {
        'tab-artist': {
          templateUrl: 'templates/artist.html',
          controller: 'ArtistListCtrl'
        }
      }
    })

  .state('tab.new', {
      url: '/new',
      views: {
        'tab-new': {
          templateUrl: 'templates/tab-new.html',
          controller: 'NewCtrl'
        }
      }
    })
    .state('tab.new-album-detail', {
      url: '/new/album/:albumId',
      views: {
        'tab-new': {
          templateUrl: 'templates/album-detail.html',
          controller: 'AlbumDetailCtrl'
        }
      }
    })
    .state('tab.new-detail', {
      url: '/new/:trackId',
      views: {
        'tab-new': {
          templateUrl: 'templates/music-detail.html',
          controller: 'MusicDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/new');

    authProvider.init({
      domain: 'soundskape.auth0.com',
      clientID: 'N7Fc5YB609zZk1yTXSF5cV0ZgeAKkG9M',
      loginState: 'login' // This is the name of the state where you'll show the login, which is defined above...
    });

});
