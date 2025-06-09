const axios = require('axios');

module.exports = function(app) {
  app.get('/api/nsfw', async (req, res) => {
    try {
      const response = await axios.get('https://api-simplebot.vercel.app/random/nsfw?apikey=free');
      
      if (!response.data || !response.data.url) {
        return res.status(502).json({ success: false, error: 'Invalid response from upstream API' });
      }

      res.json({
        success: true,
        result: response.data.url
      });

    } catch (err) {
      console.error('NSFW API Error:', err.message);
      res.status(500).json({ success: false, error: 'Failed to fetch from NSFW API' });
    }
  });
};
