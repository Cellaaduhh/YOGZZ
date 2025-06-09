const fetch = require('node-fetch');
module.exports = function(app) {
app.get('/api/pinterest', async (req, res) => {
	const query = req.query.q;
	if (!query) return res.status(400).json({ status: false, message: 'Missing "q" parameter' });

	try {
		const results = await pinterest2(query);
		res.json(results);
	} catch {
		res.status(500).json([]);
	}
});

async function pinterest2(query) {
	return new Promise(async (resolve, reject) => {
		const baseUrl = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
		const queryParams = {
			source_url: '/search/pins/?q=' + encodeURIComponent(query),
			data: JSON.stringify({
				options: {
					isPrefetch: false,
					query,
					scope: 'pins',
					no_fetch_context_on_resource: false
				},
				context: {}
			}),
			_: Date.now()
		};
		const url = new URL(baseUrl);
		Object.entries(queryParams).forEach(([key, val]) =>
			url.searchParams.set(key, val)
		);

		try {
			const response = await fetch(url.toString(), {
				headers: {
					'User-Agent': 'Mozilla/5.0',
					'Accept': 'application/json'
				}
			});
			const json = await response.json();
			const results = json.resource_response?.data?.results ?? [];

			const finalResults = results.map(item => ({
				pin: `https://www.pinterest.com/pin/${item.id ?? ''}`,
				link: item.link ?? '',
				created_at: new Date(item.created_at).toLocaleDateString('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}),
				id: item.id ?? '',
				images_url: item.images?.['736x']?.url ?? '',
				grid_title: item.grid_title ?? ''
			}));

			resolve(finalResults);
		} catch (err) {
			reject([]);
		}
	});
};
};
