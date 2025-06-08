const ytdl = require('ytdl-core');

module.exports = function (app) {
  app.get('/ytmp', async (req, res) => {
    const url = req.query.url;
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Masukkan URL YouTube yang valid di parameter ?url=' });
    }

    try {
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const thumbnail = info.videoDetails.thumbnails.pop().url;
      const duration = info.videoDetails.lengthSeconds;

      const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });
      const videoFormat = ytdl.chooseFormat(info.formats, { quality: '18' });

      res.json({
        status: true,
        title,
        duration: `${duration} detik`,
        thumbnail,
        audio: {
          url: audioFormat.url
        },
        video: {
          url: videoFormat.url
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Gagal mengambil informasi dari YouTube.' });
    }
  });
};
