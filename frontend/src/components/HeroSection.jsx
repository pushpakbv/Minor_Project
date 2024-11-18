import React from 'react';

const HeroSection = () => {
  return (
    <div className="hero bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold tracking-wide mb-4">
          Welcome to <span className="underline decoration-yellow-300">TheCipher</span>
        </h1>
        <p className="text-xl mb-8">
          Dive into the latest updates and discover trending posts!
        </p>
        <a
          href="#"
          className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
          Explore Posts
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
