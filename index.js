const express = require('express');
const app = express();
const LISTEN_PORT = process.env.IMGRESIZE_PORT || 3333;

app.use(require('express-status-monitor')());

const resize = require('./resize');

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  const imageUrl = Buffer.from(req.path.slice(1), 'base64').toString('utf8');

  resize(
    imageUrl,
    req.query.width,
    req.query.height,
    req.query.keepRatio,
    img => res.send(img)
  );
});

app.listen(LISTEN_PORT, () =>
  console.log('Application listening on port', LISTEN_PORT)
);
