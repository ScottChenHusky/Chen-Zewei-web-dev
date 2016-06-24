var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, models) {

    var musicianModel = models.musicianModel;

    app.get('/pauth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/#/user',
            failureRedirect: '/project/#/login'
        }));
    app.get ("/pauth/facebook", passport.authenticate('facebook', { scope : 'email' }));
    app.post("/papi/user", createUser);
    app.post("/papi/logout", logout);
    app.get("/papi/loggedIn", loggedIn);
    app.post("/papi/login", passport.authenticate('wam'), login);
    app.post("/papi/register", register);
    app.get("/papi/user", getUsers);
    app.get("/papi/user/:userId", findUserById);
    app.put("/papi/user/:userId", updateUser);
    app.delete("/papi/user/:userId", authenticate, deleteUser);
    app.get('/papi/search/user/:keyword', searchByUsername);

    passport.use('wam', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.PROJECT_FACEBOOK_CALLBACK_URL
    };

    passport.use('facebook', new FacebookStrategy(facebookConfig, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, done) {
        var id = profile.id;
        musicianModel
            .findUserByFacebookId(id)
            .then(
                function(facebookUser) {
                    if(facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            username: profile.displayName.replace(/ /g, ''),
                            facebook: {
                                id: profile.id,
                                token: token,
                                displayName: profile.displayName
                            }
                        };
                        return musicianModel
                            .createUser(facebookUser)
                            .then(
                                function(user) {
                                    done(null, user);
                                }
                            );
                    }
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
        musicianModel
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
        musicianModel
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
        res.sendStatus(200);
    }

    function loggedIn(req, res) {
        if(req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }
    function searchByUsername(req,res) {
        var keyword = req.params.keyword;
        //var keyword = req.body;
        musicianModel
            .searchByUsername(keyword)
            .then(
                function(result) {
                    if (result) {
                        res.json(result);
                    } else {
                        res.status(402).send("No matched result in muscian.");
                    }
                },
                function (err) {
                    res.status(404).send(err);
                }
            
        )
    }
    function createUser(req, res) {
        var newUser = req.body;
        musicianModel
            .findUserByUsername(newUser.username)
            .then(
                function(user) {
                    if(user === null) {
                        musicianModel
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

        musicianModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user) {
                        res.status(400).send("Username already exist");
                        return;
                    } else {
                        req.body.password = bcrypt.hashSync(password); // before the user be created

                        return musicianModel
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
        musicianModel
            .deleteUser(id)
            .then(
                function(status) {
                    res.sendStatus(200);
                },
                function(error) {
                    res.status(404).send("Unable to remove with ID: " + id);
                }
            );
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        musicianModel
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
        musicianModel
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
        musicianModel
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
        musicianModel
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