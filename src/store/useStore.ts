import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  homeAirport: string;
  dateOfBirth: string;
  preferences: string[];
}

export interface RecentSearch {
  from: string;
  to: string;
  code: string;
  date: string;
  flag: string;
  price?: string;
  timestamp: number;
}

export interface Alert {
  id: string;
  route: string;
  fromCode: string;
  toCode: string;
  targetPrice: number;
  currentPrice?: number;
  currency: string;
  active: boolean;
  dateAdded: number;
}

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  currency: string;
  recentSearches: RecentSearch[];
  alerts: Alert[];
  
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setCurrency: (currency: string) => void;
  
  addSearch: (search: Omit<RecentSearch, 'timestamp'>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'dateAdded'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      currency: 'INR',
      recentSearches: [],
      alerts: [],
      
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      setCurrency: (currency) => set({ currency }),
      
      addSearch: (search) => set((state) => {
        const newSearch = { ...search, timestamp: Date.now() };
        // Avoid exact duplicates
        const filtered = state.recentSearches.filter(s => s.code !== search.code || s.date !== search.date);
        return { recentSearches: [newSearch, ...filtered].slice(0, 5) };
      }),
      
      addAlert: (alert) => set((state) => ({
        alerts: [{
          ...alert,
          id: Math.random().toString(36).substr(2, 9),
          dateAdded: Date.now()
        }, ...state.alerts]
      })),
      
      toggleAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, active: !a.active } : a)
      })),
      
      deleteAlert: (id) => set((state) => ({
        alerts: state.alerts.filter(a => a.id !== id)
      }))
    }),
    {
      name: 'skyhunt-storage',
      partialize: (state) => ({ 
        recentSearches: state.recentSearches,
        alerts: state.alerts,
        currency: state.currency
      }),
    }
  )
);
