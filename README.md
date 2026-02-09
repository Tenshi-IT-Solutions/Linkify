# Linkify - Real-time Chat Application

Linkify is a modern, full-stack real-time chat application built with the MERN stack. It features instant messaging, live language translation, and a secure, robust architecture.

## 🚀 Features

- **Real-time Messaging**: Instant communication powered by **Socket.io**.
- **Voice Messaging**: Record and send voice messages with automatic **speech-to-text transcription**.
- **Live Translation**: Seamlessly translate text and voice transcripts between languages using **Google Cloud Translate**.
- **Secure Authentication**: Robust system using JWT (JSON Web Tokens) in HTTP-only cookies.
- **Global Diversity**: Pre-seeded with a diverse range of 15+ multicultural user profiles.
- **Responsive Design**: Beautiful UI built with **React**, **Tailwind CSS**, and **DaisyUI**.
- **State Management**: Optimized performance using **Zustand**.
- **Pagination**: Efficient message loading with cursor-based pagination.
- **Testing**: Comprehensive test suites using **Jest** (Backend) and **Vitest** (Frontend).

## 🌐 Real-time Language Translation & Voice Features

Linkify breaks down language barriers with its advanced communication suite:

### 🎙️ Voice Messaging with Transcription
- **Record**: Users can record voice messages directly in the chat.
- **Transcribe**: Audio is automatically processed by **Google Cloud Speech-to-Text** to generate a text transcript.
- **Accessibility**: Transcripts ensure messages are accessible even in noisy environments or for users with hearing impairments.

### 🗣️ Instant Translation
- **Auto-Detect**: The system automatically detects the language of incoming text and voice transcripts.
- **Translate**: Use the language selector to instantly translate the entire chat history into your preferred language (e.g., English, Spanish, French, etc.).
- **Context Aware**: Translations are context-aware, ensuring accurate and meaningful communication across cultures.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io (with JWT authentication)
- **Audio Processing**: Google Cloud Speech-to-Text
- **Translation**: Google Cloud Translation API
- **Security**: bcryptjs, jsonwebtoken, cookie-parser
- **Testing**: Jest, Supertest

## 📂 Project Structure

```
Chat App/
├── backend/              # Server-side logic
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API endpoints
│   │   ├── seeds/        # Database seeders
│   │   └── lib/          # Utilities (socket, db, etc.)
│   └── __tests__/        # Integration tests
├── frontend/             # Client-side application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application views
│   │   └── store/        # Zustand stores
│   └── src/store/        # Tests
├── directives/           # Agent Standard Operating Procedures (SOPs)
├── execution/            # Agent execution scripts
└── Agents.md             # System instructions
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas URI (or local instance)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tenshi-IT-Solutions/Linkify.git
   cd Linkify
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create `.env` in `backend/`:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # For Voice Transcription (Optional)
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_CLOUD_CREDENTIALS_PATH=path/to/credentials.json
   ```

   Create `.env.development` in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

### 🏃‍♂️ Running the App

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

### 🧪 Running Tests

**Backend Integration Tests**:
```bash
cd backend
npm test
```

**Frontend Unit/Component Tests**:
```bash
cd frontend
npm test
```

## 🌱 Seeding the Database
To populate the database with diverse demo users:
```bash
cd backend
node src/seeds/diverse_users.seed.js
```

## 🔒 Security Highlights
- **Socket Authentication**: Socket connections are guarded by a strict JWT handshake.
- **XSS Protection**: Inputs are sanitized and cookies are HTTP-only.
- **Port Conflict Resolution**: Backend automatically finds an available port if 5001 is busy.

## 🤝 Contribution
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
