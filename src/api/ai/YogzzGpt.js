const axios = require('axios');

module.exports = function (app) {
  app.get('/api/ai', async (req, res) => {
    const { text } = req.query;  // ganti dari q jadi text

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "text" tidak boleh kosong.',
      });
    }

    try {
      // Kirim prompt ke API pakai text
      const response = await axios.post(
        'https://chateverywhere.app/api/chat/',
        { prompt: text },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
          },
        }
      );

      const reply = response.data?.reply || 'Tidak ada respons dari AI.';

      res.json({
        success: true,
        question: text,
        reply: reply,
      });
    } catch (err) {
      console.error('API Error:', err.message);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memproses permintaan.',
      });
    }
  });
};
