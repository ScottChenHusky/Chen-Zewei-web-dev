(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

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
})();