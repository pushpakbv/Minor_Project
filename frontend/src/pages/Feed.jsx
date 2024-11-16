import React from 'react';

const Feed = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TheCipher</h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 mt-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Welcome to your Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Post */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-blue-600">Post Title</h3>
            <p className="text-gray-600 mt-2">
              This is an example of a post. Start creating amazing posts here!
            </p>
          </div>
          {/* Add more posts dynamically */}
        </div>
      </main>
    </div>
  );
};

export default Feed;
