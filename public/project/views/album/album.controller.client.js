(function(){
    angular
        .module("WeMusicians")
        .controller("AlbumListController", AlbumListController);
        // .controller("NewAlbumController", NewAlbumController)
        // .controller("EditAlbumController", EditAlbumController);

    function AlbumListController($location, $rootScope, $routeParams, AlbumService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.logout = logout;

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

        function createUser(req, res) {
            var newUser = req.body;
            userModel
                .findUserByUsername(newUser.username)
                .then(
                    function(user) {
                        if(user === null) {
                            userModel
                                .createUser(newUser)
                                .then(
                                    function(user) {
                                        res.json(user);
                                    },
                                    function(error) {
                                        res.status(400).send("Username has been used");
                                    }
                                );
                        } else {
                            res.json(null);
                        }
                    },
                    function(error) {
                        res.status(400).send(error);
                    }
                );
        }

    }

    function NewAlbumController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.createWebsite = createWebsite;

        function createWebsite(name, description) {
            if(!name) {
                vm.error = "Please Provide Website Name";
                return;
            }

            var website = {
                name: name,
                description: description,
                //developerId: "" + vm.userId
            };

            WebsiteService
                .createWebsite(vm.userId, website)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website");
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