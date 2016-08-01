function gridLayout (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.children = [];
    that.widgetList = [];
    that.nbColumns = options.nbColumns;
    that.nbRows = options.nbRows;
    that.spaceH = options.spaceH;
    that.spaceW = options.spaceW;
    that.maxWidth = options.maxWidth;
    that.maxHeight = options.maxHeight;
    that.columnSize = [];

    that.init = function () {
        for (var i = 0; i < that.nbColumns; i++)
            that.columnSize.push({w: 0, h: 0});

        that.updateRect();
        that.updateSize();
    } 

    that.addWidget = function (widget) {
        that.children.push(widget);
        that.widgetList.push(widget);
    
        widget.setParent(that);
        widget.setRelPos(that.columnSize[0].w, that.columnSize[0].h);
        
        // that.columnSize[0].w += widget.size.w + that.spaceW;
        that.columnSize[0].h += widget.size.h + that.spaceH;

        widget.updateRect();
        widget.updateSize();

        that.updateWidgetsPos();

        that.updateRect();
        that.updateSize();
    }

    that.draw = function () {
        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw();
        }
    }

    that.setNbColumns = function (newNbColumn) {
        that.nbColumns = newNbColumn;
        that.updateWidgetsPos();
    }

    that.updateWidgetsPos = function () {
        var nextWidgetPos = {x: 0, y: 0};
        var currColumn = 1;

        for (var i = 0; i < that.children.length; i++) {
            var widget = that.children[i];
            
            if (nextWidgetPos.y + widget.size.h > that.maxHeight && currColumn+1 <= that.nbColumns) {
                nextWidgetPos.x += (that.maxWidth / that.nbColumns) + that.spaceW;
                nextWidgetPos.y = 0;
                currColumn++;
            }

            widget.setRelPos(nextWidgetPos.x, nextWidgetPos.y);
            nextWidgetPos.y += widget.size.h + that.spaceH;
        }

        that.updateRect();
        that.updateSize();
    }

    that.getRect = function () {
        var rect = that.rect;

        if (that.children.length > 0) {
            var rect = that.children[0].rect;

            for (var i = 0; i < that.children.length; i++) {
                var widget = that.children[i];
                
                widget.updateRect();
            
                if (widget.rect != null) {
                    if (widget.rect.l < rect.l || i == 0) rect.l = widget.rect.l;
                    if (widget.rect.r > rect.r || i == 0) rect.r = widget.rect.r;
                    if (widget.rect.t < rect.t || i == 0) rect.t = widget.rect.t;
                    if (widget.rect.b > rect.b || i == 0) rect.b = widget.rect.b;
                }
            }
        }

        return rect;
    }

    that.getSize = function () {
        return {w: that.rect.r-that.rect.l, h: that.rect.b-that.rect.t};
    }

    that.init();

    return that;
}