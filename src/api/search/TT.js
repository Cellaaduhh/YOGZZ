const axios = require('axios');

module.exports = function(app) {
  app.get('/api/tiktok/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    try {
      const results = await tiktokSearchVideo(query);
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  async function tiktokSearchVideo(q) {
    try {
      const response = await axios("https://tikwm.com/api/feed/search", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
          'Referer': 'https://www.tikwm.com/',
        },
        data: new URLSearchParams({
          keywords: q,
          count: 12,
          cursor: 0,
          web: 1,
          hd: 1,
        }),
      });

      return response.data.data;
    } catch (err) {
      throw new Error("Failed to fetch TikTok data: " + err.message);
    }
  }
};
