import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Popular = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Popular Posts</h1>
      <div className="space-y-4">
        {/* Add popular posts content here */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          Popular posts will appear here
        </div>
      </div>
    </div>
  );
};

export default Popular;
