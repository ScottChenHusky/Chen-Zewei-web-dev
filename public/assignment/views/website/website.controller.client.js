(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .then(
                    function(response) {
                        vm.websites = response.data;
                    }
            );
        }
        init();

    }

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.createWebsite = createWebsite;

        function createWebsite(name, description) {
            var website = {
                _id: (new Date()).getTime()+"",
                name: name,
                description: description,
                developerId: "" + vm.userId
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

    function EditWebsiteController($location, $routeParams, WebsiteService) {
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