const axios = require('axios');

module.exports = function(app) {
  app.get('/api/spotify/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "q parameter is required." });
    }

    try {
      const results = await searchSpotifyTracks(q);
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  async function searchSpotifyTracks(q) {
    const clientId = 'acc6302297e040aeb6e4ac1fbdfd62c3';
    const clientSecret = '0e8439a1280a43aba9a5bc0a16f3f009';
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const getToken = async () => {
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    };

    const accessToken = await getToken();
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&offset=0&limit=10`;

    const response = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data.tracks.items;
  }
};
