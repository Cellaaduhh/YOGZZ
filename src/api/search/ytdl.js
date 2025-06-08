const express = require('express');
const axios = require('axios');
module.exports = function(app) {
app.get('/ytmp3', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Masukkan parameter ?url=');
  try {
    const api = `https://xoo-api.vercel.app/api/ytdl?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(api);
    res.redirect(data.audio.url);
  } catch (e) {
    res.status(500).send('Gagal ambil audio dari xoo-api.');
  }
});

app.get('/ytmp4', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Masukkan parameter ?url=');
  try {
    const api = `https://xoo-api.vercel.app/api/ytdl?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(api);
    res.redirect(data.video.url);
  } catch (e) {
    res.status(500).send('Gagal ambil video dari xoo-api.');
  }
});
};
