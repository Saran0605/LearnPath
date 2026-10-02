const axios = require('axios');

/**
 * Fetches relevant Reddit posts from public search JSON API
 */
async function fetchReddit(skill) {
  const snippets = [];
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(`learn ${skill} best resources`)}&sort=relevance&limit=10`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LearnPath/1.0 (Educational Resource Aggregator)'
      },
      timeout: 8000
    });

    const posts = response.data?.data?.children || [];
    for (const post of posts) {
      const data = post.data;
      if (!data) continue;

      const postUrl = data.url?.startsWith('http') 
        ? data.url 
        : `https://www.reddit.com${data.permalink}`;
      
      const permalink = `https://www.reddit.com${data.permalink}`;
      const text = `${data.title || ''}\n${data.selftext || ''}`.trim();

      if (text) {
        snippets.push({
          platform: 'Reddit',
          title: `r/${data.subreddit}: ${data.title}`,
          url: postUrl || permalink,
          text: text.slice(0, 400)
        });
      }
    }
  } catch (err) {
    // Reddit API blocks or rate limits silent catch as per requirement
    console.warn('Reddit search fetch skipped or blocked:', err.message);
  }

  return snippets;
}

module.exports = { fetchReddit };
