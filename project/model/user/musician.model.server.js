module.exports = function() {

    var mongoose = require("mongoose");
    var MusicianSchema = require("./musician.schema.server.js")();
    var Musician = mongoose.model("Musician", MusicianSchema);

    var api = {
        findUserByFacebookId: findUserByFacebookId,
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        searchByUsername: searchByUsername,
        updateFollowUnfollow: updateFollowUnfollow,
        updateMucisianUrl: updateMucisianUrl
    };
    return api;

    function updateFollowUnfollow(id, newUser) {
        return Musician.update(
            {_id: id},
            {$set :
            {
                followings: newUser.followings,
                followers: newUser.followers
            }

            }
        );
    }

    function searchByUsername(keyword) {
        return Musician.find({"username": new RegExp(keyword, 'i')});
    }
    function findUserByFacebookId(facebookId) {
        return Musician.findOne({'facebook.id': facebookId});
    }

    function createUser(user) {
        return Musician.create(user);
    }

    function findUserById(userId) {
        return Musician.findById(userId);
    }

    function findUserByUsername(username) {
        return Musician.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return Musician.findOne({username: username, password: password});
    }

    function updateUser(id, newUser) {
        return Musician.update(
            {_id: id},
            {$set :
            {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                url: newUser.url
            }

            }
        );
    }

    function updateMucisianUrl(id, newUser) {
        return Musician.update(
            {_id: id},
            {$set :
            {
                url: newUser.url
            }

            }
        );
    }

    function deleteUser(userId) {
        return Musician.remove({_id: userId});
    }
};