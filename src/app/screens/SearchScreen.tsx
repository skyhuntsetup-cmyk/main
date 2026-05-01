import { useState } from 'react';
import { MapPin, Calendar, Users, Plane, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';

interface SearchScreenProps {
  onSearch: () => void;
}

const cities = ['Delhi (DEL)', 'Mumbai (BOM)', 'Bangalore (BLR)', 'Chennai (MAA)', 'Hyderabad (HYD)', 'Kolkata (CCU)'];
const destinations = ['London (LHR)', 'Dubai (DXB)', 'Bangkok (BKK)', 'Singapore (SIN)', 'New York (JFK)', 'Tokyo (NRT)', 'Paris (CDG)', 'Sydney (SYD)'];
const cabinClasses = [
  { label: 'Economy', icon: '💺' },
  { label: 'Premium Economy', icon: '🛋️' },
  { label: 'Business', icon: '✨' },
  { label: 'First Class', icon: '👑' },
];

const popularRoutes = [
  { from: 'DEL', to: 'LHR', flag: '🇬🇧', price: '₹43K' },
  { from: 'BOM', to: 'DXB', flag: '🇦🇪', price: '₹8K' },
  { from: 'BLR', to: 'SIN', flag: '🇸🇬', price: '₹20K' },
];

export function SearchScreen({ onSearch }: SearchScreenProps) {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('London (LHR)');
  const [departDate, setDepartDate] = useState('2026-05-15');
  const [returnDate, setReturnDate] = useState('2026-05-25');
  const [passengers, setPassengers] = useState(2);
  const [cabin, setCabin] = useState('Economy');

  const inputClass = 'w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-semibold text-sm focus:border-[#00F5FF] focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,245,255,0.15)] transition-all appearance-none';

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plane size={14} className="text-[#0047AB]" />
              <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Flight Search</span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Find Flights</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Compare 50K+ routes in real-time</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Trip type */}
        <div className="flex gap-2">
          {(['round-trip', 'one-way'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tripType === type
                  ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-md'
                  : 'bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F]/60'
              }`}
            >
              {type === 'round-trip' ? 'Round Trip' : 'One Way'}
            </button>
          ))}
        </div>

        {/* Main search card */}
        <LiquidGlassCard size="large">
          <div className="space-y-4">
            {/* From / To */}
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                  <MapPin size={12} className="text-[#00F5FF]" /> From
                </label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass}>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-center">
                <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-md">
                  <ArrowLeftRight size={16} className="text-white" />
                </button>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                  <MapPin size={12} className="text-[#00F5FF]" /> To
                </label>
                <select value={to} onChange={(e) => setTo(e.target.value)} className={inputClass}>
                  {destinations.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className={`grid gap-3 ${tripType === 'round-trip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                  <Calendar size={12} className="text-[#00F5FF]" /> Depart
                </label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className={inputClass} />
              </div>
              {tripType === 'round-trip' && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                    <Calendar size={12} className="text-[#00F5FF]" /> Return
                  </label>
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={inputClass} />
                </div>
              )}
            </div>

            {/* Passengers */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                <Users size={12} className="text-[#00F5FF]" /> Passengers
              </label>
              <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60">
                <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-8 h-8 rounded-lg bg-white/40 font-black text-[#0047AB] hover:bg-white/60 transition-colors">−</button>
                <span className="flex-1 text-center font-black text-[#001F3F]">{passengers} {passengers === 1 ? 'Adult' : 'Adults'}</span>
                <button onClick={() => setPassengers(Math.min(9, passengers + 1))} className="w-8 h-8 rounded-lg bg-white/40 font-black text-[#0047AB] hover:bg-white/60 transition-colors">+</button>
              </div>
            </div>

            {/* Cabin class */}
            <div>
              <label className="text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-2 block">Cabin Class</label>
              <div className="grid grid-cols-2 gap-2">
                {cabinClasses.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setCabin(c.label)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      cabin === c.label
                        ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-md'
                        : 'bg-white/30 border-[1.5px] border-white/60 text-[#001F3F]/60'
                    }`}
                  >
                    <span>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <PremiumButton variant="primary" size="large" onClick={onSearch}>
              <Plane size={18} />
              Search Flights
              <ArrowRight size={18} />
            </PremiumButton>
          </div>
        </LiquidGlassCard>

        {/* Popular routes */}
        <div>
          <h2 className="text-xs font-black text-[#001F3F]/60 uppercase tracking-widest mb-3">Popular Routes</h2>
          <div className="grid grid-cols-3 gap-2">
            {popularRoutes.map((r, i) => (
              <LiquidGlassCard key={i} hoverable size="small" className="text-center cursor-pointer" onClick={onSearch}>
                <div className="text-2xl mb-1">{r.flag}</div>
                <div className="text-xs font-black text-[#001F3F]">{r.from} → {r.to}</div>
                <div className="text-sm font-black text-[#0047AB] mt-0.5">{r.price}</div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
