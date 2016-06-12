module.exports = function(app, models) {

    var websiteModel = models.websiteModel;

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res) {
        var newWebsite = req.body;
        var userId = req.params.userId;
        websiteModel
            .createWebsiteForUser(userId, newWebsite)
            .then(
                function(website) {
                    res.json(website);
                }, 
                function(error) {
                    res.status(400).send(error);
                }
            )
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function(websites) {
                    res.json(websites);
                }, 
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function findWebsiteById(req, res) {
        var id = req.params.websiteId;
        websiteModel
            .findWebsiteById(id)
            .then(
                function(website) {
                    res.json(website);
                },
                function(error) {
                    res.status(404).send(error);
                }
                
            );
    }

    function updateWebsite(req, res) {
        var website = req.body;
        var id = req.params.websiteId;
        websiteModel
            .updateWebsite(id, website)
            .then(
                function(website) {
                    res.json(website);
                },
                function(error) {
                    res.status(400).send("unable to update the website");
                }
            );
    }

    function deleteWebsite(req, res) {
        var id = req.params.websiteId;
        websiteModel
            .deleteWebsite(id)
            .then(
                function(status) {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send("Unable to delete this website");
                }
            );
    }
};