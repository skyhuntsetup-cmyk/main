import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Sparkles, Plane, TrendingDown } from 'lucide-react';

interface SkyDealHeroProps {
  onSearch?: () => void;
}

export function SkyDealHero({ onSearch }: SkyDealHeroProps) {
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('London (LHR)');
  const [date, setDate] = useState('2026-05-15');
  const [passengers, setPassengers] = useState(2);

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#F8FAFC] animate-[gradient_8s_ease_infinite]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E0F2FE] via-transparent to-[#F8FAFC] animate-[gradient_15s_ease-in-out_infinite] opacity-70"></div>
      </div>

      {/* Global Neural Network Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="neural-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#001F3F" />
            <line x1="1" y1="1" x2="30" y2="30" stroke="#001F3F" strokeWidth="0.5" opacity="0.3" />
            <line x1="1" y1="1" x2="60" y2="1" stroke="#001F3F" strokeWidth="0.5" opacity="0.2" />
            <line x1="1" y1="1" x2="1" y2="60" stroke="#001F3F" strokeWidth="0.5" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#neural-grid)" />

        {/* Animated connection lines */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="#001F3F"
            strokeWidth="0.5"
            opacity="0.1"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,31,63,0.08)]">
            <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse shadow-[0_0_12px_rgba(0,217,255,0.6)]"></div>
            <span className="text-sm font-bold text-[#001F3F]">AI-Powered Flight Discovery</span>
          </div>

          <h1 className="text-6xl font-bold text-[#001F3F] leading-tight">
            Find Your Perfect Flight
            <br />
            <span className="bg-gradient-to-r from-[#001F3F] via-[#00D9FF] to-[#001F3F] bg-clip-text text-transparent">
              At Sky-High Savings
            </span>
          </h1>

          <p className="text-lg text-[#001F3F]/70 font-medium max-w-2xl mx-auto">
            Our neural network scans millions of routes in real-time to surface the best deals
          </p>
        </div>

        {/* Liquid Glass Search Module */}
        <div className="relative max-w-4xl mx-auto">
          {/* Floating Price Pulse Indicator */}
          <div className="absolute -top-6 right-8 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00D9FF] rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00D9FF]/90 to-[#00B8D4]/90 backdrop-blur-xl border border-[#00D9FF]/50 shadow-[0_0_30px_rgba(0,217,255,0.4)]">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-white animate-ping absolute"></div>
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  <span className="text-sm font-bold text-white whitespace-nowrap">
                    AI Finding Deals
                  </span>
                  <Sparkles className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Glass Card */}
          <div className="relative group">
            {/* Glowing Cyan Border Top */}
            <div className="absolute -top-0.5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-[#00D9FF] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>

            {/* Glass Container */}
            <div
              className="relative bg-white/60 rounded-3xl shadow-[0_8px_32px_rgba(0,31,63,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/60"
              style={{ backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)' }}
            >
              {/* Neu-Brutalism Shadow Effect */}
              <div className="absolute -bottom-2 -right-2 w-full h-full bg-[#001F3F]/5 rounded-3xl -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#001F3F]/3 rounded-3xl -z-20"></div>

              <div className="p-8 space-y-6">
                {/* Search Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                      <MapPin size={16} className="text-[#00D9FF]" />
                      From
                    </label>
                    <div className="relative group/input">
                      <select
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/60
                                 text-[#001F3F] font-semibold text-base
                                 focus:border-[#00D9FF] focus:bg-white focus:outline-none
                                 focus:shadow-[0_0_0_4px_rgba(0,217,255,0.1)]
                                 hover:border-[#00D9FF]/50
                                 transition-all duration-200
                                 shadow-[inset_0_2px_4px_rgba(0,31,63,0.04)]"
                      >
                        <option>Delhi (DEL)</option>
                        <option>Mumbai (BOM)</option>
                        <option>Bangalore (BLR)</option>
                      </select>
                    </div>
                  </div>

                  {/* To */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                      <MapPin size={16} className="text-[#00D9FF]" />
                      To
                    </label>
                    <div className="relative">
                      <select
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/60
                                 text-[#001F3F] font-semibold text-base
                                 focus:border-[#00D9FF] focus:bg-white focus:outline-none
                                 focus:shadow-[0_0_0_4px_rgba(0,217,255,0.1)]
                                 hover:border-[#00D9FF]/50
                                 transition-all duration-200
                                 shadow-[inset_0_2px_4px_rgba(0,31,63,0.04)]"
                      >
                        <option>London (LHR)</option>
                        <option>Dubai (DXB)</option>
                        <option>Bangkok (BKK)</option>
                        <option>Singapore (SIN)</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                      <Calendar size={16} className="text-[#00D9FF]" />
                      Departure
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/60
                               text-[#001F3F] font-semibold text-base
                               focus:border-[#00D9FF] focus:bg-white focus:outline-none
                               focus:shadow-[0_0_0_4px_rgba(0,217,255,0.1)]
                               hover:border-[#00D9FF]/50
                               transition-all duration-200
                               shadow-[inset_0_2px_4px_rgba(0,31,63,0.04)]"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                      <Users size={16} className="text-[#00D9FF]" />
                      Passengers
                    </label>
                    <div className="flex items-center gap-3 h-14 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/60 shadow-[inset_0_2px_4px_rgba(0,31,63,0.04)]">
                      <button
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D9FF]/10 to-[#00D9FF]/5
                                 text-[#00D9FF] font-bold hover:from-[#00D9FF]/20 hover:to-[#00D9FF]/10
                                 transition-all active:scale-95 border border-[#00D9FF]/20"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-bold text-[#001F3F] text-lg">
                        {passengers}
                      </span>
                      <button
                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D9FF]/10 to-[#00D9FF]/5
                                 text-[#00D9FF] font-bold hover:from-[#00D9FF]/20 hover:to-[#00D9FF]/10
                                 transition-all active:scale-95 border border-[#00D9FF]/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={onSearch}
                  className="relative w-full h-16 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#00B8D4]
                           text-white font-bold text-lg
                           shadow-[0_8px_24px_rgba(0,217,255,0.25),0_2px_8px_rgba(0,31,63,0.1)]
                           hover:shadow-[0_12px_32px_rgba(0,217,255,0.35),0_4px_12px_rgba(0,31,63,0.15)]
                           active:scale-[0.98]
                           transition-all duration-200
                           overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Search size={24} />
                    <span>Search Flights</span>
                    <Plane size={24} />
                  </div>
                </button>

                {/* Quick Stats */}
                <div className="flex items-center justify-center gap-8 pt-4">
                  {[
                    { icon: Sparkles, label: '50K+ Routes', value: 'AI Scanned' },
                    { icon: TrendingDown, label: 'Save up to', value: '60%' },
                    { icon: Plane, label: 'Updated', value: 'Real-time' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF]/10 to-transparent
                                    flex items-center justify-center border border-[#00D9FF]/20">
                        <stat.icon size={16} className="text-[#00D9FF]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#001F3F]">{stat.value}</div>
                        <div className="text-xs text-[#001F3F]/60">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Elements */}
        <div className="mt-12 flex items-center justify-center gap-4">
          {[
            { emoji: '✈️', label: '2.5M+ Flights', color: 'from-blue-500/10 to-transparent' },
            { emoji: '🌍', label: '500+ Destinations', color: 'from-emerald-500/10 to-transparent' },
            { emoji: '⚡', label: 'Instant Results', color: 'from-amber-500/10 to-transparent' }
          ].map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-md
                       border border-white/60 shadow-[0_4px_16px_rgba(0,31,63,0.06)]
                       hover:shadow-[0_8px_24px_rgba(0,31,63,0.1)] transition-all duration-300
                       hover:-translate-y-1`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-bold text-[#001F3F]">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00D9FF] rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { transform: translateX(0%) translateY(0%); }
          50% { transform: translateX(2%) translateY(2%); }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% { opacity: 0.2; }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.2;
          }
          90% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
