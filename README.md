# SmartAI - AI Chat Application

**SmartAI** is a modern, full-stack conversational AI application that brings the power of Google's Gemini AI directly to your browser. Built with the MERN stack, it offers a seamless chat experience with intelligent responses, voice recognition, and persistent conversation management.

## 🌐 Live Demo

**🚀 [Try SmartAI Live](https://superb-pastelito-2a1e81.netlify.app)**

## ✨ What Makes SmartAI Special

🤖 **Powered by Google Gemini 2.5 Flash** - Experience cutting-edge AI conversations with one of the most advanced language models available

🎙️ **Voice-First Design** - Speak naturally to the AI using built-in speech recognition, making interactions feel more human and intuitive

💬 **Smart Conversation Management** - Your chats are automatically organized with AI-generated titles, making it easy to find and continue previous conversations

🔐 **Secure & Private** - Enterprise-grade JWT authentication with HTTP-only cookies ensures your conversations remain private and secure

⚡ **Real-Time Experience** - Watch AI responses appear with realistic typing animations, creating an engaging conversational flow

🎨 **Personalized Interface** - Switch between light and dark themes, with a clean, distraction-free design that focuses on what matters - your conversation

## 🎯 Perfect For

- **Developers** seeking to understand modern full-stack AI integration
- **Students** learning MERN stack development with real-world AI APIs
- **Businesses** wanting a private, self-hosted AI chat solution
- **AI Enthusiasts** exploring conversational AI interfaces
- **Anyone** who wants a powerful, personalized AI assistant

## 🚀 Features

- **JWT Cookie Authentication** - Secure login/signup
- **AI Chat** - Google Gemini 2.5 Flash integration
- **Voice Recognition** - Speech-to-text input
- **Thread Management** - Conversation history with auto-titles
- **Responsive Design** - Mobile-first UI
- **Theme Toggle** - Light/dark mode
- **Real-time Chat** - Typing animation and instant responses

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Speech Recognition  
**Backend:** Express.js, MongoDB, Mongoose, JWT, bcryptjs, Google GenAI  
**Styling:** CSS3, Font Awesome, Bootstrap

## 📁 Project Structure

```
SmartAI/
├── Backend/
│   ├── controller/AuthController.js    # Login/signup
│   ├── middleware/AuthMiddleWare.js    # JWT verification
│   ├── model/User.js & Thread.js       # Database schemas
│   ├── Routes/AuthRoutes.js & chat.js  # API endpoints
│   ├── utils/smartai.js                # Gemini API
│   └── server.js                       # Express server
├── frontend/
│   ├── src/
│   │   ├── Pages/login.jsx & signup.jsx
│   │   ├── chat/Chat.jsx & Search.jsx
│   │   ├── sidebar/Sidebar.jsx
│   │   ├── api/axios.js                # HTTP client
│   │   └── App.jsx                     # Main component
│   └── vite.config.js
```

## 🚦 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (Atlas recommended)
- Google Gemini API Key

### Setup

```bash
# Clone repository
git clone <repo-url> && cd SmartAI

# Backend setup
cd Backend && npm install

# Frontend setup  
cd ../frontend && npm install
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/smartai
SecreteKey=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
PORT=8080
```

**Frontend (.env)**
```env
VITE_THREAD_API_URL=http://localhost:8080/api
```

### Run Application

```bash
# Start Backend
cd Backend && npm run dev

# Start Frontend (new terminal)
cd frontend && npm run dev
```

**Access:** http://localhost:5173

## 🔧 API Endpoints

### Authentication
```
POST /api/signup     # Register user
POST /api/login      # Login user  
POST /api/           # Verify token
```

### Chat
```
GET  /api/thread              # Get threads
POST /api/chat                # Send message
DELETE /api/thread/:id        # Delete thread
```

### Example Request
```javascript
POST /api/chat
{
  "threadId": "optional-uuid",
  "message": { "content": "Hello!", "role": "user" },
  "userId": "user-id"
}
```

## 🤖 AI Integration

```javascript
// Gemini API call
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: message }] }]
    })
  }
);
```

## 🔐 Authentication

**JWT Cookie Settings (Development):**
```javascript
{
  httpOnly: false,
  secure: false,
  sameSite: "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000  // 3 days
}
```

## � Production

### Environment
```env
# Production settings
NODE_ENV=production
DATABASE_URL=mongodb+srv://prod-connection
GEMINI_API_KEY=prod-key
```

### Cookie Settings
```javascript
{
  httpOnly: true,
  secure: true,
  sameSite: "strict"
}
```

### Build
```bash
cd frontend && npm run build
cd Backend && npm start
```

## 🐛 Troubleshooting

**Cookie Issues:**
- Check CORS `credentials: true`
- Verify axios `withCredentials: true`
- Use `sameSite: "lax"` for localhost

**API Errors:**
- Verify `GEMINI_API_KEY`
- Check MongoDB connection string
- Ensure proper environment variables

## 📝 Scripts

```bash
# Development
npm run dev          # Backend with nodemon
npm run dev          # Frontend with Vite

# Production  
npm start            # Backend
npm run build        # Frontend build
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and create PR

## 📄 License

ISC License

## 👨‍💻 Author

**Omkar Shelke**

---