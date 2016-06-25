module.exports = function(app, models) {

    var commentModel = models.commentModel;

    app.post("/papi/user/:userId/album/:albumId/song/:songId/comment", createComment);
    app.get("/papi/song/:songId/comment", findAllCommentsForSong);
    app.get("/papi/comment/:commentId", findCommentById);
    app.put("/papi/comment/:commentId", updateComment);
    app.delete("/papi/comment/:commentId", deleteComment);
    app.get('/papi/search/comment/:keyword', searchByTitle);
    function searchByTitle(req,res) {
        var keyword = req.params.keyword;
        commentModel
            .searchByTitle(keyword)
            .then(
                function(result) {
                    if (result) {
                        res.json(result);
                    } else {
                        res.status(404).send("No matched result in comments.");
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }

            )
    }
    function createComment(req, res) {
        var newComment = req.body;
        var authorId = req.session.currentUser._id;
        var musicianId = req.params.userId;
        var albumId = req.params.albumId;
        var songId = req.params.songId;

        newComment._musican = musicianId;
        newComment._album = albumId;
        newComment._song = songId;
        newComment._author = authorId;

        commentModel
            .createComment(newComment)
            .then(
                function(comment) {
                    res.json(comment);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function findAllCommentsForSong(req, res) {
        var songId = req.params.songId;
        commentModel
            .findAllCommentsForSong(songId)
            .then(
                function(comments) {
                    res.json(comments);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function findCommentById(req, res) {
        var id = req.params.commentId;
        commentModel
            .findCommentById(id)
            .then(
                function(comment) {
                    res.json(comment);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function updateComment(req, res) {
        var newComment = req.body;
        var id = req.params.commentId;
        commentModel
            .updateComment(id, newComment)
            .then(
                function(comment) {
                    res.json(comment);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );

    }

    function deleteComment(req, res) {
        var id = req.params.commentId;
        commentModel
            .deleteComment(id)
            .then(
                function(status) {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }
};