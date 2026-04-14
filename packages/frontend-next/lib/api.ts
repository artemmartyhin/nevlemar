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
  // Already an absolute path (static asset like /main.png or /uploads/xxx) —
  // let the browser fetch it directly via nginx routing
  if (filename.startsWith('/')) return filename;
  // Legacy bare filename — prepend /uploads/
  return `/uploads/${filename}`;
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
  name?: string;
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
  coverImage?: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  author?: string;
  authorAvatar?: string;
  featured?: boolean;
  published?: boolean;
  views?: number;
  likes?: number;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt?: string;
};

export type BlogCategory = { _id?: string; slug: string; name: string };

export type BlogComment = {
  _id: string;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  approved?: boolean;
  parentId?: string | null;
  likes?: number;
  createdAt: string;
  updatedAt?: string;
};

