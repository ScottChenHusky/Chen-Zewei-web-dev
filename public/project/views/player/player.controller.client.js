(function(){
    angular
        .module("WeMusicians")
        .controller("PlayerCommentListController", PlayerCommentListController)
        .controller("PlayerNewCommentController", PlayerNewCommentController)
        .controller("PlayerEditCommentController", PlayerEditCommentController);

    function PlayerCommentListController($sce, $routeParams, $rootScope,
                                MusicianService, CommentService, $location) {
        var vm = this;

        function logout() {
            MusicianService.logout()
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }

        function search(keyword) {
            if (keyword.length > 0) {
                $location.url("/user/"+vm.userId+"/search/song/" + keyword);                
            }
        }
        function init() {
            vm.userId = $routeParams.userId;
            vm.albumId = $routeParams.albumId;
            vm.songId = $routeParams.songId;
            vm.logout = logout;
            vm.search = search;
            vm.currentUser = $rootScope.currentUser;
            CommentService
                .findCommentBySongId(vm.songId)
                .then(
                    function(response) {
                        vm.comments = response.data;
                        CommentService.findSongById(vm.songId)
                            .then(
                                function(response) {
                                    vm.song = response.data;
                                    vm.songUrl = getTrustedUrl(vm.song.url);
                                },
                                function(error) {
                                    vm.error = error.data;
                                }
                            );
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();
        function getSongUrl(song) {
            var url = song.url;
            return $sce.trustAsResourceUrl(url);

        }
        function getTrustedUrl(url) {;
            return $sce.trustAsResourceUrl(url);

        }
    }

    function PlayerNewCommentController($location, $routeParams, CommentService, MusicianService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.albumId = $routeParams.albumId;
        vm.songId = $routeParams.songId;
        vm.createComment = createComment;
        vm.logout = logout;
        function logout() {
            MusicianService.logout()
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }

        function createComment(title, body) {
            if (!title) {
                vm.error = "Please provide a comment title.";
                return;
            } else if (!body) {
                vm.error = "Please provide a comment detail.";
                return;
            }
            
            var comment = {
                title: title,
                body: body
            };
            CommentService
                .createComment(vm.userId, vm.albumId, vm.songId, comment)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album/"
                            +vm.albumId+"/song/"+vm.songId+"/play");
                    }, 
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function PlayerEditCommentController($location, $routeParams, CommentService, MusicianService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.albumId = $routeParams.albumId;
        vm.songId = $routeParams.songId;
        vm.commentId = $routeParams.commentId;
        vm.deleteComment = deleteComment;
        vm.updateComment = updateComment;
        vm.logout = logout;
        function logout() {
            CommentService.logout()
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }

        function init() {
            CommentService
                .findCommentById(vm.commentId)
                .then(
                    function(response) {
                        vm.comment = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function deleteComment() {
            CommentService
                .deleteComment(vm.commentId)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album/"
                            +vm.albumId+"/song/"+vm.songId+"/play");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }

        function updateComment(comment) {
            if (!comment.title) {
                vm.error = "Please provide a comment title.";
                return;
            } else if (!comment.body) {
                vm.error = "Please provide a comment detail.";
                return;
            }

            CommentService
                .updateComment(vm.commentId, comment)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album/"
                            +vm.albumId+"/song/"+vm.songId+"/play");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }
})();