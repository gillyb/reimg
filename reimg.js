ReImg = {

    OutputProcessor: function(encodedData, svgElement) {

        var isPng = function() {
            return encodedData.indexOf('data:image/png') === 0;
        };

        var downloadImage = function(data, filename) {
            var a = document.createElement('a');
            a.href = data;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
        };

        return {
            toBase64: function() {
                return encodedData;
            },
            toImg: function() {
                var imgElement = document.createElement('img');
                imgElement.src = encodedData;
                return imgElement;
            },
            toCanvas: function(callback) {
                var canvas = document.createElement('canvas');
                var boundedRect = svgElement.getBoundingClientRect();
                canvas.width = boundedRect.width;
                canvas.height = boundedRect.height;
                var canvasCtx = canvas.getContext('2d');

                var img = this.toImg();
                img.onload = function() {
                    canvasCtx.drawImage(img, 0, 0);
                    callback(canvas);
                };
            },
            toPng: function() {
                if (isPng()) {
                    var img = document.createElement('img');
                    img.src = encodedData;
                    return img;
                }

                this.toCanvas(function(canvas) {
                    var img = document.createElement('img');
                    img.src = canvas.toDataURL();
                    return img;
                });
            },
            toJpeg: function(quality) { // quality should be between 0-1
                quality = quality || 1.0;
                (function(q) {
                    this.toCanvas(function(canvas) {
                        var img = document.createElement('img');
                        img.src = canvas.toDataURL('image/jpeg', q);
                        return img;
                    });
                })(quality);
            },
            downloadPng: function(filename) {
                filename = filename || 'image.png';
                if (isPng()) {
                    // it's a canvas already
                    downloadImage(encodedData, filename);
                    return;
                }

                // convert to canvas first
                this.toCanvas(function(canvas) {
                    downloadImage(canvas.toDataURL(), filename);
                });
            }
        };
    },

    fromSvg: function(svgElement) {
        var svgString = new XMLSerializer().serializeToString(svgElement);
        return new this.OutputProcessor('data:image/svg+xml;base64,' + window.btoa(svgString), svgElement);
    },

    fromCanvas: function(canvasElement) {
        var dataUrl = canvasElement.toDataURL();
        return new this.OutputProcessor(dataUrl);
    }

};

if(typeof exports === 'object' && typeof module !==  void 0) {
    module.exports = {
        ReImg:ReImg
    };
}

else {
    window.ReImg = ReImg;
}