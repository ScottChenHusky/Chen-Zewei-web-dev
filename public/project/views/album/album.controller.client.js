(function(){
    angular
        .module("WeMusicians")
        .controller("AlbumListController", AlbumListController)
        .controller("NewAlbumController", NewAlbumController)
        .controller("EditAlbumController", EditAlbumController);

    function AlbumListController($location, $rootScope, $routeParams, AlbumService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.logout = logout;
        vm.search = search;

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