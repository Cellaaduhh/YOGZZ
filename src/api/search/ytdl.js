const fetch = require('node-fetch');

function parseDuration(t) {
  const total = parseInt(t);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function download(id, k) {
  const response = await fetch("https://www.yt1s.com/api/ajaxConvert/convert", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": "https://www.yt1s.com/",
      "Origin": "https://www.yt1s.com"
    },
    body: new URLSearchParams({ vid: id, k })
  });

  const data = await response.json();
  return data.dlink;
}

async function youtubedl(link) {
  const response = await fetch("https://www.yt1s.com/api/ajaxSearch/index", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": "https://www.yt1s.com/",
      "Origin": "https://www.yt1s.com"
    },
    body: new URLSearchParams({
      q: link,
      vt: "home"
    })
  });

  const data = await response.json();
  const result = {
    title: data.title,
    duration: parseDuration(data.t),
    author: data.a
  };

  const resultUrl = {
    video: Object.values(data.links.mp4),
    audio: Object.values(data.links.mp3)
  };

  for (const i in resultUrl) {
    resultUrl[i] = await Promise.all(resultUrl[i].map(async (v) => ({
      size: v.size,
      format: v.f,
      quality: v.q,
      download: await download(data.vid, v.k)
    })));
  }

  return {
    result,
    resultUrl
  };
}

module.exports = function (app) {
  app.get('/ytmp', async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ status: false, message: 'Parameter "url" wajib diisi' });
    }

    try {
      const data = await youtubedl(url);
      res.json({
        status: true,
        creator: 'Zexs',
        title: data.result.title,
        duration: data.result.duration,
        audio: data.resultUrl.audio,
        video: data.resultUrl.video
      });
    } catch (err) {
      res.status(500).json({ status: false, message: 'Gagal memproses', error: err.message });
    }
  });
};
