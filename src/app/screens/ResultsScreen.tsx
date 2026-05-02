import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { EnhancedFlightCard } from '../components/EnhancedFlightCard';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import type { FlightResult } from '../../lib/flightApi';
import type { SearchState } from './SearchScreen';

interface ResultsScreenProps {
  onBack?: () => void;
}

const mockFlights = [
  {
    id: 'mock-1',
    airline: 'IndiGo',
    departureTime: '08:30',
    arrivalTime: '20:15',
    duration: '23h',
    stops: '2 stops (4h in Dubai)',
    price: 41200,
    savings: 3200,
    rating: 4.2,
    reviews: 2400,
    delay: 0,
    isMonitoring: true,
  },
  {
    id: 'mock-2',
    airline: 'Air India',
    departureTime: '10:00',
    arrivalTime: '22:30',
    duration: '24h 30m',
    stops: '1 stop (3h in Frankfurt)',
    price: 43500,
    savings: 1500,
    rating: 4.0,
    reviews: 1800,
    delay: 12,
    isMonitoring: false,
  },
  {
    id: 'mock-3',
    airline: 'Emirates',
    departureTime: '14:30',
    arrivalTime: '01:45+1',
    duration: '23h 15m',
    stops: '1 stop (2h in Dubai)',
    price: 48900,
    rating: 4.5,
    reviews: 3200,
    delay: 0,
    isMonitoring: false,
  },
  {
    id: 'mock-4',
    airline: 'British Airways',
    departureTime: '16:00',
    arrivalTime: '02:30+1',
    duration: '22h 30m',
    stops: 'Non-stop',
    price: 52000,
    rating: 4.3,
    reviews: 2100,
    delay: 0,
    isMonitoring: false,
  },
];

const sortOptions = ['Cheapest', 'Fastest', 'Best rated', 'Non-stop'];

export function ResultsScreen({ onBack }: ResultsScreenProps) {
  const location = useLocation();
  const state = location.state as { searchState?: SearchState, flights?: FlightResult[] } | null;
  const searchState = state?.searchState;
  const apiFlights = state?.flights;

  const [sortBy, setSortBy] = useState('Cheapest');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const rawDisplayFlights = apiFlights && apiFlights.length > 0 
    ? apiFlights.map((f, i) => ({
        id: f.id || `flight-${i}`,
        airline: f.airline,
        departureTime: new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        arrivalTime: new Date(f.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: f.duration,
        stops: f.stopDetails || (f.stops === 0 ? 'Non-stop' : `${f.stops} stop(s)`),
        price: f.price,
        savings: i === 0 ? 3200 : 0,
        rating: 4.5 - (i % 3) * 0.2, // Fake varying ratings for sorting
        reviews: 1200 + Math.floor(Math.random() * 1000),
        delay: 0,
        isMonitoring: i === 0
      }))
    : mockFlights;

  let displayFlights = [...rawDisplayFlights];
  if (sortBy === 'Cheapest') {
    displayFlights.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Fastest') {
    const parseDuration = (d: string) => {
      if (d === 'N/A') return 999999;
      const hMatch = d.match(/(\d+)h/);
      const mMatch = d.match(/(\d+)m/);
      const h = hMatch ? parseInt(hMatch[1], 10) : 0;
      const m = mMatch ? parseInt(mMatch[1], 10) : 0;
      return h * 60 + m;
    };
    displayFlights.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
  } else if (sortBy === 'Best rated') {
    displayFlights.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'Non-stop') {
    displayFlights = displayFlights.filter(f => f.stops.toLowerCase().includes('non-stop') || f.stops.toLowerCase().includes('direct') || f.stops === '0');
    displayFlights.sort((a, b) => a.price - b.price);
  }

  // Format date correctly
  const displayDate = searchState?.departDate
    ? new Date(searchState.departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'May 15, 2026';


  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 px-4 pt-12 pb-3 bg-gradient-to-b from-[#F0F4F8] via-[#F0F4F8]/95 to-transparent backdrop-blur-sm">
        {/* Back + route */}
        <div className="flex items-center gap-3 mb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-[#001F3F]" />
            </button>
          )}
          <div className="flex-1">
            <div className="font-black text-[#001F3F] text-lg leading-tight">
              {searchState ? `${searchState.from.city} → ${searchState.to.city}` : 'Delhi → London'}
            </div>
            <div className="text-xs text-[#001F3F]/50 font-medium">
              {displayDate} · {searchState?.passengers || 2} passenger{searchState?.passengers !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#00A854]/15 to-transparent border border-[#00A854]/20">
            <span className="text-xs font-black text-[#00A854]">{displayFlights.length} found</span>
          </div>
        </div>

        {/* Sort / Filter bar */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] text-xs font-bold"
          >
            <Filter size={14} />
            Filter
          </button>
          <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSortBy(opt);
                  setVisibleCount(5); // Reset visible count on filter change
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  sortBy === opt
                    ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-md'
                    : 'bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F]/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] text-xs font-bold">
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <LiquidGlassCard className="mt-3" size="small">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Max Price', value: '₹55K' },
                { label: 'Max Stops', value: '2' },
                { label: 'Airline', value: 'Any' },
              ].map((f) => (
                <div key={f.label}>
                  <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase">{f.label}</div>
                  <div className="text-sm font-black text-[#0047AB] mt-0.5">{f.value}</div>
                </div>
              ))}
            </div>
          </LiquidGlassCard>
        )}
      </div>

      {/* Flight list */}
      <div className="px-4 pt-2 pb-8 space-y-3">
        {displayFlights.slice(0, visibleCount).map((flight) => (
          <EnhancedFlightCard 
            key={flight.id} 
            {...flight} 
            onBook={() => {
              // Simulated booking redirect
              alert(`Redirecting you to complete your booking with ${flight.airline}...`);
            }}
          />
        ))}

        {visibleCount < displayFlights.length && (
          <PremiumButton 
            variant="glass" 
            className="w-full mt-4"
            onClick={() => setVisibleCount(v => v + 5)}
          >
            Load More Flights
          </PremiumButton>
        )}
      </div>
    </div>
  );
}
