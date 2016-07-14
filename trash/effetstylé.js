// -- SITE FUNCTION/CLASS --
function page1 (ctx) { 
    p = page({context: ctx});

    var t = textWidget({
        text: "olololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\n",
        pos: {x: 20, y: 30},
        font: f,
    });

    var t2 = textWidget({
        text: "olololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\nlolololol lolo\nolololololol\nlolololol lolo\nelpipi\n",
        pos: {x: 200, y: 100},
        font: f,
    });

    var img = new Image();
    img.src = "unreal.png";

    var i = imageWidget({context: ctx, image: img, pos: {x: 0, y: 200}});

    p.addWidget(t);
    p.addWidget(t2);
    p.addWidget(i);

    widgetList.push(t);
    widgetList.push(t2);
    widgetList.push(i);

    return p;
}

function page2 (ctx) { 
    p = page({context: ctx});

    var unrealImg = new Image();
    unrealImg.src = "unreal.png";

    var pythonImg = new Image();
    pythonImg.src = "python.png";

    var cImg = new Image();
    cImg.src = "c.png";

    var cppImg = new Image();
    cppImg.src = "cpp.png";

    var mayaImg = new Image();
    mayaImg.src = "maya.png";

    var photoshopImg = new Image();
    photoshopImg.src = "photoshop.png";

    var blenderImg = new Image();
    blenderImg.src = "blender.png";

    var s1 = skillWidget({context: ctx, title: "unreal", font: f, image: unrealImg, value: 3, pos: {x: 0, y: 0}});
    var s2 = skillWidget({context: ctx, title: "python", font: f, image: pythonImg, value: 4, pos: {x: 0, y: 30}});
    var s3 = skillWidget({context: ctx, title: "c", font: f, image: cImg, value: 3, pos: {x: 0, y: 60}});
    var s4 = skillWidget({context: ctx, title: "cpp", font: f, image: cppImg, value: 3, pos: {x: 0, y: 90}});
    var s5 = skillWidget({context: ctx, title: "maya", font: f, image: mayaImg, value: 4, pos: {x: 0, y: 120}});
    var s6 = skillWidget({context: ctx, title: "photoshop", font: f, image: photoshopImg, value: 4, pos: {x: 0, y: 150}});
    var s7 = skillWidget({context: ctx, title: "blender", font: f, image: blenderImg, value: 2, pos: {x: 130, y: 0}});

    p.addWidget(s1);
    p.addWidget(s2);
    p.addWidget(s3);
    p.addWidget(s4);
    p.addWidget(s5);
    p.addWidget(s6);
    p.addWidget(s7);

    return p;
}

function page3 (ctx) { 
    p = pagePanelScroll({context: ctx});

    var img1 = new Image();
    img1.src = "loom-ega.png";

    var img2 = new Image();
    img2.src = "shittyhollow.png";

    var img3 = new Image();
    img3.src = "mi1.png";

    p.addPanels([panel({context: ctx, title: "loom", image: img1}),
                 panel({context: ctx, title: "shitty hollow", image: img2}),
                 panel({context: ctx, title: "monkey island", image: img3})]);

    return p;
}

function page4 (ctx) { 
    p = page({context: ctx});
    return p;
}

function backgroundTest (options) {
    var that = {};

    that.ctx = options.context;
    that.spotList = [];
    that.f = 0;
    that.nbPixels = 320 * 240;
    that.imageData = that.ctx.createImageData(that.ctx.getImageData(0, 0, 320, 240));

    that.init = function () {
        var w = that.ctx.canvas.width;
        var h = that.ctx.canvas.height;

        for (var i = 0; i < 10; i++) {
            var x = Math.round(Math.random() * 320);
            var y = Math.round(Math.random() * 240);

            that.imageData.data[(y*w + x)*4] = 255;
            that.imageData.data[(y*w + x)*4+1] = 255;
            that.imageData.data[(y*w + x)*4+2] = 255;
            that.imageData.data[(y*w + x)*4+3] = 255;
        }
    }

    that.draw = function () {
        // that.ctx.fillStyle = "#FF0000";
        // that.ctx.fillRect(20, 20, 40, 10);
        
        if (that.f % 10 == 0) {
            var newSpotIdx = Math.floor(Math.random() * that.nbPixels) * 4;

            that.imageData.data[newSpotIdx] = 255;
            that.imageData.data[newSpotIdx+1] = 255;
            that.imageData.data[newSpotIdx+2] = 255;
            that.imageData.data[newSpotIdx+3] = 255;
        }

        var newImageData = that.ctx.createImageData(that.imageData);

        var dataCopy = new Uint8ClampedArray(that.imageData.data);
        newImageData.data.set(dataCopy);

        var w = that.ctx.canvas.width;
        var h = that.ctx.canvas.height;

        var maxNewIdx = 0;

        for (var i = 0; i < that.nbPixels; i++) {
            if (that.imageData.data[i*4] > 10) {
                for (var x = -1; x < 2; x++) {
                    for (var y = -1; y < 2; y++) {
                        var xI = (i%w + x);
                        var yI = (Math.floor(i/w) + y);

                        if  (xI < w && xI >= 0
                            && yI < h && yI >= 0
                            && (x != 0 || y != 0)) {

                            var newIdx = (xI + yI*w)*4;

                            if (that.imageData.data[newIdx] == 0) {
                                newImageData.data[newIdx]   = that.imageData.data[i*4];
                                newImageData.data[newIdx+1] = that.imageData.data[i*4];
                                newImageData.data[newIdx+2] = that.imageData.data[i*4];
                                newImageData.data[newIdx+3] = 255;
                            }
                            else if (newImageData.data[newIdx] < 10) {
                                newImageData.data[newIdx] = 0;
                                newImageData.data[newIdx+1] = 0;
                                newImageData.data[newIdx+2] = 0;
                                newImageData.data[newIdx+3] = 255;
                            }
                        }
                    }
                }

                newImageData.data[i*4]   = Math.floor(that.imageData.data[i*4] * 0.90);
                newImageData.data[i*4+1] = Math.floor(that.imageData.data[i*4] * 0.90);
                newImageData.data[i*4+2] = Math.floor(that.imageData.data[i*4] * 0.90);
                newImageData.data[i*4+3] = 255;
            }
        }

        that.ctx.putImageData(newImageData, 0, 0);
        that.imageData = newImageData;

        that.f++;
    }

    that.init();

    return that;
}

// -- MAIN --
var siteCanvas = new function() {
    var canvas;
    var color;
    var text;
    var x, y;
    var b;
    var frame;

    var mp;
    var nb;
    var bg;

    this.canvas = undefined;

    this.init = function() {
        ctx = this.canvas.getContext('2d');

        ctx['imageSmoothingEnabled'] = false;
        ctx['mozImageSmoothingEnabled'] = false;
        ctx['oImageSmoothingEnabled'] = false;
        ctx['webkitImageSmoothingEnabled'] = false;
        ctx['msImageSmoothingEnabled'] = false;

        // -- FONT --
        var fontImg = new Image();
        fontImg.src = "font.png";

        f = new font({
            context: ctx,
            nbFrameW: 16,
            nbFrameH: 16,
            image: fontImg,
        });

        // -- NAVBAR --
        var btnImg = new Image();
        btnImg.src = "buttons-header.png";

        btnSprSh = new spritesheet({
            context: ctx,
            nbFrameW: 6,
            nbFrameH: 2,
            image: btnImg,
        }); 

        nb = navbar({
            pos: {x: 265, y: 6},
        });

        nb.addButton(buttonWidget({
            spritesheet: btnSprSh,
            sprOnId: 0,
            sprOffId: 1,
            sprHoverId: 1,
            callback: this.onNavbarBtnChange,
        }));

        nb.addButton(buttonWidget({
            spritesheet: btnSprSh,
            sprOnId: 2,
            sprOffId: 3,
            sprHoverId: 2,
            callback: this.onNavbarBtnChange,
        }));

        nb.addButton(buttonWidget({
            spritesheet: btnSprSh,
            sprOnId: 4,
            sprOffId: 5,
            sprHoverId: 4,
            callback: this.onNavbarBtnChange,
        }));

        nb.addButton(buttonWidget({
            spritesheet: btnSprSh,
            sprOnId: 6,
            sprOffId: 7,
            sprHoverId: 6,
            callback: this.onNavbarBtnChange,
        }));

        // -- PAGE SETUP --
        mp = multipage({
            pos: {x: 10, y: 30},
            size: {w: 290, h: 180},
        });

        mp.addPages([page1(ctx), page2(ctx), page3(ctx), page4(ctx)]);

        bg = backgroundManager();
        bg.addBG(backgroundTest({context: ctx}));

        bg.currBG = 0;

        frame = 0;

        window.addEventListener('keydown', function (e) {
            siteCanvas.onKeyDown(e);
        });

        ctx.canvas.addEventListener('mousedown', function (e) {
            siteCanvas.onMouseDown(e)
        }, false)

        this.draw();
    };

    this.onMouseDown = function(e) {
        var mousePos = getMousePos(ctx.canvas, e);

        console.log(mousePos);

        for (var i = 0; i < widgetList.length; i++) {
            // console.log(widgetList[i].rect, widgetList[i].pos, widgetList[i].size, mousePos);

            if (widgetList[i].rect.l <= mousePos.x && mousePos.x <= widgetList[i].rect.r
             && widgetList[i].rect.t <= mousePos.y && mousePos.y <= widgetList[i].rect.b) {
                widgetList[i].onMouseDown(mousePos);
            }
        }
    }

    this.onKeyDown = function (e) {
        // bg.draw();
        if (e.keyCode == 37) { // LEFT
            if (nb.currBtn == 0) {
                nb.selectBtn(nb.btnList.length - 1);
            }
            else {
                nb.selectBtn(nb.currBtn - 1);
            }
        }
        if (e.keyCode == 39) { // RIGHT
            nb.selectBtn((nb.currBtn + 1) % nb.btnList.length);
        }
        if (e.keyCode == 38) { // UP
            mp.pageList[mp.currPage].scrollUpEvent()
        }
        if (e.keyCode == 40) { // DOWN
            mp.pageList[mp.currPage].scrollDownEvent()
        }
    };

    this.onNavbarBtnChange = function (btnId) {
        mp.goToPage(btnId);
    };

    this.draw = function () {
        // this timeout adds a pause of 1 second, once
        this.interval = window.setInterval(this.render, 20);
    };

    drawLine = function (x1, y1, x2, y2) {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#FFF"
        ctx.stroke();
    };

    this.render = function () {
        var w = 320;
        var h = 240;

        ctx.canvas.width = w;
        ctx.canvas.height = h;

        ctx.scale(w/320, h/240);

        ctx.fillRect(0,0,320,240); // fill the background (color still white)
        ctx.strokeRect(0,0,320,240); // default stroke color is black 

        bg.draw();

        f.drawStr("freddyclement.com", 5, 5);

        nb.draw();
        mp.draw();

        drawLine(5, 20, 315, 20);
        drawLine(5, 220, 315, 220);

        ctx.scale(-w/320, -h/240);

        frame += 1;

    };
};
window.onload = function(){
    siteCanvas.canvas = document.getElementById('myCanvas');
    siteCanvas.init();
};

