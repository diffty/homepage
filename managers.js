// BACKGROUND MANAGER
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

// RESSOURCE MANAGER
function ressourceImg (options) {
    var that = {};

    that.loaded = false;
    that.manager = options.manager;
    that.url = options.url;
    that.name = that.url.slice(that.url.lastIndexOf("/")+1, that.url.lastIndexOf("."));

    that.data = new Image();
    that.data.src = that.url;
    
    that.allLoaded = false;

    that.data.onload = function () {
        that.loaded = true;
        that.manager.onRscLoaded(that);
    }

    return that;
}

function ressourceManager (options) {
    var that = {};

    that.rscList = [];
    that.rscNameList = [];

    that.rscIndex = {}

    if (options.hasOwnProperty("onAllLoaded"))
        that.onAllLoaded = options.onAllLoaded;
    else
        that.onAllLoaded = null;

    if (options.hasOwnProperty("onEachResourceLoaded"))
        that.onEachResourceLoaded = options.onEachResourceLoaded;
    else
        that.onEachResourceLoaded = null;

    that.allLoaded = true;


    that.addImg = function (url) {
        that.allLoaded = false;

        newRsc = new ressourceImg({
            manager: that,
            url: url,
        });

        that.rscList.push(newRsc);
        that.rscNameList.push(newRsc.name);
    }

    that.getRsc = function (rscName) {
        var rscIdx = that.rscNameList.indexOf(rscName);

        if (rscIdx != -1) {
            return that.rscList[rscIdx];
        }
        else {
            throw "Ressource " + rscName + " doesn't exists."
        }
    }

    that.getRscData = function (rscName) {
        return that.getRsc(rscName).data;
    }
    
    that.onRscLoaded = function (rsc) {
        var newAllLoaded = true;

        for (var i = 0; i < that.rscList.length; i++) {
            if (that.rscList[i].loaded == false) {
                newAllLoaded = false;
                break;
            }
        }

        if (newAllLoaded) {
            that.allLoaded = newAllLoaded;

            if (that.onAllLoaded != null)
                that.onAllLoaded();
        }

        if (that.onEachResourceLoaded != null) {
            that.onEachResourceLoaded(rsc);
        }
    }

    return that
} 
