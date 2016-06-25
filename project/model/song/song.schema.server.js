module.exports = function() {
    var mongoose = require("mongoose");

    var SongSchema = mongoose.Schema({
        _album: {type: mongoose.Schema.Types.ObjectId, ref: 'Album'},
        _musician: {type: mongoose.Schema.Types.ObjectId, ref: 'Musician'},
        name: String,
        url: String,
        rock: Boolean,
        jazz: Boolean,
        pop: Boolean,
        coverUrl: String,
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.song"});

    return SongSchema;
};