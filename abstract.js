// Abstract "class" to provide initialization functions to all widgets.
function positionnableObject (options) {
    var that = {};
    
    that.absPos = {x: 0, y: 0};
    that.relPos = {x: 0, y: 0};
    that.rect = {l: 0, r: 0, t: 0, b: 0};

    if (options.hasOwnProperty("onResize"))
        that.onResize = options.onResize;
    else
        that.onResize = null;

    // This attribut is supported by anything. 
    if (options.hasOwnProperty("visible"))
        that.visible = options.visible;
    else
        that.visible = true;

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

        if (that.onResize) {
            that.onResize();
        }
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

    that.onKeyDown = function (key) {
        for (var i = 0; i < that.children.length; i++) {
            if (that.children[i].hasOwnProperty("onKeyDown") == true) {
                that.children[i].onKeyDown(key);
            }
        }
    }

    that.onWheel = function (mousePos, delta) {
        for (var i = 0; i < that.children.length; i++) {
            if (that.children[i].rect.l <= mousePos.x && mousePos.x <= that.children[i].rect.r
             && that.children[i].rect.t <= mousePos.y && mousePos.y <= that.children[i].rect.b) {
                if (that.children[i].hasOwnProperty("onWheel") == true) {
                    that.children[i].onWheel(mousePos, delta);
                }
            }
        }
    }

    // INIT
    if (options.hasOwnProperty("size"))
        that.setSize(options.size.w, options.size.h);
    else
        that.setSize(0, 0);

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

