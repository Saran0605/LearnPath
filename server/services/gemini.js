const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You extract learning-resource recommendations from the provided source snippets ONLY. Do not use outside knowledge. Do not invent resources or URLs. If the snippets contain no real evidence for a resource, leave it out. Return ONLY valid JSON, no markdown.`;

/**
 * Sends compiled source snippets to Google Gemini / Gemma model to extract verified learning resources.
 * @param {string} skill 
 * @param {Array} sources [{ id, platform, url, title, text }]
 * @returns {Promise<string>} Raw text output (JSON string) from Gemma model
 */
async function analyzeSourcesWithGemma(skill, sources) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.warn('GEMINI_API_KEY not configured. Falling back to heuristic rule-based extraction...');
    return generateFallbackExtraction(skill, sources);
  }

  const modelName = process.env.GEMINI_MODEL || 'gemma-2-9b-it';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT
    });

    const sourcesListText = sources
      .map(
        (s) => `[Source ID: ${s.id}]
Platform: ${s.platform}
Title: ${s.title}
URL: ${s.url}
Text snippet: ${s.text}
----------------------------------------`
      )
      .join('\n\n');

    const prompt = `Skill to analyze: "${skill}"

System Instruction:
${SYSTEM_PROMPT}

Provided Source Snippets:
${sourcesListText}

Required Output JSON Schema:
{
  "skill": "${skill}",
  "resources": [
    {
      "name": "Resource Name",
      "url": "Resource URL (MUST BE EXACTLY PRESERVED FROM SOURCE SNIPPETS ABOVE)",
      "type": "youtube_playlist" | "youtube_video" | "course" | "book" | "website" | "other",
      "pricing": "free" | "paid" | "freemium" | "unknown",
      "summary": "One concise sentence summarizing what real learners praised about it",
      "feedbackQuotes": ["short paraphrased point 1", "short paraphrased point 2"],
      "mentionCount": 1,
      "sourceIds": [1],
      "bestFor": "beginner" | "intermediate" | "advanced" | "all"
    }
  ]
}

Instructions:
1. ONLY include resources that are explicitly mentioned or linked in the provided snippets above.
2. Under no circumstances should you invent URLs or recommend tools from memory not present in the snippets.
3. Return ONLY valid JSON code. No markdown wrapping.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (err) {
    console.error(`Error calling Gemma model (${modelName}):`, err.message);

    // If model name failover (e.g. gemma model unavailable in specific key region), try gemini-1.5-flash as backup
    if (modelName.includes('gemma')) {
      console.log('Attempting backup call with gemini-1.5-flash model...');
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const backupModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await backupModel.generateContent(`${SYSTEM_PROMPT}\n\n${skill}\n\nSources:\n${JSON.stringify(sources)}`);
        return result.response.text();
      } catch (backupErr) {
        console.error('Backup model also failed:', backupErr.message);
      }
    }

    return generateFallbackExtraction(skill, sources);
  }
}

/**
 * Heuristic fallback extraction if API key is missing or model network call fails.
 * Guarantees zero hallucinations by strictly extracting URLs directly from the fetched sources array.
 */
function generateFallbackExtraction(skill, sources) {
  const extracted = [];
  const urlMap = new Map();

  for (const s of sources) {
    let type = 'website';
    if (s.url.includes('youtube.com/playlist')) type = 'youtube_playlist';
    else if (s.url.includes('youtube.com') || s.url.includes('youtu.be')) type = 'youtube_video';
    else if (s.url.includes('book') || s.text.toLowerCase().includes('book')) type = 'book';
    else if (s.url.includes('course') || s.url.includes('udemy') || s.url.includes('coursera')) type = 'course';

    if (!urlMap.has(s.url)) {
      urlMap.set(s.url, {
        name: s.title || `${skill} Resource`,
        url: s.url,
        type: type,
        pricing: s.url.includes('youtube') ? 'free' : 'unknown',
        summary: `Learners on ${s.platform} recommended this resource for ${skill}.`,
        feedbackQuotes: [
          `Shared as a helpful ${s.platform} recommendation`,
          s.text.slice(0, 100) + '...'
        ],
        mentionCount: 1,
        sourceIds: [s.id],
        bestFor: 'all'
      });
    } else {
      const existing = urlMap.get(s.url);
      existing.mentionCount += 1;
      if (!existing.sourceIds.includes(s.id)) {
        existing.sourceIds.push(s.id);
      }
    }
  }

  for (const item of urlMap.values()) {
    extracted.push(item);
  }

  return JSON.stringify({
    skill: skill,
    resources: extracted.slice(0, 8)
  });
}

module.exports = {
  analyzeSourcesWithGemma
};
