(function () {
    angular
        .module("WeMusicians")
        .factory("MusicianService", MusicianService);

    function MusicianService($http) {
        var api = {
            createUser: createUser,
            loggedIn: loggedIn,
            register: register,
            login: login,
            logout: logout,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            deleteUser: deleteUser,
            searchByUsername: searchByUsername
        };
        return api;

        function searchByUsername(keyword) {
            var url = "/papi/search/user/" + keyword;
            return $http.get(url);
        }
        function createUser(newUser) {
            var url = "/papi/user";
            return $http.post(url, newUser);
        }

        function loggedIn() {
            return $http.get("/papi/loggedIn");
        }

        function register(username, password) {
            var url = "/papi/register";
            var user = {
                username: username,
                password: password
            };
            return $http.post(url, user);
        }

        function login(username, password) {
            var url = "/papi/login";
            var user = {
                username: username,
                password: password
            };
            return $http.post(url, user);
        }

        function logout() {
            return $http.post("/papi/logout");
        }

        function findUserById(id) {
            var url = "/papi/user/" + id;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/papi/user?username="+username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = "/papi/user?username="+username+"&password="+password;
            return $http.get(url);
        }

        function updateUser(id, newUser) {
            var url = "/papi/user/" + id;
            return $http.put(url, newUser);
        }

        function deleteUser(userId) {
            var url = "/papi/user/" + userId;
            return $http.delete(url);
        }

    }
})();