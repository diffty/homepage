function skillWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.title = options.title
    that.titleFont = options.titleFont
    that.font = options.font
    that.image = options.image;
    that.value = options.value;
    that.showValue = options.showValue;

    // Wiggle specific stuff
    that.isSelected = false;
    that.hovered = false;
    that.hoverStartTime = null;
    that.offsetX = null;

    that.children = [
        imageWidget({ctx: that.ctx, image: that.image, parent: that, relPos: {x: 0, y: 0}}),
        textWidget({text: that.title, font: that.titleFont, parent: that, relPos: {x: 25, y: 0}}),
    ]
    if (that.showValue) {
        that.children.push(dotMeterWidget({ctx: that.ctx, max: 5, value: options.value, parent: that, relPos: {x: 25, y: 14}}))
    }

    that.init = function () {
        that.updateRect();
        that.updateSize();
    }

    // Ces trucs là on pourrait carrément les mettre dans un boucle style "animate" qui serait appelée à chaque frame pour les 
    // objets visibles. A méditer.
    that.draw = function () {
        if (that.wiggle) {
            if (that.hovered) {
                var currTime = new Date().getTime();
                var newRelPos = {x: that.relPos.x - that.offsetX, y: that.relPos.y}

                that.offsetX = Math.floor((0.5 + Math.sin((currTime - that.hoverStartTime) / 100) * 0.5) * 10);
                
                if (that.isSelected)
                    that.offsetX = -that.offsetX;

                that.setRelPos(newRelPos.x + that.offsetX, that.relPos.y);
            }
            else {
                that.setRelPos(that.relPos.x - that.offsetX, that.relPos.y);
                that.offsetX = 0.;
                that.wiggle = false;
            }
        }

        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw();
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

    that.getSize = function () {
        return {w: that.rect.r-that.rect.l, h: that.rect.b-that.rect.t};
    }

    that.init();

    return that;
}

function expProWidget (options) {
    var that = positionnableObject(options);

    that.monthShortStringList = {
        0: "???",
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

    that.ctx = options.ctx;
    that.companyName = options.companyName;
    that.title = options.title;
    that.font = options.font
    that.titleFont = options.titleFont
    that.image = options.image;
    that.year1 = options.year1;
    that.month1 = options.month1;
    if (options.year2 >= 0) {
        that.year2 = options.year2;
        that.month2 = options.month2;
    }
    else {
        that.year2 = "???";
        that.month2 = 0;
    }
    that.desc = options.desc;

    that.isDescriptionVisible = false;

    // Wiggle specific stuff
    that.isSelected = false;
    that.hovered = false;
    that.hoverStartTime = null;
    that.offsetX = 0.;
    that.wiggle = false;

    that.children = [
        imageWidget({ctx: that.ctx, image: that.image, parent: that, relPos: {x: 0, y: 0}}),
        textWidget({text: that.companyName, font: that.titleFont, parent: that, relPos: {x: 30, y: 0}}),
        textWidget({text: that.title, font: that.font, parent: that, relPos: {x: 30, y: 15}}),
        textWidget({text: that.year1.toString(), font: that.titleFont, parent: that, relPos: {x: 250, y: 6}}),
        textWidget({text: that.monthShortStringList[that.month1], font: that.font, parent: that, relPos: {x: 250, y: 0}}),
        textWidget({text: that.year2.toString(), font: that.titleFont, parent: that, relPos: {x: 250, y: 26}}),
        textWidget({text: that.monthShortStringList[that.month2], font: that.font, parent: that, relPos: {x: 250, y: 20}}),
        textWidget({text: that.desc, font: that.font, parent: that, relPos: {x: 30, y: 45}}),
    ];

    that.draw = function () {
        // Wiggle handling. We put it here because draw is executed at each frame. (yeah I suck)
        if (that.wiggle) {
            var imageWidget = that.children[0];

            if (that.hovered) {
                var currTime = new Date().getTime();
                var newRelPos = {x: imageWidget.relPos.x - that.offsetX, y: imageWidget.relPos.y}

                //that.offsetX = Math.floor((0.5 + Math.sin((currTime - that.hoverStartTime) / 100) * 0.5) * 5);
                imageWidget.rotation = Math.floor((0.5 + Math.sin((currTime - that.hoverStartTime) / 100)) * 45);
                
                //if (that.isSelected)
                //    that.offsetX = -that.offsetX;
                
                //imageWidget.setRelPos(newRelPos.x + that.offsetX, imageWidget.relPos.y);
            }
            else {
                //imageWidget.setRelPos(imageWidget.relPos.x - that.offsetX, imageWidget.relPos.y);
                imageWidget.rotation = 0;
                //that.offsetX = 0.;
                that.wiggle = false;

            }

            that.updateRect();
            that.updateSize();
        }

        // Clippin' and drawin'
        that.ctx.save();
        
        that.ctx.beginPath();

        that.ctx.rect(that.rect.l, 0, that.size.w, that.rect.t+that.size.h);
        that.ctx.clip();

        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw();
        }

        that.ctx.restore();
    }

    that.getRect = function () { 
        var rect = that.children[0].rect;
        var nbWidgets = that.children.length;

        if (that.isDescriptionVisible == false) {
            nbWidgets = that.children.length-1;
        }

        for (var i = 0; i < nbWidgets; i++) {
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

    that.triggerDescription = function () {
        that.isDescriptionVisible = !that.isDescriptionVisible;
        that.updateRect();
        that.updateSize();
    }

    that.showDescription = function () {
        that.isDescriptionVisible = true;
        that.updateRect();
        that.updateSize();
    }

    that.hideDescription = function () {
        that.isDescriptionVisible = false;
        that.updateRect();
        that.updateSize();
    }

    that.updateSize();

    return that;
}

function navbar (options) {
    var that = positionnableObject(options);

    that.children = [];
    that.btnList = [];

    that.currBtn = 0;

    that.bubbleWidget = bubbleWidget({ctx: ctx, font: f, text: "Accueil", absPos: {x: that.absPos.x, y: that.absPos.y+10}, parent: that, visible: false});

    that.createButton = function(newBtnOptions) {
        newBtnOptions.parent = that;
        newBtnOptions.relPos = {x: 0, y: 0};

        if (that.btnList.length >= 1) {
            newBtnOptions.relPos = {x: that.btnList[that.btnList.length-1].relPos.x + that.btnList[that.btnList.length-1].size.w + 2,
                                    y: that.btnList[that.btnList.length-1].relPos.y}
        }

        var newBtn = buttonWidget(newBtnOptions)

        siteCanvas.registerWidgetForMouseHoverInput(newBtn);

        newBtn.onStartMouseHover = function (mousePos) {
            that.bubbleWidget.visible = true;
            that.bubbleWidget.setText(newBtn.label);
            that.bubbleWidget.setRelPos(newBtn.relPos.x - Math.floor(that.bubbleWidget.size.w/2), newBtn.relPos.y + 10);
        }

        newBtn.onEndMouseHover = function (mousePos) {
            if (that.bubbleWidget.text == this.label)
                that.bubbleWidget.visible = false;
        }
        
        that.children.push(newBtn);
        that.btnList.push(newBtn);

        that.updateRect();
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
        for (var i = 0; i < that.children.length; i++) {
            that.children[i].draw();
        }

        if (that.bubbleWidget.visible)
            that.bubbleWidget.draw();
    }

    that.getRect = function () {
        var rect = {l: 0, r: 0, b: 0, t: 0};

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
