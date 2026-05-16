import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PulsePrice } from '../components/PulsePrice';
import { BentoGrid } from '../components/BentoGrid';
import { PremiumButton } from '../components/PremiumButton';
import { EnhancedFlightCard } from '../components/EnhancedFlightCard';
import { Brain, TrendingDown, Shield, Zap, Sparkles, Info } from 'lucide-react';

export function UIShowcase() {

  return (
    <div className="min-h-screen relative pb-24">
      {/* Atmospheric Background with Noise Texture */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#F8FAFC] animate-[mesh_20s_ease-in-out_infinite]">
          {/* 3% Noise Grain Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Animated mesh gradient pulses */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5FF]/5 via-transparent to-[#0047AB]/5 animate-[mesh_15s_ease-in-out_infinite_reverse]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-xl border-[1.5px] border-white/60 shadow-[0_8px_24px_rgba(0,71,171,0.12)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F5FF] animate-pulse shadow-[0_0_12px_rgba(0,245,255,0.8)]" />
            <span className="text-sm font-bold bg-gradient-to-r from-[#0047AB] to-[#00F5FF] bg-clip-text text-transparent">
              UI Showcase - All Features
            </span>
          </div>
          <h1 className="text-5xl font-bold text-[#001F3F]">
            Sky Hunt Premium UI System
          </h1>
          <p className="text-lg text-[#001F3F]/70 font-medium max-w-2xl mx-auto">
            Demonstrating Liquid Glass, AI Pulse Indicators, Bento Grids, and Semantic Colors
          </p>
        </div>

        {/* Feature 1: Liquid Glass Cards with Navy Shadows */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            1. Liquid Glass Cards (15% opacity, 60px blur, Navy shadows)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Basic Glass', desc: 'White 15% opacity with 60px blur' },
              { title: 'With Pulse', desc: 'AI monitoring indicator active', pulse: true },
              { title: 'Hoverable', desc: 'Cyan glow on hover', hoverable: true }
            ].map((item, i) => (
              <LiquidGlassCard
                key={i}
                hoverable={item.hoverable}
                pulseIndicator={item.pulse}
                size="medium"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#001F3F]">{item.title}</h3>
                  <p className="text-sm text-[#001F3F]/70 font-medium">{item.desc}</p>
                  <div className="text-xs text-[#001F3F]/50 font-mono">
                    Shadow: 0_8px_32px_rgba(0,71,171,0.12)
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </section>

        {/* Feature 2: AI Pulse Price Indicators */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            2. AI Pulse Price Indicators (1px Electric Cyan glow)
          </h2>
          <LiquidGlassCard size="large">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[#001F3F] mb-4">With AI Monitoring</h3>
                <PulsePrice price={41200} savings={3200} isMonitoring={true} />
                <p className="text-sm text-[#001F3F]/60 mt-4 font-medium">
                  Notice the dual pulsing rings around the price - this indicates active AI monitoring
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001F3F] mb-4">Static Price</h3>
                <PulsePrice price={41200} savings={3200} isMonitoring={false} />
                <p className="text-sm text-[#001F3F]/60 mt-4 font-medium">
                  Same price without monitoring - no pulse effect
                </p>
              </div>
            </div>
          </LiquidGlassCard>
        </section>

        {/* Feature 3: Bento Grid with Variable Sizes */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            3. Bento Grid (Variable sizes + Hover gradient attraction)
          </h2>
          <BentoGrid
            items={[
              {
                icon: Brain,
                title: 'Primary Deal',
                description: 'Large box (8 cols, 2 rows) with gradient attraction on hover. AI actively monitoring this route.',
                value: '$1,245',
                gradient: 'from-[#00F5FF] to-[#00B8D4]',
                size: 'large',
                pulseIndicator: true
              },
              {
                icon: TrendingDown,
                title: 'Price Prediction',
                description: 'Small metric box (4 cols)',
                gradient: 'from-[#00F5A0] to-[#00D9A8]',
                size: 'small'
              },
              {
                icon: Shield,
                title: 'Watchlist',
                description: '8 routes monitored',
                gradient: 'from-[#A855F7] to-[#8B5CF6]',
                size: 'small',
                pulseIndicator: true
              },
              {
                icon: Zap,
                title: 'Flash Deals',
                description: 'Medium box (6 cols)',
                gradient: 'from-[#F59E0B] to-[#EF4444]',
                size: 'medium'
              },
              {
                icon: Sparkles,
                title: 'AI Insights',
                description: 'Medium box with hover effects',
                gradient: 'from-[#3B82F6] to-[#2563EB]',
                size: 'medium'
              }
            ]}
          />
          <div className="mt-4 p-4 bg-white/40 backdrop-blur-xl rounded-xl border-[1.5px] border-white/60">
            <p className="text-sm text-[#001F3F]/70 font-medium">
              💡 <strong>Hover over any card</strong> to see the gradient "attract" toward it with an animated orb effect
            </p>
          </div>
        </section>

        {/* Feature 4: Semantic CTA Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            4. Semantic CTA Buttons (Navy → Cyan gradient at 45°)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LiquidGlassCard>
              <h3 className="text-lg font-bold text-[#001F3F] mb-4">Primary Action</h3>
              <PremiumButton variant="primary" size="large" className="w-full">
                <Sparkles size={20} />
                Book Now
              </PremiumButton>
              <p className="text-xs text-[#001F3F]/60 mt-3 font-medium">
                Gradient: Navy (#0047AB) → Cyan (#00F5FF)
              </p>
            </LiquidGlassCard>

            <LiquidGlassCard>
              <h3 className="text-lg font-bold text-[#001F3F] mb-4">Glass Variant</h3>
              <PremiumButton variant="glass" size="large" className="w-full">
                Sign in with Google
              </PremiumButton>
              <p className="text-xs text-[#001F3F]/60 mt-3 font-medium">
                Frosted glass with gradient etched border
              </p>
            </LiquidGlassCard>

            <LiquidGlassCard>
              <h3 className="text-lg font-bold text-[#001F3F] mb-4">Success Action</h3>
              <PremiumButton variant="success" size="large" className="w-full">
                Confirm Booking
              </PremiumButton>
              <p className="text-xs text-[#001F3F]/60 mt-3 font-medium">
                Green gradient for positive actions
              </p>
            </LiquidGlassCard>
          </div>
        </section>

        {/* Feature 5: Enhanced Flight Card with All Features */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            5. Complete Flight Card (All features combined)
          </h2>
          <div className="space-y-4">
            <EnhancedFlightCard
              airline="IndiGo"
              departureTime="08:30"
              arrivalTime="20:15"
              duration="23h"
              stops="2 stops (4h in Dubai)"
              price={41200}
              savings={3200}
              rating={4.2}
              reviews={2400}
              delay={0}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/40 backdrop-blur-xl rounded-xl border-[1.5px] border-white/60">
                <div className="text-sm font-bold text-[#001F3F] mb-2">✓ Liquid Glass</div>
                <div className="text-xs text-[#001F3F]/60">15% white, 60px blur</div>
              </div>
              <div className="p-4 bg-white/40 backdrop-blur-xl rounded-xl border-[1.5px] border-white/60">
                <div className="text-sm font-bold text-[#001F3F] mb-2">✓ Pulse Indicator</div>
                <div className="text-xs text-[#001F3F]/60">Top-right corner</div>
              </div>
              <div className="p-4 bg-white/40 backdrop-blur-xl rounded-xl border-[1.5px] border-white/60">
                <div className="text-sm font-bold text-[#001F3F] mb-2">✓ Navy Shadows</div>
                <div className="text-xs text-[#001F3F]/60">rgba(0,71,171,0.12)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 6: Border Gradient Showcase */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            6. Etched Glass Borders (1.5px gradient: White 40% → Cyan 20%)
          </h2>
          <LiquidGlassCard size="large">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-[1.5px]" style={{
                borderImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,245,255,0.2) 100%) 1'
              }}>
                <h3 className="text-lg font-bold text-[#001F3F] mb-2">Standard Gradient Border</h3>
                <p className="text-sm text-[#001F3F]/70">
                  This border uses a 135° linear gradient from White 40% to Cyan 20%
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-xl border-[1.5px]" style={{
                borderImage: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(0,245,255,0.2) 100%) 1'
              }}>
                <h3 className="text-lg font-bold text-[#001F3F] mb-2">Horizontal Gradient (90°)</h3>
                <p className="text-sm text-[#001F3F]/70">
                  With glass background for enhanced depth
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[0, 45, 90, 135].map((angle) => (
                  <div
                    key={angle}
                    className="aspect-square rounded-xl flex items-center justify-center border-[1.5px]"
                    style={{
                      borderImage: `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(0,245,255,0.2) 100%) 1`
                    }}
                  >
                    <span className="text-xs font-bold text-[#001F3F]">{angle}°</span>
                  </div>
                ))}
              </div>
            </div>
          </LiquidGlassCard>
        </section>

        {/* Technical Specs Summary */}
        <section>
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#0047AB] to-[#00F5FF] rounded-full" />
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiquidGlassCard>
              <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                <Info size={20} className="text-[#00F5FF]" />
                Glassmorphism
              </h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-[#001F3F]/60">Background:</span>
                  <span className="text-[#001F3F]">white/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#001F3F]/60">Backdrop blur:</span>
                  <span className="text-[#001F3F]">60px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#001F3F]/60">Border:</span>
                  <span className="text-[#001F3F]">1.5px gradient</span>
                </div>
              </div>
            </LiquidGlassCard>

            <LiquidGlassCard>
              <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                <Info size={20} className="text-[#00F5FF]" />
                Shadows & Effects
              </h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-[#001F3F]/60">Shadow color:</span>
                  <span className="text-[#001F3F]">#0047AB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#001F3F]/60">Noise opacity:</span>
                  <span className="text-[#001F3F]">3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#001F3F]/60">Pulse color:</span>
                  <span className="text-[#001F3F]">#00F5FF</span>
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -2%) scale(1.02); }
          66% { transform: translate(-2%, 2%) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
