import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { LandingPage } from './screens/LandingPage';
import { LoginScreen } from './screens/LoginScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { DealsScreen } from './screens/DealsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

type Tab = 'home' | 'search' | 'alerts' | 'deals' | 'settings';
const APP_TABS: Tab[] = ['home', 'search', 'alerts', 'deals', 'settings'];

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

  const isInApp = APP_TABS.includes(path as Tab) || path === 'results';
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
      });

      // New user (no full_name saved yet) → complete profile setup first
      if (!user.user_metadata?.full_name) {
        navigateRef.current('/profile-setup', { replace: true });
      } else {
        // Returning user → go straight to the app home
        navigateRef.current('/home', { replace: true });
      }
    };

    // Covers OAuth redirect: tokens land in URL hash, Supabase picks them up here.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleSignIn(session);
    });

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
      {/* Global animated background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#EDF4FF] to-[#F0F7FF]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5FF]/4 via-transparent to-[#0047AB]/4" />
      </div>

      <div className={isInApp ? 'pb-24' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={(s) => navigate(`/${s}`)} />} />
          <Route path="/login" element={<LoginScreen onLoginSuccess={() => navigate('/profile-setup')} />} />
          <Route path="/profile-setup" element={<ProfileSetupScreen onComplete={() => navigate('/home')} />} />
          <Route path="/home" element={<HomeScreen onNavigate={(s) => navigate(`/${s}`)} />} />
          <Route path="/search" element={<SearchScreen onSearch={() => navigate('/results')} />} />
          <Route path="/results" element={<ResultsScreen onBack={() => navigate('/search')} />} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/deals" element={<DealsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {isInApp && path !== 'results' && (
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
    <Router>
      <AppContent />
    </Router>
  );
}
