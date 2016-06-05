(function(){
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    var key = "5344209de1b40fa382986ac3898e243e";
    var secret = "e5c7522c5dbc3d46";
    var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

    function FlickrService($http) {
        var api = {
            searchPhotos: searchPhotos
        };
        return api;

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }

    }
})();