import React, { useState } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global');

  // Mock data
  const leaderboardData = [
    { rank: 1, username: 'CodeMaster', level: 'Platinum', points: 15420, wins: 89, avatar: 'CM' },
    { rank: 2, username: 'AlgoExpert', level: 'Gold', points: 12350, wins: 76, avatar: 'AE' },
    { rank: 3, username: 'DevNinja', level: 'Gold', points: 11200, wins: 68, avatar: 'DN' },
    { rank: 4, username: 'CodeWarrior', level: 'Silver', points: 9800, wins: 55, avatar: 'CW' },
    { rank: 5, username: 'BugHunter', level: 'Silver', points: 8900, wins: 49, avatar: 'BH' },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Platinum': return 'bg-cyan-600';
      case 'Gold': return 'bg-yellow-600';
      case 'Silver': return 'bg-gray-500';
      case 'Bronze': return 'bg-amber-700';
      default: return 'bg-gray-600';
    }
  };

  const tabs = [
    { id: 'global', label: 'Global', icon: Trophy },
    { id: 'weekly', label: 'Weekly', icon: Medal },
    { id: 'monthly', label: 'Monthly', icon: Award }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">See how you rank against other coders</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-800 rounded-lg p-1 flex space-x-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((user, index) => {
          const positions = [1, 0, 2]; // Second place in middle for podium effect
          const actualUser = leaderboardData[positions[index]];
          const heights = ['h-32', 'h-40', 'h-28'];
          
          return (
            <div key={actualUser.rank} className="text-center">
              <div className={`card ${heights[index]} flex flex-col justify-end p-4 relative`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {actualUser.avatar}
                  </div>
                </div>
                <div className="mt-4">
                  {getRankIcon(actualUser.rank)}
                  <div className="text-white font-semibold">{actualUser.username}</div>
                  <div className={`text-xs px-2 py-1 rounded text-white ${getLevelColor(actualUser.level)}`}>
                    {actualUser.level}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{actualUser.points} pts</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="card">
        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                user.rank <= 3 ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>
                
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.avatar}
                </div>
                
                <div>
                  <div className="text-white font-semibold">{user.username}</div>
                  <div className={`text-xs px-2 py-1 rounded text-white inline-block ${getLevelColor(user.level)}`}>
                    {user.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-white font-semibold">{user.points}</div>
                  <div className="text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{user.wins}</div>
                  <div className="text-gray-400">Wins</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Rank */}
      <div className="card bg-blue-900 border-blue-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Your Rank</h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">#42</div>
              <div className="text-sm text-gray-300">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1,250</div>
              <div className="text-sm text-gray-300">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">23</div>
              <div className="text-sm text-gray-300">Wins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
