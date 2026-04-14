'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  role: 'admin' | 'user';
} | null;

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(r.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async () => {
    // MOCK: dev-login skips Google OAuth entirely
    try {
      const r = await axios.get(`${API}/auth/dev-login`, { withCredentials: true });
      if (r.data?.user) {
        setUser(r.data.user);
        return;
      }
    } catch {}
    // Fallback: real Google flow
    window.location.href = `${API}/auth/google`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.get(`${API}/auth/logout`, { withCredentials: true });
    } catch {}
    setUser(null);
  }, []);

  return { user, loading, login, logout, refresh };
}
