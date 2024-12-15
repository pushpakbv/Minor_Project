# Social Media Application

A full-stack social media platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time interactions, media sharing, and modern UI/UX.

## Features

### User Management
- 🔐 Secure authentication with JWT
- 👤 User profiles with customizable avatars
- ✏️ Profile editing and bio updates
- 🔍 User search functionality

### Posts and Interactions
- 📝 Create, edit, and delete posts
- 🖼️ Image and media upload via Cloudinary
- ❤️ Like and comment on posts
- 📱 Responsive feed layout
- 🔄 Real-time updates

### Media Handling
- ☁️ Cloud-based media storage with Cloudinary
- 🖼️ Image optimization and resizing
- 📹 Support for multiple file types
- 🔒 Secure file upload and storage

### Security
- 🔒 JWT-based authentication
- 🛡️ Protected API routes
- 🔑 Secure password hashing
- ⚡ Rate limiting
- 🛡️ CORS protection

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management
- Modern CSS for styling

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for media storage
- Express middleware for security

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Git

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd Minor_Project
```

2. Install backend dependencies
```bash
cd backend
npm install --legacy-peer-deps
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Backend (.env):
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Deployment

- Backend: Deployed on Render
- Frontend: Deploy on Vercel
- Database: MongoDB Atlas
- Media Storage: Cloudinary

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for media storage solutions
- Render and Vercel for hosting services
