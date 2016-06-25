module.exports = function(app) {
    var models = require("./model/models.server.js")();

    var musicianService = require("./services/musician.service.server.js")(app, models);
    var albumService = require("./services/album.service.server")(app, models);
    var songService = require("./services/song.service.server")(app, models);
    var commentService = require("./services/comment.service.server")(app, models);
};