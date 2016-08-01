var widgetList = [];


// CONSTANTS
monthShortStringList = {
    1: "JANV.",
    2: "FEVR.",
    3: "MARS",
    4: "AVR.",
    5: "MAI",
    6: "JUIN",
    7: "JUIL.",
    8: "AOUT",
    9: "SEPT",
    10: "OCT.",
    11: "NOV.",
    12: "DEC.",
}

function multipage (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.currPage = 0;
    that.destPage = 0;
    that.animPageCoef = 0.;
    that.animPageStartT = -1;
    that.animPageEndT = -1;
    that.screenOffsetStart = -1;
    that.screenOffsetDest = -1;
    that.screenOffset = 0; // position de draw dans l'écran de pages
    that.pageList = [];

    that.size = options.size;

    that.scrollBarWidget = scrollBarWidget({
        ctx: that.ctx,
        parent: that,
        relPos: {x: that.size.w-4, y: 0},
        scrollPos: that.scrollPos,
        overflow: {x: 0, y: 0},
        size: {w: 4, h: that.size.h},
    })

    //that.children.push(that.scrollBarWidget);

    that.addPages = function (pageToAddList) {
        for (var i = 0; i < pageToAddList.length; i++) {
            pageToAddList[i].setParent(that);
            pageToAddList[i].setSize(that.size.w, that.size.h);
            pageToAddList[i].updateAbsPosFromParent();
            pageToAddList[i].setRelPos(that.pageList.length * 320, 0);

            that.children.push(pageToAddList[i]);
            that.pageList.push(pageToAddList[i]);
        }

        /*
        // Au premier ajout on set la scrollBar
        if (that.pageList.length == pageToAddList.length) {
            that.scrollBarWidget.scrollPos = pageToAddList[0].scrollPos;
            that.scrollBarWidget.overflow = pageToAddList[0].overflow;
        }
        */
    }

    // TURFU : bouger des trucs dans un futur update() ? 
    that.draw = function () {
        ctx.save();
        ctx.rect(that.absPos.x, that.absPos.y, that.size.w, that.size.h);
        ctx.clip();

        if (that.pageList.length > 0) {
            if (that.animPageStartT >= 0) {
                var currTime = new Date().getTime();

                that.screenOffset = Math.round(easeInOutQuad(currTime - that.animPageStartT, that.screenOffsetStart, that.screenOffsetDest - that.screenOffsetStart, that.animPageEndT - that.animPageStartT));

                if (that.animPageEndT < currTime) {
                    that.animPageStartT = -1;
                    that.animPageEndT = -1;
                    that.currPage = that.destPage;
                    that.screenOffset = that.currPage * 320;
                }

                for (var i = 0; i < that.pageList.length; i++) {
                    that.pageList[i].setRelPos(i * 320 - that.screenOffset, 0); // Pour eviter de faire deux fois ce truc, faire un layout horizontal pour stocker les pages et appliquer la transformation?
                }

                for (var i = Math.max(0, Math.min(that.currPage, that.destPage)-1); i <= Math.min(that.pageList.length-1, Math.max(that.currPage, that.destPage)+1); i++) {
                    that.pageList[i].draw();
                }
            }
            else {
                that.pageList[that.currPage].draw();
            }

        }

        ctx.restore();

        /*if (that.scrollBarWidget.overflow.y != 0) {
            that.scrollBarWidget.draw();
        }*/
    }

    that.goToPage = function (p) {
        if (p != that.currPage) {
            if (that.pageList[that.currPage].hasOwnProperty("onLeave")) {
                that.pageList[that.currPage].onLeave();
            }
            else if (p != that.destPage && that.pageList[that.destPage].hasOwnProperty("onLeave")) {
                that.pageList[that.destPage].onLeave();
            }
        }

        that.destPage = p;
        that.animPageStartT = new Date().getTime();
        that.animPageEndT = that.animPageStartT + 500;
        that.screenOffsetStart = that.screenOffset;
        that.screenOffsetDest = 320 * that.destPage;

        /*if (that.pageList[p].hasOwnProperty("overflow")) {
            that.scrollBarWidget.scrollPos = that.pageList[p].scrollPos;
            that.scrollBarWidget.overflow = that.pageList[p].overflow;
        }
        else {
            that.scrollBarWidget.scrollPos = {w: 0, h: 0};
            that.scrollBarWidget.overflow = {w: 0, h: 0};
        }*/

        if (that.pageList[p].hasOwnProperty("onGoTo"))
            that.pageList[p].onGoTo();
    }

    that.scrollUpEvent = function () {
        that.scrollBarWidget.scrollPos = that.pageList[p].scrollPos;
        that.pageList[that.currPage].scrollUpEvent();
    }

    that.scrollDownEvent = function () {
        that.scrollBarWidget.scrollPos = that.pageList[p].scrollPos;
        that.pageList[that.currPage].scrollDownEvent();
    }

    that.updateRect();

    return that;
}

function page (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.children = [];
    that.scrollPos = {x: 0, y: 0};
    that.scrollStartT = -1;
    that.scrollEndT = -1;
    that.scrollPosStart = {x: 0, y: 0};
    that.scrollPosDest = {x: 0, y: 0};
    that.overflow = {x: 0, y: 0};
    that.title = options.title;

    /*that.scrollBarWidget = scrollBarWidget({
        ctx: options.ctx,
        parent: that,
        relPos: {x: that.size.w - 5, y: 0},
        scrollPos: that.scrollPos,
        overflow: that.overflow,
    })*/

    //that.children.push(that.scrollBarWidget);

    // TEMP TEST
    that.currentSelectedWidgetId = -1;
    that.highlighted = false;

    if (options.hasOwnProperty("scrollSpeed"))
        that.scrollSpeed = options.scrollSpeed
    else
        that.scrollSpeed = 8;

    that.addWidget = function (w) {
        w.setParent(that);
        that.children.push(w);
        //that.updateOverflow();
        that.updateRect();
        that.updateSizeFromRect();
    }

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        // SCROLLING
        if (that.scrollStartT >= 0) {
            var currTime = new Date().getTime();

            that.scrollPos.y = Math.round(easeInOutQuad(currTime - that.scrollStartT,
                                                        that.scrollPosStart.y,
                                                        that.scrollPosDest.y - that.scrollPosStart.y,
                                                        that.scrollEndT - that.scrollStartT));

            if (currTime > that.scrollEndT) {
                that.scrollStartT = -1;
                that.scrollEndT = -1;
            }
        }

        // SCROLLIN'
        that.setRelPos(that.relPos.x, -that.scrollPos.y);

        // DRAWING
        for (var i = 0; i < that.children.length; i++) {
            //that.children[i].draw(that.absPos.x - that.scrollPos.x + offX, that.absPos.y - that.scrollPos.y + offY);
            that.children[i].draw();
        }

        // TEST TEMP
        if (that.currentSelectedWidgetId != -1) {
            that.ctx.beginPath();
            that.ctx.strokeStyle = "white";

            /*that.ctx.rect(that.children[that.currentSelectedWidgetId].rect.l,
                          that.children[that.currentSelectedWidgetId].rect.t,
                          that.children[that.currentSelectedWidgetId].rect.r-that.children[that.currentSelectedWidgetId].rect.l,
                          that.children[that.currentSelectedWidgetId].rect.b-that.children[that.currentSelectedWidgetId].rect.t);*/
            that.ctx.rect(that.children[that.currentSelectedWidgetId].absPos.x,
                          that.children[that.currentSelectedWidgetId].absPos.y,
                          that.children[that.currentSelectedWidgetId].size.w,
                          that.children[that.currentSelectedWidgetId].size.h);
            that.ctx.stroke();
        }

        if (that.highlighted) {
            that.ctx.beginPath();
            that.ctx.strokeStyle = "red";

            /*that.ctx.rect(that.rect.l,
                          that.rect.t,
                          that.rect.r-that.rect.l,
                          that.rect.b-that.rect.t);*/
            that.ctx.rect(that.absPos.x,
                          that.absPos.y,
                          that.size.w,
                          that.size.h);
            that.ctx.stroke();
        }
    }

    that.scrollUpEvent = function () {
        if (that.scrollPos.y > 0) {
            that.scrollStartT = new Date().getTime();
            that.scrollEndT = that.scrollStartT + 200;
            that.scrollPosStart = {x: that.scrollPos.x, y: that.scrollPos.y};
            that.scrollPosDest = {x: that.scrollPos.x, y: Math.max(0, that.scrollPos.y - that.scrollSpeed)};
        }
    }

    that.scrollDownEvent = function () {
        if (that.scrollPos.y < that.overflow.y) {
            that.scrollStartT = new Date().getTime();
            that.scrollEndT = that.scrollStartT + 200;
            that.scrollPosStart = {x: that.scrollPos.x, y: that.scrollPos.y};
            that.scrollPosDest = {x: that.scrollPos.x, y: Math.min(that.overflow.y, that.scrollPos.y + that.scrollSpeed)};
        }
    }

    that.getOverflow = function () {
        var overflow = {x: 0, y: 0};

        for (var i = 0; i < that.children.length; i++) {
            if (that.children[i].size != null && that.children[i].absPos != null && that.size != null) { 
                var newOverflowX = that.children[i].relPos.x + that.children[i].size.w - that.size.w;
                var newOverflowY = that.children[i].relPos.y + that.children[i].size.h - that.size.h;

                if (newOverflowX > overflow.x) overflow.x = newOverflowX;
                if (newOverflowY > overflow.y) overflow.y = newOverflowY;
            }
        }
        return overflow;
    }

    that.getRect = function () {
        var rect = {l: 0, r: 0, t: 0, b: 0};

        if (that.children.length > 0) {
            for (var i = 0; i < that.children.length; i++) {
                var widget = that.children[i];

                if (widget.rect.l < rect.l || i == 0) rect.l = widget.rect.l;
                if (widget.rect.r > rect.r || i == 0) rect.r = widget.rect.r;
                if (widget.rect.t < rect.t || i == 0) rect.t = widget.rect.t;
                if (widget.rect.b > rect.b || i == 0) rect.b = widget.rect.b;
            }
        }

        return rect;
    }

    that.updateSizeFromRect = function () {
        that.setSize(that.rect.r-that.rect.l, that.rect.b-that.rect.t);
    }

    that.setSize = function (w, h) {
        that.size = {w: w, h: h};
        //that.updateOverflow();
        that.updateRect();
        // that.scrollBarWidget.setRelPos(w-5, 0);
        // that.scrollBarWidget.setSize(3, h);
    }

    that.setAbsPos = function (x, y) {
        that.absPos = {x: x, y: y};
        that.updateOverflow();
        that.updateRect();
        that.updateChildrenPos();
    }

    /*that.updateOverflow = function () {
        that.overflow = that.getOverflow();
        if (that.parent && that.parent.scrollBarWidget)
            that.parent.scrollBarWidget.overflow = that.overflow;
    }*/

    that.setSize(0, 0);

    return that;
}

function pagePanelScroll (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.panelList = [];
    that.currPanel = 0;
    that.title = options.title;

    that.dotBarWidget = dotBarWidget({ctx: that.ctx,
        nbDots: 1,
        selectedDot: 1,
        parent: that,
        relPos: {x: 280, y: 60},
    })

    that.children = [
        that.dotBarWidget
    ];

    that.addPanels = function (panelsToAddList) {
        for (var i = 0; i < panelsToAddList.length; i++) {
            panelsToAddList[i].setSize(that.size.w, that.size.h);
            panelsToAddList[i].setParent(that);
            panelsToAddList[i].updateRect();

            that.panelList.push(panelsToAddList[i]);
            that.children.push(panelsToAddList[i]);
        }

        that.dotBarWidget.setNbDots(that.panelList.length);
    }

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.panelList[that.currPanel].draw();
        that.dotBarWidget.draw();
    }

    that.scrollUpEvent = function () {
        if (that.currPanel == 0) {
            that.goToPanel(that.panelList.length - 1);
        }
        else {
            that.goToPanel(that.currPanel - 1);
        }
    }

    that.scrollDownEvent = function () {
        that.goToPanel((that.currPanel + 1) % that.panelList.length);
    }

    that.goToPanel = function (panelId) {
        that.currPanel = panelId;
        that.dotBarWidget.selectedDot = panelId + 1;
        
        if (that.hasOwnProperty("onChange"))
            that.onChange();

        if (that.panelList[panelId].hasOwnProperty("onGoTo"))
            that.panelList[panelId].onGoTo();
    }

    that.onMouseDown = function (mousePos) {
        for (var i = 0; i < that.children.length; i++) {
            if ((that.children[i] == that.dotBarWidget || that.children[i] == that.panelList[that.currPanel]) // on check que le panel est bien celui en cours ou alors la barre de nav
             && that.children[i].rect.l <= mousePos.x && mousePos.x <= that.children[i].rect.r
             && that.children[i].rect.t <= mousePos.y && mousePos.y <= that.children[i].rect.b) {
                if (that.children[i].hasOwnProperty("onMouseDown") == true) {
                    that.children[i].onMouseDown(mousePos);
                }
            }
        }
    }

    that.dotBarWidget.onSelectCallback = that.goToPanel;

    return that;
}

function panel (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.image = options.image;
    that.title = options.title;
    that.desc = options.desc;
    that.font = options.font;
    that.descfont = options.descfont;

    that.imageWidget = imageWidget({ctx: that.ctx, image: that.image, parent: that, relPos: {x: 0, y: 0}});
    that.textWidget = textWidget({ctx: that.ctx, font: that.font, text: that.title, parent: that, relPos: {x: 10, y: 165}});
    that.descTextWidget = textWidget({ctx: that.ctx, font: that.descfont, text: that.desc, parent: that, relPos: {x: 10, y: 0}});
    that.slidingPageWidget = slidingPage({ctx: ctx, parent: that, unfoldedRelPos: {x: 10, y: 20}, foldedRelPos: {x: 10, y: 180}, size: {w: 160, h: 180}});
    that.descPage = page({ctx: ctx})

    that.descPage.addWidget(that.descTextWidget);
    that.slidingPageWidget.setPage(that.descPage);

    that.textWidget.onMouseDown = function () {
        that.slidingPageWidget.triggerFold();
    };

    that.showImage = true;

    that.children = [that.imageWidget, that.textWidget, that.slidingPageWidget];

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;
        
        if (that.showImage == true)
            that.imageWidget.draw();

        that.textWidget.draw();
        // that.slidingPageWidget.draw();
    }

    return that;
}

function slidingPage (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.children = []
    that.page = null;
    that.foldedRelPos = options.foldedRelPos;
    that.unfoldedRelPos = options.unfoldedRelPos;

    that.unfolded = false;

    that.slidePos = {x: 0, y: 0};
    that.slideStartT = -1;
    that.slideEndT = -1;
    that.slidePosStart = {x: 0, y: 0};
    that.slidePosDest = {x: 0, y: 0};

    that.setRelPos(that.foldedRelPos.x, that.foldedRelPos.y);

    if (options.hasOwnProperty("parent"))
        that.setParent(options.parent);
    else
        that.parent = null; 

    that.setPage = function (newPage) {
        that.page = newPage;
        that.children.push(that.page);
        newPage.setParent(that);
    }

    that.fold = function () {
        if (that.slideStartT == -1) {
            that.slideStartT = new Date().getTime();
            that.slideEndT = that.slideStartT + 500;
            that.slidePosStart = {x: that.relPos.x, y: that.relPos.y};
            that.slidePosDest = {x: that.foldedRelPos.x, y: that.foldedRelPos.y};
        }
        that.unfolded = false;
    }

    that.unfold = function () {
        if (that.slideStartT == -1) {
            that.slideStartT = new Date().getTime();
            that.slideEndT = that.slideStartT + 500;
            that.slidePosStart = {x: that.relPos.x, y: that.relPos.y};
            that.slidePosDest = {x: that.unfoldedRelPos.x, y: that.unfoldedRelPos.y};
        }
        that.unfolded = true;
    }

    that.triggerFold = function () {
        if (that.unfolded) {
            that.fold();
        }
        else {
            that.unfold();
        }
    }

    that.draw = function () {
        if (that.slideStartT >= 0) {
            var currTime = new Date().getTime();

            var newRelPosX = Math.round(easeInOutQuad(currTime - that.slideStartT,
                                                     that.slidePosStart.x,
                                                     that.slidePosDest.x - that.slidePosStart.x,
                                                     that.slideEndT - that.slideStartT));

            var newRelPosY = Math.round(easeInOutQuad(currTime - that.slideStartT,
                                                     that.slidePosStart.y,
                                                     that.slidePosDest.y - that.slidePosStart.y,
                                                     that.slideEndT - that.slideStartT));

            that.setRelPos(newRelPosX, newRelPosY);

            if (currTime > that.slideEndT) {
                that.slideStartT = -1;
                that.slideEndT = -1;
                // that.unfolded = !that.unfolded;
            }
        }

        /*var imageData = that.ctx.getImageData(that.absPos.x, that.absPos.y, Math.min(320, that.absPos.x + that.size.w), Math.min(240, that.absPos.y + that.size.h));

        for (var y = 0; y < imageData.height; y++) {
            for (var x = y % 2; x < imageData.width; x+=2) {
                var idx = (y * imageData.width + x) * 4;

                imageData.data[idx] = 0;
                imageData.data[idx+1] = 0;
                imageData.data[idx+2] = 0;
                imageData.data[idx+3] = 0;
            }
        }

        that.ctx.putImageData(imageData, that.absPos.x, that.absPos.y);*/

        if (that.unfolded || that.slideStartT != -1) {
            for (var i = 0; i < that.children.length; i++) {
                //console.log(that.children[i]);
                that.children[i].draw();
            }
        }
    }

    return that;
}

function scrollableContainer (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.children = [];

    that.scrollPos = {x: 0, y: 0};
    that.scrollStartT = -1;
    that.scrollEndT = -1;
    that.scrollPosStart = {x: 0, y: 0};
    that.scrollPosDest = {x: 0, y: 0};
    that.overflow = {x: 0, y: 0};

    that.scrollBarWidget = scrollBarWidget({
        ctx: options.ctx,
        parent: that,
        relPos: {x: that.size.w - 5, y: 0},
        scrollPos: that.scrollPos,
        overflow: that.overflow,
        size: {w: 4, h: that.size.h},
    })

    that.children.push(that.scrollBarWidget);

    if (options.hasOwnProperty("scrollSpeed"))
        that.scrollSpeed = options.scrollSpeed
    else
        that.scrollSpeed = 8;

    if (options.hasOwnProperty("parent"))
        that.setParent(options.parent);
    else
        that.parent = null; 

    that.setWidget = function (newWidget) {
        var elmtIdx = that.children.indexOf(that.widget);
        
        if (elmtIdx != -1) {
            that.children.splice(elmtIdx, 1);
        }

        that.children.push(newWidget);

        that.widget = newWidget;
        that.widget.setParent(that);
        that.updateOverflow();
    }

    that.draw = function () {
        // SCROLLIN'
        that.widget.setRelPos(that.relPos.x, -that.scrollPos.y);

        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw();
        }

        if (that.scrollBarWidget.overflow.y != 0) {
            that.scrollBarWidget.draw();
        }
    }

    that.getSize = function () {
        return that.size;
    }

    that.setSize = function (w, h) {
        that.size = {w: w, h: h};
        //that.scrollBarWidget.setRelPos(w-5, 0);
        that.updateOverflow();
        that.updateRect();
        // that.scrollBarWidget.setSize(3, h);
    }

    that.scrollUpEvent = function () {
        if (that.scrollPos.y > 0) {
            that.scrollStartT = new Date().getTime();
            that.scrollEndT = that.scrollStartT + 200;
            that.scrollPosStart = {x: that.scrollPos.x, y: that.scrollPos.y};
            that.scrollPosDest = {x: that.scrollPos.x, y: Math.max(0, that.scrollPos.y - that.scrollSpeed)};
        }
    }

    that.scrollDownEvent = function () {
        if (that.scrollPos.y < that.overflow.y) {
            that.scrollStartT = new Date().getTime();
            that.scrollEndT = that.scrollStartT + 200;
            that.scrollPosStart = {x: that.scrollPos.x, y: that.scrollPos.y};
            that.scrollPosDest = {x: that.scrollPos.x, y: Math.min(that.overflow.y, that.scrollPos.y + that.scrollSpeed)};
        }
    }

    that.getOverflow = function () {
        var overflow = {x: 0, y: 0};

        if (that.widget) {
            that.widget.updateRect();
            that.widget.updateSize();

            overflow.x = Math.max(0, that.widget.size.w - that.size.w);
            overflow.y = Math.max(0, that.widget.size.h - that.size.h);
        }

        return overflow;
    }

    that.updateOverflow = function () {
        that.overflow = that.getOverflow();

        if (that.scrollBarWidget) {
            that.scrollBarWidget.overflow = that.overflow;
            that.scrollBarWidget.setRelPos(that.size.w - 5, that.scrollBarWidget.relPos.y);

            if (that.overflow.y < that.scrollPos.y) {
                that.scrollPos = that.overflow;
                that.scrollBarWidget.scrollPos = that.scrollPos
            }
        }
    }

    that.gotoScrollPos = function (newScrollPos) {
        if (0 <= newScrollPos.y && newScrollPos.y < that.overflow.y) {
            that.scrollPos = newScrollPos;
            that.scrollBarWidget.scrollPos = newScrollPos;
        }
    }

    that.onWheel = function (mousePos, delta) {
        that.gotoScrollPos({x: that.scrollPos.x, y: that.scrollPos.y + delta.y});
    }

    if (options.hasOwnProperty("widget"))
        that.setWidget(options.widget);
    else
        that.widget = null;

    return that;
}