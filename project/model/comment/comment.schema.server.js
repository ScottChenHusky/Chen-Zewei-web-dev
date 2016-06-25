/**
 * Created by Zhenhuan on 6/24/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");

    var CommentSchema = mongoose.Schema({
        _album: {type: mongoose.Schema.Types.ObjectId, ref: 'Album'},
        _musician: {type: mongoose.Schema.Types.ObjectId, ref: 'Musician'},
        _song:  {type: mongoose.Schema.Types.ObjectId, ref: 'Song'},
        _author: {type: mongoose.Schema.Types.ObjectId, ref: 'Musician'},
        title: String,
        body: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.comment"});

    return CommentSchema;
};