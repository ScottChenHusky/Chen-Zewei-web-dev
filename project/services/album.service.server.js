module.exports = function(app, models) {

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var albumModel = models.albumModel;

    app.post("/papi/user/:userId/album", createAlbum);
    app.get("/papi/user/:userId/album", findAllAlbumsForUser);
    app.get("/papi/album/:albumId", findAlbumById);
    app.put("/papi/album/:albumId", updateAlbum);
    app.delete("/papi/album/:albumId", deleteAlbum);
    app.get('/papi/search/album/:keyword', searchByName);
    app.post("/papi/upload", upload.single('myFile'), uploadImage);
    app.post("/papi/upload/edit", upload.single('myFile'), editImage);

    function uploadImage(req, res) {

        var uid = req.body.userId;
        var myFile = req.file;
        var albumName = req.body.name;
        var albumDescription = req.body.description;

        var newAlbum;

        if(myFile == null) {
            newAlbum = {
                name: albumName,
                description: albumDescription,
                url: "http://www.clker.com/cliparts/e/5/9/2/1352239243390755342Blank%20CD.svg.med.png"
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
            .createAlbumForUser(uid, newAlbum)
            .then(
                function(album) {
                    res.redirect("/project/index.html#/user/"+uid+"/album/"+album._id);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function editImage(req, res) {

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
                url: "http://www.clker.com/cliparts/e/5/9/2/1352239243390755342Blank%20CD.svg.med.png"
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
                    res.sendStatus(200);
                },
                function(error) {
                    res.status(400).send("Unable to delete this album");
                }
            );
    }
};