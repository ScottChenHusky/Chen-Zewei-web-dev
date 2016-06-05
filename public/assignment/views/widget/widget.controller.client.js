(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController)
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    function WidgetListController($sce, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.getSafeHtml = getSafeHtml;
        vm.getSafeUrl = getSafeUrl;

        function init() {
            WidgetService
                .findWidgetsForPageId(vm.pageId)
                .then(
                    function(response) {
                        vm.widgets = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
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

        $(".widget-container")
            .sortable({axis: "y"});



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
                    widgetType: "HEADER",
                    pageId: "",
                    name: "",
                    text: "",
                    size: "1"
                };
            } else if (widgetType === "IMAGE") {
                var widget = {
                    _id: (new Date()).getTime()+"",
                    widgetType: "IMAGE",
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
                    widgetType: "YOUTUBE",
                    pageId: "",
                    name: "",
                    text: "",
                    url: "",
                    width: "100%"
                }
            }
            WidgetService
                .createWidget(vm.pageId, widget)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
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
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(
                    function(response) {
                        vm.widget = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }

        function updateWidget() {
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function FlickrImageSearchController($location, WidgetService, $routeParams, FlickrService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.widgetId = $routeParams.widgetId;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(
                    function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                    },
                    function(error) {
                        vm.error = data.error;
                    }
                );
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(
                    function(response) {
                        var widget = response.data;
                        widget.url = url;
                        WidgetService
                            .updateWidget(vm.widgetId, widget)
                            .then(
                                function(response) {
                                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/" + vm.widgetId);
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
    }
})();