(function(){
    angular
        .module("WebAppMaker")
        .controller("EditWidgetController", EditWidgetController);

    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.widgetId = $routeParams.widgetId;
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;

        function init() {
            vm.widget = angular.copy(WidgetService.findWidgetById(vm.widgetId));
        }
        init();

        function deleteWidget() {
            var result = WidgetService.deleteWidget(vm.widgetId);
            if(result) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
            } else {
                vm.error = "Unable to delete widget";
            }
        }

        function updateWidget() {
            var result = WidgetService.updateWidget(vm.widgetId, vm.widget);
            console.log(result.name);
            if (result) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                vm.success = "Successfully updated the page"
            } else {
                vm.error = "Unable to update page";
            }
        }
    }
})();