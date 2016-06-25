(function(){
    angular
        .module("WeMusicians")
        .factory("SongService", SongService);

    function SongService($http) {
        var api = {
            createSong: createSong,
            findSongByAlbumId: findSongByAlbumId,
            findSongById: findSongById,
            updateSong: updateSong,
            deleteSong: deleteSong,
            findAlbumById: findAlbumById,
            searchByName: searchByName,
            logout: logout
        };
        return api;

        function logout() {
            return $http.post("/papi/logout");
        }

        function searchByName(keyword) {
            var url = "/papi/search/song/" + keyword;
            return $http.get(url);
        }
        function createSong(userId, albumId, song) {
            var url = "/papi/user/"+userId+"/album/"+albumId+"/song";
            //var url = "/papi/album/" + albumId + "/song";
            return $http.post(url, song);
        }

        function findSongByAlbumId(albumId) {
            var url = "/papi/album/" + albumId + "/song";
            return $http.get(url);
        }
        function findAlbumById(albumId) {
            var url = "/papi/album/" + albumId;
            return $http.get(url);
        }
        function findSongById(songId) {
            var url = "/papi/song/" + songId;
            return $http.get(url);
        }

        function updateSong(songId, song) {
            var url = "/papi/song/" + songId;
            return $http.put(url, song);
        }

        function deleteSong(songId) {
            var url = "/papi/song/" + songId;
            return $http.delete(url);
        }
    }
})();