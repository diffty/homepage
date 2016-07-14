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

function backgroundLoading (options) {
    var that = {};

    that.ctx = options.ctx;
    that.loadFinished = false;

    that.init = function () {
        that.loadingImg = new Image();
        that.loadingImg.src = "img/loading.png";
        
        that.loadingImg.onload = function () {
            that.loadFinished = true;
        };
    }

    that.draw = function () {
        if (that.loadFinished)
            that.ctx.drawImage(that.loadingImg, Math.floor(Math.random() * 320), Math.floor(Math.random() * 240));
    }

    that.init();

    return that;
}
