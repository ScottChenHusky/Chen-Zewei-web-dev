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
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }

        init();
    }

    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.createPage = createPage;

        function createPage(name, title) {
            var page = {
                _id: (new Date()).getTime()+"",
                name: name,
                title: title,
                websiteId: "" + vm.websiteId
            };
            var newPage = PageService.createPage(vm.websiteId, page);
            if(newPage) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            } else {
                vm.error = "Unable to create website";
            }
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
            vm.page = angular.copy(PageService.findPageById(vm.pageId));
            console.log(vm.page.name);
            console.log(vm.page.title);
        }
        init();

        function deletePage() {
            var result = PageService.deletePage(vm.pageId);
            if(result) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            } else {
                vm.error = "Unable to delete page";
            }
        }

        function updatePage(page) {
            var result = PageService.updatePage(vm.pageId, page);
            if (result) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                vm.success = "Successfully updated the page"
            } else {
                vm.error = "Unable to update page";
            }
        }
    }
})();