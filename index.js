import express from 'express';
const app = express();
const LISTEN_PORT = process.env.IMGRESIZE_PORT || 3333;

import resize from './resize.js';

app.get('*', async (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  const imageUrl = Buffer.from(req.path.slice(1), 'base64').toString('utf8');

  const image = await resize(
    imageUrl,
    req.query.width,
    req.query.height,
    req.query.keepRatio,
  );

  res.send(image)
});

app.listen(LISTEN_PORT, () =>
  console.log('Application listening on port', LISTEN_PORT)
);
