(function(){
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

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
                    $location.url("/profile/" + id);
                } else {
                    vm.error = "This name has been used"
                }
            } else {
                vm.error = "Passwords don't match"
            }
        }
    }
})();