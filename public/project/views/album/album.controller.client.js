(function(){
    angular
        .module("WeMusicians")
        .controller("AlbumListController", AlbumListController)
        .controller("NewAlbumController", NewAlbumController);
        // .controller("EditAlbumController", EditAlbumController);

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

    function NewAlbumController($location, $routeParams, AlbumService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.createAlbum = createAlbum;

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

    function EditAlbumController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response) {
                        vm.website = response.data;
                    }
                );
        }
        init();

        function deleteWebsite(websiteId) {
            WebsiteService
                .deleteWebsite(websiteId)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website");
                    }
                );
        }

        function updateWebsite(websiteId, website) {
            if(!website.name) {
                vm.error = "Please Provide Website Name"
                return;
            }

            WebsiteService
                .updateWebsite(websiteId, website)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website");
                    }
                );
        }
    }
})();