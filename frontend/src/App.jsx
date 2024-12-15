import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Trending from './pages/Trending';
import Explore from './pages/Explore';
import YourPosts from './pages/YourPosts';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Popular from './pages/Popular';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost/>
                </ProtectedRoute>
              }
            />
            <Route path="/popular" element={<Popular />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/explore" element={<Explore />} />
            <Route 
              path="/your-posts" 
              element={
                <ProtectedRoute>
                  <YourPosts />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
