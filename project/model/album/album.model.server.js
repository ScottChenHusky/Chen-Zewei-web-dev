module.exports = function() {

    var mongoose = require("mongoose");
    var AlbumSchema = require("./album.schema.server")();
    var Album = mongoose.model("Album", AlbumSchema);

    var api = {
        createAlbumForUser: createAlbumForUser,
        findAllAlbumsForUser: findAllAlbumsForUser,
        findAlbumById: findAlbumById,
        updateAlbum: updateAlbum,
        deleteAlbum: deleteAlbum
    };
    return api;


    function createAlbumForUser(userId, album) {
        album._musician = userId;
        return Album.create(album);
    }

    function findAllAlbumsForUser(userId) {
        return Album.find({_musician: userId});
    }

    function findAlbumById(albumId) {
        return Album.findById(albumId);
    }

    function updateAlbum(albumId, album) {
        return Album.update(
            {_id: albumId},
            {$set :
            {
                name: album.name,
                description: album.description
            }
            }
        );
    }

    function deleteAlbum(albumId) {
        return Album.remove({_id: albumId});
    }
};