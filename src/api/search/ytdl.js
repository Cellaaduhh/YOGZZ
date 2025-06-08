const ytdl = require('ytdl-core');

module.exports = function(app) {
  app.get('/ytmp', async (req, res) => {
    const { url } = req.query;
    console.log('Request url:', url);
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ status: false, error: 'Invalid or missing YouTube URL' });
    }

    try {
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const thumbnail = info.videoDetails.thumbnails.pop().url;

      const mp4Format = ytdl.chooseFormat(info.formats, { quality: '18', filter: 'audioandvideo' });
      const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

      res.json({
        status: true,
        result: {
          title,
          thumbnail,
          mp4: mp4Format.url,
          audio: audioFormat.url,
        }
      });
    } catch (error) {
      console.error('Error di /ytmp:', error);
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
