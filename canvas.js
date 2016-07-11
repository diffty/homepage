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

// -- GRAPHLIB --
function spritesheet (options) {
    var that = {};

    that.ctx = options.context;
    that.image = options.image;

    that.init = function () {
        that.width = that.image.width;
        that.height = that.image.height;
        that.nbFrameW = options.nbFrameW;
        that.nbFrameH = options.nbFrameH;
        that.frameW = that.width / options.nbFrameW;
        that.frameH = that.height / options.nbFrameH;
    }

    that.init();
    
    // Chrome set pas les attributs tant que l'image est pas chargée.
    // Ca nique la navbar du coup. Va falloir faire un preload pour toutes les images.     
    that.image.onload = that.init;

    that.drawFrame = function (f, x, y) {
        that.ctx.drawImage(that.image, (f % that.nbFrameW) * that.frameW, Math.floor(f / that.nbFrameW) * that.frameH, that.frameW, that.frameH, x, y, that.frameW, that.frameH);
    }

    return that;
}

function font (options) {
    var that = {};

    that.sprSh = new spritesheet(options);
    that.fontSizeArray = options.fontSizeArray;

    if (options.hasOwnProperty("forceCase"))
        that.forceCase = options.forceCase;
    else
        that.forceCase = null;
    
    that.drawChar = function (c, x, y) {
        that.sprSh.drawFrame(c.charCodeAt(0)-32, x, y);
    }

    that.drawStr = function (s, x, y) {
        currPos = {x: 0, y: 0};

        for (var i = 0, len = s.length; i < len; i++) {
            var c = s[i];
            
            if (that.forceCase != null) {
                if (that.forceCase == "uppercase") {
                    c = c.toUpperCase();
                }
                else if (that.forceCase == "lowercase") {
                    c = c.toLowerCase();
                }
            }

            if (c == '\n') {
                currPos.x = 0;
                currPos.y += that.sprSh.frameH;
            }
            else {
                that.drawChar(c, currPos.x + x, currPos.y + y);
                currPos.x += that.fontSizeArray[c.charCodeAt(0)-32]-1;
            }
        }
    }

    return that;
}

function imageWidget (options) {
    var that = {};

    that.context = options.context;
    that.image = options.image;
    that.pos = options.pos;

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.context.drawImage(that.image, 0, 0, that.image.width, that.image.height, that.pos.x + offX, that.pos.y + offY, that.image.width, that.image.height);
    }

    that.getSize = function () {
        return {w: that.image.width, h: that.image.height};
    }

    that.size = that.getSize();

    that.getRect = function () {
        return {l: that.pos.x, r: that.pos.x + that.size.w, t: that.pos.y, b: that.pos.y + that.size.h};
    }

    that.rect = that.getRect();

    return that;
}

function textWidget (options) {
    var that = {};

    that.text = options.text;
    that.pos = options.pos;
    that.font = options.font;
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.font.drawStr(that.text, that.pos.x + offX, that.pos.y + offY);
    }

    that.getSize = function () {
        nbCRLF = 0;
        biggestLine = 0;
        currLine = 0;

        for (var i = 0; i < that.text.length; i++) {
            if (that.text[i] == '\n') {
                nbCRLF += 1;
                if (currLine > biggestLine) {
                    biggestLine = currLine;
                    currLine = 0;
                }
            }
            else {
                currLine++;
            }
        }

        return {w: biggestLine * that.font.sprSh.frameW, h: (nbCRLF+1) * that.font.sprSh.frameH};
    }

    that.size = that.getSize();

    that.getRect = function () {
        return {l: that.pos.x, r: that.pos.x + that.size.w, t: that.pos.y, b: that.pos.y + that.size.h};
    }

    that.rect = that.getRect();

    return that;
}

function buttonWidget (options) {
    var that = {};

    that.sprSh = options.spritesheet;
    that.sprOnId = options.sprOnId;
    that.sprOffId = options.sprOffId;
    that.hoverSprId = options.hoverSprId;
    that.state = false;
    that.callback = options.callback;
    that.size = {w: that.sprSh.width, h: that.sprSh.height};

    if (typeof(options.pos) == "undefined")
        that.pos = {x: 0, y: 0}
    else
        that.pos = options.pos;

    that.parent = null;
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        if (that.state) {
            that.sprSh.drawFrame(that.sprOnId, that.pos.x + offX, that.pos.y + offY)
        }
        else {
            that.sprSh.drawFrame(that.sprOffId, that.pos.x + offX, that.pos.y + offY)
        }
    }

    that.getRect = function () {
        return {l: that.pos.x, r: that.pos.x + that.size.w, t: that.pos.y, b: that.pos.y + that.size.h};
    }

    that.setPos = function (x, y) {
        that.pos = {x: x, y: y};
        that.rect = that.getRect();
    }

    that.setSize = function (w, h) {
        that.size = {w: w, h: h};
        that.rect = that.getRect();
    }

    that.setSize(that.sprSh.frameW, that.sprSh.frameH);

    return that;
}

function dotMeterWidget (options) {
    var that = {};

    that.ctx = options.context;
    that.max = options.max;
    that.value = options.value;
    that.pos = options.pos;
    
    var dotImage = new Image();
    dotImage.src = "ui-misc-small.png";

    var dotSprSh = spritesheet({
        context: ctx,
        image: dotImage,
        nbFrameW: 2,
        nbFrameH: 1,
    });    

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        for (var i = 1; i <= that.max; i++) { 
            /*that.ctx.beginPath();
            that.ctx.arc(that.pos.x + (i-1) * 10 + offX, that.pos.y + offY, 3, 0, 2 * Math.PI, false);
            if (i <= that.value) {
                that.ctx.fillStyle = 'white';
            }
            else {
                that.ctx.fillStyle = 'black';
            }
            that.ctx.fill();
            that.ctx.lineWidth = 1;
            that.ctx.strokeStyle = '#FFFFFF';
            that.ctx.stroke();*/
            if (i <= that.value)
                dotSprSh.drawFrame(1, that.pos.x + (i-1) * 7 + offX, that.pos.y + offY);
            else
                dotSprSh.drawFrame(0, that.pos.x + (i-1) * 7 + offX, that.pos.y + offY);
        }
    }

    that.getSize = function () {
        return 4 * 2 + (that.max - 1) * 10;
    }

    that.size = that.getSize();

    that.rect = null;

    return that;
}

function dotBarWidget (options) {
    var that = {};

    that.ctx = options.context;
    that.nbDots = options.nbDots;
    that.selectedDot = options.selectedDot;
    that.pos = options.pos;

    var dotImage = new Image();
    dotImage.src = "ui-misc-small.png";

    var dotSprSh = spritesheet({
        context: ctx,
        image: dotImage,
        nbFrameW: 2,
        nbFrameH: 1,
    });
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        for (var i = 1; i <= that.nbDots; i++) { 
            /*that.ctx.beginPath();
            that.ctx.arc(that.pos.x + offX, that.pos.y + (i-1) * 10 + offY, 3, 0, 2 * Math.PI, false);
            if (i == that.selectedDot) {
                that.ctx.fillStyle = 'white';
            }
            else {
                that.ctx.fillStyle = 'black';
            }
            that.ctx.fill();
            that.ctx.lineWidth = 1;
            that.ctx.strokeStyle = '#FFFFFF';
            that.ctx.stroke();*/

            if (i == that.selectedDot)
                dotSprSh.drawFrame(1, that.pos.x + offX, that.pos.y + (i-1) * 10 + offY);
            else
                dotSprSh.drawFrame(0, that.pos.x + offX, that.pos.y + (i-1) * 10 + offY);

        }
    }

    that.rect = null;

    return that;
}

function skillWidget (options) {
    var that = {};

    that.ctx = options.context;
    that.title = options.title
    that.titleFont = options.titleFont
    that.font = options.font
    that.image = options.image;
    that.value = options.value;
    that.pos = options.pos;

    that.imageWidget = imageWidget(options);
    that.titleWidget = textWidget({text: that.title, font: that.titleFont, pos: {x: options.pos.x + 25, y: options.pos.y}});
    that.dotMeterWidget = dotMeterWidget({context: that.ctx, max: 5, value: options.value, pos: {x: that.pos.x + 25, y: that.pos.y + 14}});
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.imageWidget.draw(offX, offY);
        that.titleWidget.draw(offX, offY);
        that.dotMeterWidget.draw(offX, offY);
    }

    that.rect = null;

    return that;
}

function expProWidget (options) {
    var that = {};

    that.ctx = options.context;
    that.companyName = options.companyName;
    that.title = options.title;
    that.font = options.font
    that.titleFont = options.titleFont
    that.image = options.image;
    that.pos = options.pos;
    that.year1 = options.year1;
    that.month1 = options.month1;
    that.year2 = options.year2;
    that.month2 = options.month2;

    that.imageWidget = imageWidget({context: that.ctx, image: that.image, pos: that.pos});
    that.companyWidget = textWidget({text: that.companyName, font: that.titleFont, pos: {x: options.pos.x + 30, y: options.pos.y}});
    that.titleWidget = textWidget({text: that.title, font: that.font, pos: {x: options.pos.x + 30, y: options.pos.y + 15}});
    that.fromYearWidget = textWidget({text: that.year1.toString(), font: that.titleFont, pos: {x: options.pos.x + 250, y: options.pos.y + 6}});
    that.fromMonthWidget = textWidget({text: monthShortStringList[that.month1], font: that.font, pos: {x: options.pos.x + 250, y: options.pos.y}});
    that.toYearWidget = textWidget({text: that.year2.toString(), font: that.titleFont, pos: {x: options.pos.x + 250, y: options.pos.y + 26}});
    that.toMonthWidget = textWidget({text: monthShortStringList[that.month2], font: that.font, pos: {x: options.pos.x + 250, y: options.pos.y + 20}});
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        if (that.image)
            that.imageWidget.draw(offX, offY);
        that.companyWidget.draw(offX, offY);
        that.titleWidget.draw(offX, offY);
        that.fromYearWidget.draw(offX, offY);
        that.fromMonthWidget.draw(offX, offY);
        that.toYearWidget.draw(offX, offY);
        that.toMonthWidget.draw(offX, offY);
    }

    that.getRect = function () { 
        var widgetList = [that.imageWidget, that.companyWidget, that.titleWidget, that.fromYearWidget, that.fromMonthWidget, that.toYearWidget, that.toMonthWidget];

        var rect = widgetList[0].rect;

        for (var i = 0; i < widgetList.length; i++) {
            var widget = widgetList[i];

            widget.rect = widget.getRect();

            if (widget.rect != null) { 
                if (widget.rect.l < rect.l) rect.l = widget.rect.l;
                if (widget.rect.r > rect.r) rect.r = widget.rect.r;
                if (widget.rect.t < rect.t) rect.t = widget.rect.t;
                if (widget.rect.b > rect.b) rect.b = widget.rect.b;
            }
        }

        return rect;
    }
    
    that.rect = that.getRect();

    that.getSize = function () {
        return {w: that.rect.r-that.rect.l, h: that.rect.b-that.rect.t};
    }

    that.size = that.getSize();

    return that;
}

function multipage (options) {
    var that = {};

    that.pageList = [];
    that.currPage = 0;
    that.destPage = 0;
    that.animPageCoef = 0.;
    that.animPageStartT = -1;
    that.animPageEndT = -1;
    that.screenOffsetStart = -1;
    that.screenOffsetDest = -1;
    that.screenOffset = 0; // position de draw dans l'écran de pages

    that.size = options.size;
    that.pos = options.pos;

    that.addPages = function (pageToAddList) {
        for (var i = 0; i < pageToAddList.length; i++) {
            if (pageToAddList[i].pos == null)
                pageToAddList[i].setPos(that.pos);

            if (pageToAddList[i].size == null)
                pageToAddList[i].setSize(that.size);

            that.pageList.push(pageToAddList[i]);
        }
    }

    // TURFU : bouger des trucs dans un futur update() ? 
    that.draw = function () {
        ctx.save();
        ctx.rect(that.pos.x, that.pos.y, that.size.w, that.size.h);
        ctx.clip();

        if (that.pageList.length > 0) {
            if (that.animPageStartT >= 0) {
                var currTime = new Date().getTime();

                that.screenOffset = Math.round(easeInOutQuad (currTime - that.animPageStartT, that.screenOffsetStart, that.screenOffsetDest - that.screenOffsetStart, that.animPageEndT - that.animPageStartT));

                for (var i = Math.max(0, Math.min(that.currPage, that.destPage)-1); i <= Math.min(that.pageList.length-1, Math.max(that.currPage, that.destPage)+1); i++) {
                    that.pageList[i].draw(i * 320 - that.screenOffset, 0);
                }

                if (that.animPageEndT < currTime) {
                    that.animPageStartT = -1;
                    that.animPageEndT = -1;
                    that.currPage = that.destPage;
                    that.screenOffset = that.currPage * 320;
                }
            }
            else {
                that.pageList[that.currPage].draw(that.currPage * 320 - that.screenOffset, 0);
            }
        }

        ctx.restore();
    }

    that.goToPage = function (p) {
        if (p != that.currPage && that.pageList[that.currPage].hasOwnProperty("onLeave"))
            that.pageList[that.currPage].onLeave();

        that.destPage = p;
        that.animPageStartT = new Date().getTime();
        that.animPageEndT = that.animPageStartT + 500;
        that.screenOffsetStart = that.screenOffset;
        that.screenOffsetDest = 320 * that.destPage;

        if (that.pageList[p].hasOwnProperty("onGoTo"))
            that.pageList[p].onGoTo();
    }

    that.scrollUpEvent = function () {
        that.pageList[that.currPage].scrollUpEvent();
    }

    that.scrollDownEvent = function () {
        that.pageList[that.currPage].scrollDownEvent();
    }

    return that;
}

function page (options) {
    var that = {};

    that.ctx = options.context;
    that.widgetList = [];
    that.scrollPos = {x: 0, y: 0};
    that.scrollStartT = -1;
    that.scrollEndT = -1;
    that.scrollPosStart = {x: 0, y: 0};
    that.scrollPosDest = {x: 0, y: 0};
    that.title = options.title;

    if (options.hasOwnProperty("scrollSpeed"))
        that.scrollSpeed = options.scrollSpeed
    else
        that.scrollSpeed = 8;

    that.size = null;
    that.pos = null;

    that.addWidget = function (w) {
        that.widgetList.push(w);
        that.overflow = that.getOverflow();
        that.rect = that.getRect();
    };

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

        // DRAWING
        for (var i = 0; i < that.widgetList.length; i++) {
            that.widgetList[i].draw(that.pos.x - that.scrollPos.x + offX, that.pos.y - that.scrollPos.y + offY);
        }

        // DRAW SCROLL BAR
        if (that.overflow.y > 0) {
            that.ctx.beginPath();
            that.ctx.rect(that.pos.x + that.size.w - 5 + offX,
                          that.pos.y + that.scrollPos.y + offY,
                          3,
                          that.size.h - that.overflow.y);
            that.ctx.fillStyle = 'white';
            that.ctx.fill();
        }
    };

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

        for (var i = 0; i < that.widgetList.length; i++) {
            if (that.widgetList[i].size != null && that.widgetList[i].pos != null && that.size != null) { 
                var newOverflowX = that.widgetList[i].pos.x + that.widgetList[i].size.w - that.size.w;
                var newOverflowY = that.widgetList[i].pos.y + that.widgetList[i].size.h - that.size.h;

                if (newOverflowX > overflow.x) overflow.x = newOverflowX;
                if (newOverflowY > overflow.y) overflow.y = newOverflowY;
            }
        }
        return overflow;
    }

    that.setSize = function (newSize) {
        that.size = newSize;
        that.overflow = that.getOverflow();
        that.rect = that.getRect();
    }

    that.setPos = function (newPos) {
        that.pos = newPos;
        that.overflow = that.getOverflow();
        that.rect = that.getRect();
    }

    that.getRect = function () {
        // var rect = {l: that.pos.x, r: that.pos.x + that.size.w, t: that.pos.y, b: that.pos.y + that.size.h};
        var rect = {l: 0, r: 0, t: 0, b: 0};

        /*for (var i = 0; i < that.widgetList.length; i++) {
            var widget = that.widgetList[i];

            if (widget.rect != null) {
                if (widget.rect.l < rect.l) rect.l = widget.rect.l;
                if (widget.rect.r > rect.r) rect.r = widget.rect.r;
                if (widget.rect.t < rect.t) rect.t = widget.rect.t;
                if (widget.rect.b > rect.b) rect.b = widget.rect.b;
            }
        }*/

        return rect;
    }

    that.rect = null;
    that.overflow = that.getOverflow()

    return that;
}

function pagePanelScroll (options) {
    var that = {};

    that.ctx = options.context;
    that.panelList = [];
    that.currPanel = 0;
    that.title = options.title;

    that.pos = null;
    that.size = null;

    that.dotBarWidget = dotBarWidget({context: that.ctx,
        nbDots: 1,
        selected: 1,
        pos: {x: 290, y: 95}
    });

    that.addPanels = function (panelsToAddList) {
        for (var i = 0; i < panelsToAddList.length; i++) {
            if (panelsToAddList[i].pos == null)
                panelsToAddList[i].pos = that.pos;

            if (panelsToAddList[i].size == null)
                panelsToAddList[i].size = that.size;

            panelsToAddList[i].parent = that;

            that.panelList.push(panelsToAddList[i]);
        }
        that.dotBarWidget.nbDots = that.panelList.length;
    }

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.panelList[that.currPanel].draw(offX, offY)
        that.dotBarWidget.draw(offX, offY);
    }

    that.scrollUpEvent = function () {
        if (that.currPanel == 0) {
            that.currPanel = that.panelList.length - 1;
        }
        else {
            that.currPanel -= 1;
        }
        that.dotBarWidget.selectedDot = that.currPanel + 1;

        if (that.panelList[that.currPanel].hasOwnProperty("onGoTo"))
            that.panelList[that.currPanel].onGoTo();
    }

    that.scrollDownEvent = function () {
        that.currPanel = (that.currPanel + 1) % that.panelList.length;
        that.dotBarWidget.selectedDot = that.currPanel + 1;

        if (that.panelList[that.currPanel].hasOwnProperty("onGoTo"))
            that.panelList[that.currPanel].onGoTo();
    }

    that.setSize = function (newSize) {
        that.size = newSize;
        //that.overflow = that.getOverflow();
    }

    that.setPos = function (newPos) {
        that.pos = newPos;
        //that.overflow = that.getOverflow();
    }



    return that;
}

function panel (options) {
    var that = {};

    that.ctx = options.context;
    that.image = options.image;
    that.title = options.title;
    that.desc = options.desc;
    that.font = options.font;
    that.parent = null;

    that.imageWidget = imageWidget({context: that.ctx, image: that.image, pos: {x: 0, y: 0}});
    that.textWidget = textWidget({context: that.ctx, font: that.font, text: that.title, pos: {x: 10, y: 165}});

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        if (that.parent == null) {
            that.imageWidget.draw(offX, offY);
            that.textWidget.draw(offX, offY);
        }
        else {
            // that.imageWidget.draw(that.parent.pos.x + offX, that.parent.pos.y + offY);
            that.textWidget.draw(that.parent.pos.x + offX, that.parent.pos.y + offY);
        }
    }

    return that;
}

function navbar (options) {
    var that = {};

    that.pos = options.pos;
    that.btnList = [];
    that.currBtn = 0;

    that.addButton = function(b) {
        if (that.btnList.length >= 1) {
            b.setPos(that.btnList[that.btnList.length-1].pos.x + that.btnList[that.btnList.length-1].size.w + 2, that.pos.y);
        }
        else {
            b.setPos(that.pos.x, that.pos.y);
        }

        b.parent = that;
        
        that.btnList.push(b);
        that.rect = that.getRect();
    }

    that.selectBtn = function(n) {
        for (var i = 0; i < that.btnList.length; i++) {
            if (n == i) {
                that.btnList[i].state = true;
                if (typeof(that.btnList[i].callback) != 'undefined' && that.btnList[i].callback != null) {
                    that.btnList[i].callback(i);
                }
            }
            else {
                that.btnList[i].state = false;
            }
        }
        that.currBtn = n;
    }

    that.onMouseDown = function (mousePos) {
        for (var i = 0; i < that.btnList.length; i++) {
            if (that.btnList[i].rect.l <= mousePos.x && mousePos.x <= that.btnList[i].rect.r
             && that.btnList[i].rect.t <= mousePos.y && mousePos.y <= that.btnList[i].rect.b) {
                that.selectBtn(i);
            }
        }
    }

    that.draw = function () {
        for (var i = 0; i < that.btnList.length; i++) {
            that.btnList[i].draw();
        }
    }

    that.getRect = function () {
        var rect = {l: 0, r: 0, t: 0, b: 0};

        if (that.btnList.length > 0) {
            for (var i = 0; i < that.btnList.length; i++) {
                var btn = that.btnList[i];

                if (btn.rect.l < rect.l || i == 0) rect.l = btn.rect.l;
                if (btn.rect.r > rect.r || i == 0) rect.r = btn.rect.r;
                if (btn.rect.t < rect.t || i == 0) rect.t = btn.rect.t;
                if (btn.rect.b > rect.b || i == 0) rect.b = btn.rect.b;
            }
        }

        return rect;
    }

    that.rect = that.getRect();

    widgetList.push(that);

    return that;
}

function backgroundManager (options) {
    var that = {};
    
    that.bgList = [];
    that.nextBG = -1;
    that.currBG = -1;

    if (options.hasOwnProperty("transitionBgId"))
        that.transitionBgId = options.transitionBgId;
    else
        that.transitionBgId = -1;

    if (options.hasOwnProperty("transitionTime"))
        that.transitionTime = options.transitionTime;
    else
        that.transitionTime = -1;

    that.addBG = function (bgObj) {
        that.bgList.push(bgObj);
    }

    that.switchBG = function (bgId, doTransition) {
        if (that.bgList[that.currBG].hasOwnProperty("onSwitched"))
            that.bgList[that.currBG].onSwitched();

        if (typeof(doTransition) != "undefined" && doTransition == true) {
            that.nextBG = bgId;
            that.currBG = that.transitionBgId;

            window.setTimeout(that.transitionEnd, that.transitionTime);
        }
        else {
            that.currBG = bgId;
        }
    }

    that.draw = function () {
        if (that.currBG >= 0) {
            that.bgList[that.currBG].draw();
        }
    }

    that.transitionEnd = function () {
        that.currBG = that.nextBG;

        if (that.bgList[that.currBG].hasOwnProperty("onResume"))
            that.bgList[that.currBG].onResume();
        
        that.nextBG = -1;
    }

    return that;
}

function getMousePos (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
        y: Math.floor((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
    }
} 

function easeInOutQuad (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
