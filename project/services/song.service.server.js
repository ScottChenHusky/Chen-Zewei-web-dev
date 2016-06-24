/**
 * Created by Zhenhuan on 6/24/2016.
 */
module.exports = function(app, models) {

    var songModel = models.songModel;

    app.post("/papi/album/:albumId/song", createSong);
    app.get("/papi/album/:albumId/song", findAllSongsForAlbum);
    app.get("/papi/song/:songId", findSongById);
    app.put("/papi/song/:songId", updateSong);
    app.delete("/papi/song/:songId", deleteSong);

    function createSong(req, res) {
        var newSong = req.body;
        var albumId = req.params.songId;
        songModel
            .createSongForAlbum(albumId, newSong)
            .then(
                function(song) {
                    res.json(song);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function findAllSongsForAlbum(req, res) {
        var albumId = req.params.albumId;
        songModel
            .findAllSongsForAlbum(albumId)
            .then(
                function(songs) {
                    res.json(songs);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function findSongById(req, res) {
        var id = req.params.songId;
        songModel
            .findSongById(id)
            .then(
                function(song) {
                    res.json(song);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function updateSong(req, res) {
        var newSong = req.body;
        var id = req.params.songId;
        songModel
            .updateSong(id, newSong)
            .then(
                function(song) {
                    res.json(song);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );

    }

    function deleteSong(req, res) {
        var id = req.params.songId;
        songModel
            .deleteSong(id)
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