module.exports = function(app) {
    var models = require("./model/models.server.js")();

    var musicianService = require("./services/musician.service.server.js")(app, models);
};