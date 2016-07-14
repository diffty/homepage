var f;
var fbig;
var ctx;
var btnImg;

var rscManager;


// -- SITE FUNCTION/CLASS --
function page1 (ctx) { 
    p = page({ctx: ctx, scrollSpeed: 16, title: "ACCUEIL"});

    var t = textWidget({
        text: "JE SUIS FREDDY\nJ'AI 25 ANS\nJE VEUX FAIRE LES JEUX VIDEOS",
        absPos: {x: 45, y: 30},
        font: fbig,
    });

    var t2 = textWidget({
        text: "Clique sur les boutons en haut a droite et t'en sauras plus.",
        relPos: {x: 42, y: 120},
        font: f,
    });

    var i = imageWidget({ctx: ctx, image: rscManager.getRscData("awesome"), relPos: {x: 0, y: 200}});

    p.addWidget(t);
    p.addWidget(t2);
    p.addWidget(i);

    return p;
}

function page2 (ctx) { 
    p = page({ctx: ctx, title: "COMPETENCES"});

    var s1 = skillWidget({ctx: ctx, title: "UNREAL", font: f, titleFont: fbig, image: rscManager.getRscData("unreal"), value: 3, relPos: {x: 0, y: 0}});
    var s2 = skillWidget({ctx: ctx, title: "PYTHON", font: f, titleFont: fbig, image: rscManager.getRscData("python"), value: 4, relPos: {x: 0, y: 30}});
    var s3 = skillWidget({ctx: ctx, title: "C", font: f, titleFont: fbig, image: rscManager.getRscData("c"), value: 3, relPos: {x: 0, y: 60}});
    var s4 = skillWidget({ctx: ctx, title: "C++", font: f, titleFont: fbig, image: rscManager.getRscData("cpp"), value: 3, relPos: {x: 0, y: 90}});
    var s5 = skillWidget({ctx: ctx, title: "MAYA", font: f, titleFont: fbig, image: rscManager.getRscData("maya"), value: 4, relPos: {x: 0, y: 120}});
    var s6 = skillWidget({ctx: ctx, title: "PHOTOSHOP", font: f, titleFont: fbig, image: rscManager.getRscData("photoshop"), value: 4, relPos: {x: 0, y: 150}});
    var s7 = skillWidget({ctx: ctx, title: "BLENDER", font: f, titleFont: fbig, image: rscManager.getRscData("blender"), value: 2, relPos: {x: 130, y: 0}});

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

    p.addPanels([panel({ctx: ctx, title: "SHITTY HOLLOW", image: rscManager.getRscData("shittyhollow"), font: fbig}),
                 panel({ctx: ctx, title: "BISOUNOURS PARTY", image: rscManager.getRscData("bp"), font: fbig}),
                 panel({ctx: ctx, title: "THE FRIENDZONE", image: rscManager.getRscData("the-friendzone"), font: fbig}),
                 panel({ctx: ctx, title: "ARROWS IN CHAINS", image: rscManager.getRscData("arrows"), font: fbig}),
                 panel({ctx: ctx, title: "KEBAB SIMULATOR (PROTOTYPE)", image: rscManager.getRscData("kebab"), font: fbig})]);

    p.panelList[0].showImage = false;

    hideVid = function () {
        siteCanvas.getBGManager().bgList[4].setVideo();
        this.showImage = true;
    }

    p.panelList[0].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/shittyhollow.mov");
        this.showImage = false;
    }

    p.panelList[1].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/bp.mp4");
        this.showImage = false;
    }

    p.panelList[4].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/kebab.mov");
        this.showImage = false;
    }

    p.panelList[2].onGoTo = hideVid;
    p.panelList[3].onGoTo = hideVid;

    p.onGoTo = function () {
        siteCanvas.getBGManager().switchBG(4, true);
    };

    p.onLeave = function () {
        siteCanvas.getBGManager().switchBG(2 + Math.floor(Math.random() * 2), true);
    };

    return p;
}

function page4 (ctx) { 
    p = page({ctx: ctx, scrollSpeed: 60, title: "EXPERIENCE PROFESSIONNELLE"});

    var xp5 = expProWidget({
        ctx: ctx,
        companyName: "WHIRLPOOL",
        title: "STAGIAIRE INFORMATIQUE\nDEVELOPPEMENT/MAINTENANCE",
        image: rscManager.getRscData("whirlpool"),
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
        image: rscManager.getRscData("chu"),
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
        image: rscManager.getRscData("solidanim"),
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
        image: rscManager.getRscData("teamto"),
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
        image: rscManager.getRscData("teamto"),
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

    var xp5 = expProWidget({
        ctx: ctx,
        companyName: "LYCEE DE LA COTE D'ALBATRE",
        title: "Baccalaureat Scientifique option Sciences de L'ingenieur\nDiplome obtenu - Mention Bien",
        image: rscManager.getRscData("lycee"),
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
        image: rscManager.getRscData("iut"),
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
        image: rscManager.getRscData("ati"),
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
    
    var progressBar;

    var preloadFinished = false;

    this.registeredMouseInputWidgetList = [];

    this.canvas = undefined;

    var nbAssetsToPreload = 1;
    var nbAssetsPreloaded = 0;

    var imageList = [
        "img/loading.png",

        "img/ati.png",
        "img/arrows.png",
        "img/awesome.png",
        "img/bp.png",
        "img/blender.png",
        "img/buttons-header.png",
        "img/c.png",
        "img/chu.png",
        "img/cpp.png",
        "img/font-big.png",
        "img/font-small.png",
        "img/iut.png",
        "img/kebab.png",
        "img/lycee.png",
        "img/maya.png",
        "img/photoshop.png",
        "img/python.png",
        "img/shittyhollow.png",
        "img/solidanim.png",
        "img/teamto.png",
        "img/the-friendzone.png",
        "img/ui-misc-small.png",
        "img/unreal.png",
        "img/whirlpool.png",
    ]

    this.preload = function () {
        ctx = this.canvas.getContext('2d');

        bg = backgroundManager({
            transitionTime: 200,
            transitionBgId: 0,
        });
        
        bg.addBG(backgroundSnow({ctx: ctx}));

        bg.currBG = 0;

        progressBar = progressBarWidget({
            ctx: ctx,
            size: {w: 310, h: 4},
            absPos: {x: 5, y: 15},
            min: 1,
            max: imageList.length,
            value: 0,
        });

        rscManager = ressourceManager({
            onAllLoaded: function () {
                siteCanvas.init();
                preloadFinished = true;
            },
            onEachResourceLoaded: function (rsc) {
                progressBar.setValue(progressBar.value+1);
                
                if (rsc.name == "loading") {
                    bg.addBG(backgroundLoading({
                        ctx: ctx,
                        image: rsc.data,
                    }));
                    bg.currBG = 1;
                }
            },
        });

        for (var i = 0; i < imageList.length; i++)
            rscManager.addImg(imageList[i]);

        // Launch render process each 20ms
        this.interval = window.setInterval(this.draw, 20);
    };

    this.init = function () {
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
        f = new font({
            ctx: ctx,
            nbFrameW: 16,
            nbFrameH: 16,
            image: rscManager.getRsc("font-small").data,
            fontSizeArray: fontSizeArray,
            forceCase: "uppercase",
        });

        fbig = new font({
            ctx: ctx,
            nbFrameW: 16,
            nbFrameH: 16,
            image: rscManager.getRsc("font-big").data,
            fontSizeArray: fontBigSizeArray,
            forceCase: "uppercase",
        });

        btnSprSh = new spritesheet({
            ctx: ctx,
            nbFrameW: 6,
            nbFrameH: 2,
            image: rscManager.getRscData("buttons-header"),
        }); 

        nb = navbar({
            absPos: {x: 255, y: 5},
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 0,
            sprOffId: 1,
            sprHoverId: 1,
            state: true,
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
            ctx: ctx,
            absPos: {x: 10, y: 30},
            size: {w: 290, h: 180},
        });

        mp.addPages([page1(ctx), page3(ctx), page2(ctx), page4(ctx), page5(ctx)]);

        bg.addBG(backgroundFractal({ctx: ctx}));
        bg.addBG(backgroundPerlin({ctx: ctx}));
        bg.addBG(backgroundVideo({ctx: ctx}));
        bg.switchBG(2);

        bg.bgList[4].setVideo("media/shittyhollow.mov");

        widgetList.push(nb);
        widgetList.push(mp);

        frame = 0;

        window.addEventListener('keydown', function (e) {
            siteCanvas.onKeyDown(e);
        });

        ctx.canvas.addEventListener('mousedown', function (e) {
            siteCanvas.onMouseDown(e);
        }, false)

        ctx.canvas.addEventListener('mousemove', function (e) {
            siteCanvas.onMouseMove(e);
        }, false)

        ctx.canvas.addEventListener('mouseup', function (e) {
            siteCanvas.onMouseUp(e);
        }, false)
    };

    this.onMouseDown = function (e) {
        var mousePos = getMousePos(ctx.canvas, e);

        for (var i = 0; i < widgetList.length; i++) {
            if (widgetList[i].rect.l <= mousePos.x && mousePos.x <= widgetList[i].rect.r
             && widgetList[i].rect.t <= mousePos.y && mousePos.y <= widgetList[i].rect.b) {
                if (widgetList[i].hasOwnProperty("onMouseDown") == true) {
                    widgetList[i].onMouseDown(mousePos);
                }
            }
        }
    };

    this.onMouseMove = function (e) {
        var mousePos = getMousePos(ctx.canvas, e);

        for (var i = 0; i < this.registeredMouseInputWidgetList.length; i++) {
            this.registeredMouseInputWidgetList[i].onMouseMove(mousePos);
        }
    }

    this.onMouseUp = function (e) {
        var mousePos = getMousePos(ctx.canvas, e);

        for (var i = 0; i < this.registeredMouseInputWidgetList.length; i++) {
            this.registeredMouseInputWidgetList[i].onMouseUp(mousePos);
        }
    }

    this.registerWidgetForMouseInput = function (w) {        
        if (this.registeredMouseInputWidgetList.indexOf(w) == -1)
            this.registeredMouseInputWidgetList.push(w);
    }

    this.unregisterWidgetForMouseInput = function (w) {
        var widgetIdx = this.registeredMouseInputWidgetList.indexOf(w);

        if (widgetIdx != -1)
            this.registeredMouseInputWidgetList.splice(widgetIdx, 1);
    }

    this.onKeyDown = function (e) {
        if (e.keyCode == 37) { // LEFT
            if (nb.currBtn == 0) {
                nb.selectBtn(nb.children.length - 1);
            }
            else {
                nb.selectBtn(nb.currBtn - 1);
            }
        }
        if (e.keyCode == 39) { // RIGHT
            nb.selectBtn((nb.currBtn + 1) % nb.children.length);
        }
        if (e.keyCode == 38) { // UP
            mp.pageList[mp.currPage].scrollUpEvent()
        }
        if (e.keyCode == 40) { // DOWN
            mp.pageList[mp.currPage].scrollDownEvent()
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
            mp.pageList[mp.currPage].currentSelectedWidgetId = (mp.pageList[mp.currPage].currentSelectedWidgetId + 1) % mp.pageList[mp.currPage].children.length;
        }
    };

    this.onNavbarBtnChange = function (btnId) {
        mp.goToPage(btnId);
    };

    /*this.draw = function () {

    };*/

    drawLine = function (x1, y1, x2, y2, w, color) {
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color
        ctx.stroke();
    };

    this.draw = function () {
        var w = 320;
        var h = 240;

        ctx.canvas.width = w;
        ctx.canvas.height = h;

        ctx.scale(w / 320, h / 240);

        if (preloadFinished == false) {
            bg.draw();
            progressBar.draw();
            return null;
        }
        else {
            // ctx.fillRect(0,0,320,240); // fill the background (color still white)

            bg.draw();
            
            mp.draw();

            nb.draw();
            f.drawStr("FREDDYCLEMENT.COM v0.1", 5, 5);

            //drawLine(5, 17, 315, 17, 4, "#000");
            drawLine(5, 220, 315, 220, 4, "#000");
            //drawLine(6, 17, 314, 17, 2, "#FFF");
            drawLine(6, 220, 314, 220, 2, "#FFF");

            progressBar.draw();

            f.drawStr(mp.pageList[mp.currPage].title, 5, 224);
        }

        ctx.scale(-w/320, -h/240);

        frame += 1;
    };

    this.getBGManager = function () {
        return bg;
    }
};


window.onload = function () {
    siteCanvas.canvas = document.getElementById('myCanvas');
    siteCanvas.preload();
};

