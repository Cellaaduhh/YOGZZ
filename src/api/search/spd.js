const axios = require('axios');

module.exports = function(app) {
  app.get('/api/spotify/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Parameter 'url' is required." });
    }

    const spotifyLinkRegex = /^https:\/\/open\.spotify\.com\/track\/[0-9A-Za-z]+/i;
    if (!spotifyLinkRegex.test(url)) {
      return res.status(400).json({ error: "Invalid Spotify track URL." });
    }

    try {
      const result = await spotifyDown(url);
      res.json(result);
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  async function spotifyDown(url) {
    try {
      const response = await axios.get(`https://api.fabdl.com/spotify/get?url=${url}`);
      const { id, name, artists, image, duration_ms, gid } = response.data.result;

      const curl = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`);
      const { download_url } = curl.data.result;

      if (!download_url) {
        return {
          status: false,
          data: 'Music tidak ditemukan.'
        };
      }

      return {
        status: true,
        nama: artists,
        title: name,
        durasi: convertDuration(duration_ms),
        thumb: image,
        url: `https://api.fabdl.com${download_url}`
      };
    } catch (error) {
      return {
        status: false,
        error: error.message
      };
    }
  }

  function convertDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
};
