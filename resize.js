const { createCanvas, Image } = require('canvas');
const request = require('request');

function resize(imgUrl, height, cb) {
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
      height = height || srcHeight;

      const targetWidth = srcWidth / srcHeight * height;

      const canvas = createCanvas(targetWidth, parseInt(height, 10));
      const ctx = canvas.getContext('2d');
      ctx.patternQuality = 'bilinear';
      ctx.filter = 'bilinear';
      ctx.antialias = 'subpixel';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(source, 0, 0, targetWidth, height);

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
