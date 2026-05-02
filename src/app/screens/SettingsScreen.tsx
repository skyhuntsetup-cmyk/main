import { useState } from 'react';
import { ChevronRight, User, Bell, Lock, HelpCircle, LogOut, Settings as SettingsIcon, Award, Search, MapPin, Sparkles, X, Link, Star, Cloud } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { useStore } from '../../store/useStore';

export function SettingsScreen() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const alerts = useStore((state) => state.alerts);
  const recentSearches = useStore((state) => state.recentSearches);
  const setAccountTier = useStore((state) => state.setAccountTier);
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const uniqueRoutes = new Set(recentSearches.map(s => s.code)).size;
  
  const currentTier = user?.accountTier || 'free';
  
  const tierLabels = {
    free: 'Free Member',
    premium: 'Premium Member',
    pro: 'Pro Member'
  };

  const menuSections = [
    {
      title: 'Data & Integrations',
      items: [
        { icon: Cloud, label: 'Data Sources', sub: 'Google Flights, Booking.com, Airbnb', color: '#0047AB' },
        { icon: Link, label: 'Connected Accounts', sub: 'Frequent flyer programs', color: '#3498DB' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Sparkles, label: 'Deal Preferences', sub: 'Max budget, cabin class, layovers', color: '#00A854' },
        { icon: Bell, label: 'Notification Settings', sub: 'Email, Push, SMS', color: '#FF6B6B' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', sub: user?.fullName || 'Manage profile', color: '#F39C12' },
        { icon: Lock, label: 'Privacy & Security', sub: 'Password, sessions', color: '#8E44AD' },
      ],
    },
    {
      title: 'Help',
      items: [
        { icon: HelpCircle, label: 'About & Help', sub: 'FAQ, support, feedback', color: '#2C3E50' },
      ],
    },
  ];

  const stats = [
    { value: recentSearches.length, label: 'Searches', icon: Search, color: 'from-[#0047AB] to-[#1a6fd4]' },
    { value: alerts.length, label: 'Alerts', icon: Bell, color: 'from-[#FF6B6B] to-[#f15959]' },
    { value: uniqueRoutes, label: 'Routes', icon: MapPin, color: 'from-[#00A854] to-[#008f47]' },
    { value: currentTier === 'pro' ? '∞' : currentTier === 'premium' ? 20 : 5, label: 'Alert Limit', icon: Star, color: 'from-[#F39C12] to-[#e89c0c]' },
  ];

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon size={14} className="text-[#0047AB]" />
              <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Account</span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Settings</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Manage your profile & preferences</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Profile card */}
        <LiquidGlassCard className="border-[#0047AB]/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_4px_16px_rgba(0,71,171,0.35)] flex-shrink-0">
              <span className="text-white text-xl font-black">{user ? user.fullName.substring(0, 2).toUpperCase() : 'ME'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-[#001F3F] text-xl truncate">{user ? user.fullName : 'Guest'}</div>
              <div className="text-sm text-[#001F3F]/50 font-medium truncate">{user ? user.email : 'Not logged in'}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r border ${
                  currentTier === 'pro' ? 'from-[#8E44AD]/15 to-transparent border-[#8E44AD]/20' : 
                  currentTier === 'premium' ? 'from-[#00A854]/15 to-transparent border-[#00A854]/20' :
                  'from-[#F39C12]/15 to-transparent border-[#F39C12]/20'
                }`}>
                  <Award size={12} className={
                    currentTier === 'pro' ? 'text-[#8E44AD]' : 
                    currentTier === 'premium' ? 'text-[#00A854]' : 'text-[#F39C12]'
                  } />
                  <span className={`text-[10px] font-black ${
                    currentTier === 'pro' ? 'text-[#8E44AD]' : 
                    currentTier === 'premium' ? 'text-[#00A854]' : 'text-[#F39C12]'
                  }`}>{tierLabels[currentTier]}</span>
                </div>
              </div>
            </div>
            <PremiumButton variant="glass" size="small">Edit</PremiumButton>
          </div>
        </LiquidGlassCard>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <LiquidGlassCard key={s.label} size="small" className="text-center py-3">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-1.5`}>
                <s.icon size={13} className="text-white" />
              </div>
              <div className="text-xl font-black text-[#001F3F]">{s.value}</div>
              <div className="text-[10px] text-[#001F3F]/50 font-bold mt-0.5">{s.label}</div>
            </LiquidGlassCard>
          ))}
        </div>

        {/* Menu sections */}
        {menuSections.map((section) => (
          <div key={section.title}>
            <div className="text-[10px] font-black text-[#001F3F]/40 uppercase tracking-widest mb-2 px-1">{section.title}</div>
            <LiquidGlassCard size="small" className="divide-y divide-white/20">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}18` }}>
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-bold text-[#001F3F] text-sm">{item.label}</div>
                    <div className="text-xs text-[#001F3F]/40 font-medium truncate mt-0.5">{item.sub}</div>
                  </div>
                  <ChevronRight size={16} className="text-[#001F3F]/30 flex-shrink-0" />
                </button>
              ))}
            </LiquidGlassCard>
          </div>
        ))}

        {/* Upgrade banner */}
        {currentTier !== 'pro' && (
          <LiquidGlassCard className="border-[#F39C12]/30 bg-gradient-to-r from-[#F39C12]/8 to-transparent" pulseIndicator>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F39C12] to-[#e89c0c] flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-black text-[#001F3F] text-sm">Level up your searches</div>
                <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">Explore Premium & Pro plans</div>
              </div>
              <PremiumButton onClick={() => setShowUpgradeModal(true)} variant="primary" size="small">Upgrade</PremiumButton>
            </div>
          </LiquidGlassCard>
        )}

        {/* Logout */}
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border-[1.5px] border-[#E74C3C]/40 text-[#E74C3C] font-bold text-sm hover:bg-[#E74C3C]/5 transition-colors mt-6">
          <LogOut size={18} />
          Log Out
        </button>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#001F3F]/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#F0F4F8] rounded-3xl overflow-hidden shadow-2xl animate-slide-up relative">
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setShowUpgradeModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 text-[#001F3F]/50 hover:bg-white/80">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 pb-0">
              <h2 className="text-2xl font-black text-[#001F3F] mb-1">Choose Plan</h2>
              <p className="text-sm text-[#001F3F]/60 font-medium mb-6">Unlock more alerts and premium data sources.</p>
            </div>
            
            <div className="px-6 space-y-4 pb-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              {/* Free Tier */}
              <div 
                onClick={() => { setAccountTier('free'); setShowUpgradeModal(false); }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${currentTier === 'free' ? 'border-[#F39C12] bg-white' : 'border-transparent bg-white/60 hover:bg-white'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-black text-[#001F3F] text-lg">Free</div>
                  <div className="text-sm font-black text-[#001F3F]/40">₹0/mo</div>
                </div>
                <ul className="text-sm text-[#001F3F]/60 space-y-1">
                  <li>• 5 Price Alerts</li>
                  <li>• Basic Google Flights integration</li>
                  <li>• Standard UI views</li>
                </ul>
              </div>

              {/* Premium Tier */}
              <div 
                onClick={() => { setAccountTier('premium'); setShowUpgradeModal(false); }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 relative ${currentTier === 'premium' ? 'border-[#00A854] bg-[#00A854]/5' : 'border-[#00A854]/20 bg-white/80 hover:bg-[#00A854]/5'}`}
              >
                {currentTier === 'premium' && (
                  <div className="absolute -top-3 left-4 bg-[#00A854] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Current Plan</div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <div className="font-black text-[#00A854] text-lg">Premium</div>
                  <div className="text-sm font-black text-[#00A854]">₹299/mo</div>
                </div>
                <ul className="text-sm text-[#001F3F]/70 space-y-1 font-medium">
                  <li>• 20 Price Alerts</li>
                  <li>• Full Booking.com integration</li>
                  <li>• Automated Deal Scraping</li>
                </ul>
              </div>

              {/* Pro Tier */}
              <div 
                onClick={() => { setAccountTier('pro'); setShowUpgradeModal(false); }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 relative ${currentTier === 'pro' ? 'border-[#8E44AD] bg-[#8E44AD]/5' : 'border-[#8E44AD]/20 bg-white/80 hover:bg-[#8E44AD]/5'}`}
              >
                {currentTier === 'pro' && (
                  <div className="absolute -top-3 left-4 bg-[#8E44AD] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Current Plan</div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <div className="font-black text-[#8E44AD] text-lg">Pro</div>
                  <div className="text-sm font-black text-[#8E44AD]">₹899/mo</div>
                </div>
                <ul className="text-sm text-[#001F3F]/70 space-y-1 font-medium">
                  <li>• Unlimited Price Alerts</li>
                  <li>• Airbnb + Amadeus APIs</li>
                  <li>• Real-time SMS notifications</li>
                  <li>• Priority AI recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
