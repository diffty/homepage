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
        var currPos = {x: 0, y: 0};

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

    that.getStrSize = function (s) {
        var strSize = {w: 0, h: 0};
        var currPos = {x: 0, y: 0};

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
                currPos.x += that.getCharSize(c);
                if (currPos.x > strSize.w) strSize.w = currPos.x;
            }

            if (currPos.y > strSize.h) strSize.h = currPos.y;
        }
        
        strSize.h += that.sprSh.frameH;

        return strSize;
    }

    return that;
}