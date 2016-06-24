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
            deleteSong: deleteSong
        };
        return api;

        function createSong(albumId, song) {
            var url = "/papi/album/" + albumId + "/song";
            return $http.post(url, song);
        }

        function findSongByAlbumId(albumId) {
            var url = "/papi/album/" + albumId + "/song";
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