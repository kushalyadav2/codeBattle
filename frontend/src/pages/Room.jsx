import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import CodeEditor from '../components/CodeEditor';
import {
  Users,
  Clock,
  Trophy,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Send
} from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roomData, joinRoom, leaveRoom, toggleReady, sendMessage, messages } = useSocket();

  const [problem, setProblem] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [roomStatus, setRoomStatus] = useState('waiting');
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const isSpectator = searchParams.get('spectate') === 'true';

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId, isSpectator);
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, isSpectator]);

  useEffect(() => {
    if (roomData) {
      setRoomStatus(roomData.status);
      if (roomData.timer?.endTime) {
        const endTime = new Date(roomData.timer.endTime);
        const updateTimer = () => {
          const now = new Date();
          const remaining = Math.max(0, endTime - now);
          setTimeRemaining(remaining);

          if (remaining === 0) {
            setRoomStatus('finished');
          }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [roomData]);

  const formatTime = (ms) => {
    if (!ms) return '00:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReady = () => {
    toggleReady(roomId);
  };

  const handleSubmitCode = async (submission) => {
    try {
      // Submit code to backend
      const response = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          problemId: problem._id,
          roomId,
          code: submission.code,
          language: submission.language,
          languageId: submission.languageId
        })
      });

      const result = await response.json();

      if (result.submission) {
        setSubmissions(prev => [...prev, result.submission]);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendMessage(roomId, chatMessage.trim());
      setChatMessage('');
    }
  };

  const getCurrentUserParticipant = () => {
    return roomData?.participants?.find(p => p.user.id === user?.id);
  };

  const isHost = roomData?.host?.id === user?.id;
  const currentParticipant = getCurrentUserParticipant();
  const isReady = currentParticipant?.isReady || false;

  if (!roomData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Room Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{roomData.name}</h1>
            <p className="text-gray-400">Room ID: {roomId}</p>
          </div>

          <div className="flex items-center space-x-4">
            {timeRemaining !== null && (
              <div className="flex items-center space-x-2 text-lg font-mono">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className={`${timeRemaining < 300000 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              roomStatus === 'waiting' ? 'bg-yellow-900 text-yellow-300' :
              roomStatus === 'active' ? 'bg-green-900 text-green-300' :
              roomStatus === 'finished' ? 'bg-red-900 text-red-300' :
              'bg-gray-700 text-gray-300'
            }`}>
              {roomStatus.charAt(0).toUpperCase() + roomStatus.slice(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Problem Statement */}
          {problem && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">{problem.title}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{problem.description}</p>

                {problem.examples && problem.examples.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Examples:</h3>
                    {problem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
                        <div className="mb-2">
                          <strong className="text-gray-300">Input:</strong>
                          <code className="block bg-gray-900 p-2 rounded mt-1 text-sm">
                            {example.input}
                          </code>
                        </div>
                        <div className="mb-2">
                          <strong className="text-gray-300">Output:</strong>
                          <code className="block bg-gray-900 p-2 rounded mt-1 text-sm">
                            {example.output}
                          </code>
                        </div>
                        {example.explanation && (
                          <div>
                            <strong className="text-gray-300">Explanation:</strong>
                            <p className="text-gray-400 mt-1">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Editor */}
          {roomStatus === 'active' && problem && (
            <CodeEditor
              roomId={roomId}
              problem={problem}
              onSubmit={handleSubmitCode}
              readOnly={isSpectator}
              showSubmitButton={!isSpectator}
            />
          )}

          {/* Waiting Room */}
          {roomStatus === 'waiting' && (
            <div className="card text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Waiting for Competition to Start</h3>
              <p className="text-gray-400 mb-6">
                {isHost ? 'Start the competition when all participants are ready' : 'Get ready to compete!'}
              </p>

              {!isSpectator && (
                <button
                  onClick={handleReady}
                  className={`btn-primary ${isReady ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {isReady ? <CheckCircle className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isReady ? 'Ready!' : 'Get Ready'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Participants ({roomData.participants?.length || 0}/{roomData.maxParticipants})
            </h3>

            <div className="space-y-3">
              {roomData.participants?.map((participant) => (
                <div key={participant.user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {participant.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{participant.user.username}</div>
                      <div className="text-xs text-gray-400">{participant.user.level}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {participant.solvedAt && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {participant.isReady && roomStatus === 'waiting' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spectators */}
          {roomData.spectators?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Spectators ({roomData.spectators.length})
              </h3>

              <div className="space-y-2">
                {roomData.spectators.map((spectator) => (
                  <div key={spectator.user.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">
                        {spectator.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">{spectator.user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </h3>
              <button
                onClick={() => setShowChat(!showChat)}
                className="text-gray-400 hover:text-white"
              >
                {showChat ? 'Hide' : 'Show'}
              </button>
            </div>

            {showChat && (
              <div className="space-y-4">
                <div className="h-48 overflow-y-auto space-y-2 bg-gray-800 p-3 rounded">
                  {messages.map((message, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-blue-400 font-medium">{message.user.username}:</span>
                      <span className="text-gray-300 ml-2">{message.message}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="btn-primary px-3"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
