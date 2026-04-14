import axios from 'axios';

// Server-side calls go directly to backend; browser calls go through
// Next.js rewrite at /api/* to avoid CORS and keep cookies same-origin.
export const API =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || 'http://localhost:3001'
    : '/api';

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export function uploadUrl(filename?: string) {
  if (!filename) return '/main.png';
  if (filename.startsWith('http')) return filename;
  return `${API}/uploads/${filename}`;
}

export type Dog = {
  _id: string;
  name: string;
  born: string;
  breed: string;
  description?: string;
  gender: boolean;
  mom?: string;
  dad?: string;
  images?: string[];
  metaTitle?: string;
  metaDescription?: string;
};

export type PuppyItem = {
  name: string;
  image?: string;
  born: string;
  gender: string;
};

export type PuppiesLitter = {
  _id: string;
  puppies: PuppyItem[];
  mom?: string;
  dad?: string;
  breed: string;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogCategory = { _id?: string; slug: string; name: string };

export type BlogComment = {
  _id: string;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  approved: boolean;
  parentId?: string | null;
  createdAt: string;
};
