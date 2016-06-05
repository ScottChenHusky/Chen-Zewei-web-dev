module.exports = function(app) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);

    function createWidget(req, res) {
        console.log("here");
        var newWidget = req.body;
        newWidget.pageId = req.params.pageId;
        widgets.push(newWidget);
        res.json(newWidget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var resultSet = [];
        for(var i in widgets) {
            if(widgets[i].pageId === pageId) {
                resultSet.push(widgets[i]);
            }
        }
        res.send(resultSet);
    }

    function findWidgetById(req, res) {
        var id = req.params.widgetId;
        for(var i in widgets) {
            if (widgets[i]._id === id) {
                res.send(widgets[i]);
                return;
            }
        }
        res.status(404).send("Widget not fund");
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var id = req.params.widgetId;
        for (var i in widgets) {
            if (widgets[i]._id === id) {
                widgets[i] = widget;
                res.send(200);
                return;
            }
        }
        res.status(400).send("Unable to update Widget");
    }

    function deleteWidget(req, res) {
        var id = req.params.widgetId;
        for (var i in widgets) {
            if(widgets[i]._id === id) {
                widgets.splice(i, 1);
                res.send(200);
                return;
            }
        }
        res.status(404).send("Unable to find the Widget");
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

            for(var i in widgets) {
                if(widgets[i]._id === widgetId) {
                    widgets[i].url = "/uploads/"+filename;
                }
            }
        }
        res.redirect("/assignment/index.html#/user/"+uid+"/website/"+webId+"/page/"+pid+"/widget/"+widgetId);
    }
};