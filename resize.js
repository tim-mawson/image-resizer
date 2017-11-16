const { createCanvas, Image } = require("canvas");
const request = require("request");

function resize(imgUrl, height, cb) {
  request(imgUrl, { encoding: null }, (err, res) => {
    const source = new Image();
    source.src = res.body;

    const srcHeight = source.height;
    const srcWidth = source.width;
    const targetWidth = srcWidth / srcHeight * height;
    const canvas = createCanvas(targetWidth, parseInt(height, 10));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0, targetWidth, height);

    const out = canvas.toBuffer((err, buf) => {
      if (err) {
        throw err;
      }

      cb(buf);
    });
  });
}

module.exports = resize;
