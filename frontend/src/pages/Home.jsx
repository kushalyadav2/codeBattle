import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  Users, 
  Trophy, 
  Zap, 
  Clock, 
  Target,
  Star,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Real-time Multiplayer',
      description: 'Compete with 2-4 coders in live coding battles'
    },
    {
      icon: Code,
      title: 'Multiple Languages',
      description: 'Support for JavaScript, Python, C++, Java and more'
    },
    {
      icon: Clock,
      title: 'Timed Challenges',
      description: 'Fast-paced competitions with countdown timers'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Climb the ranks and earn badges for achievements'
    },
    {
      icon: Target,
      title: 'Skill Levels',
      description: 'Problems ranging from Easy to Hard difficulty'
    },
    {
      icon: Star,
      title: 'Spectator Mode',
      description: 'Watch live competitions and learn from others'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CODE & COMPETE
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            WITH YOUR FRIENDS
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join real-time competitive coding battles. Solve problems, climb leaderboards, 
            and prove your programming skills in fast-paced multiplayer competitions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/rooms"
                  className="btn-secondary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
                >
                  <Users className="w-5 h-5" />
                  <span>Browse Rooms</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose CodeBattle?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
                <p className="text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Create or Join Room</h3>
              <p className="text-gray-300">
                Start a new coding battle or join an existing room with other programmers
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">Solve Problems</h3>
              <p className="text-gray-300">
                Race against time to solve coding challenges in your preferred language
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Earn Points & Climb</h3>
              <p className="text-gray-300">
                Get points for correct solutions and climb the global leaderboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Start Competing?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of programmers in the ultimate coding competition platform
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Sign Up Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
