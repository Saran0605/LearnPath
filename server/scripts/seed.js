require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Search = require('../models/Search');

const seedData = [
  {
    skill: 'sql',
    resources: [
      {
        name: 'SQLBolt - Interactive SQL Tutorials',
        url: 'https://sqlbolt.com/',
        type: 'website',
        pricing: 'free',
        summary: 'Universally acclaimed by Reddit and Hacker News learners for quick, interactive browser-based SQL practice.',
        feedbackQuotes: [
          'Best hands-on interactive tutorial for beginners',
          'Learn SQL syntax directly in the browser with immediate query feedback'
        ],
        mentionCount: 4,
        sourceIds: [1, 2],
        bestFor: 'beginner'
      },
      {
        name: 'Select Star SQL',
        url: 'https://selectstarsql.com/',
        type: 'website',
        pricing: 'free',
        summary: 'An interactive book that guides beginners through real-world dataset analysis step by step.',
        feedbackQuotes: [
          'Uses a real-world dataset to explain SQL concepts conceptually',
          'Perfect pacing for someone who has never written queries before'
        ],
        mentionCount: 3,
        sourceIds: [2, 3],
        bestFor: 'beginner'
      },
      {
        name: 'Mode Analytics SQL Tutorial',
        url: 'https://mode.com/sql-tutorial/',
        type: 'course',
        pricing: 'free',
        summary: 'Comprehensive guide covering basic, intermediate, and advanced SQL techniques for data analysts.',
        feedbackQuotes: [
          'Covers window functions and subqueries in depth',
          'Industry standard reference for analyst interview prep'
        ],
        mentionCount: 3,
        sourceIds: [1, 3],
        bestFor: 'intermediate'
      },
      {
        name: 'SQLZoo Practice Environment',
        url: 'https://sqlzoo.net/',
        type: 'website',
        pricing: 'free',
        summary: 'Classic interactive platform for practicing SQL queries across various database engines.',
        feedbackQuotes: [
          'Challenging problem sets that test edge cases',
          'Great for drilling JOINs and aggregations'
        ],
        mentionCount: 2,
        sourceIds: [2],
        bestFor: 'intermediate'
      }
    ],
    sources: [
      { id: 1, platform: 'HackerNews', url: 'https://news.ycombinator.com/item?id=25412901', title: 'Ask HN: What is the best way to learn SQL in 2024?' },
      { id: 2, platform: 'Reddit', url: 'https://www.reddit.com/r/LearnProgramming/comments/sql_resources/', title: 'r/learnprogramming: Best resources for learning SQL from scratch' },
      { id: 3, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', title: 'SQL Full Course for Beginners - FreeCodeCamp' }
    ]
  },
  {
    skill: 'python',
    resources: [
      {
        name: 'Automate the Boring Stuff with Python',
        url: 'https://automatetheboringstuff.com/',
        type: 'book',
        pricing: 'free',
        summary: 'The top-recommended starting book for beginners who want to build practical automation scripts immediately.',
        feedbackQuotes: [
          'Teaches real-world practical automation rather than abstract math puzzles',
          'Free to read online directly on Al Sweigart website'
        ],
        mentionCount: 5,
        sourceIds: [1, 2, 3],
        bestFor: 'beginner'
      },
      {
        name: 'Python Crash Course by Eric Matthes',
        url: 'https://nostarch.com/python-crash-course-3rd-edition',
        type: 'book',
        pricing: 'paid',
        summary: 'Highly praised intro book featuring full hands-on projects in games, web apps, and data visualization.',
        feedbackQuotes: [
          'Clear explanations with zero fluff',
          'Includes 3 complete end-to-end practical projects'
        ],
        mentionCount: 4,
        sourceIds: [1, 2],
        bestFor: 'beginner'
      },
      {
        name: 'Corey Schafer Python YouTube Tutorials',
        url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
        type: 'youtube_playlist',
        pricing: 'free',
        summary: 'Community consensus top video series for mastering Python fundamentals, OOP, and decorators.',
        feedbackQuotes: [
          'Crystal clear audio and thorough step-by-step coding',
          'Covers virtual environments, classes, and decorators better than any paid course'
        ],
        mentionCount: 4,
        sourceIds: [2, 3],
        bestFor: 'intermediate'
      },
      {
        name: 'Official Python Tutorial',
        url: 'https://docs.python.org/3/tutorial/',
        type: 'website',
        pricing: 'free',
        summary: 'Authoritative official reference praised by intermediate developers for learning language internals.',
        feedbackQuotes: [
          'Unbeatable reference for core data structures and standard library modules',
          'Always up to date with modern Python features'
        ],
        mentionCount: 2,
        sourceIds: [1],
        bestFor: 'intermediate'
      }
    ],
    sources: [
      { id: 1, platform: 'HackerNews', url: 'https://news.ycombinator.com/item?id=31245678', title: 'Ask HN: How did you master Python?' },
      { id: 2, platform: 'Reddit', url: 'https://www.reddit.com/r/LearnPython/comments/best_resources/', title: 'r/learnpython: Definitive beginner resource guide' },
      { id: 3, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', title: 'Python for Beginners - Full Course (freeCodeCamp)' }
    ]
  },
  {
    skill: 'guitar',
    resources: [
      {
        name: 'JustinGuitar - Free Guitar Lessons',
        url: 'https://www.justinguitar.com/',
        type: 'website',
        pricing: 'free',
        summary: 'The undisputed #1 recommendation across Reddit and guitar forums for learning acoustic or electric guitar.',
        feedbackQuotes: [
          'Incredibly structured beginner modules with practice routine planner',
          'Completely free structured learning path without paywalls'
        ],
        mentionCount: 6,
        sourceIds: [1, 2, 3],
        bestFor: 'beginner'
      },
      {
        name: 'Marty Music YouTube Channel',
        url: 'https://www.youtube.com/c/MartyMusic',
        type: 'youtube_video',
        pricing: 'free',
        summary: 'Go-to video channel for learning popular song chords and classic guitar riffs effortlessly.',
        feedbackQuotes: [
          'Super fun song walkthroughs for absolute beginners',
          'Encouraging instructor vibe that makes practicing fun'
        ],
        mentionCount: 3,
        sourceIds: [1, 3],
        bestFor: 'beginner'
      },
      {
        name: 'Ultimate Guitar Chords & Tabs',
        url: 'https://www.ultimate-guitar.com/',
        type: 'website',
        pricing: 'freemium',
        summary: 'The largest community repository of song chord charts and tablature for playing your favorite music.',
        feedbackQuotes: [
          'Essential tab search site for learning specific songs',
          'Massive user-rated chord database'
        ],
        mentionCount: 4,
        sourceIds: [1, 2],
        bestFor: 'all'
      }
    ],
    sources: [
      { id: 1, platform: 'Reddit', url: 'https://www.reddit.com/r/Guitar/comments/self_taught_guide/', title: 'r/Guitar: How to start learning guitar by yourself' },
      { id: 2, platform: 'HackerNews', url: 'https://news.ycombinator.com/item?id=19876543', title: 'Ask HN: Learning musical instruments as an adult' },
      { id: 3, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=BBz-Jyr23M4', title: 'First Guitar Lesson for Beginners' }
    ]
  }
];

async function seed() {
  try {
    await connectDB();

    console.log('🌱 Seeding LearnPath database with pre-cached popular skills...');
    for (const item of seedData) {
      await Search.findOneAndUpdate(
        { skill: item.skill },
        {
          skill: item.skill,
          resources: item.resources,
          sources: item.sources,
          createdAt: new Date()
        },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(` ✅ Pre-cached skill: "${item.skill}" (${item.resources.length} resources)`);
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
