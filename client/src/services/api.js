import axios from 'axios';

// Vite environment variable or local server default
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
