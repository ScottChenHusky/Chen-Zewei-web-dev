module.exports = function(app, models) {
    
    var userModel = models.userModel;

    app.post("/api/user", createUser);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    function createUser(req, res) {
        var newUser = req.body;
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user) {
                    if(user === null) {
                        userModel
                            .createUser(newUser)
                            .then(
                                function(user) {
                                    res.json(user);
                                },
                                function(error) {
                                    res.status(400).send("Username has been used");
                                }
                            );
                    } else {
                        res.json(null);
                    }
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }
    
    function deleteUser(req, res) {
        var id = req.params.userId;
        userModel
            .deleteUser(id)
            .then(
                function(status) {
                    res.send(200);
                },
                function(error) {
                    res.status(404).send("Unable to remove with ID: " + id);
                }
            );
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(id, newUser)
            .then(
                function(user) {
                    res.send(200);
                },
                function(error) {
                    res.status(404).send("Unable to update user with ID: " + id);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(
                function(user) {
                    res.send(user);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function getUsers(req, res) {
        var username = req.query["username"];
        var password = req.query["password"];
        console.log(username);
        console.log(password);
        if(username && password) {
            findUserByCredentials(username, password, res);
        } else if(username) {
            findUserByUsername(username, res);
        } else {
            res.send(users);
        }
    }
    function findUserByCredentials(username, password, res) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if (user === null) {
                        res.json(null);
                    } else {
                        res.json(user);
                    }
                },
                function(error) {
                    res.status(403).send("Unable to login");
                }
            );

    }
    function findUserByUsername(username, res) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if (user.username !== username) {
                        res.status(404).send("Unable to find the user: " + username);
                    } else {
                        res.send(user);
                    }
                },
                function(error) {
                    res.status(404).send("Unable to find the user: " + username);
                }
            )
    }
};