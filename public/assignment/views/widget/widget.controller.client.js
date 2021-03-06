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
        vm.sorted = sorted;

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
            if(widget.url) {
                var urlParts = widget.url.split("/");
                var id = urlParts[urlParts.length - 1];
                var url = "https://www.youtube.com/embed/" + id;
                return $sce.trustAsResourceUrl(url);
            }

        }

        function sorted(startIndex, endIndex) {
            WidgetService
                .reorderWidget(vm.pageId, startIndex, endIndex)
                .then(
                    function(response) {
                        vm.success = "Reordering successful";
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                )

        }

    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId = $routeParams.pageId;
        vm.createWidget = createWidget;

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

        function createWidget(widgetType) {
            var widget = {
                type: widgetType,
                rows: 1,
                size: 1,
                width: "100%",
                height: "100%",
                order: vm.widgets.length
            };
            WidgetService
                .createWidget(vm.pageId, widget)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+ response.data._id);
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
                        vm.widget.size = vm.widget.size + "";
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
            if(!vm.widget.name) {
                vm.error = "Please Provide Widget Name";
                return;
            }

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