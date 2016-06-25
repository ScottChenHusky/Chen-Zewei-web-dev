module.exports = function() {
    var mongoose = require("mongoose");

    var MusicianSchema = mongoose.Schema({
        isAdmin: Boolean,
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
        url: {type: String, default: "http://www.hsyearbook.org/static/images/unknown_user_large.png"},
        dateCreated: {type: Date, default: Date.now},
        albums: [{type: mongoose.Schema.Types.ObjectId, ref: 'Album'}],
        followings: {type: [String]},
        followers: {type: [String]},
        favorite: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]
    }, {collection: "project.user"});

    return MusicianSchema;
    
};