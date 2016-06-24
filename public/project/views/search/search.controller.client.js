(function(){
    angular
        .module("WeMusicians")
        .controller("SearchUserController", SearchUserController)
        // .controller("SearchAlbumController", SearchAlbumController)
        .controller("SearchSongController", SearchSongController);

    function SearchUserController($routeParams, $rootScope, $location, MusicianService) {
        var vm = this;
        vm.logout = logout;
        vm.search = search;
        
        vm.keyword = $routeParams.keyword;
        var id = $rootScope.currentUser._id;
        vm.userId = id;
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

        function search(keyword) {
            $location.url("/user/"+id+"/search/song/" + keyword);
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

        function search(keyword) {
            $location.url("/user/"+vm.userId+"/search/song/" + keyword);
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