const axios = require('axios');

/**
 * Fetches relevant Hacker News stories and comments from Algolia Search API
 */
async function fetchHackerNews(skill) {
  const snippets = [];
  try {
    const storyUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(`best way to learn ${skill}`)}&tags=story&hitsPerPage=6`;
    const commentUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(`${skill} learning resources`)}&tags=comment&hitsPerPage=8`;

    const [storyRes, commentRes] = await Promise.allSettled([
      axios.get(storyUrl, { timeout: 8000 }),
      axios.get(commentUrl, { timeout: 8000 })
    ]);

    if (storyRes.status === 'fulfilled' && storyRes.value.data?.hits) {
      for (const hit of storyRes.value.data.hits) {
        const itemUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        const text = hit.story_text || hit.title || '';
        if (itemUrl && text) {
          snippets.push({
            platform: 'HackerNews',
            title: hit.title || `HN Discussion on ${skill}`,
            url: itemUrl,
            text: text.slice(0, 400)
          });
        }
      }
    }

    if (commentRes.status === 'fulfilled' && commentRes.value.data?.hits) {
      for (const hit of commentRes.value.data.hits) {
        const itemUrl = `https://news.ycombinator.com/item?id=${hit.objectID}`;
        if (hit.comment_text) {
          // Strip basic HTML tags from HN comments
          const cleanText = hit.comment_text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          snippets.push({
            platform: 'HackerNews',
            title: `HN Comment on ${skill} (Story #${hit.story_id || hit.objectID})`,
            url: itemUrl,
            text: cleanText.slice(0, 400)
          });
        }
      }
    }
  } catch (err) {
    console.error('Hacker News Fetch Error:', err.message);
  }

  return snippets;
}

module.exports = { fetchHackerNews };
