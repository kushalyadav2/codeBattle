import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  Code, 
  Trophy, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/rooms', label: 'Rooms', icon: Users },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const authLinks = isAuthenticated ? [
    { to: '/dashboard', label: 'Dashboard', icon: Code },
    { to: '/profile', label: 'Profile', icon: User },
  ] : [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-400">
            <Zap className="w-6 h-6" />
            <span>CodeBattle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Connection Status */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-400">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="text-white">{user?.username}</div>
                    <div className="text-gray-400">{user?.level}</div>
                  </div>
                </div>

                {/* Auth Links */}
                {authLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {authLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      label === 'Register' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  {authLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                authLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {label}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
