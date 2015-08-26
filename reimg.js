
window.ReImg = {

    OutputProcessor: function(encodedData) {
        return {
            toBase64: function() {
                return encodedData;
            },
            toImg: function() {
                var imgElement = document.createElement('img');
                imgElement.src = 'data:image/svg+xml;base64,' + encodedData;
                return imgElement;
            },
            toCanvas: function(callback) {
                // https://gist.github.com/gustavohenke/9073132
                var canvas = document.createElement('canvas');
                var canvasCtx = canvas.getContext('2d');

                var img = this.toImg();
                img.onload = function() {
                    canvasCtx.drawImage(img, 0, 0);
                    callback(canvas);
                };
            },
            downloadPng: function() {
                // http://stackoverflow.com/questions/6796974/force-download-an-image-using-javascript
                this.toCanvas(function(canvas) {
                    var imageData = canvas.toDataURL('image/png;base64');
                    imageData.replace('image/png', 'image/octet-stream');
                    window.location.href = imageData;
                });
            }
        };
    },

    fromSvg: function(svgElement) {
        var svgString = new XMLSerializer().serializeToString(svgElement);
        return new this.OutputProcessor(window.btoa(svgString));
    }

};

//var img = ReImg.fromSvg(mySvg).toImg();
//var canvas = ReImg.fromSvg(mySvg).toCanvas();

//var base64 = ReImg.fromCanvas(myCanvas).toBase64();
