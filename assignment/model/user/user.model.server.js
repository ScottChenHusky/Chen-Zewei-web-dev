module.exports = function() {

    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var User = mongoose.model("User", UserSchema);

    var api = {
        findUserByFacebookId: findUserByFacebookId,
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser
    };
    return api;

    function findUserByFacebookId(facebookId) {
        return User.findOne({'facebook.id': facebookId});
    }
    
    function createUser(user) {
        return User.create(user);
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }

    function updateUser(id, newUser) {
        return User.update(
            {_id: id},
            {$set :
            {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone
            }

            }
        );
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }
    
};