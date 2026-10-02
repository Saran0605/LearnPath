import axios from 'axios';

// Determine API base URL dynamically for Dev vs Production
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production (e.g. Render fullstack deploy), use relative /api path
  if (import.meta.env.MODE === 'production' || typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Searches for a skill's recommendations
 * @param {string} skill 
 */
export const searchSkill = async (skill) => {
  const response = await api.post('/search', { skill });
  return response.data;
};

/**
 * Fetches recent searches
 */
export const getRecentSearches = async () => {
  const response = await api.get('/recent');
  return response.data;
};

export default api;
