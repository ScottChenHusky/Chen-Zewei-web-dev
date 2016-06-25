module.exports = function() {

    var musicianModel = require("./user/musician.model.server.js")();
    var albumModel = require("./album/album.model.server")();
    var songModel = require("./song/song.model.server")();
    var commentModel = require("./comment/comment.model.server")();

    var models = {
        musicianModel: musicianModel,
        albumModel: albumModel,
        songModel: songModel,
        commentModel: commentModel
    };
    return models;
    
};