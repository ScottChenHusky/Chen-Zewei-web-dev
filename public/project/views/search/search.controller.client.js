(function(){
    angular
        .module("WeMusicians")
        .controller("SearchUserController", SearchUserController)
        .controller("SearchAlbumController", SearchAlbumController)
        .controller("SearchSongController", SearchSongController);

    function SearchUserController($routeParams, $rootScope, $location, MusicianService) {
        var vm = this;
        vm.logout = logout;
        vm.search = search;

        vm.keyword = $routeParams.keyword;
        //var id = $rootScope.currentUser._id;
        vm.userId = $routeParams.userId;
        function init() {
            MusicianService
                .searchByUsername(vm.keyword)
                .then(
                    function(response) {
                        vm.result = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function search() {
            if (vm.keyword.length > 0) {
                $location.url("/user/" + vm.userId + "/search/album/" + vm.keyword);
            }
        }


        function logout() {
            MusicianService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }
    }
    function SearchAlbumController($routeParams, $rootScope, $location, AlbumService) {
        var vm = this;
        vm.logout = logout;
        vm.search = search;

        vm.keyword = $routeParams.keyword;
        vm.userId = $routeParams.userId;
        function init() {
            AlbumService
                .searchByName(vm.keyword)
                .then(
                    function(response) {
                        vm.result = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function search() {
            if (vm.keyword.length > 0) {
                $location.url("/user/" + vm.userId + "/search/album/" + vm.keyword);
            }
        }


        function logout() {
            MusicianService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }
    }
    function SearchSongController($routeParams, $rootScope, $location, SongService) {
        var vm = this;
        vm.logout = logout;
        vm.search = search;

        vm.keyword = $routeParams.keyword;
        //var id = $rootScope.currentUser._id;
        vm.userId = $routeParams.userId;
        function init() {
            SongService
                .searchByName(vm.keyword)
                .then(
                    function(response) {
                        vm.result = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function search() {
            if (vm.keyword.length > 0) {
                $location.url("/user/" + vm.userId + "/search/album/" + vm.keyword);
            } else {
                return;
            }
        }


        function logout() {
            MusicianService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }
    }

    
})();