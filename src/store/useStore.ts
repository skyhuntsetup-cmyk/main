import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  homeAirport: string;
  dateOfBirth: string;
  preferences: string[];
}

export interface RecentSearch {
  id?: string;
  from_city: string;
  to_city: string;
  code: string;
  date: string;
  flag: string;
  price?: string;
  timestamp?: number;
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
  
  addSearch: (search: Omit<RecentSearch, 'timestamp' | 'id'>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'dateAdded'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  
  fetchUserData: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      currency: 'INR',
      recentSearches: [],
      alerts: [],
      
      login: (user) => {
        set({ user, isAuthenticated: true });
        get().fetchUserData();
      },
      
      logout: () => set({ user: null, isAuthenticated: false, recentSearches: [], alerts: [] }),
      
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      setCurrency: (currency) => set({ currency }),

      fetchUserData: async () => {
        if (!supabase) return;
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: searches } = await supabase
            .from('recent_searches')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          const { data: alerts } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (searches) {
            set({ recentSearches: searches });
          }
          if (alerts) {
            // Map db columns back to frontend state if necessary
            const mappedAlerts = alerts.map((a: any) => ({
              id: a.id,
              route: a.route,
              fromCode: a.from_code,
              toCode: a.to_code,
              targetPrice: a.target_price,
              currentPrice: a.current_price,
              currency: a.currency,
              active: a.active,
              dateAdded: new Date(a.created_at).getTime()
            }));
            set({ alerts: mappedAlerts });
          }
        } catch (err) {
          console.error("Failed to sync with Supabase", err);
        }
      },
      
      addSearch: async (search) => {
        const newSearch = { ...search, timestamp: Date.now() };
        set((state) => {
          const filtered = state.recentSearches.filter(s => s.code !== search.code || s.date !== search.date);
          return { recentSearches: [newSearch, ...filtered].slice(0, 5) };
        });

        // Sync to Supabase
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('recent_searches').insert({
              user_id: user.id,
              from_city: search.from_city,
              to_city: search.to_city,
              code: search.code,
              date: search.date,
              flag: search.flag,
              price: search.price
            });
          }
        }
      },
      
      addAlert: async (alert) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        const newAlert = {
          ...alert,
          id: tempId,
          dateAdded: Date.now()
        };
        
        set((state) => ({
          alerts: [newAlert, ...state.alerts]
        }));

        // Sync to Supabase
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await supabase.from('price_alerts').insert({
              user_id: user.id,
              route: alert.route,
              from_code: alert.fromCode,
              to_code: alert.toCode,
              target_price: alert.targetPrice,
              current_price: alert.currentPrice,
              currency: alert.currency,
              active: alert.active
            }).select().single();
            
            // Replace temp id with real id
            if (data && !error) {
              set((state) => ({
                alerts: state.alerts.map(a => a.id === tempId ? { ...a, id: data.id } : a)
              }));
            }
          }
        }
      },
      
      toggleAlert: async (id) => {
        const alertToToggle = get().alerts.find(a => a.id === id);
        if (!alertToToggle) return;

        const newActive = !alertToToggle.active;
        set((state) => ({
          alerts: state.alerts.map(a => a.id === id ? { ...a, active: newActive } : a)
        }));

        if (supabase) {
          await supabase.from('price_alerts').update({ active: newActive }).eq('id', id);
        }
      },
      
      deleteAlert: async (id) => {
        set((state) => ({
          alerts: state.alerts.filter(a => a.id !== id)
        }));

        if (supabase) {
          await supabase.from('price_alerts').delete().eq('id', id);
        }
      }
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
