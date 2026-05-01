import { create } from 'zustand';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  homeAirport: string;
  dateOfBirth: string;
  preferences: string[];
}

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  currency: string;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setCurrency: (currency: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  currency: 'INR',
  
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateProfile: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
  
  setCurrency: (currency) => set({ currency }),
}));
