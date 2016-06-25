(function(){
    angular
        .module("WeMusicians")
        .controller("AlbumListController", AlbumListController)
        .controller("NewAlbumController", NewAlbumController)
        .controller("EditAlbumController", EditAlbumController);

    function AlbumListController($location, $rootScope, $routeParams, AlbumService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.currentUser = $rootScope.currentUser;
        //vm.theOwner = false;
        //vm.isFollowed = false;
        vm.theUser = null;

        vm.logout = logout;
        vm.search = search;
        vm.followUnfollow = followUnfollow;

        function init() {
            AlbumService
                .findAlbumsByUser(vm.userId)
                .then(
                    function(response) {
                        vm.albums = response.data;
                        AlbumService
                            .findUserById(vm.userId)
                            .then(
                                function(response) {
                                    vm.user = response.data;
                                    vm.theUser = response.data;
                                    vm.theOwner = false;
                                    if (vm.currentUser._id === vm.userId) {
                                        vm.theOwner = true;
                                    }
                                    if (!vm.theOwner) {
                                        vm.isFollowed = false;
                                        for (var i in vm.currentUser.followings) {
                                            if(vm.currentUser.followings[i] === vm.userId) {
                                                vm.isFollowed = true;
                                                break;
                                            }
                                        }
                                    }
                                },
                                function(error) {
                                    vm.error = error.data;
                                }
                            )
                    },
                    function(error) {
                        vm.error = error.data;
                    }
            );
        }
        init();

        function followUnfollow() {
            if (!vm.theOwner) {
                if (vm.isFollowed) {
                    for (var i in vm.currentUser.followings) {
                        if (vm.currentUser.followings[i] === vm.user._id) {
                            vm.currentUser.followings.splice(i, 1);
                            break;
                        }
                    }
                    for (var j in vm.user.followers) {
                        if (vm.user.followers[i] === vm.currentUser._id) {
                            vm.user.followers.splice(i, 1);
                            break;
                        }
                    }
                    vm.isFollowed = false;

                } else {
                    vm.user.followers.push(vm.currentUser._id);
                    vm.currentUser.followings.push(vm.user._id);
                    vm.isFollowed = true;
                }
                AlbumService
                    .updateFollowUnfollow(vm.user._id, vm.user)
                    .then(
                        function (response) {
                            AlbumService
                                .updateFollowUnfollow(vm.currentUser._id, vm.currentUser)
                                .then(
                                    function (response) {
                                    },
                                    function (error) {
                                        vm.error = error;
                                    }
                                )
                        },
                        function (error) {
                            vm.error = error.data;
                        }
                    );
            }
            init();
        }   
            
            
            
            
            
        //     if (!vm.theOwner) {
        //         if (vm.isFollowed) {
        //             AlbumService
        //                 .unfollowUser(vm.user._id)
        //                 .then(
        //                     function(response) {
        //                         vm.isFollowed = false;
        //                     },
        //                     function(error) {
        //                         vm.error = error;
        //                     }
        //                 );
        //         } else {
        //             AlbumService
        //                 .followUser(vm.user._id)
        //                 .then(
        //                     function(response) {
        //                         vm.isFollowed = true;
        //                     },
        //                     function(error) {
        //                         vm.error = error;
        //                     }
        //                 );
        //         }
        //     }
        // }


        //
        //
        // if (!vm.theOwner) {
        //     if (vm.isFollowed) {
        //         for (var i in vm.currentUser.followings) {
        //             if (vm.currentUser.followings[i] === vm.user._id) {
        //                 vm.currentUser.followings.splice(i, 1);
        //                 break;
        //             }
        //         }
        //         for (var j in vm.user.followers) {
        //             if (vm.user.followers[i] === vm.currentUser._id) {
        //                 vm.user.followers.splice(i, 1);
        //                 break;
        //             }
        //         }
        //
        //     } else {
        //         vm.user.followers.push(vm.currentUser._id);
        //         vm.currentUser.followings.push(vm.user._id);
        //     }
        // }









        
        function logout(req, res) {
            AlbumService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }

        function search(keyword) {
            $location.url("/user/"+vm.userId+"/search/user/" + keyword);
        }
    }

    function NewAlbumController($location, $rootScope, $routeParams, AlbumService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.createAlbum = createAlbum;
        vm.logout = logout;

        function logout(req, res) {
            AlbumService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }

        function createAlbum(name, description, RockBox, JazzBox, PopBox) {
            if(!name) {
                vm.error = "Please Provide Album Name";
                return;
            }

            var album = {
                name: name,
                description: description,
                rock: RockBox,
                jazz: JazzBox,
                pop: PopBox
            };

            AlbumService
                .createAlbum(vm.userId, album)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function EditAlbumController($location, $rootScope, $routeParams, AlbumService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.albumId = $routeParams.albumId;
        vm.deleteAlbum = deleteAlbum;
        vm.updateAlbum = updateAlbum;
        vm.logout = logout;

        function init() {
            AlbumService
                .findAlbumById(vm.albumId)
                .then(
                    function(response) {
                        vm.album = response.data;
                    }
                );
        }
        init();

        function deleteAlbum(albumId) {
            AlbumService
                .deleteAlbum(albumId)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album");
                    }
                );
        }

        function updateAlbum(albumId, album) {
            if(!album.name) {
                vm.error = "Please Provide Album Name";
                return;
            }

            AlbumService
                .updateAlbum(albumId, album)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album");
                    }
                );
        }

        function logout(req, res) {
            AlbumService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }
    }
})();