(function(){
    angular
        .module("WeMusicians")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function ProfileController($routeParams, $rootScope, $location, MusicianService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.unregister = unregister;
        vm.logout = logout;
        vm.search = search;
        var id = $rootScope.currentUser._id;

        function init() {
            MusicianService
                .findUserById(id)
                .then(
                    function(response) {
                        vm.user = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function search(keyword) {
            $location.url("/user/"+id+"/search/user/" + keyword);
        }

        function updateUser(newUser) {
            MusicianService
                .updateUser(id, newUser)
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
                .deleteUser(id)
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
                            $location.url("/user/" + id);
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

        function register (username, password1, password2) {
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
                .register(username, password1)
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
})();