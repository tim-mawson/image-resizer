const express = require('express');
const app = express();
const LISTEN_PORT = process.env.IMGRESIZE_PORT || 3333;

const resize = require('./resize');

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  resize(
    req.query.url,
    req.query.width,
    req.query.height,
    req.query.keepRatio,
    img => res.send(img)
  );
});

app.listen(LISTEN_PORT, () =>
  console.log('Application listening on port', LISTEN_PORT)
);
