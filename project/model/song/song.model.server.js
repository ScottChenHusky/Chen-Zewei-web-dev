module.exports = function() {

    var mongoose = require("mongoose");
    var SongSchema = require("./song.schema.server")();
    var Song = mongoose.model("Song", SongSchema);

    var api = {
        createSong: createSong,
        findAllSongsForAlbum: findAllSongsForAlbum,
        findSongById: findSongById,
        updateSong: updateSong,
        deleteSong: deleteSong,
        searchByName: searchByName,
        findNewSongs: findNewSongs
    };
    return api;
    function findNewSongs(limit) {
        return Song.find().sort({$natural:-1}).limit(parseInt(limit));
    }
    function searchByName(keyword) {
        return Song.find({"name": new RegExp(keyword, 'i')});
    }
    function createSong(userId, albumId, song) {
        song._album = albumId;
        song._musician = userId;
        return Song.create(song);
    }

    function findAllSongsForAlbum(albumId) {
        return Song.find({_album: albumId});
    }

    function findSongById(songId) {
        return Song.findById(songId);
    }

    function updateSong(songId, song) {
        //return Song.findOneAndUpdate({_id: songId}, song);

        return Song.update(
            {_id: songId},
            {$set :
            {
                name: song.name,
                url: song.url,
                rock: song.rock,
                jazz: song.jazz,
                pop: song.pop,
                coverUrl: song.coverUrl
            }
            }
        );
    }

    function deleteSong(songId) {
        return Song.remove({_id: songId});
    }
};