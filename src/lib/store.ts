import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

interface ContentState {
  heroImage: string;
  logoImage: string;
  heroTitle: string;
  heroSubtitle: string;
  setHeroImage: (url: string) => void;
  setLogoImage: (url: string) => void;
  setHeroTitle: (title: string) => void;
  setHeroSubtitle: (subtitle: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading }),
}));

export const useContentStore = create<ContentState>((set) => ({
  heroImage: '/melnica.jpg',
  logoImage: '/logo.png',
  heroTitle: 'Луксозен жилищна сграда',
  heroSubtitle: 'Модерна архитектура и уникален стил в сърцето на Варна',
  setHeroImage: (url) => set({ heroImage: url }),
  setLogoImage: (url) => set({ logoImage: url }),
  setHeroTitle: (title) => set({ heroTitle: title }),
  setHeroSubtitle: (subtitle) => set({ heroSubtitle: subtitle }),
}));