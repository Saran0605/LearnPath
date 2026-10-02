const express = require('express');
const router = express.Router();
const Search = require('../models/Search');
const { fetchHackerNews } = require('../services/hackernews');
const { fetchReddit } = require('../services/reddit');
const { fetchYouTube } = require('../services/youtube');
const { analyzeSourcesWithGemma } = require('../services/gemini');
const { validateSkill, parseAndValidateGemmaOutput } = require('../utils/validate');

const STALENESS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * POST /api/search
 * Core endpoint for searching skills and retrieving verified recommendations
 */
router.post('/search', async (req, res, next) => {
  try {
    const { skill } = req.body;
    const validation = validateSkill(skill);

    if (!validation.valid) {
      return res.status(400).json({ error: true, message: validation.message });
    }

    const normalizedSkill = validation.skill;

    // 1. Check MongoDB cache (< 7 days old)
    const cached = await Search.findOne({ skill: normalizedSkill });
    if (cached) {
      const age = Date.now() - new Date(cached.createdAt).getTime();
      if (age < STALENESS_MS) {
        console.log(`⚡ Returning cached recommendations for "${normalizedSkill}" (${Math.round(age / (1000 * 60 * 60))}h old)`);
        return res.json({
          skill: cached.skill,
          resources: cached.resources,
          sources: cached.sources,
          cached: true,
          createdAt: cached.createdAt
        });
      }
    }

    console.log(`🔍 Fetching fresh sources for skill: "${normalizedSkill}"...`);

    // 2. Fetch from HN, Reddit, YouTube in parallel (Promise.allSettled)
    const [hnResult, redditResult, ytResult] = await Promise.allSettled([
      fetchHackerNews(normalizedSkill),
      fetchReddit(normalizedSkill),
      fetchYouTube(normalizedSkill)
    ]);

    const rawSources = [
      ...(hnResult.status === 'fulfilled' ? hnResult.value : []),
      ...(redditResult.status === 'fulfilled' ? redditResult.value : []),
      ...(ytResult.status === 'fulfilled' ? ytResult.value : [])
    ];

    if (rawSources.length === 0) {
      console.log(`⚠️ No source snippets retrieved for "${normalizedSkill}".`);
      return res.json({
        skill: normalizedSkill,
        resources: [],
        sources: [],
        cached: false,
        message: 'Not enough real feedback found for this skill. Try a broader term.'
      });
    }

    // Assign integer IDs to sources
    const indexedSources = rawSources.map((s, idx) => ({
      id: idx + 1,
      platform: s.platform,
      title: s.title,
      url: s.url,
      text: s.text
    }));

    console.log(`📦 Collected ${indexedSources.length} source snippets. Sending to Gemma AI model...`);

    // 3. Analyze sources with Gemma AI model
    const gemmaRawText = await analyzeSourcesWithGemma(normalizedSkill, indexedSources);

    // 4. Validate output with anti-hallucination check
    const verifiedResources = parseAndValidateGemmaOutput(gemmaRawText, indexedSources);

    console.log(`✅ Extracted & verified ${verifiedResources.length} resources for "${normalizedSkill}".`);

    // Prepare sources array for storage (without heavy text)
    const sourcesForDb = indexedSources.map((s) => ({
      id: s.id,
      platform: s.platform,
      url: s.url,
      title: s.title
    }));

    // 5. Save/Update MongoDB Search document
    const updatedSearch = await Search.findOneAndUpdate(
      { skill: normalizedSkill },
      {
        skill: normalizedSkill,
        resources: verifiedResources,
        sources: sourcesForDb,
        createdAt: new Date()
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    return res.json({
      skill: updatedSearch.skill,
      resources: updatedSearch.resources,
      sources: updatedSearch.sources,
      cached: false,
      createdAt: updatedSearch.createdAt
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/recent
 * Returns the 12 most recent skill searches for dashboard chips
 */
router.get('/recent', async (req, res, next) => {
  try {
    const recentSearches = await Search.find({}, 'skill resources createdAt')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const formatted = recentSearches.map((item) => ({
      skill: item.skill,
      resourceCount: item.resources ? item.resources.length : 0,
      createdAt: item.createdAt
    }));

    return res.json(formatted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
