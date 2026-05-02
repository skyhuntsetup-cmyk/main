import { useState } from 'react';
import { Card } from '../components/Card';
import { User, Phone, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const login = useStore((state) => state.login);
  const user = useStore((state) => state.user);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    homeAirport: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: formData.fullName }
        });
        if (error) throw error;
      }

      login({
        fullName: formData.fullName,
        phone: formData.phone,
        email: user?.email || '',
        homeAirport: formData.homeAirport,
        dateOfBirth: formData.dateOfBirth,
        preferences: [],
        accountTier: 'free'
      });
      onComplete();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const popularAirports = [
    'Delhi (DEL)', 'Mumbai (BOM)', 'Bangalore (BLR)',
    'Chennai (MAA)', 'Hyderabad (HYD)', 'Kolkata (CCU)'
  ];

  return (
    <div className="profile-setup-container min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#F8FAFC]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2FE] via-transparent to-[#F8FAFC] animate-[mesh_15s_ease-in-out_infinite] opacity-70"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#00F5FF] opacity-5 animate-pulse"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
              left: `${20 + i * 20}%`,
              top: `${10 + i * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8 animate-[scale-fade-in_0.7s_cubic-bezier(0.4,0,0.2,1)]">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-4
                          bg-white/40 backdrop-blur-xl border border-white/60
                          shadow-[0_8px_32px_rgba(0,245,255,0.12)]">
              <Sparkles className="text-[#00F5FF]" size={18} />
              <span className="text-sm font-bold text-[#001F3F]">
                Welcome aboard!
              </span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0047AB] to-[#00F5FF] bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-[#001F3F]/70 font-medium text-lg max-w-xl mx-auto">
              Help us personalize your flight hunting experience with a few quick details
            </p>
          </div>

          {/* Profile Setup Form */}
          <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                    <User size={16} className="text-[#1F77D2]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-[#E8E8E8]
                             text-[#001F3F] font-semibold text-base placeholder:text-[#001F3F]/40
                             focus:border-[#1F77D2] focus:bg-white focus:outline-none
                             focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                             hover:border-[#1F77D2]/50
                             transition-all duration-200"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                    <Phone size={16} className="text-[#1F77D2]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-[#E8E8E8]
                             text-[#001F3F] font-semibold text-base placeholder:text-[#001F3F]/40
                             focus:border-[#1F77D2] focus:bg-white focus:outline-none
                             focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                             hover:border-[#1F77D2]/50
                             transition-all duration-200"
                  />
                </div>

                {/* Home Airport */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                    <MapPin size={16} className="text-[#1F77D2]" />
                    Home Airport
                  </label>
                  <select
                    value={formData.homeAirport}
                    onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
                    required
                    className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-[#E8E8E8]
                             text-[#001F3F] font-semibold text-base
                             focus:border-[#1F77D2] focus:bg-white focus:outline-none
                             focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                             hover:border-[#1F77D2]/50
                             transition-all duration-200"
                  >
                    <option value="">Select your nearest airport</option>
                    {popularAirports.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                    <Calendar size={16} className="text-[#1F77D2]" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-[#E8E8E8]
                             text-[#001F3F] font-semibold text-base
                             focus:border-[#1F77D2] focus:bg-white focus:outline-none
                             focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                             hover:border-[#1F77D2]/50
                             transition-all duration-200"
                  />
                </div>
              </div>

              {/* Travel Preferences - Optional */}
              <div className="pt-4 border-t border-[#E8E8E8]">
                <h3 className="text-lg font-bold text-[#222222] mb-4">Travel Preferences (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Economy Class',
                    'Business Class',
                    'Direct Flights',
                    'Window Seat',
                    'Aisle Seat',
                    'Morning Flights'
                  ].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      className="px-4 py-3 rounded-xl border-2 border-[#E8E8E8] text-sm font-semibold text-[#666666]
                               hover:border-[#1F77D2] hover:bg-[#1F77D2]/5 hover:text-[#1F77D2]
                               transition-all duration-200"
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-xl
                           bg-gradient-to-r from-[#1F77D2] to-[#1557a0]
                           text-white font-bold text-lg
                           shadow-[0_8px_24px_rgba(31,119,210,0.25)]
                           hover:shadow-[0_12px_32px_rgba(31,119,210,0.35)]
                           hover:scale-[1.02]
                           active:scale-[0.98]
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           relative overflow-hidden group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Your Profile...</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <Sparkles size={20} />
                        <span>Start Hunting Deals</span>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Info Text */}
              <div className="text-center text-sm text-[#666666] pt-2">
                You can update these details anytime in Settings
              </div>
            </form>
          </Card>

          {/* Benefits Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { emoji: '🎯', label: 'Personalized Deals', desc: 'Based on your preferences' },
              { emoji: '⚡', label: 'Instant Alerts', desc: 'Via SMS & Email' },
              { emoji: '💰', label: 'Save up to 60%', desc: 'On every booking' }
            ].map((benefit, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60
                         shadow-[0_4px_16px_rgba(0,31,63,0.06)] text-center"
              >
                <div className="text-3xl mb-2">{benefit.emoji}</div>
                <div className="text-sm font-bold text-[#222222]">{benefit.label}</div>
                <div className="text-xs text-[#666666] mt-1">{benefit.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -2%) scale(1.02); }
          66% { transform: translate(-2%, 2%) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
