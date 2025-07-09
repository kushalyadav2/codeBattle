import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, Star, Code, Trophy, Target } from 'lucide-react';
import api from '../utils/api';

const Practice = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = [
    'Array', 'String', 'Math', 'Dynamic Programming', 
    'Graph', 'Tree', 'Sorting', 'Searching', 'Other'
  ];

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-400/10',
    Medium: 'text-yellow-400 bg-yellow-400/10',
    Hard: 'text-red-400 bg-red-400/10'
  };

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.category) params.append('category', filters.category);

      const response = await api.get(`/problems?${params}`);
      setProblems(response.data.problems);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [filters.difficulty, filters.category]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProblems(1);
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchProblems()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Practice Problems</h1>
        <p className="text-gray-400 text-lg">
          Sharpen your coding skills with our curated collection of problems
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{pagination.total}</div>
          <div className="text-gray-400">Total Problems</div>
        </div>
        <div className="card text-center">
          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {problems.filter(p => p.difficulty === 'Easy').length}
          </div>
          <div className="text-gray-400">Easy</div>
        </div>
        <div className="card text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {problems.filter(p => p.difficulty === 'Medium').length}
          </div>
          <div className="text-gray-400">Medium</div>
        </div>
        <div className="card text-center">
          <Trophy className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {problems.filter(p => p.difficulty === 'Hard').length}
          </div>
          <div className="text-gray-400">Hard</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems by title or tags..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="btn-primary px-4">
              Search
            </button>
          </form>

          {/* Difficulty Filter */}
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <Link
            key={problem._id}
            to={`/practice/${problem._id}`}
            className="card hover:border-blue-500 transition-colors group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {problem.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Category:</span>
                <span className="text-sm text-blue-400">{problem.category}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {problem.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {problem.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                    +{problem.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{problem.solveCount} solved</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{problem.successRate.toFixed(1)}% success</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && (
        <div className="card text-center py-12">
          <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Problems Found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() => {
              setFilters({ difficulty: '', category: '', search: '' });
              fetchProblems(1);
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => fetchProblems(page)}
              className={`px-4 py-2 rounded-lg ${
                page === pagination.current
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Practice;
