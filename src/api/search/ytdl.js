const express = require('express');
const axios = require('axios');
module.exports = function(app) {
app.get('/ytmp', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send({ error: 'Parameter ?url= wajib diisi' });

  try {
    const { data } = await axios.get('https://xoo-api.vercel.app/ytmp', {
      params: { url }
    });
    res.json(data);
  } catch (err) {
    res.status(500).send({ error: 'Gagal mengambil data dari xoo-api', detail: err.message });
  }
});
};
