const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
  app.get('/api/mediafire', async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" is required.' });
    }

    try {
      const result = await mediafire(url);
      res.json({ success: true, data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch mediafire link' });
    }
  });

  async function mediafire(query) {
    return new Promise((resolve, reject) => {
      axios.get(query)
        .then(({ data }) => {
          const $ = cheerio.load(data);
          const judul = $('div.promoDownloadName.notranslate > div').text();
          const size = $('ul > li:nth-child(1) > span').text();
          const upload_date = $('ul > li:nth-child(2) > span').text();
          const link = $('#downloadButton').attr('href');

          if (!link) {
            return reject(new Error('Failed to extract download link'));
          }

          const result = {
            judul: link.split('/')[5],
            upload_date,
            size,
            mime: link.split('/')[5].split('.').pop(),
            link
          };

          resolve(result);
        })
        .catch(reject);
    });
  }
};
