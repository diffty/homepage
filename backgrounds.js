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

    that.setVideo = function (newVideoURL, noPlay) {
        that.videoElmt.src = newVideoURL;

        if (!noPlay) {
            siteCanvas.getBGManager().switchBG(0, false);

            that.videoElmt.oncanplay = function () {
                siteCanvas.getBGManager().switchBG(2, false);
                that.videoElmt.play();
            }
        }
    } 

    that.init();

    return that;
}

function backgroundLoading (options) {
    var that = {};

    that.ctx = options.ctx;
    that.image = options.image;
    that.f = 0;

    that.draw = function () {
        that.ctx.drawImage(that.image, Math.floor(Math.random() * 320), Math.floor(Math.random() * 240));
    }

    return that;
}

function backgroundCube (options) {
    var that = {};

    that.ctx = options.ctx;

    that.offCanvas = document.createElement('canvas');
    that.offCanvas.width = 320;
    that.offCanvas.height = 240;
    that.offCtx = that.offCanvas.getContext('2d');

    that.firstCubePos = {x: 0, y: 13};
    that.nextCubePos = {x: that.firstCubePos.x, y: that.firstCubePos.y};
    that.currCube = null;

    that.erasing = false;

    that.dissolveSpeed = 2;

    that.size = {w: 20, h: 17};

    var Cube = function (x, y, colors) {
        var that = {};

        that.init = function (x, y, colors) {
            that.reinitMove();
            that.pos = {x: 0, y: 0};
            that.colors = colors;
        }

        that.reinitMove = function () {
            that.animStartPos = null;
            that.animDestPos = null;

            that.animStartT = -1;
            that.animEndT = -1;
        }

        that.moveTo = function (fromPos, toPos, duration) {
            var currTime = new Date().getTime();

            that.animStartPos = fromPos;
            that.animDestPos = toPos;
            that.animStartT = currTime;
            that.animEndT = that.animStartT + duration;
        }

        that.drawCube = function (ctx, x, y) {
            ctx.save()
            ctx.translate(x, y);

            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.lineTo(10, 15);
            ctx.lineTo(10, 27);
            ctx.lineTo(0, 22);
            ctx.closePath();
            ctx.fillStyle = "hsl(" + that.colors[0].r + ",50%,70%)";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(10, 15);
            ctx.lineTo(20, 10);
            ctx.lineTo(20, 22);
            ctx.lineTo(10, 27);
            ctx.closePath();
            ctx.fillStyle = "hsl(" + that.colors[0].r + ",50%,30%)";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.lineTo(10, 15);
            ctx.lineTo(20, 10);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.fillStyle = "hsl(" + that.colors[0].r + ",50%,60%)";
            ctx.fill();

            ctx.restore();
        }

        that.draw = function (ctx) {
            var currTime = new Date().getTime();

            if (that.animStartT != -1) {
                that.pos.x = Math.round(easeInOutQuad(currTime - that.animStartT, that.animStartPos.x, that.animDestPos.x - that.animStartPos.x, that.animEndT - that.animStartT));
                that.pos.y = Math.round(easeInOutQuad(currTime - that.animStartT, that.animStartPos.y, that.animDestPos.y - that.animStartPos.y, that.animEndT - that.animStartT));
                
                if (currTime > that.animEndT) {
                    that.pos = that.animDestPos;
                    that.reinitMove();
                }
            }

            that.drawCube(ctx, that.pos.x, that.pos.y);
        }

        that.init(x, y, colors);

        return that;
    }

    that.draw = function () {
        if (!that.erasing) {
            if (that.nextCubePos.y < 0) {
                that.erasing = true;
                that.currCube = null;
            }
            else {
                if (that.currCube == null) {
                    var cubePos = {x: that.nextCubePos.x * that.size.w, y: that.nextCubePos.y * that.size.h};

                    if (that.nextCubePos.y % 2 == 1) {
                        cubePos.x -= 10;
                    }

                    that.currCube = Cube(cubePos.x, 0, [{r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255)}, {r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255)}, {r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255)}]);
                    that.currCube.moveTo({x: cubePos.x, y: -30}, {x: cubePos.x, y: cubePos.y}, 100);

                    that.nextCubePos.x += 1;
                    
                    if (that.nextCubePos.x > 16) {
                        that.nextCubePos.x = 0;
                        that.nextCubePos.y -= 1;
                    }
                }

                if (that.currCube.animStartT == -1) {
                    that.currCube.draw(that.offCtx);
                    that.currCube = null;
                }
            }

            var offBuffImg = that.offCtx.getImageData(0, 0, 320, 240);
            that.ctx.putImageData(offBuffImg, 0, 0);

            if (that.currCube) {
                that.currCube.draw(that.ctx);
            }
        }
        else {
            var offBuffImg = that.offCtx.getImageData(0, 0, 320, 240);
            var dissolveFinished = true;

            for (var i = 320*240-1; i >= 320; i--) {
                var r = Math.floor(that.dissolveSpeed + Math.random() * 3);

                var currIdx = i*4;
                var prevIdx = i*4 - 320*4*r;

                offBuffImg.data[currIdx]   = offBuffImg.data[prevIdx];
                offBuffImg.data[currIdx+1] = offBuffImg.data[prevIdx+1];
                offBuffImg.data[currIdx+2] = offBuffImg.data[prevIdx+2];
                offBuffImg.data[currIdx+3] = offBuffImg.data[prevIdx+3];

                if (offBuffImg.data[currIdx] + offBuffImg.data[currIdx+1] + offBuffImg.data[currIdx+2] != 0) {
                    dissolveFinished = false;
                }
            }

            that.offCtx.putImageData(offBuffImg, 0, 0);
            that.ctx.putImageData(offBuffImg, 0, 0);

            if (dissolveFinished) {
                that.erasing = false;
                that.nextCubePos = {x: that.firstCubePos.x, y: that.firstCubePos.y};
            }
        }
    }

    return that;
}

function backgroundRaudrant (options) {
    var that = {};

    that.ctx = options.ctx;
    that.image = options.image;
    
    that.zoomPos = [{x: 69, y: 138}, {x: 114, y: 118}];

    that.imageList = [];

    that.spawnNewImage = function () {
        pivot = that.zoomPos[Math.floor(Math.random() * that.zoomPos.length)];

        that.imageList.push(ImageObject({
            ctx: that.ctx,
            image: that.image,
            position: {x: 320/2, y: 240/2},
            rotation: Math.floor(Math.random() * 359),
            scale: {x: 0.01, y: 0.01},
            pivot: pivot,
        }));
    }

    that.draw = function () {
        for (var i = 0; i < that.imageList.length; i++) {
            that.imageList[i].setSize(that.imageList[i].size.w * 1.05, that.imageList[i].size.h * 1.05);
            that.imageList[i].rot += 1;
            that.imageList[i].draw();
        }

        if (that.imageList.length == 1) {
            if (that.imageList[0].scale.x > 100) {
                that.spawnNewImage();
            }
        }
        else {
            if (that.imageList[1].scale.x > 50) {
                that.imageList.splice(0, 1);
            }
        }
    }

    that.spawnNewImage();

    return that;
}
