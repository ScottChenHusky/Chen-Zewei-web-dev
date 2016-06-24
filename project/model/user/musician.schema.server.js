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
        url: {type: String, default: "http://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/29/11/Taylor-Swift-revenge-nerds.jpg"},
        dateCreated: {type: Date, default: Date.now},
        albums: [{type: mongoose.Schema.Types.ObjectId, ref: 'Album'}],
        followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Musician'}],
        followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Musician'}],
        favorite: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]
    }, {collection: "project.user"});

    return MusicianSchema;
    
};