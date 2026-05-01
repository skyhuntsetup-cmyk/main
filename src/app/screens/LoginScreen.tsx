import { useState } from 'react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { Plane, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    if (!supabase) {
      alert('Supabase credentials are not configured. Please add them to your .env file.');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message || 'An error occurred during authentication');
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      alert('Supabase credentials are not configured. Please add them to your .env file.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLoginSuccess();
      } else {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Registration successful! Please check your email to verify your account.');
        setIsLogin(true); // Switch back to login
      }
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#F8FAFC] animate-[mesh_20s_ease-in-out_infinite]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5FF]/5 via-transparent to-[#0047AB]/5 animate-[mesh_15s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-[fade-in_0.6s_ease-out]">
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_8px_32px_rgba(0,71,171,0.3)]">
                <Plane className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0047AB] to-[#00F5FF] bg-clip-text text-transparent">
              Welcome to SkyDeal
            </h1>
            <p className="text-[#001F3F]/70 font-medium">
              {isLogin ? 'Sign in to continue your journey' : 'Create your account and start saving'}
            </p>
          </div>

          {/* Main Login Card */}
          <LiquidGlassCard size="large">
            <div className="space-y-6">
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <PremiumButton
                  variant="glass"
                  size="large"
                  className="w-full"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path fill="#4285F4" d="M19.6 10.23c0-.82-.07-1.42-.23-2.05H10v3.72h5.5c-.11.87-.69 2.18-2 3.07l-.02.1 2.9 2.25.2.02c1.85-1.7 2.92-4.22 2.92-7.11z"/>
                    <path fill="#34A853" d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.08-2.37c-.83.56-1.92.94-3.54.94-2.69 0-4.97-1.7-5.78-4.03l-.12.01-3.02 2.33-.04.11C2.62 17.78 6.03 20 10 20z"/>
                    <path fill="#FBBC05" d="M4.22 11.12c-.22-.64-.34-1.32-.34-2.04 0-.72.12-1.4.33-2.04l-.01-.11-3.05-2.37-.1.05C.37 6.15 0 7.99 0 9.92c0 1.93.37 3.77 1.05 5.36l3.17-2.45z"/>
                    <path fill="#EB4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.03 0 2.62 2.22 1.05 5.43l3.16 2.45C5.03 5.58 7.31 3.88 10 3.88z"/>
                  </svg>
                  <span>Continue with Google</span>
                </PremiumButton>

                <PremiumButton
                  variant="glass"
                  size="large"
                  className="w-full"
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15.5 9c0-2.8 2.3-4.2 2.4-4.3-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.3 1-4.2 1-.9 0-2.2-1-3.6-1C4.4 2.6 2.5 3.9 1.5 5.8c-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.6 2.8 1.4-.1 2-1 3.6-1s2.2.9 3.6.9c1.5 0 2.5-1.3 3.5-2.7.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.5-3.7m-2.8-8.3c.8-1 1.3-2.4 1.2-3.7-1.2.1-2.6.8-3.4 1.8-.8.9-1.4 2.3-1.2 3.6 1.3.1 2.6-.6 3.4-1.7"/>
                  </svg>
                  <span>Continue with Apple</span>
                </PremiumButton>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/20 backdrop-blur-sm rounded-full text-[#001F3F]/60 font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#001F3F] mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-[#00F5FF]" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-medium placeholder:text-[#001F3F]/40 focus:border-[#00F5FF] focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,245,255,0.15)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#001F3F] mb-2 flex items-center gap-2">
                    <Lock size={16} className="text-[#00F5FF]" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-medium placeholder:text-[#001F3F]/40 focus:border-[#00F5FF] focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,245,255,0.15)] transition-all"
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-[#001F3F]/70">Remember me</span>
                    </label>
                    <button type="button" className="text-[#00F5FF] font-semibold hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <PremiumButton
                  variant="primary"
                  size="large"
                  className="w-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </PremiumButton>
              </form>

              {/* Toggle Login/Signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-[#001F3F]/70"
                >
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span className="text-[#00F5FF] font-bold hover:underline">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>

              {/* Features */}
              <div className="pt-6 border-t border-white/20">
                <div className="space-y-3">
                  {[
                    'Save up to 60% on every flight',
                    'AI-powered price predictions',
                    'Real-time deal alerts'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00F5A0] to-[#00D9A8] flex items-center justify-center flex-shrink-0">
                        <Sparkles size={12} className="text-white" />
                      </div>
                      <span className="text-[#001F3F]/80 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Footer */}
          <div className="text-center text-sm text-[#001F3F]/60">
            By continuing, you agree to our{' '}
            <button className="text-[#00F5FF] font-semibold hover:underline">Terms</button>
            {' '}and{' '}
            <button className="text-[#00F5FF] font-semibold hover:underline">Privacy Policy</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -2%) scale(1.02); }
          66% { transform: translate(-2%, 2%) scale(0.98); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
