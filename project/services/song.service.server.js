/**
 * Created by Zhenhuan on 6/24/2016.
 */
module.exports = function(app, models) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var songModel = models.songModel;

    app.post("/papi/user/:userId/album/:albumId/song", createSong);
    app.get("/papi/album/:albumId/song", findAllSongsForAlbum);
    app.get("/papi/song/:songId", findSongById);
    app.put("/papi/song/:songId", updateSong);
    app.delete("/papi/song/:songId", deleteSong);
    app.get('/papi/search/song/:keyword', searchByName);
    app.post("/papi/upload/song", upload.single('myFile'), uploadMusic);
    app.post("/papi/upload/song/edit", upload.single('myFile'), editMusicUpload);
    function uploadMusic(req, res) {
        var myFile = req.file;

        var userId = req.body.userId;
        var albumId = req.body.albumId;
        var url = req.body.url;
        var rock = req.body.rock;
        var pop = req.body.pop;
        var jazz = req.body.jazz;

        var name = req.body.name;
        var url = req.body.url;

        var newSong;

        if(myFile == null) {
            newSong = {
                name: name,
                url: url,
                rock: rock,
                jazz: jazz,
                pop: pop
            };
        } else {
            var originalname  = myFile.originalname; // file name on user's computer
            var filename      = myFile.filename;     // new file name in upload folder
            var path          = myFile.path;         // full path of uploaded file
            var destination   = myFile.destination;  // folder where file is saved to
            var size          = myFile.size;
            var mimetype      = myFile.mimetype;
            newSong = {
                name: name,
                url: "/uploads/song/"+filename,
                rock: rock,
                jazz: jazz,
                pop: pop
            };

        }
        //res.redirect("/project/index.html#/user/"+uid+"/album/"+albumId);
        songModel
            .createSong(userId, albumId, newSong)
            .then(
                function(song) {
                    res.redirect("/project/index.html#/user/"
                        +userId+"/album/"+albumId + "/song/"+song._id);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function editMusicUpload(req, res) {

        var myFile = req.file;
        var uid = req.body.userId;
        var albumName = req.body.name;
        var albumDescription = req.body.description;
        var albumUrl = req.body.url;
        var albumId = req.body.albumId;

        var newAlbum;


        if(myFile == null) {
            newAlbum = {
                name: albumName,
                description: albumDescription,
                url: albumUrl
            };
        } else {
            var originalname  = myFile.originalname; // file name on user's computer
            var filename      = myFile.filename;     // new file name in upload folder
            var path          = myFile.path;         // full path of uploaded file
            var destination   = myFile.destination;  // folder where file is saved to
            var size          = myFile.size;
            var mimetype      = myFile.mimetype;


            newAlbum = {
                name: albumName,
                description: albumDescription,
                url: "/uploads/"+filename
            };

        }
        //res.redirect("/project/index.html#/user/"+uid+"/album/"+albumId);
        albumModel
            .updateAlbum(albumId, newAlbum)
            .then(
                function(album) {
                    res.redirect("/project/index.html#/user/"+uid+"/album/"+albumId);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function searchByName(req,res) {
        var keyword = req.params.keyword;
        songModel
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
    function createSong(req, res) {
        var newSong = req.body;
        var userId = req.params.userId;
        var albumId = req.params.albumId;
        newSong._musican = userId;
        newSong._album = albumId;
        songModel
            .createSong(userId, albumId, newSong)
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
                    res.status(400).send(error);
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