import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Plus, 
  Clock, 
  Target,
  Eye,
  Play,
  Search
} from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simulate loading rooms
    setTimeout(() => {
      setRooms([
        {
          id: '1',
          roomId: 'ABC123',
          name: 'Quick Battle',
          host: { username: 'CodeMaster', level: 'Gold' },
          participants: 2,
          maxParticipants: 4,
          difficulty: 'Easy',
          status: 'waiting'
        },
        {
          id: '2',
          roomId: 'XYZ789',
          name: 'Algorithm Challenge',
          host: { username: 'AlgoExpert', level: 'Platinum' },
          participants: 3,
          maxParticipants: 4,
          difficulty: 'Hard',
          status: 'waiting'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.host.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || room.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Coding Rooms</h1>
          <p className="text-gray-400">Join or create competitive coding sessions</p>
        </div>
        
        {isAuthenticated && (
          <Link
            to="/create-room"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search rooms or hosts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="input-field"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No rooms found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || difficultyFilter !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a room!'
            }
          </p>
          {isAuthenticated && (
            <Link to="/create-room" className="btn-primary">
              Create Room
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{room.name}</h3>
                  <p className="text-sm text-gray-400">Room ID: {room.roomId}</p>
                </div>
                <span className={`text-sm font-medium ${getDifficultyColor(room.difficulty)}`}>
                  {room.difficulty}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Host:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{room.host.username}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {room.host.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Players:</span>
                  <div className="flex items-center space-x-1 text-white">
                    <Users className="w-4 h-4" />
                    <span>{room.participants}/{room.maxParticipants}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 capitalize">{room.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/room/${room.roomId}`}
                  className="btn-primary flex-1 text-center"
                >
                  <Play className="w-4 h-4 inline mr-1" />
                  Join
                </Link>
                <Link
                  to={`/room/${room.roomId}?spectate=true`}
                  className="btn-secondary px-3"
                  title="Watch as spectator"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
