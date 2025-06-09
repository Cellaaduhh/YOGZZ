const axios = require('axios');

module.exports = function(app) {
  app.get('/api/prompt', async (req, res) => {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Parameter "text" is required.' });
    }

    try {
      const response = await axios.post('https://gpt-api.me/api/gpt', {
        prompt: text
      });

      res.json({
        success: true,
        result: response.data.reply
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Gagal generate AI response'
      });
    }
  });
};
