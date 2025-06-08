const ytdl = require('ytdl-core');

module.exports = function(app) {
  app.get('/ytmp', async (req, res) => {
    const { url } = req.query;
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ status: false, error: 'Invalid or missing YouTube URL' });
    }

    try {
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const thumbnail = info.videoDetails.thumbnails.pop().url;

      // Pilih format mp4 (video + audio)
      const mp4Format = ytdl.chooseFormat(info.formats, { quality: '18', filter: 'audioandvideo' });
      // Pilih format audio saja (biasanya webm/opus)
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
      res.status(500).json({ status: false, error: error.message });
    }
  });
}
