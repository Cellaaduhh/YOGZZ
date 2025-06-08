const axios = require('axios');

module.exports = function(app) {
  app.get('/ytmp3', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ status: false, error: 'Parameter ?url= diperlukan' });
    }

    try {
      const api = `https://xoo-api.vercel.app/api/ytdl?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(api);

      res.redirect(data.audio.url); // redirect langsung ke file MP3
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: false, error: 'Gagal mengambil audio dari xoo-api.' });
    }
  });

  app.get('/ytmp4', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ status: false, error: 'Parameter ?url= diperlukan' });
    }

    try {
      const api = `https://xoo-api.vercel.app/api/ytdl?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(api);

      res.redirect(data.video.url); // redirect langsung ke file MP4
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: false, error: 'Gagal mengambil video dari xoo-api.' });
    }
  });
};
