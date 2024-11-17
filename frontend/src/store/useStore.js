// src/store/useStore.js
import { create } from 'zustand';

const useStore = create((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  removePost: (id) => set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
}));

export default useStore;