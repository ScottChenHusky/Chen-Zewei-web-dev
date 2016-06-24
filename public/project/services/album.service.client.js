(function(){
    angular
        .module("WeMusicians")
        .factory("AlbumService", AlbumService);

    function AlbumService($http) {
        var api = {
            createAlbum: createAlbum,
            findAlbumsByUser: findAlbumsByUser,
            findAlbumById: findAlbumById,
            updateAlbum: updateAlbum,
            deleteAlbum: deleteAlbum,
            findUserById: findUserById
        };
        return api;
        
        function findUserById(userId) {
            var url = "/papi/user/" + userId;
            return $http.get(url);
        }

        function createAlbum(userId, album) {
            var url = "/papi/user/" + userId + "/album";
            return $http.post(url, album);
        }

        function findAlbumsByUser(userId) {
            var url = "/papi/user/" + userId + "/album";
            return $http.get(url);
        }

        function findAlbumById(albumId) {
            var url = "/papi/album/" + albumId;
            return $http.get(url);
        }

        function updateAlbum(albumId, album) {
            var url = "/papi/album/" + albumId;
            return $http.put(url, album);
        }

        function deleteAlbum(albumId) {
            var url = "/papi/album/" + albumId;
            return $http.delete(url);
        }
    }
})();