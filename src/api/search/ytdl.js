const express = require('express');
const ytdl = require('ytdl-core');
module.exports = function(app) {
app.get('/ytmp', async (req, res) => {
  const url = req.query.url;
  if (!url || !ytdl.validateURL(url))
    return res.status(400).json({ error: 'Masukkan URL YouTube di ?url=' });

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails.slice(-1)[0].url;
    const duration = info.videoDetails.lengthSeconds;

    const audio = ytdl.chooseFormat(info.formats, { quality: '140' });
    const video = ytdl.chooseFormat(info.formats, { quality: '18' });

    res.json({
      status: true,
      title,
      duration: `${duration} detik`,
      thumbnail,
      audio: { url: audio.url },
      video: { url: video.url }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal ambil data YouTube!' });
  }
});
};
