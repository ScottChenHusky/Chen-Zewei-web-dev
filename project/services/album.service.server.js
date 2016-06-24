module.exports = function(app, models) {

    var albumModel = models.albumModel;

    app.post("/papi/user/:userId/album", createAlbum);
    app.get("/papi/user/:userId/album", findAllAlbumsForUser);
    app.get("/papi/album/:albumId", findAlbumById);
    app.put("/papi/album/:albumId", updateAlbum);
    app.delete("/papi/album/:albumId", deleteAlbum);
    app.get('/papi/search/album/:keyword', searchByName);
    function searchByName(req,res) {
        var keyword = req.params.keyword;
        albumModel
            .searchByName(keyword)
            .then(
                function(result) {
                    if (result) {
                        res.json(result);
                    } else {
                        res.status(404).send("No matched result in songs.");
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }

            )
    }
    function createAlbum(req, res) {
        var newAlbum = req.body;
        var userId = req.params.userId;
        albumModel
            .createAlbumForUser(userId, newAlbum)
            .then(
                function(album) {
                    res.json(album);
                },
                function(error) {
                    res.status(400).send(error);
                }
            )
    }

    function findAllAlbumsForUser(req, res) {
        var userId = req.params.userId;
        albumModel
            .findAllAlbumsForUser(userId)
            .then(
                function(albums) {
                    res.json(albums);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function findAlbumById(req, res) {
        var id = req.params.albumId;
        albumModel
            .findAlbumById(id)
            .then(
                function(album) {
                    res.json(album);
                },
                function(error) {
                    res.status(404).send(error);
                }

            );
    }

    function updateAlbum(req, res) {
        var album = req.body;
        var id = req.params.albumId;
        albumModel
            .updateAlbum(id, album)
            .then(
                function(album) {
                    res.json(album);
                },
                function(error) {
                    res.status(400).send("unable to update the album");
                }
            );
    }

    function deleteAlbum(req, res) {
        var id = req.params.albumId;
        albumModel
            .deleteAlbum(id)
            .then(
                function(status) {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send("Unable to delete this album");
                }
            );
    }
};