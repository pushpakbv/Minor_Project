export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '/default-avatar.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5000${imagePath}`;
}; 