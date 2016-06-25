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

            .when("/user/:userId/search/song/:keyword", {
                templateUrl: "views/search/searchSong.view.client.html",
                controller: "SearchSongController",
                controllerAs: "model"
            })

            .when("/user/:userId/search/album/:keyword", {
                templateUrl: "views/search/searchAlbum.view.client.html",
                controller: "SearchAlbumController",
                controllerAs: "model"
            })

            .when("/user/:userId/search/user/:keyword", {
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

            // //album routes
            .when("/user/:userId/album", {
                templateUrl: "views/album/album-list.view.client.html",
                controller: "AlbumListController",
                controllerAs: "model"
            })
            .when("/user/:userId/album/new", {
                templateUrl: "views/album/album-new.view.client.html",
                controller: "NewAlbumController",
                controllerAs: "model"
            })
            .when("/user/:userId/album/:albumId", {
                templateUrl: "views/album/album-edit.view.client.html",
                controller: "EditAlbumController",
                controllerAs: "model"
            })

            // song routes
            .when("/user/:userId/album/:albumId/song", {
                templateUrl: "views/song/song-list.view.client.html",
                controller: "SongListController",
                controllerAs: "model"
            })
            .when("/user/:userId/album/:albumId/song/new", {
                templateUrl: "views/song/song-new.view.client.html",
                controller: "NewSongController",
                controllerAs: "model"
            })
            .when("/user/:userId/album/:albumId/song/:songId", {
                templateUrl: "views/song/song-edit.view.client.html",
                controller: "EditSongController",
                controllerAs: "model"
            })
/*
            // player and comment routes
            .when("/user/:userId/album/:albumId/song/:songId/play", {
                templateUrl: "views/player/player-comment-list.view.client.html",
                controller: "PlayerCommentListController",
                controllerAs: "model"
            })
            .when("/user/:userId/album/:albumId/song/:songId/play/new", {
                templateUrl: "views/player/player-comment-new.view.client.html",
                controller: "PlayerNewCommentController",
                controllerAs: "model"
            })
            .when("/user/:userId/album/:albumId/song/:songId/play/:commentId", {
                templateUrl: "views/player/player-comment-edit.view.client.html",
                controller: "PlayerEditCommentController",
                controllerAs: "model"
            })
*/
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