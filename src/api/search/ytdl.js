const express = require('express');

module.exports = function(app) {
  app.get('/api/ytdl', async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "Parameter 'url' is required." });
    }

    try {
      const result = await ytdl(url);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  async function ytdl(url) {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://shinoa.us.kg/api/download/ytdl', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'api_key': 'free',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: url })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
};
