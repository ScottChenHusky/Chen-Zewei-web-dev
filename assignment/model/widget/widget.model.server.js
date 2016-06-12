module.exports = function() {

    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server.js")();
    var Widget = mongoose.model("Widget", WidgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget,
        updateWidgetUrl: updateWidgetUrl
        
    };
    return api;


    function createWidget(pageId, widget) {
        widget._page = pageId;
        return Widget.create(widget);
    }

    function findAllWidgetsForPage(pageId) {
        return Widget.find({_page: pageId});
    }

    function findWidgetById(widgetId) {
        return Widget.findById(widgetId);
    }

    function updateWidget(widgetId, widget) {
        return Widget.update(
            {_id: widgetId},
            {$set :
            {
                name: widget.name,
                text: widget.text,
                placeholder: widget.placeholder,
                description: widget.description,
                url: widget.url,
                width: widget.width,
                height: widget.height,
                rows: Number(widget.rows),
                size: Number(widget.size),
                class: widget.class,
                icon: widget.icon,
                deletable: widget.deletable,
                formatted: widget.formatted
            }
            }
        );
    }



    function deleteWidget(widgetId) {
        return Widget.remove({_id: widgetId});
    }

    function reorderWidget(pageId, startOrder, endOrder) {
        var start = parseInt(startOrder);
        var end = parseInt(endOrder);
        return Widget
            .find({_page: pageId}, function(err, widgets) {
                widgets.forEach(function(widget) {
                    if(start < end) {
                        if(widget.order > start && widget.order <= end) {
                            widget.order-=1;
                            widget.save();
                        } else if(widget.order === start) {
                            widget.order = end;
                            widget.save();
                        }
                    } else if (start > end) {
                        if(widget.order >= end && widget.order < start) {
                            widget.order+=1;
                            widget.save();
                        }
                        else if(widget.order === start) {
                            widget.order = end;
                            widget.save();
                        }
                    }
                })
            });
    }
    
    function updateWidgetUrl(widgetId, url) {
        return Widget.update(
            {_id: widgetId},
            {$set :
            {
                url: url
            }
            }
        ); 
    }
};