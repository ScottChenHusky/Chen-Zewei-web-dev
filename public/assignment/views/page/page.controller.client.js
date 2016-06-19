(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .then(
                    function(response) {
                        vm.pages = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();
    }

    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.createPage = createPage;

        function createPage(name, title, description) {
            if (!name) {
                vm.error = "Please Provide Page Name";
                return;
            } else if (!title) {
                vm.error = "Please Provide Page Title";
                return;
            }
            
            var page = {
                name: name,
                title: title,
                description: description
                //websiteId: "" + vm.websiteId
            };
            PageService
                .createPage(vm.websiteId, page)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }, 
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function EditPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function init() {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        vm.page = response.data;
                    },
                    function(error) {
                        vm.error = erro.data;
                    }
                );
        }
        init();

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }

        function updatePage(page) {
            if (!page.name) {
                vm.error = "Please Provide Page Name";
                return;
            } else if (!page.title) {
                vm.error = "Please Provide Page Title";
                return;
            }

            PageService
                .updatePage(vm.pageId, page)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }
})();