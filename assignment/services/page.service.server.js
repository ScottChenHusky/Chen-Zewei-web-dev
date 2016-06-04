module.exports = function(app) {

    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456" },
        { "_id": "432", "name": "Post 2", "websiteId": "456" },
        { "_id": "543", "name": "Post 3", "websiteId": "456" }
    ];

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req, res) {
        var newPage = req.body;
        newPage.websiteId = req.params.websiteId;
        pages.push(newPage);
        res.json(newPage);
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var resultSet = [];
        for(var i in pages) {
            if(pages[i].websiteId === websiteId) {
                resultSet.push(pages[i]);
            }
        }
        res.send(resultSet);
    }

    function findPageById(req, res) {
        var id = req.params.pageId;
        for(var i in pages) {
            if (pages[i]._id === id) {
                res.send(pages[i]);
                return;
            }
        }
        res.status(404).send("Page not fund");
    }

    function updatePage(req, res) {
        var page = req.body;
        var id = req.params.pageId;
        for (var i in pages) {
            if (pages[i]._id === id) {
                pages[i] = page;
                res.send(200);
                return;
            }
        }
        res.status(400).send("Unable to update Page");
    }

    function deletePage(req, res) {
        var id = req.params.pageId;
        for (var i in pages) {
            if(pages[i]._id === id) {
                pages.splice(i, 1);
                res.send(200);
                return;
            }
        }
        res.status(404).send("Unable to find the Page");
    }
};