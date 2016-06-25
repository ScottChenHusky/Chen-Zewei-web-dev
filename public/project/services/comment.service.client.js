(function(){
    angular
        .module("WeMusicians")
        .factory("CommentService", CommentService);

    function CommentService($http) {
        var api = {
            createComment: createComment,
            findCommentBySongId: findCommentBySongId,
            findCommentById: findCommentById,
            updateComment: updateComment,
            deleteComment: deleteComment,
            findSongById: findSongById,
            searchByName: searchByName
        };
        return api;
        function searchByName(keyword) {
            var url = "/papi/search/comment/" + keyword;
            return $http.get(url);
        }
        function createComment(userId, albumId, songId, comment) {
            var url = "/papi/user/"+userId+"/album/"
                +albumId+"/song/" + songId + "/comment";
            return $http.post(url, comment);
        }

        function findCommentBySongId(songId) {
            var url = "/papi/song/" + songId + "/comment";
            return $http.get(url);
        }
         function findSongById(songId) {
             var url = "/papi/song/" + songId;
             return $http.get(url);
        }
        function findCommentById(commentId) {
            var url = "/papi/comment/" + commentId;
            return $http.get(url);
        }

        function updateComment(commentId, comment) {
            var url = "/papi/comment/" + commentId;
            return $http.put(url, comment);
        }

        function deleteComment(commentId) {
            var url = "/papi/comment/" + commentId;
            return $http.delete(url);
        }
    }
})();