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

    that.currPage = 0;
    that.destPage = 0;
    that.animPageCoef = 0.;
    that.animPageStartT = -1;
    that.animPageEndT = -1;
    that.screenOffsetStart = -1;
    that.screenOffsetDest = -1;
    that.screenOffset = 0; // position de draw dans l'écran de pages

    that.size = options.size;

    that.addPages = function (pageToAddList) {
        for (var i = 0; i < pageToAddList.length; i++) {
            pageToAddList[i].setParent(that);
            pageToAddList[i].setSize(that.size.w, that.size.h);
            pageToAddList[i].updateAbsPosFromParent();
            pageToAddList[i].setRelPos(that.children.length * 320, 0);
            that.children.push(pageToAddList[i]);
        }
    }

    // TURFU : bouger des trucs dans un futur update() ? 
    that.draw = function () {
        ctx.save();
        ctx.rect(that.absPos.x, that.absPos.y, that.size.w, that.size.h);
        ctx.clip();

        if (that.children.length > 0) {
            if (that.animPageStartT >= 0) {
                var currTime = new Date().getTime();

                that.screenOffset = Math.round(easeInOutQuad(currTime - that.animPageStartT, that.screenOffsetStart, that.screenOffsetDest - that.screenOffsetStart, that.animPageEndT - that.animPageStartT));

                if (that.animPageEndT < currTime) {
                    that.animPageStartT = -1;
                    that.animPageEndT = -1;
                    that.currPage = that.destPage;
                    that.screenOffset = that.currPage * 320;
                }

                for (var i = 0; i < that.children.length; i++) {
                    // that.children[i].setAbsPos(that.absPos.x + i * 320 - that.screenOffset, that.children[i].absPos.y);
                    that.children[i].setRelPos(i * 320 - that.screenOffset, 0); // Pour eviter de faire deux fois ce truc, faire un layout horizontal pour stocker les pages et appliquer la transformation?
                }

                for (var i = Math.max(0, Math.min(that.currPage, that.destPage)-1); i <= Math.min(that.children.length-1, Math.max(that.currPage, that.destPage)+1); i++) {
                    //that.children[i].draw(i * 320 - that.screenOffset, 0);
                    that.children[i].draw();
                }
            }
            else {
                //that.children[that.currPage].draw(that.currPage * 320 - that.screenOffset, 0);
                that.children[that.currPage].draw();
            }
        }

        ctx.restore();
    }

    that.goToPage = function (p) {
        if (p != that.currPage) {
            if (that.children[that.currPage].hasOwnProperty("onLeave")) {
                that.children[that.currPage].onLeave();
            }
            else if (p != that.destPage && that.children[that.destPage].hasOwnProperty("onLeave")) {
                that.children[that.destPage].onLeave();
            }
        }

        that.destPage = p;
        that.animPageStartT = new Date().getTime();
        that.animPageEndT = that.animPageStartT + 500;
        that.screenOffsetStart = that.screenOffset;
        that.screenOffsetDest = 320 * that.destPage;

        if (that.children[p].hasOwnProperty("onGoTo"))
            that.children[p].onGoTo();
    }

    that.scrollUpEvent = function () {
        that.children[that.currPage].scrollUpEvent();
    }

    that.scrollDownEvent = function () {
        that.children[that.currPage].scrollDownEvent();
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

    that.scrollBarWidget = scrollBarWidget({
        ctx: options.ctx,
        parent: that,
        relPos: {x: that.size.w - 5, y: 0},
        scrollPos: that.scrollPos,
        overflow: that.overflow,
    })

    that.children.push(that.scrollBarWidget);

    // TEMP TEST
    that.currentSelectedWidgetId = -1;

    if (options.hasOwnProperty("scrollSpeed"))
        that.scrollSpeed = options.scrollSpeed
    else
        that.scrollSpeed = 8;

    that.addWidget = function (w) {
        w.setParent(that);
        that.children.push(w);
        that.updateOverflow();
        that.updateRect();
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

            that.ctx.rect(that.children[that.currentSelectedWidgetId].rect.l,
                          that.children[that.currentSelectedWidgetId].rect.t,
                          that.children[that.currentSelectedWidgetId].rect.r-that.children[that.currentSelectedWidgetId].rect.l,
                          that.children[that.currentSelectedWidgetId].rect.b-that.children[that.currentSelectedWidgetId].rect.t);
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
        var rect = {l: that.absPos.x, r: that.absPos.x + that.size.w, t: that.absPos.y, b: that.absPos.y + that.size.h};
        return rect;
    }

    that.setSize = function (w, h) {
        that.size = {w: w, h: h};
        that.updateOverflow();
        that.updateRect();
        that.scrollBarWidget.setRelPos(w-5, 0);
        that.scrollBarWidget.setSize(3, h);
    }

    that.setAbsPos = function (x, y) {
        that.absPos = {x: x, y: y};
        that.updateOverflow();
        that.updateRect();
        that.updateChildrenPos();
    }

    that.updateOverflow = function () {
        that.overflow = that.getOverflow();
        that.scrollBarWidget.overflow = that.overflow;
    }

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
        
        if (that.panelList[panelId].hasOwnProperty("onGoTo"))
            that.panelList[panelId].onGoTo();
    }

    that.dotBarWidget.onSelectCallback = that.goToPanel;

    that.setSize(0, 0);

    return that;
}

function panel (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.image = options.image;
    that.title = options.title;
    that.desc = options.desc;
    that.font = options.font;

    that.imageWidget = imageWidget({ctx: that.ctx, image: that.image, parent: that, relPos: {x: 0, y: 0}}),
    that.textWidget = textWidget({ctx: that.ctx, font: that.font, text: that.title, parent: that, relPos: {x: 10, y: 165}}),

    that.showImage = true;

    that.children = [that.imageWidget, that.textWidget];

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;
        
        if (that.showImage == true)
            that.imageWidget.draw();
        that.textWidget.draw();
    }

    return that;
}
