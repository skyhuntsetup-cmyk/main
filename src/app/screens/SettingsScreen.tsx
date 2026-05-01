import { ChevronRight, User, Bell, Lock, HelpCircle, LogOut, Settings as SettingsIcon, Award, Search, Zap, MapPin, Sparkles } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { useStore } from '../../store/useStore';

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', sub: 'Rishabh Arora', color: '#0047AB' },
      { icon: SettingsIcon, label: 'Preferences', sub: 'Home city, airlines, cabin class', color: '#00A854' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: Bell, label: 'Notification Settings', sub: 'Alerts, deals, reminders', color: '#FF6B6B' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: Lock, label: 'Privacy & Security', sub: 'Password, connected accounts', color: '#F39C12' },
    ],
  },
  {
    title: 'Help',
    items: [
      { icon: HelpCircle, label: 'About & Help', sub: 'FAQ, support, feedback', color: '#3498DB' },
    ],
  },
];

const stats = [
  { value: 42, label: 'Searches', icon: Search, color: 'from-[#0047AB] to-[#1a6fd4]' },
  { value: 8, label: 'Alerts', icon: Bell, color: 'from-[#FF6B6B] to-[#f15959]' },
  { value: 5, label: 'Routes', icon: MapPin, color: 'from-[#00A854] to-[#008f47]' },
  { value: 12, label: 'Bookings', icon: Zap, color: 'from-[#F39C12] to-[#e89c0c]' },
];

export function SettingsScreen() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

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
              <span className="text-white text-xl font-black">{user ? user.fullName.substring(0, 2).toUpperCase() : 'RA'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-[#001F3F] text-xl">{user ? user.fullName : 'Rishabh Arora'}</div>
              <div className="text-sm text-[#001F3F]/50 font-medium truncate">{user ? user.email : 'info.houseofgrc@gmail.com'}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#00A854]/15 to-transparent border border-[#00A854]/20">
                  <Award size={12} className="text-[#00A854]" />
                  <span className="text-[10px] font-black text-[#00A854]">Premium Member</span>
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
        <LiquidGlassCard className="border-[#F39C12]/30 bg-gradient-to-r from-[#F39C12]/8 to-transparent" pulseIndicator>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F39C12] to-[#e89c0c] flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-black text-[#001F3F] text-sm">Upgrade to Premium</div>
              <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">Unlimited alerts · SMS notify · ₹299/mo</div>
            </div>
            <PremiumButton variant="primary" size="small">Upgrade</PremiumButton>
          </div>
        </LiquidGlassCard>

        {/* Logout */}
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border-[1.5px] border-[#E74C3C]/40 text-[#E74C3C] font-bold text-sm hover:bg-[#E74C3C]/5 transition-colors">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
