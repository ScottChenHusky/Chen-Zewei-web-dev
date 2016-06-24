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
            deleteAlbum: deleteAlbum
        };
        return api;

        function createAlbum(userId, album) {
            var url = "/api/user/" + userId + "/album";
            return $http.post(url, album);
        }

        function findAlbumsByUser(userId) {
            var url = "/api/user/" + userId + "/album";
            return $http.get(url);
        }

        function findAlbumById(albumId) {
            var url = "/api/album/" + albumId;
            return $http.get(url);
        }

        function updateAlbum(albumId, album) {
            var url = "/api/album/" + albumId;
            return $http.put(url, album);
        }

        function deleteAlbum(albumId) {
            var url = "/api/album/" + albumId;
            return $http.delete(url);
        }
    }
})();