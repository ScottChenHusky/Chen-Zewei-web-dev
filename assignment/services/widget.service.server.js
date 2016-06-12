module.exports = function(app, models) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var widgetModel = models.widgetModel;

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);

    function createWidget(req, res) {
        var newWidget = req.body;
        var pageId = req.params.pageId;
        widgetModel
            .createWidget(pageId, newWidget)
            .then(
                function(widget) {
                    res.json(widget);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function(widgets) {
                    res.json(widgets);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function findWidgetById(req, res) {
        var id = req.params.widgetId;
        widgetModel
            .findWidgetById(id)
            .then(
                function(widget) {
                    res.json(widget);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var id = req.params.widgetId;
        widgetModel
            .updateWidget(id, widget)
            .then(
                function(widget) {
                    res.json(widget);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function deleteWidget(req, res) {
        var id = req.params.widgetId;
        widgetModel
            .deleteWidget(id)
            .then(
                function(status) {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send(error);
                }
            );
    }

    function uploadImage(req, res) {

        var uid = req.body.userId;
        var webId = req.body.websiteId;
        var pid = req.body.pageId;

        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        if(myFile == null) {
            res.redirect("/assignment/index.html#/user/"+uid+"/website/"+webId+"/page/"+pid+"/widget/"+widgetId);
            return;
        } else {
            var originalname  = myFile.originalname; // file name on user's computer
            var filename      = myFile.filename;     // new file name in upload folder
            var path          = myFile.path;         // full path of uploaded file
            var destination   = myFile.destination;  // folder where file is saved to
            var size          = myFile.size;
            var mimetype      = myFile.mimetype;

            widgetModel
                .updateWidgetUrl(widgetId, "/uploads/"+filename)
                .then(
                    function(widget) {
                        res.redirect("/assignment/index.html#/user/"+uid+"/website/"+webId+"/page/"+pid+"/widget/"+widgetId);
                    },
                    function(error) {
                        res.status(404).send(error);
                    }
                );

            // for(var i in widgets) {
            //     if(widgets[i]._id === widgetId) {
            //         widgets[i].url = "/uploads/"+filename;
            //     }
            // }
        }
        res.redirect("/assignment/index.html#/user/"+uid+"/website/"+webId+"/page/"+pid+"/widget/"+widgetId);
    }
};