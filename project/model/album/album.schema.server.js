module.exports = function() {
    var mongoose = require("mongoose");

    var AlbumSchema = mongoose.Schema({
        _musician: {type: mongoose.Schema.Types.ObjectId, ref: 'Musician'},
        name: String,
        description: String,
        songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.album"});

    return AlbumSchema;
};