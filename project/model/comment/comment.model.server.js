/**
 * Created by Zhenhuan on 6/24/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var CommentSchema = require("./comment.schema.server.js")();
    var Comment = mongoose.model("Comment", CommentSchema);

    var api = {
        createComment: createComment,
        findAllCommentsForSong: findAllCommentsForSong,
        findCommentById: findCommentById,
        updateComment: updateComment,
        deleteComment: deleteComment,
        searchByTitle: searchByTitle
    };
    return api;

    function searchByTitle(keyword) {
        return Comment.find({"title": new RegExp(keyword, 'i')});
    }
    function createComment(comment) {
        return Comment.create(comment);
    }

    function findAllCommentsForSong(songId) {
        return Comment.find({_song: songId});
    }

    function findCommentById(commentId) {
        return Comment.findById(commentId);
    }

    function updateComment(commentId, comment) {
        return Comment.findOneAndUpdate({_id: commentId}, comment);
    }

    function deleteComment(commentId) {
        return Comment.remove({_id: commentId});
    }
};