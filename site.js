var f;
var fbig;
var ctx;
var btnImg;

var rscManager;


// -- SITE FUNCTION/CLASS --
function page1 (ctx) { 
    var p = page({ctx: ctx, title: "ACCUEIL"}); // scrollSpeed: 16
    var sp = page({ctx: ctx})

    var t = textWidget({
        text: "JE SUIS FREDDY\nJ'AI 25 ANS\nJE VEUX FAIRE LES JEUX VIDEOS",
        relPos: {x: 45, y: 30},
        font: fbig,
    });

    var t2 = textWidget({
        text: "Clique sur les boutons en haut a droite et t'en sauras plus.",
        relPos: {x: 42, y: 120},
        font: f,
    });

    var i = imageWidget({ctx: ctx, image: rscManager.getRscData("awesome"), relPos: {x: 0, y: 200}});

    sp.addWidget(t);
    sp.addWidget(t2);
    sp.addWidget(i);

    var sc = scrollableContainer({ctx: ctx, widget: sp, size: {w: 290, h: 180}})

    p.addWidget(sc);

    return p;
}

function page2 (ctx) { 
    p = page({ctx: ctx, title: "COMPETENCES"});

    // Sliding detail page
    var sp = slidingPage({ctx: ctx, parent: p, unfoldedRelPos: {x: 135, y: 0}, foldedRelPos: {x: 320, y: 0}, size: {w: 160, h: 180}});

    var sp1 = textWidget({ctx: ctx, font: f, text: "", parent: sp, relPos: {x: 0, y: 0}});
    var psp = page({ctx: ctx});

    psp.addWidget(sp1)
    sp.setPage(psp);

    // Skillz widgetz
    var gl = gridLayout({ctx: ctx, nbColumns: 2, nbRows: 1, spaceH: 5, spaceW: 5, maxWidth: 290, maxHeight: 180});

    var s1 = skillWidget({ctx: ctx, title: "UNREAL", font: f, titleFont: fbig, image: rscManager.getRscData("unreal"), value: 3});
    var s2 = skillWidget({ctx: ctx, title: "PYTHON", font: f, titleFont: fbig, image: rscManager.getRscData("python"), value: 4});
    var s3 = skillWidget({ctx: ctx, title: "C", font: f, titleFont: fbig, image: rscManager.getRscData("c"), value: 3});
    var s4 = skillWidget({ctx: ctx, title: "C++", font: f, titleFont: fbig, image: rscManager.getRscData("cpp"), value: 3});
    var s5 = skillWidget({ctx: ctx, title: "MAYA", font: f, titleFont: fbig, image: rscManager.getRscData("maya"), value: 4});
    var s6 = skillWidget({ctx: ctx, title: "PHOTOSHOP", font: f, titleFont: fbig, image: rscManager.getRscData("photoshop"), value: 4});
    var s7 = skillWidget({ctx: ctx, title: "BLENDER", font: f, titleFont: fbig, image: rscManager.getRscData("blender"), value: 2});
    var s8 = skillWidget({ctx: ctx, title: "JAVASCRIPT", font: f, titleFont: fbig, image: rscManager.getRscData("blender"), value: 2});
    var s9 = skillWidget({ctx: ctx, title: "AFTER EFFECTS", font: f, titleFont: fbig, image: rscManager.getRscData("blender"), value: 3});

    s1.desc = "- maitrise de l'interface\n- utilisation extensive des blueprints pour la\nrealisation de plusieurs projets dans le cadre\nd'une game jam, d'un protoype personnel et\nd'un test graphique.\n- connaissance sommaire mais operationnnelle\ndu langage de programmation nodal de shaders"
    s2.desc = "- maitrise du langage pour scripts ponctuels\net applications completes\n- maitrise des concepts de POO au sein de Python\n- a maintenu et largement etendu un pipeline\ncomplet d'une production de serie animee\nsous maya 2012\n- a developpe quelques wrappers et libraries\nfacilitant l'utilisation et l'unification des\nsystemes (assets manager, render manager...)\nutilises en interne lors de cette production.\n- developpement de nombreux outils avec\ninterface graphique bases sur ces librairies."
    s3.desc = "- bases solides en programmation C.\n- a developpe quelques routines graphiques\nayant permis la realisation d'un petit prototype\nde jeu pour MS-DOS.\n"
    s4.desc = "- bases solides en programmation objet/C++.\n- utilisation sommaire de la librarie graphique SFML\n- a developpe un prototype de controleur MIDI\nvirtuel utilisant le trackpad d'un MacBook Pro,\nsous XCode et openFrameworks."
    s5.desc = "- maitrise de l'interface\n- maitrise de l'API Python\n- a fait evoluer, developpe et maintenu un\npipeline de serie d'animation 3D\n- maitrise des outils et workflows de\nmodelisation et d'animation\n- connaissances en setup/rigging\n- connaissances en rendu Mental Ray\n- a contribue a la realisation de 2 projets\nintensifs etudiants rendus sous Mental Ray\n- a realise 2 courts etudiants complets\nsous Mental Ray"
    s6.desc = "- maitrise de l'interface et des outils\n- pratique de la retouche photo\n- relativement a l'aise en texturing\n- quelques notions en digital painting"
    s7.desc = "- bases dans les workflows de modelisation,\ntexturing, rigging et rendus (sous Cycles\net Blender Render)\n- a effectue une mission de modelisation/retopo,\nanimation et rendu de pieces mecaniques."
    s8.desc = "- apprentissage conjoint a la realisation en\nquelques semaines de ce site et de son\nsysteme de contenu."
    s9.desc = "- maitrise de l'interface\n- confortable avec les expressions\n- utilise pour la post-production et les animations\nde tous les projets, d'integration, d'animation\nou de compositing realises."

    gl.addWidget(s1);
    gl.addWidget(s2);
    gl.addWidget(s3);
    gl.addWidget(s4);
    gl.addWidget(s5);
    gl.addWidget(s6);
    gl.addWidget(s7);
    gl.addWidget(s8);
    gl.addWidget(s9);
    
    var sc = scrollableContainer({ctx: ctx, widget: gl, size: {w: 290, h: 180}});

    var onSkillMouseDown = function () {
        sp1.text = this.desc;

        this.setRelPos(this.relPos.x - this.offsetX, this.relPos.y)
        this.wiggle = false;
        this.offsetX = 0.;

        if (gl.selectedWidget == this || gl.selectedWidget == null) {
            sp.triggerFold();
            gl.setNbColumns((gl.nbColumns % 2) + 1);
            sc.setSize(gl.size.w, sc.size.h)
        }

        if (gl.selectedWidget != null) {
            gl.selectedWidget.isSelected = false;

            gl.selectedWidget.setRelPos(gl.selectedWidget.relPos.x - gl.selectedWidget.offsetX, gl.selectedWidget.relPos.y);
            gl.selectedWidget.offsetX = 0.;
            gl.selectedWidget.setRelPos(gl.selectedWidget.relPos.x + gl.selectedWidget.offsetX, gl.selectedWidget.relPos.y);

        }

        if (sp.unfolded == false) {
            gl.selectedWidget = null;

            this.setRelPos(this.relPos.x - this.offsetX, this.relPos.y);
            this.offsetX = 0.;
        }
        else {
            gl.selectedWidget = this;
            this.isSelected = true;

            if (sc.overflow.y > 0) {
                if (sc.size.h + sc.scrollPos.y < gl.selectedWidget.relPos.y && sc.size.h + sc.scrollPos.y < gl.selectedWidget.relPos.y) {
                    sc.gotoScrollPos({x: sc.scrollPos.x, y: Math.max(0, gl.selectedWidget.relPos.y - sc.size.h + gl.selectedWidget.size.h)})
                }
            }

            var newRelPos = {x: this.relPos.x - this.offsetX + 10., y: this.relPos.y};
            this.offsetX = 10.;
            this.setRelPos(newRelPos.x, newRelPos.y);
        }
    }

    var onSkillStartMouseHover = function () {
        this.offsetX = 0.;
        this.wiggle = true;
        this.hoverStartTime = new Date().getTime();
    }

    var onSkillEndMouseHover = function () {}

    s1.onMouseDown = onSkillMouseDown;
    s2.onMouseDown = onSkillMouseDown;
    s3.onMouseDown = onSkillMouseDown;
    s4.onMouseDown = onSkillMouseDown;
    s5.onMouseDown = onSkillMouseDown;
    s6.onMouseDown = onSkillMouseDown;
    s7.onMouseDown = onSkillMouseDown;
    s8.onMouseDown = onSkillMouseDown;
    s9.onMouseDown = onSkillMouseDown;

    siteCanvas.registerWidgetForMouseHoverInput(s1);
    siteCanvas.registerWidgetForMouseHoverInput(s2);
    siteCanvas.registerWidgetForMouseHoverInput(s3);
    siteCanvas.registerWidgetForMouseHoverInput(s4);
    siteCanvas.registerWidgetForMouseHoverInput(s5);
    siteCanvas.registerWidgetForMouseHoverInput(s6);
    siteCanvas.registerWidgetForMouseHoverInput(s7);
    siteCanvas.registerWidgetForMouseHoverInput(s8);
    siteCanvas.registerWidgetForMouseHoverInput(s9);

    s1.onStartMouseHover = onSkillStartMouseHover;
    s2.onStartMouseHover = onSkillStartMouseHover;
    s3.onStartMouseHover = onSkillStartMouseHover;
    s4.onStartMouseHover = onSkillStartMouseHover;
    s5.onStartMouseHover = onSkillStartMouseHover;
    s6.onStartMouseHover = onSkillStartMouseHover;
    s7.onStartMouseHover = onSkillStartMouseHover;
    s8.onStartMouseHover = onSkillStartMouseHover;
    s9.onStartMouseHover = onSkillStartMouseHover;

    s1.onEndMouseHover = onSkillEndMouseHover;
    s2.onEndMouseHover = onSkillEndMouseHover;
    s3.onEndMouseHover = onSkillEndMouseHover;
    s4.onEndMouseHover = onSkillEndMouseHover;
    s5.onEndMouseHover = onSkillEndMouseHover;
    s6.onEndMouseHover = onSkillEndMouseHover;
    s7.onEndMouseHover = onSkillEndMouseHover;
    s8.onEndMouseHover = onSkillEndMouseHover;
    s9.onEndMouseHover = onSkillEndMouseHover;

    var onLayoutResize = function () {
        sc.updateOverflow();

        if (sc.scrollPos.y > sc.overflow.y) {
            sc.gotoScrollPos({x: sc.overflow.x, y: sc.overflow.y});
        }
    }

    gl.onResize = onLayoutResize;

    p.addWidget(sc);
    p.addWidget(sp);

    return p;
}

function page3 (ctx) {
    var p = page({ctx: ctx, title: "PROJETS"});
    var ps = pagePanelScroll({ctx: ctx, title: "PROJETS", size: {w: 290, h: 180}});

    var animSprSh = spritesheet({ctx: ctx, image: rscManager.getRscData("small-arrow-animated"), nbFrameW: 4, nbFrameH: 1});
    var arrowWidget = animatedImageWidget({ctx: ctx, sprSh: animSprSh, startFrame: 0, nbFrame: 2, animSpeed: 10, parent: ps, relPos: {x: 0, y: 168}})

    // "A videogame about hate and shit set in a medieval dystopian universe.\nPrototype made in 2 days during a game jam.\nBuilt on Unreal Engine 4."
    ps.addPanels([panel({ctx: ctx, title: "SHITTY HOLLOW", image: rscManager.getRscData("shittyhollow"), iconsList: ["unreal"], font: fbig, descfont: f,
                    desc: "Un jeu de combat medieval dystopique, abordant avec passion et energie\nles themes societaux de la haine et du caca.\n\nPrototype cree en 2 jours lors d'une game jam.\nConstruit via l'Unreal Engine 4."}),

                  panel({ctx: ctx, title: "BISOUNOURS PARTY", image: rscManager.getRscData("bp"), iconsList: ["sourcefilmmaker", "maya"], font: fbig, descfont: f,
                    desc: "Mod multijoueur pour Half-Life 2 sorti en 2009 puis laisse a l'abandon,\navant d'etre recupere par Louis \"Orygin\" Gueuten et moi-meme\nafin de lui donner les correctifs qu'il meritait.\n\nJ'ai realise l'integralite du trailer pour ce projet,\nde l'ecriture a l'animation, sous Source Filmmaker."}),

                  panel({ctx: ctx, title: "THE FRIENDZONE", image: rscManager.getRscData("the-friendzone"), iconsList: ["unity"], font: fbig, descfont: f,
                    desc: "Une experimentation realisee durant la game jam Ludum Dare 35.\n\nElle met en scene deux amis partageant la meme couchette,\nl'un ayant le sommeil agite et l'autre, controle par le joueur,\ndevant s'eloigner le plus possible de son camarade afin de ne\npas rendre leur relation \"etrange\"...\n\nDeveloppe en 2 jours par 3 personnes sous Unity.\nCe \"jeu\" termina a la 11e place de la LD, categorie Humour."}),

                  panel({ctx: ctx, title: "ARROWS IN CHAINS", image: rscManager.getRscData("arrows"), iconsList: ["pico8"], font: fbig, descfont: f,
                    desc: "Petite experimentation realisee durant la Pico-8 Jam #2,\nen une semaine, dont le theme etait Chain Reaction.\n\nIl s'agit de declencher la plus grande reaction en chaine,\nen selectionnant les cases d'une grille.\nChaque case correspondant a une fleche qui revelera celle\ndont la fleche pointe, et ainsi de suite."}),

                  panel({ctx: ctx, title: "KEBAB SIMULATOR (PROTOTYPE)", image: rscManager.getRscData("kebab"), iconsList: ["c", "msdos"], font: fbig, descfont: f,
                    desc: "Prototype/exercice realise dans le but d'apprendre\nle developpement de jeux videos \"a l'ancienne\" sous MS-DOS,\nen plus de m'interesser aux contraintes et problematiques\nqu'imposent les environnements et systemes de cette epoque.\n\nProgramme en C sous Turbo-C, avec l'aide seule de dos.h,\ndiverses libraries standards, ainsi que DOSBox pour l'execution."}),

                  panel({ctx: ctx, title: "LE DEFILE", image: rscManager.getRscData("kebab"), iconsList: ["maya"], font: fbig, descfont: f,
                    desc: "Projet intensif de court metrage d'animation realise en 3 semaines.\n\nJ'ai modelise, rigge, texture, anime, et rendu integralement l'un des\n3 personnages de ce court metrage, ainsi qu'effectue le compositing\nsous After Effects.\n\nRealise au sein d'une equipe de 3 personnes, rendu sous Mental Ray."}),

                  panel({ctx: ctx, title: "PROCESS", image: rscManager.getRscData("kebab"), iconsList: ["maya", "python"], font: fbig, descfont: f,
                    desc: "Projet intensif de court metrage d'animation realise en 3 semaines.\n\nJ'ai modelise les patrons en papier, effectue leur setup via un auto-rig\nprogramme pour l'occasion, puis anime leur pliage et assemblage pour\nformer la machine.\n\nRealise au sein d'une equipe de 5 personnes, rendu sous Mental Ray"})]);


    ps.panelList[0].showImage = false;

    hideVid = function () {
        siteCanvas.getBGManager().bgList[4].setVideo();
        this.showImage = true;
    }

    ps.panelList[0].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/shittyhollow.mov");
        this.showImage = false;
    }

    ps.panelList[1].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/bp.mp4");
        this.showImage = false;
    }

    ps.panelList[2].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/the-friendzone.mov");
        this.showImage = false;
    }

    ps.panelList[3].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/arrows.mov");
        this.showImage = false;
    }

    ps.panelList[4].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/kebab.mov");
        this.showImage = false;
    }

    ps.panelList[5].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/le-defile.mov");
        this.showImage = false;
    }

    ps.panelList[6].onGoTo = function () {
        siteCanvas.getBGManager().bgList[4].setVideo("media/process.mov");
        this.showImage = false;
    }

    //ps.panelList[2].onGoTo = hideVid;

    p.onGoTo = function () {
        siteCanvas.getBGManager().switchBG(4, true);
    };

    p.onLeave = function () {
        siteCanvas.getBGManager().switchBG(2 + Math.floor(Math.random() * 2), true);
    };

    var slidingPageWidget = slidingPage({ctx: ctx, parent: p, unfoldedRelPos: {x: 0, y: 20}, foldedRelPos: {x: 0, y: 180}, size: {w: 160, h: 180}});  
    var descPage = page({ctx: ctx});
    var descTextWidget = textWidget({ctx: ctx, font: f, text: ps.panelList[0].desc, parent: descPage, relPos: {x: 10, y: 0}});
    var dummy = dummyWidget({size: {w: 270, h: 180}, parent: p});

    ps.onChange = function () {
        descTextWidget.text = ps.panelList[ps.currPanel].desc;
    }

    dummy.onMouseDown = function () {
        slidingPageWidget.triggerFold();
        
        if (slidingPageWidget.unfolded)
            arrowWidget.setStartFrame(2);
        else
            arrowWidget.setStartFrame(0);
    }

    slidingPageWidget.setPage(descPage);

    descPage.addWidget(descTextWidget);

    p.addWidget(dummy);
    p.addWidget(ps);
    p.addWidget(slidingPageWidget);
    p.addWidget(arrowWidget);

    return p;
}

function page4 (ctx) { 
    var p = page({ctx: ctx, scrollSpeed: 60, title: "EXPERIENCE PROFESSIONNELLE"});
    var gl = gridLayout({ctx: ctx, nbColumns: 1, nbRows: 1, spaceH: 5, spaceW: 5, maxWidth: 290, maxHeight: 180});

    var xp5 = expProWidget({
        ctx: ctx,
        companyName: "WHIRLPOOL",
        title: "STAGIAIRE INFORMATIQUE\nDEVELOPPEMENT/MAINTENANCE",
        desc: "Stage facultatif de 6 semaines.\n\nJ'ai effectue des missions de fabrication de nouvelles applications\nintranet en ASP.NET et effectue la migration de vieilles\napps ASP ainsi que leur maintenance.",
        image: rscManager.getRscData("whirlpool"),
        year1: 2009,
        month1: 7, 
        year2: 2009,
        month2: 8,
        relPos: {x: 0, y: 240},
        titleFont: fbig,
        font: f,
    });

    var xp4 = expProWidget({
        ctx: ctx,
        companyName: "CHU AMIENS",
        title: "STAGIAIRE R&D\nRECHERCHE BIOPHYSIQUE\nTRAITEMENT D'IMAGES IRM",
        desc: "Stage obligatoire de fin d'etudes d'une duree de 4 mois.\n\nJ'y ai developpe un algorithme de voxelisation puis\nvectorisation automatique d'un arbre vasculaire cerebral,\ngenere a partir d'une serie d'image IRM.",
        image: rscManager.getRscData("chu"),
        year1: 2010,
        month1: 4, 
        year2: 2010,
        month2: 7,
        relPos: {x: 0, y: 180},
        titleFont: fbig,
        font: f,
    });

    var xp3 = expProWidget({
        ctx: ctx,
        companyName: "SOLIDANIM",
        title: "STAGIAIRE R&D\nTRAITEMENT D'IMAGES EN TEMPS REEL",
        desc: "Stage obligatoire d'une duree de 3 mois.\n\nJ'y ai developpe un prototype d'algorithme de\ndeflicking d'images super-slow motion en temps reel, en\nutilisant C++, OpenCV, et les fonctionnalitees GPU de ce\ndernier.",
        image: rscManager.getRscData("solidanim"),
        year1: 2011,
        month1: 6, 
        year2: 2011,
        month2: 9,
        relPos: {x: 0, y: 120},
        titleFont: fbig,
        font: f,
    });

    var xp2 = expProWidget({
        ctx: ctx,
        companyName: "TEAMTO",
        title: "STAGIAIRE R&D\nDEVELOPPEMENT OUTILS\nGUS",
        desc: "Stage obligatoire d'une duree de 3 mois.\n\nJ'ai effectue de multiples taches afin d'aider le quotidien\ndes graphistes sur diverses productions, delestant le travail\ndes developpeurs et data managers titulaires, que ce soit du\nsimple script Maya a l'amelioration des briques et outils du\npipeline historique de la societe.",
        image: rscManager.getRscData("teamto"),
        year1: 2012,
        month1: 6, 
        year2: 2012,
        month2: 8,
        relPos: {x: 0, y: 60},
        titleFont: fbig,
        font: f,
    });

    var xp1 = expProWidget({
        ctx: ctx,
        companyName: "TEAMTO",
        title: "Developpeur pipeline/Data manager\nPyjamasques Saison 1",
        desc: "Durant toute la fabrication de la saison,\nJ'ai developpe divers outils pour les graphistes et mis\nen place l'ensemble du pipeline et automatisation de taches.",
        image: rscManager.getRscData("teamto"),
        year1: 2012,
        month1: 11,
        year2: 2015,
        month2: 12,
        relPos: {x: 0, y: 0},
        titleFont: fbig,
        font: f,
    });

    gl.addWidget(xp1);
    gl.addWidget(xp2);
    gl.addWidget(xp3);
    gl.addWidget(xp4);
    gl.addWidget(xp5);

    var sc = scrollableContainer({ctx: ctx, widget: gl, size: {w: 290, h: 180}});

    var resizeFunc = function () {
        gl.updateWidgetsPos();
        sc.updateRect();
        sc.updateSize();
        sc.updateOverflow();
    }

    xp1.onResize = resizeFunc;
    xp2.onResize = resizeFunc;
    xp3.onResize = resizeFunc;
    xp4.onResize = resizeFunc;
    xp5.onResize = resizeFunc;

    // Mouse down event handlin'
    var onExpProMouseDown = function () {
        // Hiding all descriptions before showing the current one
        for (var i = 0; i < gl.children.length; i++) {
            if (gl.children[i].isDescriptionVisible && this != gl.children[i])
                gl.children[i].hideDescription();
        }

        this.triggerDescription();

        var imageWidget = this.children[0];
        imageWidget.setRelPos(imageWidget.relPos.x - this.offsetX, imageWidget.relPos.y)

        this.updateRect();
        this.updateSize();

        this.wiggle = false;
        this.offsetX = 0.;

        if (this.isDescriptionVisible && this.relPos.y + this.size.h > sc.size.h + sc.scrollPos.y) {
            sc.gotoScrollPos({x: sc.scrollPos.x, y: this.relPos.y + this.size.h - sc.size.h});
        }
    }

    // Mouse hover handlin'
    var onExpProStartMouseHover = function () {
        this.offsetX = 0.;
        this.wiggle = true;
        this.hoverStartTime = new Date().getTime();
    }

    var onExpProEndMouseHover = function () {}

    siteCanvas.registerWidgetForMouseHoverInput(xp1);
    siteCanvas.registerWidgetForMouseHoverInput(xp2);
    siteCanvas.registerWidgetForMouseHoverInput(xp3);
    siteCanvas.registerWidgetForMouseHoverInput(xp4);
    siteCanvas.registerWidgetForMouseHoverInput(xp5);

    xp1.onMouseDown = onExpProMouseDown;
    xp2.onMouseDown = onExpProMouseDown;
    xp3.onMouseDown = onExpProMouseDown;
    xp4.onMouseDown = onExpProMouseDown;
    xp5.onMouseDown = onExpProMouseDown;

    xp1.onStartMouseHover = onExpProStartMouseHover;
    xp2.onStartMouseHover = onExpProStartMouseHover;
    xp3.onStartMouseHover = onExpProStartMouseHover;
    xp4.onStartMouseHover = onExpProStartMouseHover;
    xp5.onStartMouseHover = onExpProStartMouseHover;

    xp1.onEndMouseHover = onExpProEndMouseHover;
    xp2.onEndMouseHover = onExpProEndMouseHover;
    xp3.onEndMouseHover = onExpProEndMouseHover;
    xp4.onEndMouseHover = onExpProEndMouseHover;
    xp5.onEndMouseHover = onExpProEndMouseHover;

    p.addWidget(sc);

    return p;
}

function page5 (ctx) { 
    var p = page({ctx: ctx, scrollSpeed: 60, title: "ETUDES"});
    var gl = gridLayout({ctx: ctx, nbColumns: 1, nbRows: 1, spaceH: 10, spaceW: 5, maxWidth: 290, maxHeight: 180});

    var xp5 = expProWidget({
        ctx: ctx,
        companyName: "LYCEE DE LA COTE D'ALBATRE",
        title: "Baccalaureat Scientifique option Sciences de l'Ingenieur\nDiplome obtenu - Mention Bien",
        desc: "",
        image: rscManager.getRscData("lycee"),
        year1: 2005,
        month1: 9, 
        year2: 2008,
        month2: 6,
        relPos: {x: 0, y: 120},
        titleFont: fbig,
        font: f,
    });

    var xp4 = expProWidget({
        ctx: ctx,
        companyName: "IUT AMIENS",
        title: "Departement Informatique\nOption Imagerie Numerique",
        desc: "Formation preparant aux metiers de l'informatique.\nJ'y ai perfectionne mes connaissances en programmation,\nsystemes d'information, et ai appris de nombreuses notions\nfondamentales pour l'imagerie numeriques.",
        image: rscManager.getRscData("iut"),
        year1: 2008,
        month1: 9, 
        year2: 2010,
        month2: 6,
        relPos: {x: 0, y: 60},
        titleFont: fbig,
        font: f,
    });

    var xp3 = expProWidget({
        ctx: ctx,
        companyName: "ATI - Paris VIII",
        title: "Arts et Technologies de l'Image\nNiveau Master obtenu - Mention Bien",
        desc: "Formation enseignant l'ensemble des etapes de fabrication\nd'un court metrage d'animation ou a effets speciaux, ainsi\nque la programmation Python/C++ dans le cadre du scripting\ndes logiciels de production ou de la realisation de jeux video.",
        image: rscManager.getRscData("ati"),
        year1: 2010,
        month1: 6, 
        year2: 2013,
        month2: 9,
        relPos: {x: 0, y: 0},
        titleFont: fbig,
        font: f,
    });

    gl.addWidget(xp3);
    gl.addWidget(xp4);
    gl.addWidget(xp5);

    var sc = scrollableContainer({ctx: ctx, widget: gl, size: {w: 290, h: 180}});

    var resizeFunc = function () {
        gl.updateWidgetsPos();
        sc.updateRect();
        sc.updateSize();
        sc.updateOverflow();
    }

    xp3.onResize = resizeFunc;
    xp4.onResize = resizeFunc;
    xp5.onResize = resizeFunc;

    // Mouse down event handlin'
    var onExpProMouseDown = function () {
        // Hiding all descriptions before showing the current one
        for (var i = 0; i < gl.children.length; i++) {
            if (gl.children[i].isDescriptionVisible && this != gl.children[i])
                gl.children[i].hideDescription();
        }

        this.triggerDescription();

        var imageWidget = this.children[0];
        imageWidget.setRelPos(imageWidget.relPos.x - this.offsetX, imageWidget.relPos.y)

        this.updateRect();
        this.updateSize();
        
        this.wiggle = false;
        this.offsetX = 0.;

        if (this.isDescriptionVisible && this.relPos.y + this.size.h > sc.size.h + sc.scrollPos.y) {
            sc.gotoScrollPos({x: sc.scrollPos.x, y: this.relPos.y + this.size.h - sc.size.h});
        }
    }

    // Mouse hover handlin'
    var onExpProStartMouseHover = function () {
        this.offsetX = 0.;
        this.wiggle = true;
        this.hoverStartTime = new Date().getTime();
    }

    var onExpProEndMouseHover = function () {}

    siteCanvas.registerWidgetForMouseHoverInput(xp3);
    siteCanvas.registerWidgetForMouseHoverInput(xp4);
    siteCanvas.registerWidgetForMouseHoverInput(xp5);

    xp3.onMouseDown = onExpProMouseDown;
    xp4.onMouseDown = onExpProMouseDown;
    xp5.onMouseDown = onExpProMouseDown;

    xp3.onStartMouseHover = onExpProStartMouseHover;
    xp4.onStartMouseHover = onExpProStartMouseHover;
    xp5.onStartMouseHover = onExpProStartMouseHover;

    xp3.onEndMouseHover = onExpProEndMouseHover;
    xp4.onEndMouseHover = onExpProEndMouseHover;
    xp5.onEndMouseHover = onExpProEndMouseHover;

    p.addWidget(sc);

    return p;
}

function page6 (ctx) { 
    var p = page({ctx: ctx, title: "A PROPOS"}); // scrollSpeed: 16
    var sp = page({ctx: ctx})

    var t1 = textWidget({
        text: "QUI ES-TU ?",
        relPos: {x: 0, y: 0},
        font: fbig,
    });

    var t2 = textWidget({
        text: "Je suis Freddy Clement, et je cherche du travail.",
        relPos: {x: 0, y: 20},
        font: f,
    });

    var t3 = textWidget({
        text: "COMMENT EST FAIT CE SITE ?!",
        relPos: {x: 0, y: 50},
        font: fbig,
    });

    var t4 = textWidget({
        text: "Integralement en Javascript, dessine dans un Canvas HTML5.\nTout est fait main, from scratch, du framework code pour l'occasion\na la typo, en passant par les icones !",
        relPos: {x: 0, y: 70},
        font: f,
    });

    var t5 = textWidget({
        text: "POURQUOI UN SITE EN FULL JS/CANVAS ?",
        relPos: {x: 0, y: 110},
        font: fbig,
    });

    var t6 = textWidget({
        text: "J'aime pas le CSS.\nOu plutot je deteste le CSS.\nEt puis je trouvais ca plus rigolo et formateur de faire ca a la maniere\nd'un jeu video, ou du moins d'une vraie application graphique !",
        relPos: {x: 0, y: 130},
        font: f,
    });

    var t7 = textWidget({
        text: "JE PEUX VOIR LE CODE ???",
        relPos: {x: 0, y: 180},
        font: fbig,
    });

    var t8 = textWidget({
        text: "Il est un peu degueu, car ecrit en vitesse.\nJ'ai mis quelque chose comme 3 semaines a tout faire, sans compter\nles jours de grippe/hangover. (:\nDonc ok, jette un oeil si tu trouves mon GitHub, mais je donnerai pas\nle lien tant que j'aurais pas refacto, histoire de me deresponsabiliser\nde tout saignement oculaire. :>",
        relPos: {x: 0, y: 200},
        font: f,
    });

    var t9 = textWidget({
        text: "ET SINON, A PART CA ?",
        relPos: {x: 0, y: 270},
        font: fbig,
    });

    var t10 = textWidget({
        text: "J'ecoute des tetratonnes de musiques, tous genres confondus,\ndes fois je prends des photos, joue a plein de jeux videos solo, bade\nquand un petit enfant casse ou perd son jouet, lis des manuels de\nprogrammation pour Macintosh Plus aux toilettes, reponds aux ordres\nd'un animal felin de sexe feminin, collectionne les vieux ordinateurs\net vieilles consoles, et adore tenter de programmer des trucs dessus.",
        relPos: {x: 0, y: 290},
        font: f,
    });

    sp.addWidget(t1);
    sp.addWidget(t2);
    sp.addWidget(t3);
    sp.addWidget(t4);
    sp.addWidget(t5);
    sp.addWidget(t6);
    sp.addWidget(t7);
    sp.addWidget(t8);
    sp.addWidget(t9);
    sp.addWidget(t10);

    var sc = scrollableContainer({ctx: ctx, widget: sp, size: {w: 290, h: 180}})

    p.addWidget(sc);

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
    this.registeredMouseHoverInputWidgetList = [];

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
        "img/msdos.png",
        "img/pico8.png",
        "img/sourcefilmmaker.png",
        "img/unity.png",
        
        "img/small-arrow-animated.png",

        "img/bubble-l.png",
        "img/bubble-r.png",
        "img/bubble-t.png",
        "img/bubble-b.png",
        "img/bubble-tl.png",
        "img/bubble-tr.png",
        "img/bubble-bl.png",
        "img/bubble-br.png",
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
        ctx.msImageSmoothingEnabled = false;

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
            absPos: {x: 245, y: 5},
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 0,
            sprOffId: 1,
            sprHoverId: 1,
            state: true,
            label: "Accueil",
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 2,
            sprOffId: 3,
            sprHoverId: 2,
            label: "Projets",
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 4,
            sprOffId: 5,
            sprHoverId: 4,
            label: "Competences",
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 6,
            sprOffId: 7,
            sprHoverId: 6,
            label: "Parcours pro",
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 8,
            sprOffId: 9,
            sprHoverId: 8,
            label: "Etudes",
            callback: this.onNavbarBtnChange,
        });

        nb.createButton({
            spritesheet: btnSprSh,
            sprOnId: 10,
            sprOffId: 11,
            sprHoverId: 10,
            label: "A propos de",
            callback: this.onNavbarBtnChange,
        });

        // -- PAGE SETUP --
        mp = multipage({
            ctx: ctx,
            absPos: {x: 10, y: 30},
            size: {w: 290, h: 180},
        });

        mp.addPages([page1(ctx), page3(ctx), page2(ctx), page4(ctx), page5(ctx), page6(ctx)]);

        bg.addBG(backgroundFractal({ctx: ctx}));
        bg.addBG(backgroundPerlin({ctx: ctx}));
        bg.addBG(backgroundVideo({ctx: ctx}));
        bg.addBG(backgroundCube({ctx: ctx}));
        bg.switchBG(5);

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

        ctx.canvas.addEventListener('wheel', function (e) {
            siteCanvas.onWheel(e);
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
            var widget = this.registeredMouseInputWidgetList[i];

            if (widget.hasOwnProperty("onMouseMove") == true) {
                widget.onMouseMove(mousePos);
            }
        }

        for (var i = 0; i < this.registeredMouseHoverInputWidgetList.length; i++) {
            var widget = this.registeredMouseHoverInputWidgetList[i];

            if (widget.rect.l <= mousePos.x && mousePos.x <= widget.rect.r
             && widget.rect.t <= mousePos.y && mousePos.y <= widget.rect.b) {
                if (!widget.hovered) {
                    widget.hovered = true;
                    widget.onStartMouseHover(mousePos);
                }
            }
            else {
                if (widget.hovered) {
                    widget.hovered = false;
                    widget.onEndMouseHover(mousePos);
                }
            }
        }
    }

    this.onMouseUp = function (e) {
        var mousePos = getMousePos(ctx.canvas, e);

        for (var i = 0; i < this.registeredMouseInputWidgetList.length; i++) {
            var widget = this.registeredMouseInputWidgetList[i];

            if (widget.hasOwnProperty("onMouseUp") == true) {
                widget.onMouseUp(mousePos);
            }
        }
    }

    this.onWheel = function (e) {
        var mousePos = getMousePos(ctx.canvas, e);

        for (var i = 0; i < widgetList.length; i++) {
            if (widgetList[i].rect.l <= mousePos.x && mousePos.x <= widgetList[i].rect.r
             && widgetList[i].rect.t <= mousePos.y && mousePos.y <= widgetList[i].rect.b) {
                if (widgetList[i].hasOwnProperty("onWheel") == true) {
                    widgetList[i].onWheel(mousePos, {x: e.deltaX, y: e.deltaY});
                }
            }
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

    this.registerWidgetForMouseHoverInput = function (w) {        
        if (this.registeredMouseHoverInputWidgetList.indexOf(w) == -1)
            this.registeredMouseHoverInputWidgetList.push(w);
    }

    this.unregisterWidgetForMouseHoverInput = function (w) {
        var widgetIdx = this.registeredMouseHoverInputWidgetList.indexOf(w);

        if (widgetIdx != -1)
            this.registeredMouseHoverInputWidgetList.splice(widgetIdx, 1);
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
        if (e.keyCode == 88) { // X
            mp.pageList[mp.currPage].highlighted = !mp.pageList[mp.currPage].highlighted;
        }
        if (e.keyCode == 67) { // C
            var wId = mp.pageList[mp.currPage].currentSelectedWidgetId;

            mp.pageList[mp.currPage].children[wId].updateSize();
            mp.pageList[mp.currPage].updateOverflow();
        }
        if (e.keyCode == 86) { // V
            if (mp.pageList[2].children[0].nbColumns == 1)
                mp.pageList[2].children[0].setNbColumns(2);
            else
                mp.pageList[2].children[0].setNbColumns(1);

            mp.pageList[2].updateOverflow();
        }
        if (e.keyCode == 188) { // ,
            mp.pageList[2].children[mp.pageList[2].children.length-1].triggerFold();
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

            //drawLine(5, 17, 315, 17, 4, "#000");
            drawLine(5, 220, 315, 220, 4, "#000");
            //drawLine(6, 17, 314, 17, 2, "#FFF");
            drawLine(6, 220, 314, 220, 2, "#FFF");

            progressBar.draw();

            nb.draw();
            f.drawStr("FREDDYCLEMENT.COM v0.1", 5, 5);

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

