const express = require('express');
const { exec } = require('child_process');
module.exports = function(app) {
app.get('/api/ytmp', async (req, res) => {
  const url = req.query.url;
  if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
    return res.status(400).json({ status: false, message: 'URL YouTube tidak valid' });
  }

  try {
    const cmd = `yt-dlp -j --no-playlist "${url}"`;
    exec(cmd, (err, stdout) => {
      if (err) return res.status(500).json({ status: false, message: 'Gagal mendapatkan data video' });

      const data = JSON.parse(stdout);
      const title = data.title;
      const thumbnail = data.thumbnail;
      const duration = data.duration;

      const mp3 = `https://ytdl.m4a.download/api/button/mp3/${data.id}`;
      const mp4 = `https://ytdl.m4a.download/api/button/mp4/${data.id}`;

      res.json({
        status: true,
        title,
        duration,
        thumbnail,
        mp3,
        mp4
      });
    });
  } catch (e) {
    res.status(500).json({ status: false, message: 'Terjadi kesalahan internal' });
  }
});
};
