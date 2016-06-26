(function(){
    angular
        .module("WeMusicians")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController)
        .controller("HomeController", HomeController);

    function ProfileController($routeParams, $rootScope, $location, MusicianService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.unregister = unregister;
        vm.logout = logout;
        vm.search = search;
        var currentId = $rootScope.currentUser._id;
        var userId = $routeParams.id;

        function init() {
            if (currentId === userId || $rootScope.currentUser.isAdmin) {
                MusicianService
                    .findUserById(userId)
                    .then(
                        function(response) {
                            vm.user = response.data;
                        },
                        function(error) {
                            vm.error = error.data;
                        }
                    );
            } else {
                $location.url("/user/"+currentId+"/album")
            }
        }
        init();

        function search(keyword) {
            $location.url("/user/"+userId+"/search/user/" + keyword);
        }

        function updateUser(newUser) {
            MusicianService
                .updateUser(userId, newUser)
                .then(
                    function(response) {
                        vm.success = "Success";
                    },
                    function(error) {
                        vm.error = error.data;
                    }
            );
        }

        function unregister() {
            MusicianService
                .deleteUser(userId)
                .then(
                    function(response) {
                        $location.url("/login");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
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

    function LoginController($location, $rootScope, MusicianService) {
        var vm = this;
        vm.login = login;
        
        function login (username, password) {
            if (!username || !password) {
                vm.error = "Please Enter Username & Password";
                return;
            }
            MusicianService
                .login(username, password)
                .then(
                    function(response) {
                        var user = response.data;
                        if(user) {
                            $rootScope.currentUser = user;
                            var id = user._id;
                            $location.url("/user/" + id+"/album");
                        } else {
                            vm.error = "Please check your Username or Password";
                        }
                    },
                    function (error) {
                        vm.error = "User not found";
                    }
                );
        }
    }

    function RegisterController($location, $rootScope, MusicianService) {
        var vm = this;
        vm.register = register;

        function register (username, password1, password2, admin) {
            if (!username) {
                vm.error = "Please Enter Username";
                return;
            } else if (!password1) {
                vm.error = "Please Enter Password";
                return;
            } else if (!password2) {
                vm.error = "Please Enter Verified Password";
                return;
            } else if (password1 !== password2) {
                vm.error = "Passwords don't match";
                return;
            }
            MusicianService
            //.createUser(user)
                .register(username, password1, admin)
                .then(
                    function(response){
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/user/"+user._id);
                        // if (newUser !== null) {
                        //     $location.url("/user/"+newUser._id);
                        // } else {
                        //     vm.error = "This username has been used";
                        // }
                    },
                    function(error){
                        vm.error = error.data;
                    }
                );
        }
    }

    function HomeController(SongService){
        var vm = this;
        function init() {
            SongService
                .findNewSongs(10)
                .then(
                    function(response) {
                        vm.newSongs = response.data;
                    },
                    function(err) {
                        vm.err = err.data;
                    }
                )
        }
        init();
        
    }
})();