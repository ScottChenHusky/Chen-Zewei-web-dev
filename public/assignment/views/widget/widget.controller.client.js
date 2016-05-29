(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($sce, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.getSafeHtml = getSafeHtml;
        vm.getSafeUrl = getSafeUrl;

        function init() {
            vm.widgets = WidgetService.findWidgetsForPageId(vm.pageId);
        }
        init();

        function getSafeHtml(widget) {
            return $sce.trustAsHtml(widget.text);
        }

        function getSafeUrl(widget) {
            var urlParts = widget.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);

        }

    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            if(widgetType === "HEADER") {
                var widget = {
                    _id: (new Date()).getTime()+"",
                    widgetType: widgetType,
                    pageId: "",
                    name: "",
                    text: "",
                    size: "1"
                };
            } else if (widgetType === "IMAGE") {
                var widget = {
                    _id: (new Date()).getTime()+"",
                    widgetType: widgetType,
                    pageId: "",
                    name: "",
                    text: "",
                    url: "",
                    width: "100%",
                    upload: ""
                }
            } else if (widgetType === "YOUTUBE") {
                var widget = {
                    _id: (new Date()).getTime()+"",
                    widgetType: widgetType,
                    pageId: "",
                    name: "",
                    text: "",
                    url: "",
                    width: "100%"
                }
            }

            var newWidget = WidgetService.createWidget(vm.pageId, widget);
            if (newWidget) {
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
            } else {
                vm.error = "Unable to create widget";
            }
        }

    }
    
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
})()