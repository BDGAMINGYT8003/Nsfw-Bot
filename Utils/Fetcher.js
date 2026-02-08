const axios = require('axios');

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";

async function fetchImage(type) {
    // Mapping for types that might differ between APIs
    const typeMapping = {
        'htigh': 'hthigh',
        'pgif': 'pgif',
        'lewdneko': 'lewdneko'
    };

    const apiType = typeMapping[type] || type;

    // 1. Try Nekobot (Original)
    try {
        const res = await axios.get(`https://nekobot.xyz/api/image?type=${apiType}`, {
            timeout: 5000,
            headers: { 'User-Agent': userAgent }
        });
        if (res.data && res.data.message) return res.data.message;
    } catch (err) {
        // Fallback
    }

    // 2. Try Waifu.im (Reliable)
    const waifuImTags = {
        '4k': 'hentai',
        'anal': 'oral',
        'ass': 'ero',
        'blowjob': 'oral',
        'boobs': 'oppai',
        'hentai': 'hentai',
        'paizuri': 'paizuri',
        'pussy': 'hentai',
        'lewd': 'ero',
        'thigh': 'hentai',
        'hthigh': 'hentai',
        'htigh': 'hentai'
    };

    if (waifuImTags[type]) {
        try {
            const res = await axios.get(`https://api.waifu.im/search/?is_nsfw=true&tag=${waifuImTags[type]}`, { timeout: 5000 });
            if (res.data && res.data.images && res.data.images[0]) return res.data.images[0].url;
        } catch (err) { }
    }

    // 3. Try Waifu.pics
    const waifuPicsTags = ['waifu', 'neko', 'trap', 'blowjob'];
    if (waifuPicsTags.includes(type) || waifuPicsTags.includes(apiType)) {
        const t = waifuPicsTags.includes(type) ? type : apiType;
        try {
            const res = await axios.get(`https://api.waifu.pics/nsfw/${t}`, { timeout: 5000 });
            if (res.data && res.data.url) return res.data.url;
        } catch (err) { }
    }

    // 4. Ultimate Fallback: Yande.re (Very reliable)
    // Map categories to yande.re tags
    const yandereTags = {
        '4k': 'width:>=3840',
        'anal': 'anal',
        'ass': 'ass',
        'blowjob': 'blowjob',
        'boobs': 'breasts',
        'feet': 'feet',
        'hentai': 'rating:explicit',
        'paizuri': 'paizuri',
        'pussy': 'pussy',
        'thigh': 'thighs',
        'hthigh': 'thighs',
        'htigh': 'thighs'
    };

    const yTag = yandereTags[type] || 'rating:explicit';
    try {
        const res = await axios.get(`https://yande.re/post.json?limit=1&tags=${yTag}`, { timeout: 5000 });
        if (res.data && res.data[0] && res.data[0].file_url) return res.data[0].file_url;
    } catch (err) { }

    throw new Error('All image providers failed.');
}

module.exports = { fetchImage };
