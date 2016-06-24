module.exports = function() {
    var mongoose = require("mongoose");

    var AlbumSchema = mongoose.Schema({
        _musician: {type: mongoose.Schema.Types.ObjectId, ref: 'Musician'},
        name: String,
        description: String,
        rock: Boolean,
        jazz: Boolean,
        pop: Boolean,
        url: {type: String, default: "http://www.clker.com/cliparts/e/5/9/2/1352239243390755342Blank%20CD.svg.med.png"},
        songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.album"});

    return AlbumSchema;
    
};