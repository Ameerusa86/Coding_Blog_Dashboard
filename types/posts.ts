// src/types/posts.ts
export interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  technologies: string[];
  githubLink: string;
  date: string;
  image: string;
  createdAt: string;
}
