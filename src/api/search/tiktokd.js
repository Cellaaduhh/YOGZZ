const axios = require('axios');

module.exports = function(app) {
  app.get('/download/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, error: 'URL is required' });

    try {
      const result = await tiktokDl(url);
      res.json(result);
    } catch (err) {
      console.error('[TikTok Download Error]', err);
      res.status(500).json({ status: false, error: err.message || 'Failed to download video' });
    }
  });

  async function tiktokDl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];

        function formatNumber(integer) {
          return Number(parseInt(integer)).toLocaleString().replace(/,/g, '.');
        }

        function formatDate(n, locale = 'id') {
          const d = new Date(n * 1000);
          return d.toLocaleDateString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          });
        }

        const domain = 'https://www.tikwm.com/api/';
        const res = (await axios.post(domain, {}, {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://www.tikwm.com',
            'Referer': 'https://www.tikwm.com/',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          },
          params: {
            url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
          }
        })).data.data;

        if (res.duration === 0 && res.images) {
          data = res.images.map(v => ({ type: 'photo', url: v }));
        } else {
          data.push(
            { type: 'watermark', url: 'https://www.tikwm.com' + (res?.wmplay || '/undefined') },
            { type: 'nowatermark', url: 'https://www.tikwm.com' + (res?.play || '/undefined') },
            { type: 'nowatermark_hd', url: 'https://www.tikwm.com' + (res?.hdplay || '/undefined') }
          );
        }

        resolve({
          status: true,
          title: res.title,
          taken_at: formatDate(res.create_time),
          region: res.region,
          id: res.id,
          duration: res.duration + ' detik',
          cover: 'https://www.tikwm.com' + res.cover,
          size_wm: res.wm_size,
          size_nowm: res.size,
          size_nowm_hd: res.hd_size,
          data,
          music_info: {
            id: res.music_info.id,
            title: res.music_info.title,
            author: res.music_info.author,
            album: res.music_info.album || null,
            url: 'https://www.tikwm.com' + (res.music || res.music_info.play)
          },
          stats: {
            views: formatNumber(res.play_count),
            likes: formatNumber(res.digg_count),
            comment: formatNumber(res.comment_count),
            share: formatNumber(res.share_count),
            download: formatNumber(res.download_count)
          },
          author: {
            id: res.author.id,
            fullname: res.author.unique_id,
            nickname: res.author.nickname,
            avatar: 'https://www.tikwm.com' + res.author.avatar
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
};
