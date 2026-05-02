import { useState } from 'react';
import { Calendar, Users, Plane, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { AirportSearch } from '../components/AirportSearch';
import { type Airport, AIRPORTS } from '../../data/airports';
import { useStore } from '../../store/useStore';

interface SearchScreenProps {
  onSearch: (params: SearchState) => void;
}

export interface SearchState {
  from: Airport;
  to: Airport;
  departDate: string;
  returnDate: string;
  passengers: number;
  cabin: string;
  tripType: 'one-way' | 'round-trip';
}

const cabinClasses = [
  { label: 'Economy', icon: '💺', value: 'economy' },
  { label: 'Premium Economy', icon: '🛋️', value: 'premium_economy' },
  { label: 'Business', icon: '✨', value: 'business' },
  { label: 'First Class', icon: '👑', value: 'first' },
];

const popularRoutes = [
  { from: 'DEL', to: 'LHR', label: 'Delhi → London', flag: '🇬🇧', price: '₹43K' },
  { from: 'BOM', to: 'DXB', label: 'Mumbai → Dubai', flag: '🇦🇪', price: '₹8K' },
  { from: 'BLR', to: 'SIN', label: 'Bengaluru → Singapore', flag: '🇸🇬', price: '₹20K' },
  { from: 'DEL', to: 'JFK', label: 'Delhi → New York', flag: '🇺🇸', price: '₹56K' },
  { from: 'BOM', to: 'CDG', label: 'Mumbai → Paris', flag: '🇫🇷', price: '₹48K' },
  { from: 'HYD', to: 'SYD', label: 'Hyderabad → Sydney', flag: '🇦🇺', price: '₹62K' },
];

const defaultFrom = AIRPORTS.find(a => a.code === 'DEL')!;
const defaultTo   = AIRPORTS.find(a => a.code === 'LHR')!;

export function SearchScreen({ onSearch }: SearchScreenProps) {
  const { user } = useStore();
  const [tripType, setTripType]     = useState<'one-way' | 'round-trip'>('round-trip');
  const [from, setFrom]             = useState<Airport>(
    AIRPORTS.find(a => a.code === user?.homeAirport?.match(/\((\w+)\)/)?.[1]) || defaultFrom
  );
  const [to, setTo]                 = useState<Airport>(defaultTo);
  const [departDate, setDepartDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin]           = useState('economy');

  const handleSwap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
  };

  const handleSearch = () => {
    onSearch({ from, to, departDate, returnDate, passengers, cabin, tripType });
  };

  const handlePopularRoute = (fromCode: string, toCode: string) => {
    const f = AIRPORTS.find(a => a.code === fromCode);
    const t = AIRPORTS.find(a => a.code === toCode);
    if (f) setFrom(f);
    if (t) setTo(t);
    setTimeout(handleSearch, 100);
  };

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
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">
              150+ countries · 200+ airlines · Best prices
            </p>
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
              {type === 'round-trip' ? '↔ Round Trip' : '→ One Way'}
            </button>
          ))}
        </div>

        {/* Main search card */}
        <LiquidGlassCard size="large">
          <div className="space-y-4">
            {/* From / To with swap */}
            <div className="space-y-2">
              <AirportSearch
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="City or airport code..."
              />

              {/* Swap button */}
              <div className="flex items-center justify-center py-1">
                <button
                  onClick={handleSwap}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF]
                             flex items-center justify-center shadow-md
                             hover:scale-110 active:scale-95 transition-transform"
                >
                  <ArrowLeftRight size={16} className="text-white" />
                </button>
              </div>

              <AirportSearch
                label="To"
                value={to}
                onChange={setTo}
                placeholder="City or airport code..."
              />
            </div>

            {/* Dates */}
            <div className={`grid gap-3 ${tripType === 'round-trip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                  <Calendar size={12} className="text-[#00F5FF]" /> Depart
                </label>
                <input
                  type="date"
                  value={departDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              {tripType === 'round-trip' && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                    <Calendar size={12} className="text-[#00F5FF]" /> Return
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={departDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {/* Passengers */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
                <Users size={12} className="text-[#00F5FF]" /> Passengers
              </label>
              <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60">
                <button
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-8 h-8 rounded-lg bg-white/40 font-black text-[#0047AB] hover:bg-white/60 transition-colors text-lg"
                >−</button>
                <span className="flex-1 text-center font-black text-[#001F3F]">
                  {passengers} {passengers === 1 ? 'Adult' : 'Adults'}
                </span>
                <button
                  onClick={() => setPassengers(Math.min(9, passengers + 1))}
                  className="w-8 h-8 rounded-lg bg-white/40 font-black text-[#0047AB] hover:bg-white/60 transition-colors text-lg"
                >+</button>
              </div>
            </div>

            {/* Cabin class */}
            <div>
              <label className="text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-2 block">
                Cabin Class
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cabinClasses.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setCabin(c.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      cabin === c.value
                        ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-md'
                        : 'bg-white/30 border-[1.5px] border-white/60 text-[#001F3F]/60 hover:bg-white/50'
                    }`}
                  >
                    <span>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <PremiumButton variant="primary" size="large" onClick={handleSearch}>
              <Plane size={18} />
              Search Flights
              <ArrowRight size={18} />
            </PremiumButton>
          </div>
        </LiquidGlassCard>

        {/* Popular routes */}
        <div>
          <h2 className="text-xs font-black text-[#001F3F]/60 uppercase tracking-widest mb-3">
            Popular Routes from India
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {popularRoutes.map((r, i) => (
              <LiquidGlassCard
                key={i}
                hoverable
                size="small"
                className="cursor-pointer"
                onClick={() => handlePopularRoute(r.from, r.to)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{r.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-[#001F3F] truncate">{r.label}</div>
                    <div className="text-sm font-black text-[#0047AB]">from {r.price}</div>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
