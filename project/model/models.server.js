module.exports = function() {

    var musicianModel = require("./user/musician.model.server.js")();

    var models = {
        musicianModel: musicianModel
    };
    return models;
    
};