const { createCanvas, Image } = require('canvas');
const request = require('request');

function resize(imgUrl, width, height, keepRatio, cb) {
  request(imgUrl, { encoding: null }, (err, res) => {
    if (err) {
      throw new Error(err);
    }

    const source = new Image();

    source.onerror = err => {
      throw new Error(err);
    };

    source.onload = () => {
      const srcHeight = source.height;
      const srcWidth = source.width;
      let targetWidth, targetHeight;

      if (width && height && keepRatio) {
        let wRatio = 1,
          hRatio = 1;

        if (srcWidth > srcHeight) {
          if (!(srcWidth <= width && srcHeight <= height)) {
            hRatio = height / srcHeight;
            wRatio = width / srcWidth;
          }
        } else {
          if (!(srcHeight <= width && srcWidth <= height)) {
            wRatio = height / srcHeight;
            hRatio = width / srcWidth;
          }
        }

        let ratio = Math.min(wRatio, hRatio);
        targetWidth = srcWidth * ratio;
        targetHeight = srcHeight * ratio;
      } else {
        if (!width && !height) {
          targetWidth = srcWidth;
          targetHeight = srcHeight;
        } else if (!width) {
          targetWidth = srcWidth / srcHeight * height;
          targetHeight = parseInt(height, 10);
        } else if (!height) {
          targetHeight = srcHeight / srcWidth * width;
          targetWidth = parseInt(width, 10);
        } else {
          targetWidth = parseInt(width, 10);
          targetHeight = parseInt(height, 10);
        }
      }

      const canvas = createCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext('2d');
      ctx.patternQuality = 'bilinear';
      ctx.filter = 'bilinear';
      ctx.antialias = 'subpixel';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

      const out = canvas.toBuffer((err, buf) => {
        if (err) {
          throw err;
        }

        cb(buf);
      });
    };

    source.src = res.body;
  });
}

module.exports = resize;
