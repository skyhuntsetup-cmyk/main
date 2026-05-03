import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { searchFlights } from '../lib/flightApi';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  homeAirport: string;
  dateOfBirth: string;
  preferences: string[];
  accountTier: 'free' | 'premium' | 'pro';
  dealPreferences?: {
    maxBudget: number;
    cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
    maxLayovers: number;
  };
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'info' | 'alert';
  timestamp: number;
  read: boolean;
}

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  currency: string;
  recentSearches: RecentSearch[];
  alerts: Alert[];
  notifications: AppNotification[];
  isCheckingAlerts: boolean;
  
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setCurrency: (currency: string) => void;
  setAccountTier: (tier: 'free' | 'premium' | 'pro') => void;
  
  addSearch: (search: Omit<RecentSearch, 'timestamp' | 'id'>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'dateAdded'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  
  markNotificationRead: (id: string) => void;
  checkPriceAlerts: () => Promise<void>;
  
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
      notifications: [],
      isCheckingAlerts: false,
      
      login: (user) => {
        set({ user, isAuthenticated: true });
        get().fetchUserData();
      },
      
      logout: () => set({ user: null, isAuthenticated: false, recentSearches: [], alerts: [] }),
      
      updateProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const newUser = { ...currentUser, ...updates };
        set({ user: newUser });

        // Sync to Supabase
        if (supabase) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: authUser.id,
                full_name: newUser.fullName,
                phone: newUser.phone,
                home_airport: newUser.homeAirport,
                date_of_birth: newUser.dateOfBirth,
                preferences: newUser.preferences,
                deal_preferences: newUser.dealPreferences,
                is_premium: newUser.accountTier !== 'free'
              });
            if (error) console.error("Error syncing profile:", error);
          }
        }
      },
      
      setCurrency: (currency) => set({ currency }),

      setAccountTier: (accountTier) => {
        set((state) => ({
          user: state.user ? { ...state.user, accountTier } : null
        }));
        get().updateProfile({ accountTier });
      },

      fetchUserData: async () => {
        if (!supabase) return;
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) return;

          // Fetch Profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profile) {
            set({
              user: {
                fullName: profile.full_name || '',
                email: authUser.email || '',
                phone: profile.phone || '',
                homeAirport: profile.home_airport || '',
                dateOfBirth: profile.date_of_birth || '',
                preferences: profile.preferences || [],
                accountTier: profile.is_premium ? 'premium' : 'free',
                dealPreferences: profile.deal_preferences || {
                  maxBudget: 50000,
                  cabinClass: 'economy',
                  maxLayovers: 1
                }
              }
            });
          }

          const { data: searches } = await supabase
            .from('recent_searches')
            .select('*')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(5);

          const { data: alerts } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('user_id', authUser.id)
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

          // Trigger background alert check
          get().checkPriceAlerts();

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
      },

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),

      checkPriceAlerts: async () => {
        const { alerts } = get();
        const activeAlerts = alerts.filter(a => a.active);
        
        if (activeAlerts.length === 0) return;

        set({ isCheckingAlerts: true });
        
        const newNotifications: AppNotification[] = [];

        try {
          for (const alert of activeAlerts) {
            // For demo purposes, we will fetch flights 14 days from now.
            let departDateStr = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0];
            
            try {
              const flights = await searchFlights({
                fromCode: alert.fromCode,
                toCode: alert.toCode,
                departDate: departDateStr,
                adults: 1,
                cabinClass: 'economy',
                currency: get().currency
              });

              if (flights && flights.length > 0) {
                const cheapest = flights[0].price;
                if (cheapest < alert.targetPrice) {
                  // Price dropped!
                  newNotifications.push({
                    id: Math.random().toString(),
                    title: `Price Drop Alert: ${alert.route}`,
                    message: `Prices have dropped to ₹${cheapest.toLocaleString('en-IN')}, well below your target of ₹${alert.targetPrice}!`,
                    type: 'price_drop',
                    timestamp: Date.now(),
                    read: false
                  });

                  // Update alert currentPrice
                  set((state) => ({
                    alerts: state.alerts.map(a => a.id === alert.id ? { ...a, currentPrice: cheapest } : a)
                  }));

                  if (supabase) {
                    await supabase.from('price_alerts').update({ current_price: cheapest }).eq('id', alert.id);
                  }
                }
              }
            } catch (e) {
              console.error(`Error checking alert for ${alert.route}`, e);
            }
          }

          if (newNotifications.length > 0) {
            set((state) => ({
              notifications: [...newNotifications, ...state.notifications].slice(0, 50)
            }));
          }
        } finally {
          set({ isCheckingAlerts: false });
        }
      }
    }),
    {
      name: 'skyhunt-storage',
      partialize: (state) => ({ 
        recentSearches: state.recentSearches,
        alerts: state.alerts,
        currency: state.currency,
        notifications: state.notifications
      }),
    }
  )
);
