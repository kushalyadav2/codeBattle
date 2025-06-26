import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Trophy, 
  Code, 
  Clock, 
  Target,
  Plus,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Create Room',
      description: 'Start a new competitive coding session',
      icon: Plus,
      to: '/rooms',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Join Room',
      description: 'Find and join existing coding battles',
      icon: Users,
      to: '/rooms',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Practice',
      description: 'Solve problems to improve your skills',
      icon: Code,
      to: '/problems',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Leaderboard',
      description: 'Check your ranking and compete',
      icon: Trophy,
      to: '/leaderboard',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  const stats = [
    { label: 'Total Points', value: user?.totalPoints || 0, icon: Target },
    { label: 'Games Played', value: user?.gamesPlayed || 0, icon: Code },
    { label: 'Games Won', value: user?.gamesWon || 0, icon: Trophy },
    { label: 'Current Streak', value: user?.currentStreak || 0, icon: Clock }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-400">
          Ready for your next coding challenge?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card text-center">
            <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ title, description, icon: Icon, to, color }) => (
            <Link
              key={title}
              to={to}
              className={`${color} p-6 rounded-lg text-white transition-colors group`}
            >
              <Icon className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm opacity-90 mb-4">{description}</p>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="card">
          <div className="text-center py-8 text-gray-400">
            <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity yet.</p>
            <p className="text-sm">Start competing to see your activity here!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
