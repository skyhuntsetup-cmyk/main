import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, Cloud, Calendar, TrendingDown, Shield, Zap, Brain, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AirportSearch } from '../components/AirportSearch';
import { AIRPORTS } from '../../data/airports';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const { user, isAuthenticated } = useStore();

  const [from, setFrom] = useState(AIRPORTS.find(a => a.code === 'JFK') || AIRPORTS[0]);
  const [to, setTo] = useState(AIRPORTS.find(a => a.code === 'LHR') || AIRPORTS[1]);
  const [departDate, setDepartDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax offset
  const getParallax = (speed: number) => {
    if (!heroRef.current) return { x: 0, y: 0 };
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return {
      x: (mousePos.x - centerX) * speed * 0.02,
      y: (mousePos.y - centerY) * speed * 0.02
    };
  };

  const deals = [
    { from: 'NYC', to: 'London', price: 320, flag: '🇬🇧', savings: 45 },
    { from: 'LA', to: 'Tokyo', price: 450, flag: '🇯🇵', savings: 38 },
    { from: 'Miami', to: 'Paris', price: 380, flag: '🇫🇷', savings: 52 },
    { from: 'Chicago', to: 'Dubai', price: 520, flag: '🇦🇪', savings: 41 },
    { from: 'Seattle', to: 'Singapore', price: 490, flag: '🇸🇬', savings: 35 },
    { from: 'Boston', to: 'Rome', price: 410, flag: '🇮🇹', savings: 48 }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Itinerary Master',
      description: 'Generates daily plans, visa hacks, and personalized travel routes.',
      gradient: 'from-[#00F5FF] to-[#00B8D4]'
    },
    {
      icon: Zap,
      title: 'Mistake Fare Detector',
      description: 'Z-score statistical anomaly engine catches 90% off pricing errors.',
      gradient: 'from-[#F59E0B] to-[#EF4444]'
    },
    {
      icon: Shield,
      title: 'Smart Document Vault',
      description: 'Secure, encrypted cloud storage for your passports and visas.',
      gradient: 'from-[#A855F7] to-[#8B5CF6]'
    },
    {
      icon: Plane,
      title: 'Airline Reliability Scores',
      description: 'Advanced trust metrics to actively filter out low-quality carriers.',
      gradient: 'from-[#00F5A0] to-[#00D9A8]'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Plane className="text-[#00F5FF]" size={24} />
          <span className="font-black text-[#001F3F] text-xl">SkyDeal</span>
        </div>
        <div>
          {isAuthenticated && user ? (
            <button 
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            >
              <span className="text-white font-bold">{user.fullName.substring(0, 2).toUpperCase()}</span>
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#001F3F] font-bold shadow-sm hover:bg-white/60 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Living Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 animate-[mesh_20s_ease-in-out_infinite]"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, #E0F2FE 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, #F8FAFC 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #00F5FF15 0%, transparent 40%),
              linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%)
            `
          }}
        />
        <div
          className="absolute inset-0 animate-[mesh_15s_ease-in-out_infinite_reverse] opacity-60"
          style={{
            background: `
              radial-gradient(circle at 60% 30%, #00F5FF20 0%, transparent 40%),
              radial-gradient(circle at 30% 70%, #E0F2FE 0%, transparent 50%)
            `
          }}
        />

        {/* Animated pulse circles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#00F5FF] opacity-5 animate-pulse"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Floating 3D Glass Planes and Clouds with Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
        {[
          { Icon: Plane, speed: 0.5, x: 15, y: 20, size: 60, rotation: 45 },
          { Icon: Cloud, speed: 0.3, x: 75, y: 15, size: 80, rotation: 0 },
          { Icon: Plane, speed: 0.7, x: 60, y: 70, size: 50, rotation: -30 },
          { Icon: Cloud, speed: 0.4, x: 25, y: 60, size: 70, rotation: 0 },
          { Icon: Plane, speed: 0.6, x: 85, y: 45, size: 55, rotation: 15 }
        ].map((item, i) => {
          const parallax = getParallax(item.speed);
          return (
            <div
              key={i}
              className="absolute transition-transform duration-300 ease-out"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(${parallax.x}px, ${parallax.y}px) rotate(${item.rotation}deg)`
              }}
            >
              <div
                className="relative"
                style={{
                  width: item.size,
                  height: item.size
                }}
              >
                <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,245,255,0.15)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <item.Icon className="text-[#00F5FF]" size={item.size * 0.5} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center mb-16 space-y-6">
          {/* Magnetic headline with tilt */}
          <div
            className="transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${(mousePos.y - window.innerHeight / 2) * -0.005}deg) rotateY(${(mousePos.x - window.innerWidth / 2) * 0.005}deg)`
            }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6
                          bg-white/40 backdrop-blur-xl border border-white/60
                          shadow-[0_8px_32px_rgba(0,245,255,0.12)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F5FF] animate-pulse shadow-[0_0_12px_rgba(0,245,255,0.8)]" />
              <span className="text-sm font-bold bg-gradient-to-r from-[#001F3F] to-[#00F5FF] bg-clip-text text-transparent">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#001F3F] via-[#00B8D4] to-[#001F3F] bg-clip-text text-transparent">
                Travel Smarter
              </span>
              <br />
              <span className="text-[#001F3F]">
                With SkyDeal
              </span>
            </h1>

            <p className="text-xl text-[#001F3F]/70 font-medium max-w-2xl mx-auto">
              Our AI scans millions of flights in real-time to find you the absolute best deals.
              Save up to 60% on every booking.
            </p>
          </div>

          {/* Floating Glass Hero Search - Container_Main for Smart Animate */}
          <div className="relative max-w-5xl mx-auto mt-12" id="Container_Main">
            <div
              className="group relative"
              style={{
                transform: `translateY(${Math.sin(Date.now() / 2000) * 5}px)`
              }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00F5FF]/20 via-[#00F5FF]/10 to-[#00F5FF]/20
                            rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Glass Card */}
              <div
                className="relative bg-white/60 rounded-3xl border-[1.5px] border-white/80
                          shadow-[0_32px_64px_rgba(0,31,63,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"
                style={{
                  backdropFilter: 'blur(60px)',
                  WebkitBackdropFilter: 'blur(60px)'
                }}
              >
                <div className="p-10 space-y-8">
                  {/* Search Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <AirportSearch
                        label="From"
                        value={from}
                        onChange={setFrom}
                        placeholder="New York (JFK)"
                      />
                    </div>

                    <div className="space-y-2">
                      <AirportSearch
                        label="To"
                        value={to}
                        onChange={setTo}
                        placeholder="London (LHR)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                        <Calendar size={12} className="text-[#00F5FF]" /> Departure
                      </label>
                      <input
                        type="date"
                        value={departDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl
                                 bg-white/80 backdrop-blur-sm
                                 border-2 border-white/60
                                 text-[#001F3F] font-semibold
                                 focus:border-[#00F5FF] focus:bg-white focus:outline-none
                                 focus:shadow-[0_0_0_4px_rgba(0,245,255,0.15)]
                                 hover:border-[#00F5FF]/50
                                 transition-all duration-200 appearance-none"
                      />
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Primary CTA */}
                    <button
                      onClick={() => navigate('/loading', {
                        state: {
                          from,
                          to,
                          departDate,
                          returnDate: '',
                          passengers: 1,
                          cabin: 'Economy',
                          tripType: 'one-way'
                        }
                      })}
                      className="flex-1 h-16 rounded-xl
                               bg-gradient-to-r from-[#00F5FF] via-[#00D9FF] to-[#00B8D4]
                               text-white font-bold text-lg
                               shadow-[0_12px_32px_rgba(0,245,255,0.3)]
                               hover:shadow-[0_16px_48px_rgba(0,245,255,0.4)]
                               hover:scale-[1.02]
                               active:scale-[0.98]
                               transition-all duration-200
                               relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0
                                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      <div className="relative flex items-center justify-center gap-3">
                        <Search size={24} />
                        <span>Start Exploring</span>
                        <ArrowRight size={24} />
                      </div>
                    </button>

                    {/* Google OAuth Button */}
                    <button
                      onClick={() => onNavigate('login')}
                      className="h-16 px-8 rounded-xl
                               bg-white/60 backdrop-blur-xl
                               border-[1.5px] border-white/80
                               text-[#001F3F] font-bold
                               shadow-[0_8px_24px_rgba(0,31,63,0.08)]
                               hover:shadow-[0_12px_32px_rgba(0,31,63,0.12)]
                               hover:bg-white/80
                               active:scale-[0.98]
                               transition-all duration-200
                               flex items-center justify-center gap-3"
                      style={{
                        backdropFilter: 'blur(60px)',
                        WebkitBackdropFilter: 'blur(60px)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <path fill="#4285F4" d="M19.6 10.23c0-.82-.07-1.42-.23-2.05H10v3.72h5.5c-.11.87-.69 2.18-2 3.07l-.02.1 2.9 2.25.2.02c1.85-1.7 2.92-4.22 2.92-7.11z"/>
                        <path fill="#34A853" d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.08-2.37c-.83.56-1.92.94-3.54.94-2.69 0-4.97-1.7-5.78-4.03l-.12.01-3.02 2.33-.04.11C2.62 17.78 6.03 20 10 20z"/>
                        <path fill="#FBBC05" d="M4.22 11.12c-.22-.64-.34-1.32-.34-2.04 0-.72.12-1.4.33-2.04l-.01-.11-3.05-2.37-.1.05C.37 6.15 0 7.99 0 9.92c0 1.93.37 3.77 1.05 5.36l3.17-2.45z"/>
                        <path fill="#EB4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.03 0 2.62 2.22 1.05 5.43l3.16 2.45C5.03 5.58 7.31 3.88 10 3.88z"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Stream - Horizontal Auto-Scroll */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[#001F3F] mb-8 text-center">
            Live Deals Just In
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-[scroll_30s_linear_infinite]">
              {[...deals, ...deals].map((deal, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 p-6 rounded-2xl
                           bg-white/50 backdrop-blur-xl
                           border-[1.5px] border-white/70
                           shadow-[0_8px_32px_rgba(0,31,63,0.08)]
                           hover:shadow-[0_16px_48px_rgba(0,245,255,0.15)]
                           hover:scale-105
                           transition-all duration-300
                           group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{deal.flag}</span>
                      <div>
                        <div className="font-bold text-[#001F3F] text-lg">
                          {deal.from} → {deal.to}
                        </div>
                        <div className="text-sm text-[#001F3F]/60">Round trip</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-4xl font-bold text-[#00F5FF]">
                      ${deal.price}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#00F5A0]/10 border border-[#00F5A0]/30">
                      <span className="text-sm font-bold text-[#00F5A0]">
                        Save {deal.savings}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-[#001F3F] mb-12 text-center">
            Why Choose SkyDeal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl
                         bg-white/50 backdrop-blur-xl
                         border-2 border-white/70
                         hover:border-[#00F5FF]
                         shadow-[0_8px_32px_rgba(0,31,63,0.08)]
                         hover:shadow-[0_16px_48px_rgba(0,245,255,0.2)]
                         transition-all duration-300
                         relative overflow-hidden"
              >
                {/* Glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient}
                                flex items-center justify-center mb-6
                                shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#001F3F] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#001F3F]/70 font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA with Depth Scroll */}
        <div
          className="relative rounded-3xl p-16 text-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg,
              rgba(0, 71, 171, ${Math.min(scrollY / 1000, 0.95)}) 0%,
              rgba(0, 31, 63, ${Math.min(scrollY / 1000, 0.98)}) 100%)`
          }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join over 2 million travelers who save an average of $450 per booking
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="h-16 px-12 rounded-xl
                       bg-white text-[#001F3F] font-bold text-lg
                       shadow-[0_12px_32px_rgba(255,255,255,0.3)]
                       hover:shadow-[0_16px_48px_rgba(255,255,255,0.4)]
                       hover:scale-105
                       active:scale-95
                       transition-all duration-200"
            >
              Join SkyDeal Now
            </button>
          </div>
        </div>
      </div>

      {/* Live Deals Ticker at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-14
                    bg-[#001F3F]/95 backdrop-blur-xl
                    border-t border-[#00F5FF]/30
                    shadow-[0_-4px_24px_rgba(0,245,255,0.15)]">
        <div className="flex items-center h-full overflow-hidden">
          <div className="flex gap-12 animate-[ticker_40s_linear_infinite] px-8">
            {[...deals, ...deals, ...deals].map((deal, i) => (
              <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-2xl">{deal.flag}</span>
                <span className="font-bold" style={{ color: '#00F5FF' }}>
                  {deal.from} → {deal.to}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white font-bold">${deal.price}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00F5A0]/20 text-[#00F5A0] text-xs font-bold">
                  -{deal.savings}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -2%) scale(1.02); }
          66% { transform: translate(-2%, 2%) scale(0.98); }
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
