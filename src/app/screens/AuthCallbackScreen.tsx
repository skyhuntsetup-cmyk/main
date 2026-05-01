import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { Plane } from 'lucide-react';

export function AuthCallbackScreen() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [status, setStatus] = useState('Completing sign in...');
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const log = (msg: string) => {
    console.log('[Auth Callback]', msg);
    setDebugLog(prev => [...prev, msg]);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

    log(`URL params: code=${params.has('code')} error=${params.has('error')} hash_token=${hashParams.has('access_token')}`);
    log(`Supabase configured: ${supabase !== null}`);

    // Surface any OAuth error passed back in the URL immediately
    const urlError = params.get('error') || hashParams.get('error');
    const urlErrorDesc = params.get('error_description') || hashParams.get('error_description');
    if (urlError) {
      const msg = urlErrorDesc ? `${urlError}: ${decodeURIComponent(urlErrorDesc)}` : urlError;
      log(`OAuth error from provider: ${msg}`);
      setStatus(`❌ ${msg}`);
      setTimeout(() => navigate('/login', { replace: true }), 5000);
      return;
    }

    if (!supabase) {
      setStatus('❌ Supabase not configured');
      log('Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      setTimeout(() => navigate('/login'), 4000);
      return;
    }

    const doLogin = (user: any) => {
      login({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        homeAirport: '',
        dateOfBirth: '',
        preferences: [],
      });
      setStatus('✅ Signed in! Redirecting...');
      setTimeout(() => {
        navigate(user.user_metadata?.full_name ? '/home' : '/profile-setup', { replace: true });
      }, 800);
    };

    // Supabase auto-exchanges the PKCE code from the URL on client init
    // (detectSessionInUrl: true). We just need to wait for the session.
    // First check if it's already done:
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        log(`getSession error: ${error.message}`);
        setStatus(`❌ ${error.message}`);
        setTimeout(() => navigate('/login', { replace: true }), 4000);
        return;
      }

      if (session?.user) {
        log(`Session ready immediately. User: ${session.user.email}`);
        doLogin(session.user);
        return;
      }

      // Not ready yet — listen for SIGNED_IN which fires once the
      // automatic PKCE exchange completes
      log('Session pending — waiting for SIGNED_IN event...');

      const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
        log(`Auth event: ${event}`);
        if (event === 'SIGNED_IN' && session?.user) {
          log(`SIGNED_IN! User: ${session.user.email}`);
          subscription.unsubscribe();
          doLogin(session.user);
        } else if (event === 'SIGNED_OUT') {
          subscription.unsubscribe();
          navigate('/login', { replace: true });
        }
      });

      const timer = setTimeout(() => {
        log('Timeout — no session detected after 8s');
        setStatus('❌ Session not detected. Check debug log.');
        subscription.unsubscribe();
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }, 8000);

      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    });
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#F8FAFC] p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_8px_32px_rgba(0,71,171,0.3)]">
          <Plane className="text-white animate-pulse" size={36} />
        </div>
        <div className="w-10 h-10 border-4 border-[#0047AB]/20 border-t-[#0047AB] rounded-full animate-spin" />
        <p className="text-[#001F3F] font-semibold text-lg text-center">{status}</p>

        {debugLog.length > 0 && (
          <div className="w-full bg-black/80 rounded-xl p-4 text-left">
            <p className="text-yellow-400 text-xs font-bold mb-2">Debug Log:</p>
            {debugLog.map((line, i) => (
              <p key={i} className="text-green-400 text-xs font-mono leading-relaxed">{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
