# CodeBattle - Real-time Competitive Coding Platform

A modern, real-time competitive coding platform where developers can compete in live coding battles, solve problems, and climb leaderboards.

## 🚀 Features

### ✅ Core Features Implemented
- **Real-time Multiplayer**: Compete with 2-4 coders in live coding battles
- **Multiple Languages**: Support for JavaScript, Python, C++, Java
- **Timed Challenges**: Fast-paced competitions with countdown timers
- **Leaderboards**: Global, weekly, and monthly rankings
- **Skill Levels**: Problems ranging from Easy to Hard difficulty
- **Spectator Mode**: Watch live competitions and learn from others
- **Code Editor**: Monaco Editor with syntax highlighting and auto-completion
- **Real-time Communication**: Socket.IO for live updates and chat
- **Badge System**: Achievements for Fast Solver, Bug Hunter, Streak Master, etc.
- **User Authentication**: JWT-based secure authentication
- **Problem Management**: CRUD operations for coding problems
- **Code Execution**: Judge0 API integration for testing solutions

### 🎯 Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Socket.IO Client
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB with Mongoose
- **Code Editor**: Monaco Editor
- **Code Execution**: Judge0 API
- **Authentication**: JWT tokens
- **Deployment**: Docker + Docker Compose

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProblemSolvingGame
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run seed  # Seed database with sample problems
   npm run dev   # Start development server
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev   # Start development server
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Docker Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Application: http://localhost:3000
   - API: http://localhost:3001

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codebattle
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

## 🎮 How to Use

1. **Register/Login**: Create an account or sign in
2. **Dashboard**: View your stats and quick actions
3. **Create/Join Room**: Start a new battle or join existing ones
4. **Compete**: Solve coding problems in real-time
5. **Leaderboard**: Check your ranking and compete for the top

## 🏗️ Project Structure

```
ProblemSolvingGame/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utility functions
│   └── public/
├── backend/                 # Node.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── socket/              # Socket.IO handlers
│   ├── utils/               # Utility functions
│   └── controllers/         # Route controllers
└── docker-compose.yml       # Docker configuration
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Environment
1. Set up environment variables for production
2. Configure MongoDB connection
3. Set up Judge0 API key for code execution
4. Deploy using Docker Compose or your preferred method

### Scaling Considerations
- Use Redis for session storage in multi-instance deployments
- Implement horizontal scaling for the backend
- Use CDN for static assets
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed ....

## 🙏 Acknowledgments

- Judge0 API for code execution
- Monaco Editor for the code editor
- Socket.IO for real-time communication
- Tailwind CSS for styling
- React ecosystem for the frontend

## 📞 Support

For support, email kushalyadav589@gmail.com or create an issue in the repository.
