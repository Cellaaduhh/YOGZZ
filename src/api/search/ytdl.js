module.exports = function(app) {
app.get('/ytmp3', async (req, res) => {
     const ytdlp = require('yt-dlp-exec');
    const url = req.query.url;
    if (!url) return res.status(400).json({ status: false, error: 'URL is required' });

    try {
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
        });

        const title = info.title;
        const audioUrl = await ytdlp(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            getUrl: true,
        });

        res.json({
            status: true,
            title,
            download: audioUrl.trim()
        });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});

// YTMP4 Endpoint
app.get('/ytmp4', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ status: false, error: 'URL is required' });

    try {
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
        });

        const title = info.title;
        const videoUrl = await ytdlp(url, {
            format: 'mp4',
            getUrl: true,
        });

        res.json({
            status: true,
            title,
            download: videoUrl.trim()
        });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});
};
