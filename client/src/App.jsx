import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import ResourceCard from './components/ResourceCard';
import RecentSearches from './components/RecentSearches';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import { searchSkill, getRecentSearches } from './services/api';
import { Zap, Sparkles, BookOpenCheck } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentSkill, setCurrentSkill] = useState('sql');
  const [searchData, setSearchData] = useState(null);
  const [recentList, setRecentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Client-side Filters State
  const [filters, setFilters] = useState({
    pricing: 'all',
    type: 'all',
    level: 'all'
  });

  // Fetch initial recent searches and default pre-cached skill on load
  useEffect(() => {
    loadRecentSearches();
    handleSearch('sql');
  }, []);

  const loadRecentSearches = async () => {
    try {
      const recents = await getRecentSearches();
      if (Array.isArray(recents)) {
        setRecentList(recents);
      }
    } catch (err) {
      console.warn('Failed to load recent searches:', err.message);
    }
  };

  const handleSearch = async (skillToSearch) => {
    if (!skillToSearch || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setCurrentSkill(skillToSearch);

    try {
      const data = await searchSkill(skillToSearch);

      if (data.error) {
        setErrorMsg(data.message || 'An error occurred while searching.');
        setSearchData(null);
      } else {
        setSearchData(data);
        if (!data.resources || data.resources.length === 0) {
          setErrorMsg(data.message || 'Not enough real feedback found for this skill. Try a broader term.');
        }
      }

      // Refresh recent searches list
      loadRecentSearches();
    } catch (err) {
      console.error('Search request failed:', err);
      const serverErrorMsg = err.response?.data?.message || 'Failed to fetch recommendations. Make sure the server is running.';
      setErrorMsg(serverErrorMsg);
      setSearchData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterCategory, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterCategory]: value
    }));
  };

  // Filter resources client-side
  const filteredResources = useMemo(() => {
    if (!searchData?.resources) return [];

    return searchData.resources.filter((res) => {
      // Pricing filter
      if (filters.pricing !== 'all' && res.pricing !== filters.pricing) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all') {
        if (filters.type === 'youtube') {
          if (!res.type.includes('youtube')) return false;
        } else if (res.type !== filters.type) {
          return false;
        }
      }

      // Level filter
      if (filters.level !== 'all' && res.bestFor !== 'all' && res.bestFor !== filters.level) {
        return false;
      }

      return true;
    });
  }, [searchData, filters]);

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          currentSkill={currentSkill}
        />

        {/* Recently Searched Carousel / Pills */}
        <RecentSearches
          recentList={recentList}
          onSelectSkill={handleSearch}
          isLoading={isLoading}
        />

        {/* Main Loading State */}
        {isLoading && <LoadingSkeleton skill={currentSkill} />}

        {/* Error / Empty State */}
        {!isLoading && errorMsg && (
          <ErrorMessage
            message={errorMsg}
            isNotFound={errorMsg.includes('Not enough real feedback')}
            onRetry={() => handleSearch('python')}
          />
        )}

        {/* Results View */}
        {!isLoading && !errorMsg && searchData && searchData.resources && searchData.resources.length > 0 && (
          <div className="results-container">
            <div className="results-header-banner">
              <div className="results-title-group">
                <h2 className="results-skill-title">
                  Top Recommended Resources for <span className="skill-highlight">"{searchData.skill}"</span>
                </h2>
                {searchData.cached && (
                  <span className="cached-badge" title="Retrieved from fast 7-day MongoDB cache">
                    <Zap size={14} /> Instant Cache
                  </span>
                )}
              </div>

              <p className="results-subtitle">
                Ranked by real learner mention frequency and community feedback.
              </p>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              totalCount={searchData.resources.length}
              filteredCount={filteredResources.length}
            />

            {/* Filter Empty State */}
            {filteredResources.length === 0 && (
              <div className="no-filter-match">
                <BookOpenCheck size={32} />
                <p>No resources match the selected filter criteria.</p>
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={() => setFilters({ pricing: 'all', type: 'all', level: 'all' })}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Resources Grid */}
            <div className="resources-grid">
              {filteredResources.map((resource, idx) => (
                <ResourceCard
                  key={`${resource.name}-${idx}`}
                  resource={resource}
                  sources={searchData.sources}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
