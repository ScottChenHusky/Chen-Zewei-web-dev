(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.unregister = unregister;
        var id = $routeParams.id;

        function init() {
            UserService
                .findUserById(id)
                .then(
                    function(response) {
                        vm.user = response.data;
                    }
                );
        }
        init();

        function updateUser(newUser) {
            UserService
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
            UserService
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
    }

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;
        function login (username, password) {
            UserService
                .findUserByCredentials(username, password)
                .then(
                    function(response) {
                        var user = response.data;
                        if(user) {
                            var id = user._id;
                            $location.url("/user/" + id);
                        }
                    },
                    function (error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register (username, password1, password2) {
            if (password1 === password2) {
                var user = {
                    username: username,
                    password: password1,
                    firstName: "",
                    lastName: ""
                };
                UserService
                    .createUser(user)
                    .then(
                        function(response){
                            var user = response.data;
                            $location.url("/user/"+user._id);
                        },
                        function(error){
                            vm.error = error.data;
                        }
                    );
            } else {
                vm.error = "Passwords don't match";
            }
        }
    }
})();