angular.module('musicapp.services', [])

.factory('MusicFac', function($http){
  return{
    topSongs: function(){
      return $http.get('https://itunes.apple.com/us/rss/topsongs/limit=15/explicit=true/json')
        .then(function (response){
          return (response.data)
        });
    },
   /*topAlbums: function(){
      return $http.get('http://localhost:3000/albums.json')
        .then(function (response){
          return (response.data)
        });
    },*/
    topAlbums: function(){
      return $http.get('https://itunes.apple.com/us/rss/topalbums/limit=15/explicit=true/json')
        .then(function (response){
          return (response.data)
        });
    },
    lookup: function(id) {
      return $http.jsonp('https://itunes.apple.com/us/lookup?id='+id+'&callback=JSON_CALLBACK')
        .then(function (response){
          return (response.data)
        });
    },
    lookupSongs: function(id) {
      return $http.get('http://localhost:3000/tracks/'+id+'.json')
        .then(function (response){
          return (response.data)
        });
    },
    getArtists: function() {
      return $http.get('http://localhost:3000/bands.json')
        .then(function (response){
          return (response.data)
        });
    },
    getArtist: function(id) {
      return $http.get('http://localhost:3000/bands/'+id+'.json')
        .then(function(response) {
          return (response.data);
        })
    },
    getArtistAlbums: function(id) {
      return $http.get('http://localhost:3000/bands/'+id+'/albums.json')
        .then(function(response) {
          return (response.data);
        })
    },
    lookupAlbum: function(id) {
      return $http.get('http://localhost:3000/albums/'+id+'.json')
        .then(function(response) {
          return (response.data);
        })
    }
  }

});
