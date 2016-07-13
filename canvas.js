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

// Abstract "class" to provide initialization functions to all widgets.
function positionnableObject (options) {
    var that = {};
    
    that.absPos = {x: 0, y: 0};
    that.relPos = {x: 0, y: 0};
    that.size = {x: 0, y: 0};
    that.parent = null;
    that.children = []; // TURFU: A METTRE DANS UN AUTRE OBJET ABSTRAIT STYLE NODE, HERITE DE CELUI-CI ?
    that.parentPosIndependant = options.hasOwnProperty("parentPosIndependant") && options.parentPosIndependant;

    that.updateRect = function () {
        that.rect = that.getRect();
    } 

    that.updateAbsPosFromParent = function () {
        if (that.parent != null && !that.parentPosIndependant) {
            that.absPos = posAdd(that.parent.absPos, that.relPos);
            that.updateChildrenPos();
            that.updateRect();
        }
    }

    that.updateChildrenPos = function () {
        for (var i = 0; i < that.children.length; i++) {
            that.children[i].updateAbsPosFromParent();
            that.children[i].updateChildrenPos();
        }
    }

    that.getRect = function () {
        return {l: that.absPos.x, r: that.absPos.x + that.size.w, t: that.absPos.y, b: that.absPos.y + that.size.h};
    }

    that.setRelPos = function (x, y) {
        that.relPos.x = x;
        that.relPos.y = y;

        if (that.parent != null)
            that.absPos = posAdd(that.parent.absPos, that.relPos);
        else
            that.absPos = that.relPos;

        that.updateRect();
        that.updateChildrenPos();
    }

    that.setAbsPos = function (x, y) {
        that.absPos.x = x;
        that.absPos.y = y;

        if (that.parent != null)
            that.relPos = posSub(that.absPos, that.parent.absPos);
        else
            that.relPos = that.absPos;

        that.updateRect();
        that.updateChildrenPos();
    }

    that.setParent = function (newParent) {
        that.parent = newParent;
        that.setRelPos(that.relPos.x, that.relPos.y);
    } 

    that.setSize = function (w, h) {
        that.size = {w: w, h: h};
        that.updateRect();
    }

    that.updateSize = function () {
        var newSize = that.getSize();
        that.setSize(newSize.w, newSize.h);
    }

    that.onMouseDown = function (mousePos) {
        for (var i = 0; i < that.children.length; i++) {
            if (that.children[i].rect.l <= mousePos.x && mousePos.x <= that.children[i].rect.r
             && that.children[i].rect.t <= mousePos.y && mousePos.y <= that.children[i].rect.b) {
                if (that.children[i].hasOwnProperty("onMouseDown") == true) {
                    that.children[i].onMouseDown(mousePos);
                }
            }
        }
    }

    // INIT
    if (options.hasOwnProperty("parent")) {
        that.setParent(options.parent);
    }

    if (options.hasOwnProperty("absPos")) {
        that.setAbsPos(options.absPos.x, options.absPos.y);
    }
    else if (options.hasOwnProperty("relPos")) {
        that.setRelPos(options.relPos.x, options.relPos.y);
    }

    return that;
}
 
// -- GRAPHLIB --
function spritesheet (options) {
    var that = {};

    that.ctx = options.ctx;
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
                currPos.x += that.getCharSize(c);
            }
        }
    }

    that.getCharSize = function (c) {
        if (that.forceCase == "uppercase") {
            c = c.toUpperCase();
        }
        else if (that.forceCase == "lowercase") {
            c = c.toLowerCase();
        }

        return that.fontSizeArray[c.charCodeAt(0)-32]-1;
    }

    return that;
}

function imageWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.image = options.image;

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.ctx.drawImage(that.image, 0, 0, that.image.width, that.image.height, that.absPos.x + offX, that.absPos.y + offY, that.image.width, that.image.height);
    }

    that.getSize = function () {
        return {w: that.image.width, h: that.image.height};
    }

    that.updateSize();

    return that;
}

function textWidget (options) {
    var that = positionnableObject(options);

    that.text = options.text;
    that.font = options.font;
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.font.drawStr(that.text, that.absPos.x + offX, that.absPos.y + offY);
    }

    that.getSize = function () {
        nbCRLF = 0;
        biggestLine = 0;
        currLine = 0;

        for (var i = 0; i < that.text.length; i++) {
            if (that.text[i] == '\n') {
                nbCRLF += 1;
                biggestLine = Math.max(currLine, biggestLine);
                currLine = 0;
            }
            else {
                currLine += that.font.getCharSize(that.text[i]);
            }
        }

        biggestLine = Math.max(currLine, biggestLine);

        return {w: biggestLine, h: (nbCRLF+1) * that.font.sprSh.frameH};
    }

    that.updateSize();

    return that;
}

function buttonWidget (options) {
    var that = positionnableObject(options);

    that.sprSh = options.spritesheet;
    that.sprOnId = options.sprOnId;
    that.sprOffId = options.sprOffId;
    that.hoverSprId = options.hoverSprId;
    that.state = false;
    that.callback = options.callback;
    that.size = {w: that.sprSh.width, h: that.sprSh.height};

    that.parent = null;
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        if (that.state) {
            that.sprSh.drawFrame(that.sprOnId, that.absPos.x + offX, that.absPos.y + offY)
        }
        else {
            that.sprSh.drawFrame(that.sprOffId, that.absPos.x + offX, that.absPos.y + offY)
        }
    }

    that.setSize(that.sprSh.frameW, that.sprSh.frameH);

    return that;
}

function dotMeterWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.max = options.max;
    that.value = options.value;
    that.spaceBetweenDots = 0;
    
    var dotImage = new Image();
    dotImage.src = "ui-misc-small.png";

    that.dotSprSh = spritesheet({
        ctx: ctx,
        image: dotImage,
        nbFrameW: 2,
        nbFrameH: 2,
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
                that.dotSprSh.drawFrame(1, that.absPos.x + (i-1) * (that.dotSprSh.frameW + that.spaceBetweenDots) + offX, that.absPos.y + offY);
            else
                that.dotSprSh.drawFrame(0, that.absPos.x + (i-1) * (that.dotSprSh.frameW + that.spaceBetweenDots) + offX, that.absPos.y + offY);
        }
    }

    that.getSize = function () {
        return {w: (that.max - 1) * (that.dotSprSh.frameW + that.spaceBetweenDots) + that.dotSprSh.frameW, h: that.dotSprSh.frameH};
    }

    that.updateSize();

    return that;
}

function dotBarWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.nbDots = options.nbDots;
    that.selectedDot = options.selectedDot;
    that.spaceBetweenDots = 0;
    that.onSelectCallback = null;

    if (options.hasOwnProperty("onSelectCallback")) {
        that.onSelectCallback = options.onSelectCallback;
    }

    var dotImage = new Image();
    dotImage.src = "ui-misc-small.png";

    that.dotSprSh = spritesheet({
        ctx: ctx,
        image: dotImage,
        nbFrameW: 2,
        nbFrameH: 2,
    });
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        for (var i = 1; i <= that.nbDots; i++) { 
            /*that.ctx.beginPath();
            that.ctx.arc(that.absPos.x + offX, that.absPos.y + (i-1) * 10 + offY, 3, 0, 2 * Math.PI, false);
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
                that.dotSprSh.drawFrame(1, that.absPos.x, that.absPos.y + (i-1) * that.dotSprSh.frameH);
            else
                that.dotSprSh.drawFrame(0, that.absPos.x, that.absPos.y + (i-1) * that.dotSprSh.frameH);
        }
    }

    that.getSize = function () {
        return {w: that.dotSprSh.frameW,
                h: (that.nbDots - 1) * (that.dotSprSh.frameH + that.spaceBetweenDots) + that.dotSprSh.frameH};
    }

    that.setNbDots = function (newNbDots) {
        that.nbDots = newNbDots;
        that.updateSize();
    }

    that.onMouseDown = function (mousePos) {
        var btnHitId = Math.floor((mousePos.y - that.rect.t) / that.size.h * that.nbDots);

        if (btnHitId != (that.selectedDot - 1) && that.onSelectCallback != null) {
            that.onSelectCallback(btnHitId);
        }
    }

    that.updateSize();

    return that;
}

function skillWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.title = options.title
    that.titleFont = options.titleFont
    that.font = options.font
    that.image = options.image;
    that.value = options.value;

    that.children = [
        imageWidget({ctx: that.ctx, image: that.image, parent: that, relPos: {x: 0, y: 0}}),
        textWidget({text: that.title, font: that.titleFont, parent: that, relPos: {x: 25, y: 0}}),
        dotMeterWidget({ctx: that.ctx, max: 5, value: options.value, parent: that, relPos: {x: 25, y: 14}}),
    ];

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;
        
        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw(offX, offY);
        }
    }

    that.getRect = function () { 
        var rect = that.children[0].rect;

        for (var i = 0; i < that.children.length; i++) {
            var widget = that.children[i];

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

    that.updateRect();

    return that;
}

function expProWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.companyName = options.companyName;
    that.title = options.title;
    that.font = options.font
    that.titleFont = options.titleFont
    that.image = options.image;
    that.year1 = options.year1;
    that.month1 = options.month1;
    that.year2 = options.year2;
    that.month2 = options.month2;

    that.isSelected = false;

    that.children = [
        imageWidget({ctx: that.ctx, image: that.image, parent: that, relPos: {x: 0, y: 0}}),
        textWidget({text: that.companyName, font: that.titleFont, parent: that, relPos: {x: 30, y: 0}}),
        textWidget({text: that.title, font: that.font, parent: that, relPos: {x: 30, y: 15}}),
        textWidget({text: that.year1.toString(), font: that.titleFont, parent: that, relPos: {x: 250, y: 6}}),
        textWidget({text: monthShortStringList[that.month1], font: that.font, parent: that, relPos: {x: 250, y: 0}}),
        textWidget({text: that.year2.toString(), font: that.titleFont, parent: that, relPos: {x: 250, y: 26}}),
        textWidget({text: monthShortStringList[that.month2], font: that.font, parent: that, relPos: {x: 250, y: 20}}),
    ];

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw(offX, offY);
        }

        // TEMP TEST TEST
        if (that.isSelected == true) {
            that.ctx.beginPath();
            that.ctx.strokeStyle = "white";
            that.ctx.rect(offX+that.rect.l, offY+that.rect.t, that.rect.r-that.rect.l, that.rect.b-that.rect.t);
            that.ctx.stroke();
        }
    }

    that.getRect = function () { 
        var rect = that.children[0].rect;

        for (var i = 0; i < that.children.length; i++) {
            var widget = that.children[i];

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

    that.updateSize();

    return that;
}

// ATTENTION il FAUT un parent
function scrollBarWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.overflow = options.overflow;
    that.scrollPos = options.scrollPos;
    that.lastMousePos = null;
    that.parentPosIndependant = true;

    that.draw = function () {
        if (that.overflow.y > 0) {
            that.ctx.beginPath();

            if (that.parentPosIndependant)
                var scrollPosToAdd = that.scrollPos.y;
            else
                var scrollPosToAdd = that.scrollPos.y * 2;

            that.ctx.rect(that.absPos.x,
                          that.absPos.y + scrollPosToAdd,
                          that.size.w,
                          that.size.h - that.overflow.y);
            that.ctx.fillStyle = 'white';
            that.ctx.fill();
        }
    }

    that.onMouseDown = function (mousePos) {
        siteCanvas.registerWidgetForMouseInput(that);
        that.lastMousePos = mousePos;
    }

    that.onMouseMove = function (mousePos) {
        if (that.lastMousePos != null) {
            that.addScroll(mousePos.y - that.lastMousePos.y);
        }
        that.lastMousePos = mousePos;
    }

    that.onMouseUp = function (mousePos) {
        siteCanvas.unregisterWidgetForMouseInput(that);
        that.lastMousePos = null;
    }

    that.addScroll = function (scrollAmount) {
        that.scrollPos.y += scrollAmount;
        that.updateRect();
    }

    return that;
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
        selected: 1,
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

function navbar (options) {
    var that = positionnableObject(options);

    that.children = [];
    that.currBtn = 0;

    that.createButton = function(newBtnOptions) {
        newBtnOptions.parent = that;
        newBtnOptions.relPos = {x: 0, y: 0};

        if (that.children.length >= 1) {
            newBtnOptions.relPos = {x: that.children[that.children.length-1].relPos.x + that.children[that.children.length-1].size.w + 2,
                                    y: that.children[that.children.length-1].relPos.y}
        }

        var newBtn = buttonWidget(newBtnOptions)
        
        that.children.push(newBtn);
        that.updateRect();
    }

    that.selectBtn = function(n) {
        for (var i = 0; i < that.children.length; i++) {
            if (n == i) {
                that.children[i].state = true;
                if (typeof(that.children[i].callback) != 'undefined' && that.children[i].callback != null) {
                    that.children[i].callback(i);
                }
            }
            else {
                that.children[i].state = false;
            }
        }
        that.currBtn = n;
    }

    that.onMouseDown = function (mousePos) {
        for (var i = 0; i < that.children.length; i++) {
            if (that.children[i].rect.l <= mousePos.x && mousePos.x <= that.children[i].rect.r
             && that.children[i].rect.t <= mousePos.y && mousePos.y <= that.children[i].rect.b) {
                that.selectBtn(i);
            }
        }
    }

    that.draw = function () {
        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw();
        }
    }

    that.getRect = function () {
        var rect = {l: 0, r: 0, t: 0, b: 0};

        if (that.children.length > 0) {
            for (var i = 0; i < that.children.length; i++) {
                var btn = that.children[i];

                if (btn.rect.l < rect.l || i == 0) rect.l = btn.rect.l;
                if (btn.rect.r > rect.r || i == 0) rect.r = btn.rect.r;
                if (btn.rect.t < rect.t || i == 0) rect.t = btn.rect.t;
                if (btn.rect.b > rect.b || i == 0) rect.b = btn.rect.b;
            }
        }

        return rect;
    }

    that.updateRect();

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
            var isTransitionActive = (that.nextBG != -1);

            that.nextBG = bgId;
            that.currBG = that.transitionBgId;

            if (!isTransitionActive) {
                window.setTimeout(that.transitionEnd, that.transitionTime);
            }
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


// FONCTIONS UTILITAIRES
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

function posAdd (posA, posB) {
    return {x: posA.x + posB.x, y: posA.y + posB.y}
}

function posSub (posA, posB) {
    return {x: posA.x - posB.x, y: posA.y - posB.y}
}  
