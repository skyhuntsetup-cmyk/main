import { useState } from 'react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { Plane, Mail, Phone, ArrowRight, Sparkles, MessageCircle, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

type AuthMethod = 'email' | 'whatsapp';

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSendMagicLink = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured — check your .env file.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      setSuccessMsg('Magic link sent! Check your inbox to sign in.');
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWhatsAppCode = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured — check your .env file.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        phone, 
        options: { channel: 'whatsapp' } 
      });
      if (error) throw error;
      setSuccessMsg('WhatsApp code sent!');
      setShowOtpInput(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send WhatsApp code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured — check your .env file.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ 
        phone, 
        token: otp, 
        type: 'sms' 
      });
      if (error) throw error;
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid code');
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
              Sign in instantly — no password required
            </p>
          </div>

          {/* Main Login Card */}
          <LiquidGlassCard size="large">
            <div className="space-y-6">
              
              {/* Auth Method Tabs */}
              {!showOtpInput && (
                <div className="flex bg-white/40 p-1 rounded-2xl border border-white/60">
                  <button 
                    onClick={() => { setAuthMethod('email'); setError(''); setSuccessMsg(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      authMethod === 'email' 
                      ? 'bg-white text-[#001F3F] shadow-sm' 
                      : 'text-[#001F3F]/50 hover:bg-white/20'
                    }`}
                  >
                    <Mail size={16} />
                    Email
                  </button>
                  <button 
                    onClick={() => { setAuthMethod('whatsapp'); setError(''); setSuccessMsg(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      authMethod === 'whatsapp' 
                      ? 'bg-[#25D366] text-white shadow-sm' 
                      : 'text-[#001F3F]/50 hover:bg-white/20'
                    }`}
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                </div>
              )}

              {/* Status Banners */}
              {error && (
                <div className="rounded-xl bg-red-500/15 border border-red-500/40 px-4 py-3 text-sm text-red-700 font-semibold">
                  ⚠️ {error}
                </div>
              )}
              {successMsg && (
                <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-700 font-medium">
                  ✅ {successMsg}
                </div>
              )}

              {/* Email Form */}
              {authMethod === 'email' && !showOtpInput && (
                <form onSubmit={handleSendMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#001F3F] mb-2 flex items-center gap-2">
                      <Mail size={16} className="text-[#00F5FF]" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-medium placeholder:text-[#001F3F]/40 focus:border-[#00F5FF] focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,245,255,0.15)] transition-all"
                    />
                  </div>

                  <PremiumButton
                    variant="primary"
                    size="large"
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Link...</span>
                      </div>
                    ) : (
                      <>
                        <span>Send Magic Link</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </PremiumButton>
                  <p className="text-center text-xs text-[#001F3F]/50 mt-2 font-medium">
                    We'll email you a magic link for a password-free sign in.
                  </p>
                </form>
              )}

              {/* WhatsApp Form */}
              {authMethod === 'whatsapp' && !showOtpInput && (
                <form onSubmit={handleSendWhatsAppCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#001F3F] mb-2 flex items-center gap-2">
                      <Phone size={16} className="text-[#25D366]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      required
                      className="w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-medium placeholder:text-[#001F3F]/40 focus:border-[#25D366] focus:outline-none focus:shadow-[0_0_0_4px_rgba(37,211,102,0.15)] transition-all"
                    />
                  </div>

                  <PremiumButton
                    variant="primary"
                    size="large"
                    className="w-full !from-[#25D366] !to-[#128C7E] !shadow-[0_8px_20px_rgba(37,211,102,0.3)]"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Code...</span>
                      </div>
                    ) : (
                      <>
                        <span>Send WhatsApp Code</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </PremiumButton>
                </form>
              )}

              {/* OTP Verification Form */}
              {showOtpInput && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-[fade-in_0.4s_ease-out]">
                  <div>
                    <label className="block text-sm font-bold text-[#001F3F] mb-2 flex items-center gap-2">
                      <Lock size={16} className="text-[#25D366]" />
                      Enter 6-digit Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      required
                      maxLength={6}
                      className="w-full h-14 px-4 text-center tracking-[0.5em] text-2xl rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-black placeholder:text-[#001F3F]/20 focus:border-[#25D366] focus:outline-none focus:shadow-[0_0_0_4px_rgba(37,211,102,0.15)] transition-all"
                    />
                  </div>

                  <PremiumButton
                    variant="primary"
                    size="large"
                    className="w-full !from-[#25D366] !to-[#128C7E]"
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </PremiumButton>
                  
                  <button 
                    type="button" 
                    onClick={() => { setShowOtpInput(false); setOtp(''); setError(''); setSuccessMsg(''); }}
                    className="w-full text-center text-sm font-bold text-[#001F3F]/60 mt-4 hover:text-[#001F3F]"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}

              {/* Features */}
              <div className="pt-6 border-t border-white/20 mt-6">
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
