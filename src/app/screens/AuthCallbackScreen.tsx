import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { Plane } from 'lucide-react';

export function AuthCallbackScreen() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    if (!supabase) {
      setStatus('Configuration error. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Exchange the code in the URL for a session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Auth callback error:', error);
        setStatus('Sign in failed. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (session?.user) {
        const user = session.user;
        login({
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: '',
          homeAirport: '',
          dateOfBirth: '',
          preferences: [],
        });

        // New user → profile setup, existing user → home
        if (!user.user_metadata?.full_name) {
          navigate('/profile-setup', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      } else {
        // No session found — wait for onAuthStateChange to fire
        setStatus('Verifying session...');
        if (!supabase) {
          navigate('/login', { replace: true });
          return;
        }
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const user = session.user;
            login({
              fullName: user.user_metadata?.full_name || '',
              email: user.email || '',
              phone: '',
              homeAirport: '',
              dateOfBirth: '',
              preferences: [],
            });
            subscription.unsubscribe();
            if (!user.user_metadata?.full_name) {
              navigate('/profile-setup', { replace: true });
            } else {
              navigate('/home', { replace: true });
            }
          } else if (event === 'SIGNED_OUT') {
            subscription.unsubscribe();
            navigate('/login', { replace: true });
          }
        });

        // Fallback — if nothing fires in 5s, go to login
        setTimeout(() => {
          subscription.unsubscribe();
          navigate('/login', { replace: true });
        }, 5000);
      }
    });
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#F8FAFC]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_8px_32px_rgba(0,71,171,0.3)]">
          <Plane className="text-white animate-pulse" size={36} />
        </div>

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-[#0047AB]/20 border-t-[#0047AB] rounded-full animate-spin" />

        <p className="text-[#001F3F]/70 font-semibold text-lg">{status}</p>
      </div>
    </div>
  );
}
