(function(){
    angular
        .module("WebAppMaker")
        .controller("NewWidgetController", NewWidgetController);

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
})();