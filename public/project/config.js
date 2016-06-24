/**
 * Created by ScottChen on 5/23/16.
 */
(function(){
    angular
        .module("WeMusicians")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider

            // new config
            .when("/home", {
                templateUrl: "views/user/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })

            .when("/user/:id/search/song/:keyword", {
                templateUrl: "views/search/searchSong.view.client.html",
                controller: "SearchSongController",
                controllerAs: "model"
            })

            .when("/user/:id/search/album/:keyword", {
                templateUrl: "views/search/searchAlbum.view.client.html",
                controller: "SearchAlbumController",
                controllerAs: "model"
            })

            .when("/user/:id/search/user/:keyword", {
                templateUrl: "views/search/searchUser.view.client.html",
                controller: "SearchUserController",
                controllerAs: "model"
            })

            //user routes

            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when("/user/:id", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })

            // //website routes
            .when("/user/:userId/website", {
                templateUrl: "views/album/album-list.view.client.html",
                //controller: "WebsiteListController",
                //controllerAs: "model"
            })
            // .when("/user/:userId/website/new", {
            //     templateUrl: "views/website/album-new.view.client.html",
            //     controller: "NewWebsiteController",
            //     controllerAs: "model"
            // })
            // .when("/user/:userId/website/:websiteId", {
            //     templateUrl: "views/website/website-edit.view.client.html",
            //     controller: "EditWebsiteController",
            //     controllerAs: "model"
            // })
            //
            // // page routes
            // .when("/user/:userId/website/:websiteId/page", {
            //     templateUrl: "views/page/page-list.view.client.html",
            //     controller: "PageListController",
            //     controllerAs: "model"
            // })
            // .when("/user/:userId/website/:websiteId/page/new", {
            //     templateUrl: "views/page/page-new.view.client.html",
            //     controller: "NewPageController",
            //     controllerAs: "model"
            // })
            // .when("/user/:userId/website/:websiteId/page/:pageId", {
            //     templateUrl: "views/page/page-edit.view.client.html",
            //     controller: "EditPageController",
            //     controllerAs: "model"
            // })
            //
            // // widget routes
            // .when("/user/:userId/website/:websiteId/page/:pageId/widget", {
            //     templateUrl: "views/widget/widget-list.view.client.html",
            //     controller: "WidgetListController",
            //     controllerAs: "model"
            // })
            // .when("/user/:userId/website/:websiteId/page/:pageId/widget/new", {
            //     templateUrl: "views/widget/widget-chooser.view.client.html",
            //     controller: "NewWidgetController",
            //     controllerAs: "model"
            // })
            // .when("/user/:userId/website/:websiteId/page/:pageId/widget/:widgetId", {
            //     templateUrl: "views/widget/widget-edit.view.client.html",
            //     controller: "EditWidgetController",
            //     controllerAs: "model"
            // })
            // .when("/user/:userId/website/:websiteId/page/:pageId/widget/:widgetId/flickr", {
            //     templateUrl: "views/widget/widget-flickr-search.view.client.html",
            //     controller: "FlickrImageSearchController",
            //     controllerAs: "model"
            //
            // })
            // .otherwise({
            //     redirectTo: "/home"
            // });

        function checkLoggedIn(MusicianService, $location, $q, $rootScope) {

            var deferred = $q.defer();

            MusicianService
                .loggedIn()
                .then(
                    function(response) {
                        var user = response.data;
                        console.log(user);
                        if(user == '0') {
                            $rootScope.currentUser = null;
                            deferred.reject();
                            $location.url("/login");
                        } else {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        }
                    },
                    function(err) {
                        $location.url("/login");
                    }
                );

            return deferred.promise;
        }

    }
})();