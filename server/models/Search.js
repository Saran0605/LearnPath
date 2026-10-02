const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ['youtube_playlist', 'youtube_video', 'course', 'book', 'website', 'other'],
    default: 'other'
  },
  pricing: {
    type: String,
    enum: ['free', 'paid', 'freemium', 'unknown'],
    default: 'unknown'
  },
  summary: { type: String, required: true },
  feedbackQuotes: [{ type: String }],
  mentionCount: { type: Number, default: 1 },
  sourceIds: [{ type: Number }],
  bestFor: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all'],
    default: 'all'
  }
});

const SourceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, default: '' }
});

const SearchSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  resources: [ResourceSchema],
  sources: [SourceSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: auto delete records older than 7 days (604,800 seconds)
    expires: 604800
  }
});

module.exports = mongoose.model('Search', SearchSchema);
