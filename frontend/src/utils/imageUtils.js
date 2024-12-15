export const getFullImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return '/default-avatar.png';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return `http://localhost:5000${imagePath}`;
  return `http://localhost:5000/${imagePath}`;
};