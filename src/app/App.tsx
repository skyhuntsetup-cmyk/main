import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, Suspense, lazy } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { LandingPage } from './screens/LandingPage';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { AuthCallbackScreen } from './screens/AuthCallbackScreen';
import { BottomNav } from './components/BottomNav';

// Lazy loaded screens
const ProfileSetupScreen = lazy(() => import('./screens/ProfileSetupScreen').then(module => ({ default: module.ProfileSetupScreen })));
const SearchLoadingScreen = lazy(() => import('./screens/SearchLoadingScreen').then(module => ({ default: module.SearchLoadingScreen })));
const ResultsScreen = lazy(() => import('./screens/ResultsScreen').then(module => ({ default: module.ResultsScreen })));
const AlertsScreen = lazy(() => import('./screens/AlertsScreen').then(module => ({ default: module.AlertsScreen })));
const DealsScreen = lazy(() => import('./screens/DealsScreen').then(module => ({ default: module.DealsScreen })));
const DiscoverScreen = lazy(() => import('./screens/DiscoverScreen').then(module => ({ default: module.DiscoverScreen })));
const ItineraryScreen = lazy(() => import('./screens/ItineraryScreen').then(module => ({ default: module.ItineraryScreen })));
const HotelsScreen = lazy(() => import('./screens/HotelsScreen').then(module => ({ default: module.HotelsScreen })));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen').then(module => ({ default: module.SettingsScreen })));
const PriceCalendarScreen = lazy(() => import('./screens/PriceCalendarScreen').then(module => ({ default: module.PriceCalendarScreen })));
const VaultScreen = lazy(() => import('./screens/VaultScreen').then(module => ({ default: module.VaultScreen })));
const DestinationDetailScreen = lazy(() => import('./screens/DestinationDetailScreen').then(module => ({ default: module.DestinationDetailScreen })));
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

type Tab = 'home' | 'search' | 'hotels' | 'deals' | 'alerts' | 'discover' | 'settings';
const APP_TABS: Tab[] = ['home', 'search', 'hotels', 'deals', 'alerts', 'discover', 'settings'];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.substring(1);
  const { login, logout } = useStore();

  // Use refs so the effect only runs once on mount but always has
  // the latest navigate / login / logout values without re-subscribing.
  const navigateRef = useRef(navigate);
  const loginRef = useRef(login);
  const logoutRef = useRef(logout);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  useEffect(() => { loginRef.current = login; }, [login]);
  useEffect(() => { logoutRef.current = logout; }, [logout]);

  const isInApp = !['/', '/login', '/auth/callback'].includes(location.pathname);
  const activeTab = (APP_TABS.includes(path as Tab) ? path : 'search') as Tab;

  // Set up auth listener exactly ONCE on mount.
  useEffect(() => {
    if (!supabase) return;

    const handleSignIn = (session: any) => {
      const user = session?.user;
      if (!user) return;

      loginRef.current({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        homeAirport: '',
        dateOfBirth: '',
        preferences: [],
        accountTier: 'free',
      });

      // Let AuthCallbackScreen handle navigation during OAuth redirect;
      // only navigate here for non-callback routes (e.g. email login).
      // Only navigate to home/profile-setup if we are currently on a "guest" page
      // (Landing or Login). If the user is already deep-linked into the app, stay there.
      const isGuestPage = ['/', '/login'].includes(window.location.pathname);
      if (!isGuestPage) return;

      if (!user.user_metadata?.full_name) {
        navigateRef.current('/profile-setup', { replace: true });
      } else {
        navigateRef.current('/home', { replace: true });
      }
    };

    // Covers OAuth redirect: tokens land in URL hash, Supabase picks them up here.
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session) handleSignIn(session);
      })
      .catch(err => console.error('Global session check failed:', err));

    // Covers all future auth events (email login, token refresh, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleSignIn(session);
      } else if (event === 'SIGNED_OUT') {
        logoutRef.current();
        navigateRef.current('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — intentional; latest values come through refs.

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <Helmet>
        <title>Sky Hunt | AI-Powered Travel & Mistake Fares</title>
        <meta name="description" content="Discover secret flight deals, mistake fares, and AI-curated travel itineraries with Sky Hunt. Save up to 60% on international flights." />
      </Helmet>

      {/* Global animated background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#EDF4FF] to-[#F0F7FF]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5FF]/4 via-transparent to-[#0047AB]/4" />
      </div>

      <div className={isInApp ? 'pb-24' : ''}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0047AB] font-black">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage onNavigate={(s: string) => navigate(`/${s}`)} />} />
            <Route path="/login" element={<LoginScreen onLoginSuccess={() => navigate('/profile-setup')} />} />
            <Route path="/profile-setup" element={<ProfileSetupScreen onComplete={() => navigate('/home')} />} />
            <Route path="/home" element={<HomeScreen onNavigate={(s: string) => navigate(`/${s}`)} />} />
            <Route path="/search" element={<SearchScreen onSearch={(params) => navigate('/loading', { state: params })} />} />
            <Route path="/hotels" element={<HotelsScreen />} />
            <Route path="/loading" element={<SearchLoadingScreen />} />
            <Route path="/results" element={<ResultsScreen onBack={() => navigate('/search')} />} />
            <Route path="/alerts" element={<AlertsScreen />} />
            <Route path="/deals" element={<DealsScreen />} />
            <Route path="/discover" element={<DiscoverScreen />} />
            <Route path="/discover/:id" element={<DestinationDetailScreen />} />
            <Route path="/itinerary" element={<ItineraryScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/calendar" element={<PriceCalendarScreen />} />
            <Route path="/vault" element={<VaultScreen />} />
            <Route path="/auth/callback" element={<AuthCallbackScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      {isInApp && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => navigate(`/${tab}`)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

