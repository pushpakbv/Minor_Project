import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('/auth/register', { username, email, password });
      alert(response.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label htmlFor="username" className="block font-medium mb-2">Username</label>
          <input
            type="text"
            id="username"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
