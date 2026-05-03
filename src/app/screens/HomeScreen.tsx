import { Plane, Bell, TrendingDown, TrendingUp, Sparkles, ArrowRight, Zap, MapPin, X, Loader2, Brain } from 'lucide-react';
import { useEffect } from 'react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { useStore } from '../../store/useStore';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const mockRecentSearches: any[] = [];
const popularDestinations: any[] = [];
const liveDeals: any[] = [];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const user = useStore((state) => state.user);
  const alerts = useStore((state) => state.alerts);
  const activeAlerts = alerts.filter(a => a.active).length;
  const storeRecentSearches = useStore((state) => state.recentSearches);
  const recentSearches = storeRecentSearches.length > 0 ? storeRecentSearches : mockRecentSearches;
  const notifications = useStore((state) => state.notifications);
  const isCheckingAlerts = useStore((state) => state.isCheckingAlerts);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  
  const unreadNotifications = notifications.filter(n => !n.read);

  useEffect(() => {
    // Optionally trigger check automatically if we have alerts but haven't checked recently
    // get().checkPriceAlerts() is already called in fetchUserData, but we can have a manual refresh button too.
  }, []);

  return (
    <div className="min-h-screen pb-28">
      {/* Hero Header */}
      <div className="relative px-5 pt-14 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
              <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">AI Active</span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F] leading-tight">
              Good morning,<br />
              <span className="bg-gradient-to-r from-[#0047AB] to-[#00B8D4] bg-clip-text text-transparent">
                {user ? user.fullName.split(' ')[0] : 'Rishabh'} ✈️
              </span>
            </h1>
            <p className="text-sm text-[#001F3F]/50 mt-1 font-medium">3 new deals since your last visit</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_4px_16px_rgba(0,71,171,0.35)]">
            <span className="text-white text-base font-black">{user ? user.fullName.substring(0, 2).toUpperCase() : 'RA'}</span>
          </div>
        </div>

        {/* Stat Pills */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: recentSearches.length.toString(), label: 'Routes', icon: MapPin, color: 'from-[#0047AB] to-[#1a6fd4]' },
            { value: alerts.length.toString(), label: 'Alerts', icon: Bell, color: 'from-[#FF6B6B] to-[#f15959]' },
            { value: '12', label: 'Deals', icon: Zap, color: 'from-[#00A854] to-[#008f47]' },
          ].map((stat) => (
            <LiquidGlassCard key={stat.label} size="small" className="text-center py-4">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                <stat.icon size={15} className="text-white" />
              </div>
              <div className="text-2xl font-black text-[#001F3F]">{stat.value}</div>
              <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase tracking-wide mt-0.5">{stat.label}</div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>

      {/* Notifications Area */}
      {(isCheckingAlerts || unreadNotifications.length > 0) && (
        <div className="px-5 mb-6">
          {isCheckingAlerts && (
            <div className="flex items-center justify-center gap-2 py-3 mb-2 rounded-2xl bg-white/40 border border-[#001F3F]/5">
              <Loader2 size={16} className="text-[#0047AB] animate-spin" />
              <span className="text-xs font-bold text-[#001F3F]/50">Checking alerts in background...</span>
            </div>
          )}

          {unreadNotifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Alerts & Updates</h2>
              </div>
              {unreadNotifications.map(notification => (
                <LiquidGlassCard key={notification.id} className={notification.type === 'price_drop' ? 'border-[#00A854]/30 bg-gradient-to-r from-[#00A854]/5 to-transparent' : ''}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                        {notification.type === 'price_drop' ? <TrendingDown size={20} className="text-[#00A854]" /> : <Bell size={20} className="text-[#0047AB]" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#001F3F] text-sm">{notification.title}</h3>
                        <p className="text-xs text-[#001F3F]/70 mt-1">{notification.message}</p>
                        <p className="text-[10px] text-[#001F3F]/40 font-bold mt-2 uppercase tracking-wider">
                          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => markNotificationRead(notification.id)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#001F3F]/5 text-[#001F3F]/40 hover:text-[#001F3F]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Search CTA */}
      <div className="px-5 mb-6">
        <LiquidGlassCard hoverable onClick={() => onNavigate('search')} className="border-[#0047AB]/20 bg-gradient-to-r from-[#0047AB]/8 to-[#00F5FF]/4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_4px_16px_rgba(0,71,171,0.35)] flex-shrink-0">
              <Plane size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#001F3F] text-base">Where to next?</div>
              <div className="text-sm text-[#001F3F]/50 font-medium">Search flights · Compare prices</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center flex-shrink-0">
              <ArrowRight size={16} className="text-white" />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* AI Itinerary Master CTA */}
      <div className="px-5 mb-6">
        <LiquidGlassCard hoverable onClick={() => onNavigate('itinerary')} className="border-[#0047AB]/20 bg-gradient-to-br from-[#001F3F] to-[#0047AB] text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg flex-shrink-0">
              <Brain size={22} className="text-[#00F5FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-white text-base">AI Itinerary Master</div>
              <div className="text-sm text-white/70 font-medium">Visa hacks · Daily plans · Local tips</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F5FF]/20 text-[#00F5FF] text-[10px] font-black uppercase tracking-widest">
              New
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Live Deals Strip */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse" />
            <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Live Deals</h2>
          </div>
          <button onClick={() => onNavigate('deals')} className="text-xs font-bold text-[#0047AB]">See all →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 px-5 no-scrollbar">
          {liveDeals.length > 0 ? liveDeals.map((deal, i) => (
            <LiquidGlassCard
              key={i}
              size="small"
              className={`flex-shrink-0 w-[150px] cursor-pointer ${deal.urgent ? 'border-[#FF6B6B]/40' : ''}`}
              hoverable
              onClick={() => onNavigate('deals')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-[#001F3F]/60">{deal.route}</span>
                {deal.urgent && <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse flex-shrink-0" />}
              </div>
              <div className="text-lg font-black text-[#001F3F]">{deal.price}</div>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#00A854]/10">
                <TrendingDown size={10} className="text-[#00A854]" />
                <span className="text-[10px] font-black text-[#00A854]">{deal.save} OFF</span>
              </div>
            </LiquidGlassCard>
          )) : (
            <div className="w-full p-4 rounded-2xl bg-white/30 border border-dashed border-[#001F3F]/20 text-center">
              <span className="text-xs font-bold text-[#001F3F]/50">No live deals found. Waiting for API integration...</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Recent Searches</h2>
          <button className="text-xs font-bold text-[#0047AB]">See all →</button>
        </div>
        <div className="space-y-2.5">
          {recentSearches.length > 0 ? recentSearches.map((s, i) => (
            <LiquidGlassCard key={i} hoverable onClick={() => onNavigate('search')} size="small">
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{s.flag}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#001F3F] text-sm">{s.from_city} → {s.to_city}</div>
                  <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">{s.date} · {s.code}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-[#0047AB]">{s.price}</div>
                  <ArrowRight size={13} className="text-[#001F3F]/30 ml-auto mt-1" />
                </div>
              </div>
            </LiquidGlassCard>
          )) : (
            <div className="w-full p-6 rounded-2xl bg-white/30 border border-dashed border-[#001F3F]/20 text-center">
              <span className="text-xs font-bold text-[#001F3F]/50">No recent searches. Try making a search!</span>
            </div>
          )}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Popular Destinations</h2>
          <button className="text-xs font-bold text-[#0047AB]">See all →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popularDestinations.length > 0 ? popularDestinations.map((dest, i) => (
            <LiquidGlassCard key={i} hoverable onClick={() => onNavigate('search')} size="small">
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{dest.flag}</span>
                <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  dest.trend === 'down' ? 'bg-[#00A854]/10 text-[#00A854]' :
                  dest.trend === 'up' ? 'bg-[#E74C3C]/10 text-[#E74C3C]' :
                  'bg-[#001F3F]/5 text-[#001F3F]/40'
                }`}>
                  {dest.trend === 'down' && <TrendingDown size={10} />}
                  {dest.trend === 'up' && <TrendingUp size={10} />}
                  <span>{dest.trend === 'stable' ? 'Stable' : `${dest.change}%`}</span>
                </div>
              </div>
              <div className="font-black text-[#001F3F]">{dest.city}</div>
              <div className="text-xs text-[#001F3F]/40 font-medium">{dest.country}</div>
              <div className="text-xl font-black text-[#0047AB] mt-1">{dest.avgPrice}</div>
              <div className="text-[10px] text-[#001F3F]/40 font-medium">avg / person</div>
            </LiquidGlassCard>
          )) : (
            <div className="col-span-2 w-full p-6 rounded-2xl bg-white/30 border border-dashed border-[#001F3F]/20 text-center">
              <span className="text-xs font-bold text-[#001F3F]/50">Waiting for API integration...</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Promo Banner */}
      <div className="px-5">
        <LiquidGlassCard className="border-[#0047AB]/20" pulseIndicator>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-black text-[#001F3F] text-sm">
                {activeAlerts > 0 ? `AI monitoring ${activeAlerts} routes` : 'Setup AI Price Tracking'}
              </div>
              <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">
                {activeAlerts > 0 ? 'Watching for price drops' : 'Never miss a flight deal'}
              </div>
            </div>
            <PremiumButton variant="primary" size="small" onClick={() => onNavigate('alerts')}>
              View
            </PremiumButton>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
