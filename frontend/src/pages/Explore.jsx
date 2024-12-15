import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Explore = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      <div className="space-y-4">
        {/* Add explore content here */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          Explore content will appear here
        </div>
      </div>
    </div>
  );
};

export default Explore;
