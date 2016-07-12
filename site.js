var f;
var fbig;
var ctx;
var btnImg;


// -- SITE FUNCTION/CLASS --
function page1 (ctx) { 
    p = page({ctx: ctx, scrollSpeed: 16, title: "ACCUEIL"});

    var t = textWidget({
        text: "JE SUIS FREDDY\nJ'AI 25 ANS\nJE VEUX FAIRE LES JEUX VIDEOS",
        absPos: {x: 45, y: 0},
        font: fbig,
    });

    var t2 = textWidget({
        text: "Clique sur les boutons en haut a droite et t'en sauras plus.",
        relPos: {x: 42, y: 120},
        font: f,
    });

    var img = new Image();
    img.src = "unreal.png";

    var i = imageWidget({ctx: ctx, image: img, relPos: {x: 0, y: 200}});

    p.addWidget(t);
    p.addWidget(t2);
    p.addWidget(i);

    widgetList.push(t);
    widgetList.push(t2);
    widgetList.push(i);

    return p;
}

function page2 (ctx) { 
    p = page({ctx: ctx, title: "COMPETENCES"});

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

    var s1 = skillWidget({ctx: ctx, title: "UNREAL", font: f, titleFont: fbig, image: unrealImg, value: 3, relPos: {x: 0, y: 0}});
    var s2 = skillWidget({ctx: ctx, title: "PYTHON", font: f, titleFont: fbig, image: pythonImg, value: 4, relPos: {x: 0, y: 30}});
    var s3 = skillWidget({ctx: ctx, title: "C", font: f, titleFont: fbig, image: cImg, value: 3, relPos: {x: 0, y: 60}});
    var s4 = skillWidget({ctx: ctx, title: "C++", font: f, titleFont: fbig, image: cppImg, value: 3, relPos: {x: 0, y: 90}});
    var s5 = skillWidget({ctx: ctx, title: "MAYA", font: f, titleFont: fbig, image: mayaImg, value: 4, relPos: {x: 0, y: 120}});
    var s6 = skillWidget({ctx: ctx, title: "PHOTOSHOP", font: f, titleFont: fbig, image: photoshopImg, value: 4, relPos: {x: 0, y: 150}});
    var s7 = skillWidget({ctx: ctx, title: "BLENDER", font: f, titleFont: fbig, image: blenderImg, value: 2, relPos: {x: 130, y: 0}});

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
    p = pagePanelScroll({ctx: ctx, title: "PROJETS"});

    var img1 = new Image();
    img1.src = "arrows.png";

    var img2 = new Image();
    img2.src = "shittyhollow.png";

    var img3 = new Image();
    img3.src = "kebab.png";

    var img4 = new Image();
    img4.src = "the-friendzone.png";
 
    var img5 = new Image();
    img5.src = "bp.png";

    p.addPanels([panel({ctx: ctx, title: "SHITTY HOLLOW", image: img2, font: fbig}),
                 panel({ctx: ctx, title: "BISOUNOURS PARTY", image: img5, font: fbig}),
                 panel({ctx: ctx, title: "THE FRIENDZONE", image: img4, font: fbig}),
                 panel({ctx: ctx, title: "ARROWS IN CHAINS", image: img1, font: fbig}),
                 panel({ctx: ctx, title: "KEBAB SIMULATOR (PROTOTYPE)", image: img3, font: fbig})]);

    p.panelList[0].showImage = false;

    hideVid = function () {
        siteCanvas.getBGManager().bgList[3].setVideo();
        this.showImage = true;
    }

    p.panelList[0].onGoTo = function () {
        siteCanvas.getBGManager().bgList[3].setVideo("big_buck_bunny.mp4");
        this.showImage = false;
    }

    p.panelList[1].onGoTo = function () {
        siteCanvas.getBGManager().bgList[3].setVideo("test.mp4");
        this.showImage = false;
    }

    p.panelList[2].onGoTo = hideVid;
    p.panelList[3].onGoTo = hideVid;
    p.panelList[4].onGoTo = hideVid;

    p.onGoTo = function () {
        siteCanvas.getBGManager().switchBG(3, true);
    };

    p.onLeave = function () {
        siteCanvas.getBGManager().switchBG(1 + Math.floor(Math.random() * 2), true);
    };

    return p;
}

function page4 (ctx) { 
    p = page({ctx: ctx, scrollSpeed: 60, title: "EXPERIENCE PROFESSIONNELLE"});

    solidanimImg = new Image();
    solidanimImg.src = "solidanim.png";

    teamtoImg = new Image();
    teamtoImg.src = "teamto.png";

    chuImg = new Image();
    chuImg.src = "chu.png";

    whirlpoolImg = new Image();
    whirlpoolImg.src = "whirlpool.png";


    var xp5 = expProWidget({
        ctx: ctx,
        companyName: "WHIRLPOOL",
        title: "STAGIAIRE INFORMATIQUE\nDEVELOPPEMENT/MAINTENANCE",
        image: whirlpoolImg,
        year1: 2009,
        month1: 7, 
        year2: 2009,
        month2: 8,
        parent: p,
        relPos: {x: 0, y: 240},
        titleFont: fbig,
        font: f,
    });

    var xp4 = expProWidget({
        ctx: ctx,
        companyName: "CHU AMIENS",
        title: "STAGIAIRE R&D\nRECHERCHE BIOPHYSIQUE\nTRAITEMENT D'IMAGES IRM",
        image: chuImg,
        year1: 2010,
        month1: 4, 
        year2: 2010,
        month2: 7,
        parent: p,
        relPos: {x: 0, y: 180},
        titleFont: fbig,
        font: f,
    });

    var xp3 = expProWidget({
        ctx: ctx,
        companyName: "SOLIDANIM",
        title: "STAGIAIRE R&D\nTRAITEMENT D'IMAGES EN TEMPS REEL",
        image: solidanimImg,
        year1: 2011,
        month1: 6, 
        year2: 2011,
        month2: 9,
        parent: p,
        relPos: {x: 0, y: 120},
        titleFont: fbig,
        font: f,
    });

    var xp2 = expProWidget({
        ctx: ctx,
        companyName: "TEAMTO",
        title: "STAGIAIRE R&D\nDEVELOPPEMENT OUTILS\nGUS",
        image: teamtoImg,
        year1: 2012,
        month1: 6, 
        year2: 2012,
        month2: 8,
        parent: p,
        relPos: {x: 0, y: 60},
        titleFont: fbig,
        font: f,
    });

    var xp1 = expProWidget({
        ctx: ctx,
        companyName: "TEAMTO",
        title: "Developpeur pipeline/Data manager\nPyjamasques Saison 1",
        image: teamtoImg,
        year1: 2012,
        month1: 11,
        year2: 2015,
        month2: 12,
        parent: p,
        relPos: {x: 0, y: 0},
        titleFont: fbig,
        font: f,
    });

    // p.addWidget(t1);
    p.addWidget(xp1);
    p.addWidget(xp2);
    p.addWidget(xp3);
    p.addWidget(xp4);
    p.addWidget(xp5);

    return p;
}

function page5 (ctx) { 
    p = page({ctx: ctx, scrollSpeed: 60, title: "ETUDES"});

    atiImg = new Image();
    atiImg.src = "ati.png";

    iutImg = new Image();
    iutImg.src = "iut.png";

    lyceeImg = new Image();
    lyceeImg.src = "lycee.png";

    var xp5 = expProWidget({
        ctx: ctx,
        companyName: "LYCEE DE LA COTE D'ALBATRE",
        title: "Baccalaureat Scientifique option Sciences de L'ingenieur\nDiplome obtenu - Mention Bien",
        image: lyceeImg,
        year1: 2005,
        month1: 9, 
        year2: 2008,
        month2: 6,
        parent: p,
        relPos: {x: 0, y: 120},
        titleFont: fbig,
        font: f,
    });

    var xp4 = expProWidget({
        ctx: ctx,
        companyName: "IUT AMIENS",
        title: "Departement Informatique\nOption Imagerie Numerique",
        image: iutImg,
        year1: 2008,
        month1: 9, 
        year2: 2010,
        month2: 6,
        parent: p,
        relPos: {x: 0, y: 60},
        titleFont: fbig,
        font: f,
    });

    var xp3 = expProWidget({
        ctx: ctx,
        companyName: "ATI - Paris VIII",
        title: "Arts et Technologies de l'Image\nNiveau Master obtenu - Mention Bien",
        image: atiImg,
        year1: 2010,
        month1: 6, 
        year2: 2013,
        month2: 9,
        parent: p,
        relPos: {x: 0, y: 0},
        titleFont: fbig,
        font: f,
    });

    p.addWidget(xp3);
    p.addWidget(xp4);
    p.addWidget(xp5);

    return p;
}

function backgroundFractal (options) {
    var that = {};

    that.ctx = options.ctx;
    that.spotList = [];
    that.f = 0;
    that.nbPixels = 320 * 240;
    that.imageData = that.ctx.createImageData(that.ctx.getImageData(0, 0, 320, 240));
    that.lastSpotTime = 0;

    that.init = function () {
        var w = that.ctx.canvas.width;
        var h = that.ctx.canvas.height;

        for (var i = 0; i < 3; i++) {
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

        var currTime = new Date().getTime();
        
        if (currTime - that.lastSpotTime > 10000) {
            var newSpotIdx = Math.floor(Math.random() * that.nbPixels) * 4;

            that.imageData.data[newSpotIdx] = 255;
            that.imageData.data[newSpotIdx+1] = 255;
            that.imageData.data[newSpotIdx+2] = 255;
            that.imageData.data[newSpotIdx+3] = 255;

            that.lastSpotTime = currTime;
        }

        var newImageData = that.ctx.createImageData(that.imageData);

        var dataCopy = new Uint8ClampedArray(that.imageData.data);
        newImageData.data.set(dataCopy);

        var w = that.ctx.canvas.width;
        var h = that.ctx.canvas.height;

        for (var i = 0; i < that.nbPixels; i++) {
            if (that.imageData.data[i*4] > 0) {
                if (that.imageData.data[i*4] == 255) {
                    for (var x = -Math.floor(Math.random()*2); x < 1+Math.floor(Math.random()*2); x++) {
                        for (var y = -Math.floor(Math.random()*2); y < 1+Math.floor(Math.random()*2); y++) {
                            var xI = (i%w + x);
                            var yI = (Math.floor(i/w) + y);

                            if  (xI < w && xI >= 0
                                && yI < h && yI >= 0
                                && (x != 0 || y != 0)) {

                                var newIdx = (xI + yI*w)*4;

                                if (that.imageData.data[newIdx] == 0) {
                                    newImageData.data[newIdx]   = 255;
                                    newImageData.data[newIdx+1] = Math.floor(Math.random()*255);
                                    newImageData.data[newIdx+2] = Math.floor(Math.random()*255);
                                    newImageData.data[newIdx+3] = 255;
                                }
                            }
                        }
                    }
                }

                newImageData.data[i*4]   = Math.floor(that.imageData.data[i*4] * 0.90);
                newImageData.data[i*4+1] = Math.floor(that.imageData.data[i*4] * 0.90);
                newImageData.data[i*4+2] = Math.floor(that.imageData.data[i*4] * 0.90);
                newImageData.data[i*4+3] = Math.floor(that.imageData.data[i*4] * 0.90);
            }
        }

        that.imageData = newImageData;

        that.ctx.putImageData(newImageData, 0, 0);

        that.f++;
    }

    that.init();

    return that;
}

function backgroundSnow (options) {
    var that = {};

    that.ctx = options.ctx;
    that.imageData = that.ctx.createImageData(that.ctx.getImageData(0, 0, 320, 240));
    that.nbPixels = 320 * 240;
    that.randomStrip = Array(that.nbPixels);

    that.init = function () {
        for (var i = 0; i < that.nbPixels; i++) {
            that.randomStrip[i] = Math.floor(Math.random() * 255);
        }
    }

    that.draw = function () {
        var arrOffset = Math.floor(Math.random() * that.nbPixels);

        for (var i = 0; i < that.nbPixels; i++) {
            var idx = i*4;
            var idxArr = (arrOffset + i) % that.nbPixels;

            that.imageData.data[idx] = that.randomStrip[idxArr];
            that.imageData.data[idx+1] = that.randomStrip[idxArr];
            that.imageData.data[idx+2] = that.randomStrip[idxArr];
            that.imageData.data[idx+3] = 255;
        }

        that.ctx.putImageData(that.imageData, 0, 0);
    }

    that.init();

    return that;
}

function backgroundPerlin (options) {
    var that = {};

    that.ctx = options.ctx;
    that.imageData = that.ctx.createImageData(that.ctx.getImageData(0, 0, 320, 240));
    that.nbPixels = 320 * 240;
    that.randomStrip = [];
    that.startTime = 0;
    that.maxVal = 255;
    that.prevTime = -1;

    that.fadeCoef = [];
    that.fadeDirection = [];

    that.init = function () {
        for (var j = 0; j < 10; j++) {
            that.generateNewNoise();
        }

        that.fadeDirection[0] = 1;

        that.startTime = new Date().getTime();
    }

    that.onResume = function () {
        that.prevTime = -1;
    } 

    that.generateNewNoise = function () {
        noise.seed(Math.random());
        var newRandomStrip = Array(that.nbPixels);

        for (var i = 0; i < that.nbPixels; i++) {
            newRandomStrip[i] = noise.perlin2(i%320 / 50, Math.floor(i/320) / 50) * that.maxVal;
        }

        that.randomStrip.push(newRandomStrip);
        that.fadeCoef.push(0);
        that.fadeDirection.push(0);
    }

    that.draw = function () {
        var currTime = new Date().getTime();

        for (var i = 0; i < that.nbPixels; i++) {
            var valF = 0;
            for (var j = 0; j < that.randomStrip.length; j++) {
                var idx = i*4;
                var val = that.randomStrip[j][i] * that.fadeCoef[j]; // + Math.cos((currTime - that.startTime)/2000)*20;
                valF += val;
            }

            var color = {r: 0, g: 0, b: 0};

            if (valF >= 0 && valF < 110) {
                color.r = 1;
            }
            else if (valF >= 110 && valF < 255) {
                color.r = (110-valF)/(255-110);
                color.g = (110-valF)/(255-110);
            }
            /*else if (valF >= 100 && valF < 255) {
                color.b = 1;
            }*/

            color.r = valF;
            color.g = valF;
            color.b = valF;

            that.imageData.data[idx] = color.r;
            that.imageData.data[idx+1] = color.g;
            that.imageData.data[idx+2] = color.b;
            that.imageData.data[idx+3] = 255;
        }

        if (that.prevTime > 0) {
            for (var j = 0; j < that.randomStrip.length; j++) {
                that.fadeCoef[j] += (currTime - that.prevTime) * 0.001 * that.fadeDirection[j];
                if (that.fadeCoef[j] >= 1) {
                    that.fadeDirection[j] = -1;
                }
                else if (that.fadeCoef[j] <= 0 && that.fadeDirection[j] < 0) {
                    that.randomStrip.splice(j, j+1);
                    that.fadeCoef.splice(j, j+1);
                    that.generateNewNoise();
                }

                if (that.fadeCoef[j] <= 0.5 && that.fadeDirection[j] < 0) {
                    that.fadeDirection[j+1] = 1;
                }
            }
        }


        that.prevTime = currTime;

        that.ctx.putImageData(that.imageData, 0, 0);
    }

    that.init();

    return that;
}

function backgroundVideo (options) {
    var that = {};

    that.ctx = options.ctx;
    that.videoElmt = document.getElementById('v');

    that.init = function () {

    }

    that.onResume = function () {
        that.videoElmt.play();
    }

    that.onSwitched = function () {
        that.videoElmt.pause();
    }

    that.draw = function () {
        that.ctx.drawImage(that.videoElmt, 0, 0, 320, 240);
    }

    that.setVideo = function (newVideoURL) {
        that.videoElmt.src = newVideoURL;
        that.videoElmt.play();
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

    var nbAssetsToPreload = 1;
    var nbAssetsPreloaded = 0;

    this.load = function () {
        btnImg = new Image()
        btnImg.src = "buttons-header.png";
        btnImg.onload = this.preloadEnd;
    };

    this.preloadEnd = function () {
        nbAssetsPreloaded++;

        if (nbAssetsPreloaded == nbAssetsToPreload) {
            siteCanvas.init();
        }
    };

    this.init = function () {
        ctx = this.canvas.getContext('2d');

        ctx['imageSmoothingEnabled'] = false;
        ctx['mozImageSmoothingEnabled'] = false;
        ctx['oImageSmoothingEnabled'] = false;
        ctx['webkitImageSmoothingEnabled'] = false;
        ctx['msImageSmoothingEnabled'] = false;

        fontSizeArray = [
            3, 3, 5, 7, 5, 7, 6, 3, 4, 4, 5, 5, 4, 5, 3, 5,
            5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 4, 5, 5, 5, 4,
            6, 5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 7, 5, 5,
            5, 5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 4, 5, 4, 5, 6,
            4, 5, 5, 4, 5, 4, 4, 5, 5, 3, 3, 5, 3, 7, 5, 5,
            5, 5, 4, 4, 4, 5, 5, 7, 5, 5, 5, 5, 4, 5, 6, 3,
        ]

        fontBigSizeArray = [
            6, 3, 6, 9, 9, 9, 9, 4, 5, 5, 9, 9, 9, 9, 9, 9,
            7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9,
            9, 9, 8, 9, 8, 8, 8, 9, 8, 3, 8, 9, 8, 9, 9, 9,
            8, 9, 8, 9, 9, 9, 9, 15, 9, 9, 9, 9, 9, 9, 9, 9,
            9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
            9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
        ]

        // -- FONT --
        var fontSmallImg = new Image();
        fontSmallImg.src = "font-small.png";

        var fontBigImg = new Image();
        fontBigImg.src = "font-big.png";

        f = new font({
            ctx: ctx,
            nbFrameW: 16,
            nbFrameH: 16,
            image: fontSmallImg,
            fontSizeArray: fontSizeArray,
            forceCase: "uppercase",
        });

        fbig = new font({
            ctx: ctx,
            nbFrameW: 16,
            nbFrameH: 16,
            image: fontBigImg,
            fontSizeArray: fontBigSizeArray,
            forceCase: "uppercase",
        });

        // -- NAVBAR --
        var btnImg = new Image();
        btnImg.src = "buttons-header.png";

        btnSprSh = new spritesheet({
            ctx: ctx,
            nbFrameW: 6,
            nbFrameH: 2,
            image: btnImg,
        }); 

        nb = navbar({
            absPos: {x: 255, y: 5},
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 0,
            sprOffId: 1,
            sprHoverId: 1,
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 2,
            sprOffId: 3,
            sprHoverId: 2,
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 4,
            sprOffId: 5,
            sprHoverId: 4,
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 6,
            sprOffId: 7,
            sprHoverId: 6,
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 8,
            sprOffId: 9,
            sprHoverId: 8,
            callback: this.onNavbarBtnChange,
        });

        // -- PAGE SETUP --
        mp = multipage({
            absPos: {x: 10, y: 30},
            size: {w: 290, h: 180},
        });

        mp.addPages([page1(ctx), page3(ctx), page2(ctx), page4(ctx), page5(ctx)]);

        bg = backgroundManager({
            transitionTime: 200,
            transitionBgId: 0,
        });
        bg.addBG(backgroundSnow({ctx: ctx}));
        bg.addBG(backgroundFractal({ctx: ctx}));
        bg.addBG(backgroundPerlin({ctx: ctx}));
        bg.addBG(backgroundVideo({ctx: ctx}));
        bg.currBG = 1;

        frame = 0;

        window.addEventListener('keydown', function (e) {
            siteCanvas.onKeyDown(e);
        });

        ctx.canvas.addEventListener('mousedown', function (e) {
            siteCanvas.onMouseDown(e);
        }, false)

        this.draw();
    };

    this.onMouseDown = function(e) {
        var mousePos = getMousePos(ctx.canvas, e);

        for (var i = 0; i < widgetList.length; i++) {
            if (widgetList[i].rect.l <= mousePos.x && mousePos.x <= widgetList[i].rect.r
             && widgetList[i].rect.t <= mousePos.y && mousePos.y <= widgetList[i].rect.b) {
                widgetList[i].onMouseDown(mousePos);
            }
        }
    };

    this.onKeyDown = function (e) {
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
            mp.children[mp.currPage].scrollUpEvent()
        }
        if (e.keyCode == 40) { // DOWN
            mp.children[mp.currPage].scrollDownEvent()
        }
        if (e.keyCode == 66) { // B
            var nextBG = (bg.currBG + 1) % bg.bgList.length;
            if (nextBG == bg.transitionBgId) {
                bg.switchBG((nextBG + 1) % bg.bgList.length, true);
            }
            else {
                bg.switchBG(nextBG, true);
            }
        }
        if (e.keyCode == 78) { // N
            var nextBG = (bg.currBG - 1);

            if (nextBG < 0) {
                nextBG = bg.bgList.length - 1;
            }

            if (nextBG == bg.transitionBgId) {
                nextBG--;

                if (nextBG < 0) {
                    nextBG = bg.bgList.length - 1;
                }

                bg.switchBG(nextBG, true);
            }
            else {
                bg.switchBG(nextBG, true);
            }
        }
        if (e.keyCode == 87) { // W
            mp.children[mp.currPage].currentSelectedWidgetId = (mp.children[mp.currPage].currentSelectedWidgetId + 1) % mp.children[mp.currPage].children.length;
        }
    };

    this.onNavbarBtnChange = function (btnId) {
        mp.goToPage(btnId);
    };

    this.draw = function () {
        // this timeout adds a pause of 1 second, once
        this.interval = window.setInterval(this.render, 20);
    };

    drawLine = function (x1, y1, x2, y2, w, color) {
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color
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

        f.drawStr("FREDDYCLEMENT.COM v0.1", 5, 5);

        nb.draw();
        mp.draw();

        drawLine(5, 17, 315, 17, 4, "#000");
        drawLine(5, 220, 315, 220, 4, "#000");
        drawLine(6, 17, 314, 17, 2, "#FFF");
        drawLine(6, 220, 314, 220, 2, "#FFF");

        f.drawStr(mp.children[mp.currPage].title, 5, 224);

        ctx.scale(-w/320, -h/240);

        frame += 1;
    };

    this.getBGManager = function () {
        return bg;
    }
};
window.onload = function(){
    siteCanvas.canvas = document.getElementById('myCanvas');
    siteCanvas.load();
};

