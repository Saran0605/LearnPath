/**
 * Skill input validation and normalization
 */
function validateSkill(skill) {
  if (!skill || typeof skill !== 'string') {
    return { valid: false, message: 'Skill query is required and must be a string.' };
  }
  const normalized = skill.trim().toLowerCase();
  if (normalized.length === 0) {
    return { valid: false, message: 'Skill query cannot be empty.' };
  }
  if (normalized.length > 60) {
    return { valid: false, message: 'Skill query cannot exceed 60 characters.' };
  }
  // Sanitize: allow letters, numbers, spaces, and common tech chars (+, #, ., -, /)
  if (!/^[a-z0-9\s+#./-]+$/.test(normalized)) {
    return { valid: false, message: 'Skill query contains invalid characters.' };
  }
  return { valid: true, skill: normalized };
}

/**
 * Anti-hallucination validation:
 * Ensures all returned resources physically appeared in the fetched source text / URLs
 */
function parseAndValidateGemmaOutput(rawText, sources) {
  if (!rawText) return [];

  // Strip code fences if Gemma included markdown formatting
  let cleanJson = rawText.trim();
  cleanJson = cleanJson.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    console.error('Failed to parse Gemma JSON output:', err.message, 'Raw response:', rawText);
    return [];
  }

  const rawResources = Array.isArray(parsed.resources) ? parsed.resources : [];
  const validSourceIds = new Set(sources.map((s) => Number(s.id)));

  // Collect all text and URLs from fetched sources for strict checking
  const fullSourceCorpus = sources
    .map((s) => `${s.url} ${s.title || ''} ${s.text || ''}`)
    .join(' ')
    .toLowerCase();

  const validResources = [];

  for (const item of rawResources) {
    if (!item.name || !item.url) continue;

    const resUrl = item.url.trim().toLowerCase();
    const resName = item.name.trim().toLowerCase();

    // Check if the URL or name appears in the source corpus
    // Extract base domain / URL path to match robustly
    let urlFound = fullSourceCorpus.includes(resUrl);
    if (!urlFound) {
      try {
        const parsedUrl = new URL(item.url);
        // Check hostname + pathname or domain presence
        urlFound = fullSourceCorpus.includes(parsedUrl.hostname.toLowerCase()) || 
                   fullSourceCorpus.includes(parsedUrl.pathname.toLowerCase());
      } catch (e) {
        urlFound = false;
      }
    }

    // Drop any resource whose URL or name does not appear in the source snippets
    if (!urlFound && !fullSourceCorpus.includes(resName)) {
      console.warn(`[Anti-Hallucination Filter] Dropping recommended resource: "${item.name}" (${item.url}) - not found in fetched source text.`);
      continue;
    }

    // Filter sourceIds to only valid existing sources
    const rawSourceIds = Array.isArray(item.sourceIds) ? item.sourceIds : [];
    const filteredSourceIds = rawSourceIds
      .map(Number)
      .filter((id) => validSourceIds.has(id));

    // If sourceIds were missing/invalid but resource URL was found in a source, link it to that source's ID
    if (filteredSourceIds.length === 0) {
      const matchingSource = sources.find(
        (s) => s.url.toLowerCase().includes(resUrl) || fullSourceCorpus.includes(s.url.toLowerCase())
      );
      if (matchingSource) {
        filteredSourceIds.push(matchingSource.id);
      }
    }

    // Enums normalization
    const allowedTypes = ['youtube_playlist', 'youtube_video', 'course', 'book', 'website', 'other'];
    const allowedPricing = ['free', 'paid', 'freemium', 'unknown'];
    const allowedLevels = ['beginner', 'intermediate', 'advanced', 'all'];

    const type = allowedTypes.includes(item.type) ? item.type : 'website';
    const pricing = allowedPricing.includes(item.pricing) ? item.pricing : 'unknown';
    const bestFor = allowedLevels.includes(item.bestFor) ? item.bestFor : 'all';

    validResources.push({
      name: item.name.trim(),
      url: item.url.trim(),
      type,
      pricing,
      summary: item.summary ? item.summary.trim() : `Recommended resource for learning ${parsed.skill || 'this skill'}.`,
      feedbackQuotes: Array.isArray(item.feedbackQuotes) ? item.feedbackQuotes.slice(0, 3) : [],
      mentionCount: typeof item.mentionCount === 'number' && item.mentionCount > 0 ? item.mentionCount : Math.max(1, filteredSourceIds.length),
      sourceIds: filteredSourceIds,
      bestFor
    });
  }

  // Sort by mentionCount descending and limit to top 8 resources as required
  validResources.sort((a, b) => b.mentionCount - a.mentionCount);
  return validResources.slice(0, 8);
}

module.exports = {
  validateSkill,
  parseAndValidateGemmaOutput
};
