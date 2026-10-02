const axios = require('axios');

/**
 * Fetches YouTube videos and playlists using YouTube Data API v3
 */
async function fetchYouTube(skill) {
  const snippets = [];
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_youtube_api_key')) {
    console.warn('YouTube API Key not configured in environment; skipping YouTube search.');
    return snippets;
  }

  try {
    const query = `${skill} full course learn`;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(query)}&type=playlist,video&key=${apiKey}`;

    const response = await axios.get(searchUrl, { timeout: 8000 });
    const items = response.data?.items || [];

    for (const item of items) {
      const isPlaylist = item.id.kind === 'youtube#playlist';
      const isVideo = item.id.kind === 'youtube#video';
      const id = isPlaylist ? item.id.playlistId : (isVideo ? item.id.videoId : null);

      if (!id) continue;

      const url = isPlaylist 
        ? `https://www.youtube.com/playlist?list=${id}`
        : `https://www.youtube.com/watch?v=${id}`;

      const title = item.snippet?.title || `${skill} YouTube Course`;
      const channel = item.snippet?.channelTitle || 'YouTube Creator';
      const description = item.snippet?.description || '';

      snippets.push({
        platform: 'YouTube',
        title: `${title} (${channel})`,
        url: url,
        text: `Channel: ${channel} | Title: ${title} | Details: ${description}`.slice(0, 400)
      });
    }
  } catch (err) {
    console.error('YouTube Fetch Error:', err.response?.data?.error?.message || err.message);
  }

  return snippets;
}

module.exports = { fetchYouTube };
