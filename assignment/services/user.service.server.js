var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, models) {
    
    var userModel = models.userModel;

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/user',
            failureRedirect: '/#/login'
        }));
    app.get ("/auth/facebook", passport.authenticate('facebook', { scope : 'email' }));
    app.post("/api/user", createUser);
    app.post("/api/logout", logout);
    app.get("/api/loggedin", loggedin);
    app.post("/api/login", passport.authenticate('wam'), login);
    app.post("/api/register", register);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", authenticate, deleteUser);

    passport.use('wam', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, done) {
        var id = profile.id;
        userModel
            .findUserByFacebookId(id)
            .then(
                function(user) {
                    if(user) {
                        return done(nul, user);
                    } else {
                        var user = {
                            username: profile.displayName.replace(/ /g, ''),
                            facebook: {
                                id: profile.id,
                                displayName: profile.displayName
                            }
                        };
                        return userModel
                            .createUser(user)
                    }
                }
            )
            .then(
                function(user) {
                    return done(null, user);
                }
            );
    }

    function authenticate(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function loggedin(req, res) {
        if(req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send("0");
        }
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

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

    function register(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user) {
                        res.status(400).send("Username already exist");
                        return;
                    } else {
                        req.body.password = bcrypt.hashSync(password); // before the user be created

                        return userModel
                            .createUser(req.body);
                    }
                    res.send(200);
                },
                function(error) {
                    res.status(400).send(error);
                }
            )
            .then(
                function(user) {
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
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
    function findUserByCredentials(username, password, req, res) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if (user === null) {
                        res.json(null);
                    } else {
                        req.user = user;
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