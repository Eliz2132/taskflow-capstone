# TaskFlow Capstone

A full-stack MERN task management app built for a capstone project.

## Features
- User registration and login
- JWT authentication
- Create, view, update, and delete tasks
- Task status and priority tracking
- Search and filter tasks
- Responsive dashboard UI

## Project structure

```text
.
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
└──
```

## Local setup

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment variables

Backend `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
JWT_SECRET=your_secret_key_here
```

Frontend `.env` (optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Backend (Render)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add env vars:
  - `PORT=5000`
  - `MONGO_URI=...`
  - `JWT_SECRET=...`

### Frontend (Vercel)
- Root directory: `client`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add env var: `VITE_API_URL=https://your-render-url.onrender.com/api`

## License
MIT
