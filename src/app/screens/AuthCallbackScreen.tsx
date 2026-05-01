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
    log('Callback screen mounted');
    log(`Supabase configured: ${supabase !== null}`);
    log(`Current URL: ${window.location.href}`);

    if (!supabase) {
      setStatus('❌ Supabase not configured — check Vercel env vars');
      log('Supabase is null — VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
      setTimeout(() => navigate('/login'), 4000);
      return;
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        log(`getSession error: ${error.message}`);
        setStatus(`❌ Error: ${error.message}`);
        setTimeout(() => navigate('/login'), 4000);
        return;
      }

      if (session?.user) {
        log(`Session found! User: ${session.user.email}`);
        log(`full_name in metadata: ${session.user.user_metadata?.full_name || 'NONE'}`);
        setStatus('✅ Signed in! Redirecting...');
        const user = session.user;
        login({
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: '',
          homeAirport: '',
          dateOfBirth: '',
          preferences: [],
        });
        setTimeout(() => {
          if (!user.user_metadata?.full_name) {
            navigate('/profile-setup', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
        }, 1000);
      } else {
        log('No session from getSession — waiting for SIGNED_IN event...');
        setStatus('Verifying session...');

        if (!supabase) { navigate('/login', { replace: true }); return; }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          log(`Auth event: ${event}`);
          if (event === 'SIGNED_IN' && session?.user) {
            const user = session.user;
            log(`SIGNED_IN! User: ${user.email}`);
            setStatus('✅ Signed in! Redirecting...');
            login({
              fullName: user.user_metadata?.full_name || '',
              email: user.email || '',
              phone: '',
              homeAirport: '',
              dateOfBirth: '',
              preferences: [],
            });
            subscription.unsubscribe();
            setTimeout(() => {
              if (!user.user_metadata?.full_name) {
                navigate('/profile-setup', { replace: true });
              } else {
                navigate('/home', { replace: true });
              }
            }, 1000);
          } else if (event === 'SIGNED_OUT') {
            log('SIGNED_OUT event received');
            subscription.unsubscribe();
            navigate('/login', { replace: true });
          }
        });

        setTimeout(() => {
          log('Timeout — no session detected after 5s');
          setStatus('❌ Session not detected. Returning to login...');
          subscription.unsubscribe();
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        }, 5000);
      }
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

        {/* Debug log — visible on screen */}
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

