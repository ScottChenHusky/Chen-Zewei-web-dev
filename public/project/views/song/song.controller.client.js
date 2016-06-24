(function(){
    angular
        .module("WeMusicians")
        .controller("SongListController", SongListController)
        .controller("NewSongController", NewSongController)
        .controller("EditSongController", EditSongController);

    function SongListController($routeParams,
                                SongService, MusicianService, AlbumService,$location) {
        var vm = this;
        vm.userId = $routeParams.id;
        vm.albumId = $routeParams.albumId;
        vm.logout = logout;
        vm.search = search;
        function logout() {
            MusicianService.logout()
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }
        function search(keyword) {
            $location.url("/user/"+vm.userId+"/search/song/" + keyword);
        }
        function init() {
            SongService
                .findSongByAlbumId(vm.albumId)
                .then(
                    function(response) {
                        vm.songs = response.data;
                        SongService.findAlbumById(vm.albumId)
                            .then(
                                function(response) {
                                    vm.album = response.data;
                                },
                                function(error) {
                                    vm.error = error.data;
                                }
                            );
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();
    }

    function NewSongController($location, $routeParams, SongService, MusicianService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.albumId = $routeParams.albumId;
        vm.createSong = createSong;
        vm.logout = logout;
        function logout() {
            MusicianService.logout()
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }

        function createSong(name, url, RockBox, JazzBox, PopBox) {
            if (!name) {
                vm.error = "Please provide a song name";
                return;
            } else if (!url) {
                vm.error = "Please provide a song URL.";
                return;
            }
            
            var song = {
                name: name,
                url: url,
                rock: RockBox,
                jazz: JazzBox,
                pop: PopBox
            };
            SongService
                .createSong(vm.userId, vm.albumId, song)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album/"+vm.albumId+"/song");
                    }, 
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function EditSongController($location, $routeParams, SongService, MusicianService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.albumId = $routeParams.albumId;
        vm.songId = $routeParams.songId;
        vm.deleteSong = deleteSong;
        vm.updateSong = updateSong;
        vm.logout = logout;
        function logout() {
            MusicianService.logout()
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }

        function init() {
            SongService
                .findSongById(vm.songId)
                .then(
                    function(response) {
                        vm.song = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function deleteSong() {
            SongService
                .deleteSong(vm.songId)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album/"+vm.albumId+"/song");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }

        function updateSong(song) {
            if (!song.name) {
                vm.error = "Please provide a song name.";
                return;
            } else if (!song.url) {
                vm.error = "Please provide a song URL.";
                return;
            }

            SongService
                .updateSong(vm.songId, song)
                .then(
                    function(response) {
                        $location.url("/user/"+vm.userId+"/album/"+vm.albumId+"/song");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }
})();