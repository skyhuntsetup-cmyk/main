import { useState } from 'react';
import { ChevronRight, User, Bell, Lock, HelpCircle, LogOut, Settings as SettingsIcon, Award, Search, MapPin, Sparkles, Link, Star, Cloud, ChevronLeft } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { ProUpgradeModal } from '../components/ProUpgradeModal';
import { useStore } from '../../store/useStore';
import { ProfilePanel } from './settings/ProfilePanel';
import { NotificationSettingsPage } from './settings/NotificationSettingsPage';
import { PreferencesPage } from './settings/PreferencesPage';
import { AboutPage } from './settings/AboutPage';

export function SettingsScreen() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const alerts = useStore((state) => state.alerts);
  const recentSearches = useStore((state) => state.recentSearches);
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  
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
        { id: 'data-sources', icon: Cloud, label: 'Data Sources', sub: 'Google Flights, Booking.com, Airbnb', color: '#0047AB' },
        { id: 'connected-accounts', icon: Link, label: 'Connected Accounts', sub: 'Frequent flyer programs', color: '#3498DB' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'deal-preferences', icon: Sparkles, label: 'Deal Preferences', sub: 'Max budget, cabin class, layovers', color: '#00A854' },
        { id: 'notifications', icon: Bell, label: 'Notification Settings', sub: 'Email, Push, SMS', color: '#FF6B6B' },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', icon: User, label: 'Profile', sub: user?.fullName || 'Manage profile', color: '#F39C12' },
        { id: 'security', icon: Lock, label: 'Privacy & Security', sub: 'Password, sessions', color: '#8E44AD' },
      ],
    },
    {
      title: 'Help',
      items: [
        { id: 'help', icon: HelpCircle, label: 'About & Help', sub: 'FAQ, support, feedback', color: '#2C3E50' },
      ],
    },
  ];

  const stats = [
    { value: recentSearches.length, label: 'Searches', icon: Search, color: 'from-[#0047AB] to-[#1a6fd4]' },
    { value: alerts.length, label: 'Alerts', icon: Bell, color: 'from-[#FF6B6B] to-[#f15959]' },
    { value: uniqueRoutes, label: 'Routes', icon: MapPin, color: 'from-[#00A854] to-[#008f47]' },
    { value: currentTier === 'pro' ? '∞' : currentTier === 'premium' ? 20 : 5, label: 'Alert Limit', icon: Star, color: 'from-[#F39C12] to-[#e89c0c]' },
  ];


  if (activePanel === 'profile') {
    return (
      <div className="min-h-screen bg-[#F0F4F8] pb-28 animate-slide-up">
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <button onClick={() => setActivePanel(null)} className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[#001F3F]/50">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#001F3F]">My Profile</h1>
            <p className="text-xs text-[#001F3F]/50 font-medium">Manage your personal details</p>
          </div>
        </div>

        <div className="px-5">
          <ProfilePanel onBack={() => setActivePanel(null)} />
        </div>
      </div>
    );
  }

  if (activePanel === 'notifications') {
    return (
      <div className="min-h-screen bg-[#F0F4F8] pb-28 animate-slide-up">
        <NotificationSettingsPage onBack={() => setActivePanel(null)} />
      </div>
    );
  }

  if (activePanel === 'deal-preferences') {
    return (
      <div className="min-h-screen bg-[#F0F4F8] pb-28 animate-slide-up">
        <PreferencesPage onBack={() => setActivePanel(null)} />
      </div>
    );
  }

  if (activePanel === 'help') {
    return (
      <div className="min-h-screen bg-[#F0F4F8] pb-28 animate-slide-up">
        <AboutPage onBack={() => setActivePanel(null)} />
      </div>
    );
  }

  // Placeholder for other panels
  if (activePanel) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] pb-28 animate-slide-up flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-lg mb-4">
          <SettingsIcon size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-[#001F3F] mb-2">Coming Soon</h1>
        <p className="text-sm text-[#001F3F]/50 font-medium mb-6">The {activePanel.replace('-', ' ')} panel is currently under development.</p>
        <PremiumButton variant="glass" onClick={() => setActivePanel(null)}>
          <ChevronLeft size={16} /> Go Back
        </PremiumButton>
      </div>
    );
  }

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
        <LiquidGlassCard className="border-[#0047AB]/20 cursor-pointer hover:border-[#0047AB]/40 transition-colors" onClick={() => setActivePanel('profile')}>
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
                  onClick={() => setActivePanel(item.id)}
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

      {showUpgradeModal && <ProUpgradeModal onClose={() => setShowUpgradeModal(false)} />
      }
    </div>
  );
}
