import { useState } from 'react';
import { User, Phone, MapPin, Calendar, Sparkles, Save, Camera, Mail, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';

interface ProfilePanelProps {
  onBack: () => void;
}

export function ProfilePanel({ onBack }: ProfilePanelProps) {
  const user = useStore((state) => state.user);
  const updateProfile = useStore((state) => state.updateProfile);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    homeAirport: user?.homeAirport || '',
    dateOfBirth: user?.dateOfBirth || '',
    email: user?.email || '',
  });

  const popularAirports = [
    'Delhi (DEL)', 'Mumbai (BOM)', 'Bangalore (BLR)',
    'Chennai (MAA)', 'Hyderabad (HYD)', 'Kolkata (CCU)'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      // Optional: Add a success toast/message here
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Avatar Section */}
      <div className="flex flex-col items-center py-6">
        <div className="relative group">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-[0_12px_40px_rgba(0,71,171,0.3)] group-hover:scale-105 transition-transform duration-300">
            <span className="text-white text-3xl font-black">{formData.fullName.substring(0, 2).toUpperCase()}</span>
            <button className="absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#0047AB] hover:scale-110 active:scale-95 transition-all">
              <Camera size={18} />
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center gap-2 justify-center">
            <h2 className="text-2xl font-black text-[#001F3F]">{formData.fullName || 'Traveler'}</h2>
            <ShieldCheck size={20} className="text-[#00A854]" />
          </div>
          <p className="text-sm text-[#001F3F]/50 font-bold uppercase tracking-widest mt-1">
            {user?.accountTier} Member
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <LiquidGlassCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/40 uppercase tracking-widest px-1">
                <User size={14} className="text-[#0047AB]" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-[#0047AB]/20 focus:bg-white transition-all text-[#001F3F] font-bold outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/40 uppercase tracking-widest px-1">
                <Mail size={14} className="text-[#0047AB]" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full h-12 px-4 rounded-xl bg-[#001F3F]/5 border-2 border-transparent text-[#001F3F]/40 font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/40 uppercase tracking-widest px-1">
                <Phone size={14} className="text-[#0047AB]" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-[#0047AB]/20 focus:bg-white transition-all text-[#001F3F] font-bold outline-none"
              />
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/40 uppercase tracking-widest px-1">
                <MapPin size={14} className="text-[#0047AB]" />
                Home Airport
              </label>
              <select
                value={formData.homeAirport}
                onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-[#0047AB]/20 focus:bg-white transition-all text-[#001F3F] font-bold outline-none appearance-none"
              >
                <option value="">Select Airport</option>
                {popularAirports.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/40 uppercase tracking-widest px-1">
                <Calendar size={14} className="text-[#0047AB]" />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-[#0047AB]/20 focus:bg-white transition-all text-[#001F3F] font-bold outline-none"
              />
            </div>
          </div>
        </LiquidGlassCard>

        <PremiumButton 
          variant="primary" 
          className="w-full h-14 text-lg" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Changes
            </>
          )}
        </PremiumButton>
      </div>

      {/* Account Stats / Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <LiquidGlassCard size="small" className="bg-gradient-to-br from-[#0047AB]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0047AB]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#001F3F]/40 uppercase">Sky Points</div>
              <div className="text-lg font-black text-[#001F3F]">1,250</div>
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard size="small" className="bg-gradient-to-br from-[#00A854]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#00A854]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#001F3F]/40 uppercase">Verified</div>
              <div className="text-lg font-black text-[#00A854]">Level 2</div>
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
