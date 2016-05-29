(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        var id = $routeParams.id;

        function init() {
            vm.user = angular.copy(UserService.findUserById(id));
        }
        init();

        function updateUser(newUser) {
            vm.success = "Success";
            UserService.updateUser(id, newUser);
        }
    }

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;
        function login (username, password) {
            var user = UserService.findUserByCredentials(username, password);
            if(user) {
                var id = user._id;
                $location.url("/user/" + id);
            } else {
                vm.error = "User not found";
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register (username, password1, password2) {
            if (password1 === password2) {
                if(!UserService.findUserByUsername(username)) {
                    var id = (new Date).getTime();
                    var user = {_id: "" + id,
                        username: username,
                        password: password1,
                        firstName: "",
                        lastName: ""};
                    UserService.createUser(user);
                    $location.url("/user/" + id);
                } else {
                    vm.error = "This name has been used"
                }
            } else {
                vm.error = "Passwords don't match"
            }
        }
    }
})();