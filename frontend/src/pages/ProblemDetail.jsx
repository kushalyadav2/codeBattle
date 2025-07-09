import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MemoryStick, Users, Target, Play, Code } from 'lucide-react';
import api from '../utils/api';
import CodeEditor from '../components/CodeEditor';

const ProblemDetail = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
    { id: 'java', name: 'Java', extension: 'java' }
  ];

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20'
  };

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[selectedLanguage] || '// Your code here');
    }
  }, [problem, selectedLanguage]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/problems/${problemId}`);
      setProblem(response.data.problem);
    } catch (err) {
      setError('Failed to fetch problem details');
      console.error('Error fetching problem:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      // Simulate submission (replace with actual submission API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      setSubmissionResult({
        status: 'Accepted',
        testsPassed: 3,
        totalTests: 3,
        runtime: '45ms',
        memory: '12.3MB'
      });
    } catch (err) {
      setSubmissionResult({
        status: 'Error',
        message: 'Submission failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert('Please write some code before running!');
      return;
    }

    // Simulate code execution
    console.log('Running code:', code);
    alert('Code execution feature coming soon!');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-red-400 mb-4">{error || 'Problem not found'}</p>
          <Link to="/practice" className="btn-primary">
            Back to Practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/practice"
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <span className="text-gray-400">{problem.category}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="space-y-6">
          <div className="card">
            <h1 className="text-2xl font-bold text-white mb-4">{problem.title}</h1>
            
            {/* Problem Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{problem.timeLimit}ms</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MemoryStick className="w-4 h-4" />
                <span>{problem.memoryLimit}MB</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{problem.solveCount} solved</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Target className="w-4 h-4" />
                <span>{problem.successRate.toFixed(1)}%</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-400">Input:</span>
                        <pre className="text-green-400 mt-1 font-mono text-sm">{example.input}</pre>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-400">Output:</span>
                        <pre className="text-blue-400 mt-1 font-mono text-sm">{example.output}</pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-sm font-medium text-gray-400">Explanation:</span>
                          <p className="text-gray-300 mt-1 text-sm">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Constraints</h3>
              <div className="text-gray-300 text-sm whitespace-pre-wrap">
                {problem.constraints}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <div className="card">
            {/* Language Selector */}
            <div className="flex items-center justify-between mb-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>

              <div className="flex space-x-2">
                <button
                  onClick={handleRunCode}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={selectedLanguage}
                height="400px"
              />
            </div>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Submission Result</h3>
              <div className={`p-4 rounded-lg ${
                submissionResult.status === 'Accepted' 
                  ? 'bg-green-900/20 border border-green-500/20' 
                  : 'bg-red-900/20 border border-red-500/20'
              }`}>
                <div className={`font-semibold mb-2 ${
                  submissionResult.status === 'Accepted' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {submissionResult.status}
                </div>
                {submissionResult.status === 'Accepted' && (
                  <div className="space-y-1 text-sm text-gray-300">
                    <div>Tests Passed: {submissionResult.testsPassed}/{submissionResult.totalTests}</div>
                    <div>Runtime: {submissionResult.runtime}</div>
                    <div>Memory: {submissionResult.memory}</div>
                  </div>
                )}
                {submissionResult.message && (
                  <div className="text-sm text-gray-300">{submissionResult.message}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
