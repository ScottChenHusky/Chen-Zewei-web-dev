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
            findUserById: findUserById,
            logout: logout,
            searchByName: searchByName,
            updateFollowUnfollow: updateFollowUnfollow
            
        };
        return api;
        
        
        
        
        function updateFollowUnfollow(userId, user) {
            var url = "/papi/follow/" + userId;
            return $http.put(url, user);
        }
        
        function searchByName(keyword) {
            var url = "/papi/search/album/" + keyword;
            return $http.get(url);
        }
        function logout() {
            return $http.post("/papi/logout");
        }
        
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