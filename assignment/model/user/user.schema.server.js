module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        facebook: {
            id: String,
            token: String,
            displayName: String
        },
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Website'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "assignment.user"});

    return UserSchema;
};