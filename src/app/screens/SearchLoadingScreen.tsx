import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { searchFlights, FlightResult } from '../../lib/flightApi';
import { Plane, Hotel, MapPin, Thermometer, Camera, Utensils, Clock } from 'lucide-react';
import type { SearchState } from './SearchScreen';

// Destination tips database
const DESTINATION_TIPS: Record<string, {
  tips: string[];
  hotels: { name: string; rating: number; price: string; type: string }[];
  weather: string;
  bestTime: string;
  cuisine: string;
  mustSee: string;
  image: string;
}> = {
  LHR: {
    tips: ['Book the Heathrow Express for a fast 15-min ride to Paddington', 'Get an Oyster card for unlimited tube/bus travel', 'Museums like the British Museum are completely free', 'Congestion charges apply if driving into central London'],
    hotels: [
      { name: 'The Savoy', rating: 5, price: '₹45,000/night', type: 'Luxury' },
      { name: 'citizenM London Shoreditch', rating: 4, price: '₹12,000/night', type: 'Boutique' },
      { name: 'Premier Inn City', rating: 3, price: '₹7,500/night', type: 'Budget' },
    ],
    weather: '12°C · Cloudy', bestTime: 'May–Sep', cuisine: 'Fish & Chips, Afternoon Tea', mustSee: 'Tower of London, Big Ben', image: '🏰'
  },
  DXB: {
    tips: ['Metro connects airport to Downtown in 35 mins', 'Avoid outdoor activities 12–4pm in summer', 'Duty-free is massive — great for shopping on arrival', 'Friday brunch is a Dubai institution — book early'],
    hotels: [
      { name: 'Burj Al Arab', rating: 5, price: '₹1,20,000/night', type: 'Ultra Luxury' },
      { name: 'Atlantis The Palm', rating: 5, price: '₹55,000/night', type: 'Resort' },
      { name: 'ibis Dubai Mall', rating: 3, price: '₹8,000/night', type: 'Budget' },
    ],
    weather: '35°C · Sunny', bestTime: 'Nov–Mar', cuisine: 'Shawarma, Biryani, Mezze', mustSee: 'Burj Khalifa, Dubai Mall', image: '🌇'
  },
  SIN: {
    tips: ['MRT is the cleanest and fastest way to get around', 'Hawker centres serve amazing food under ₹500', 'Grab a Singapore Tourist Pass for unlimited transport', 'Changi Airport itself is worth a visit — has a waterfall!'],
    hotels: [
      { name: 'Marina Bay Sands', rating: 5, price: '₹35,000/night', type: 'Iconic' },
      { name: 'Park Royal on Pickering', rating: 4, price: '₹18,000/night', type: 'Boutique' },
      { name: 'Ibis Budget Joo Koon', rating: 3, price: '₹6,000/night', type: 'Budget' },
    ],
    weather: '30°C · Humid', bestTime: 'Feb–Apr', cuisine: 'Hainanese Chicken, Laksa, Chilli Crab', mustSee: 'Gardens by the Bay, Sentosa', image: '🌿'
  },
  JFK: {
    tips: ['JFK AirTrain + Subway is cheapest way to Manhattan', 'Tipping 18–20% is expected at restaurants', 'NYC Pass covers top attractions at a discount', 'Avoid Times Square restaurants — overpriced and average'],
    hotels: [
      { name: 'The Plaza Hotel', rating: 5, price: '₹60,000/night', type: 'Iconic' },
      { name: 'Pod 51', rating: 3, price: '₹12,000/night', type: 'Boutique' },
      { name: 'Flushing YMCA', rating: 2, price: '₹5,000/night', type: 'Budget' },
    ],
    weather: '18°C · Partly cloudy', bestTime: 'Apr–Jun, Sep–Nov', cuisine: 'NY Pizza, Bagels, Cheesecake', mustSee: 'Central Park, Statue of Liberty', image: '🗽'
  },
  CDG: {
    tips: ['RER B train connects airport to city center in 35 mins', 'Paris Museum Pass saves you queuing and money', 'Many restaurants close between 2–7pm for lunch break', 'Book Eiffel Tower tickets well in advance online'],
    hotels: [
      { name: 'Ritz Paris', rating: 5, price: '₹75,000/night', type: 'Legendary' },
      { name: 'Hotel des Grands Boulevards', rating: 4, price: '₹20,000/night', type: 'Boutique' },
      { name: 'Generator Paris', rating: 3, price: '₹5,500/night', type: 'Hostel/Budget' },
    ],
    weather: '15°C · Mild', bestTime: 'Apr–Oct', cuisine: 'Croissants, Crêpes, Coq au Vin', mustSee: 'Eiffel Tower, Louvre, Montmartre', image: '🗼'
  },
  BKK: {
    tips: ['BTS Skytrain avoids notorious Bangkok traffic', 'Always negotiate tuk-tuk fares before you get in', 'Temple dress code: cover shoulders and knees', 'Grab app is cheaper and safer than street taxis'],
    hotels: [
      { name: 'Mandarin Oriental Bangkok', rating: 5, price: '₹30,000/night', type: 'Historic Luxury' },
      { name: 'The Standard Bangkok', rating: 4, price: '₹15,000/night', type: 'Trendy' },
      { name: 'Lub d Bangkok Silom', rating: 3, price: '₹2,500/night', type: 'Budget' },
    ],
    weather: '32°C · Humid', bestTime: 'Nov–Feb', cuisine: 'Pad Thai, Tom Yum, Mango Sticky Rice', mustSee: 'Grand Palace, Chatuchak Market', image: '🛕'
  },
  SYD: {
    tips: ['Opal card works on all trains, buses and ferries', 'Ferry to Manly Beach is one of the world\'s best commutes', 'BYO (Bring Your Own) wine restaurants save a lot', 'Book Bondi to Coogee coastal walk for sunrise'],
    hotels: [
      { name: 'Park Hyatt Sydney', rating: 5, price: '₹55,000/night', type: 'Harbour Views' },
      { name: 'Ovolo Woolloomooloo', rating: 4, price: '₹22,000/night', type: 'Boutique' },
      { name: 'Wake Up! Sydney', rating: 3, price: '₹4,000/night', type: 'Budget' },
    ],
    weather: '22°C · Sunny', bestTime: 'Sep–Nov, Mar–May', cuisine: 'Meat Pies, Tim Tams, Barramundi', mustSee: 'Opera House, Bondi Beach, Harbour Bridge', image: '🦘'
  },
  NRT: {
    tips: ['Get a Suica or Pasmo IC card for all transport', 'Convenience stores (7-Eleven, Lawson) have amazing food', 'Tipping is considered rude in Japan', 'JR Pass is worth it if you plan to travel between cities'],
    hotels: [
      { name: 'The Tokyo Edition', rating: 5, price: '₹40,000/night', type: 'Design Hotel' },
      { name: 'Shinjuku Granbell Hotel', rating: 4, price: '₹15,000/night', type: 'Boutique' },
      { name: 'Khaosan Tokyo Ninja', rating: 3, price: '₹3,500/night', type: 'Hostel' },
    ],
    weather: '18°C · Clear', bestTime: 'Mar–May, Sep–Nov', cuisine: 'Ramen, Sushi, Tempura, Wagyu', mustSee: 'Shibuya Crossing, Senso-ji, Fuji-san', image: '🗾'
  },
  AUH: {
    tips: ['Abu Dhabi is more relaxed and affordable than Dubai', 'Louvre Abu Dhabi is architecturally stunning', 'Dress modestly outside hotels and malls', 'Yas Island has Ferrari World and Warner Bros. Park'],
    hotels: [
      { name: 'Emirates Palace', rating: 5, price: '₹80,000/night', type: 'Palace Hotel' },
      { name: 'Yas Island Rotana', rating: 4, price: '₹18,000/night', type: 'Resort' },
      { name: 'Centro Yas Island', rating: 3, price: '₹9,000/night', type: 'Budget' },
    ],
    weather: '34°C · Sunny', bestTime: 'Nov–Mar', cuisine: 'Luqaimat, Machboos, Arabic Coffee', mustSee: 'Sheikh Zayed Mosque, Louvre Abu Dhabi', image: '🕌'
  },
  DEFAULT: {
    tips: ['Book airport transfers in advance for best rates', 'Get travel insurance before your trip', 'Download offline maps before you land', 'Check visa requirements well before departure'],
    hotels: [
      { name: 'Luxury Hotel', rating: 5, price: '₹25,000/night', type: 'Luxury' },
      { name: 'Business Hotel', rating: 4, price: '₹12,000/night', type: 'Business' },
      { name: 'Budget Inn', rating: 3, price: '₹4,000/night', type: 'Budget' },
    ],
    weather: 'Check local forecast', bestTime: 'Year-round', cuisine: 'Local specialties', mustSee: 'City landmarks', image: '✈️'
  },
};

function getTips(toCode: string) {
  return DESTINATION_TIPS[toCode] || DESTINATION_TIPS['DEFAULT'];
}

export function SearchLoadingScreen() {
  const location = useLocation();
  const navigate  = useNavigate();
  const searchState = location.state as SearchState | null;

  const [progress, setProgress]   = useState(0);
  const [tipIndex, setTipIndex]   = useState(0);
  const [phase, setPhase]         = useState<'scanning' | 'hotels' | 'ready'>('scanning');
  const fetchedFlightsRef         = useRef<FlightResult[] | null>(null);

  const destination = searchState?.to || { code: 'LHR', city: 'London', flag: '🇬🇧' } as any;
  const tips        = getTips(destination.code);
  const DURATION    = 18000; // 18 seconds total

  // Fetch real flight data
  useEffect(() => {
    if (searchState) {
      let cabinMap = 'economy';
      if (searchState.cabin === 'Premium Economy') cabinMap = 'premium_economy';
      else if (searchState.cabin === 'Business') cabinMap = 'business';
      else if (searchState.cabin === 'First Class') cabinMap = 'first';

      searchFlights({
        fromCode: searchState.from.code,
        toCode: searchState.to.code,
        departDate: searchState.departDate,
        returnDate: searchState.tripType === 'round-trip' ? searchState.returnDate : undefined,
        adults: searchState.passengers,
        cabinClass: cabinMap as any,
        currency: 'INR'
      }).then(flights => {
        fetchedFlightsRef.current = flights;
      }).catch(err => console.error('Failed to fetch flights:', err));
    }
  }, [searchState]);

  // Redirect to results after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/results', { state: { searchState, flights: fetchedFlightsRef.current }, replace: true });
    }, DURATION);
    return () => clearTimeout(timer);
  }, [navigate, searchState]);

  // Progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (DURATION / 100));
        return Math.min(next, 99);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cycle tips every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.tips.length]);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hotels'), 6000);
    const t2 = setTimeout(() => setPhase('ready'), 13000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const phases = [
    { id: 'scanning', label: 'Scanning 200+ airlines', done: phase !== 'scanning' },
    { id: 'hotels',   label: 'Finding best hotels', done: phase === 'ready' },
    { id: 'ready',    label: 'Ranking by price & quality', done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] via-[#0047AB] to-[#001F3F] flex flex-col overflow-hidden">

      {/* Animated stars / particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 7 + 3) % 100}%`,
              top: `${(i * 11 + 5) % 100}%`,
              opacity: 0.1 + (i % 5) * 0.05,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Flying plane animation */}
      <div className="relative h-32 overflow-hidden">
        <div
          className="absolute transition-all"
          style={{
            top: '40px',
            left: `${Math.min(progress, 85)}%`,
            transform: 'translateX(-50%)',
            transition: 'left 0.5s linear',
          }}
        >
          <div className="relative">
            <Plane size={32} className="text-white drop-shadow-[0_0_16px_rgba(0,245,255,0.6)]" />
            {/* Contrail */}
            <div
              className="absolute top-3 right-8 h-0.5 bg-gradient-to-l from-transparent to-white/30 rounded-full"
              style={{ width: `${Math.max(progress * 2, 20)}px` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 space-y-5">
        {/* Destination hero */}
        <div className="text-center">
          <div className="text-6xl mb-2">{tips.image}</div>
          <h1 className="text-3xl font-black text-white">
            {destination.flag} {destination.city}
          </h1>
          <p className="text-white/60 font-medium mt-1">
            {searchState?.from?.city} → {destination.city} · {searchState?.passengers || 1} passenger
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00F5FF] to-[#0047AB] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Phase checklist */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 space-y-3">
          {phases.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                p.done ? 'bg-green-400' : phase === p.id ? 'bg-[#00F5FF] animate-pulse' : 'bg-white/20'
              }`}>
                {p.done ? (
                  <span className="text-white text-xs font-black">✓</span>
                ) : phase === p.id ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : null}
              </div>
              <span className={`text-sm font-semibold ${
                p.done ? 'text-green-300 line-through' : phase === p.id ? 'text-white' : 'text-white/40'
              }`}>
                {p.label}
              </span>
              {phase === p.id && (
                <div className="ml-auto flex gap-1">
                  {[0,1,2].map(d => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-bounce"
                      style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rotating travel tip */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-[#00F5FF]" />
            <span className="text-xs font-black text-[#00F5FF] uppercase tracking-widest">Travel Tip</span>
          </div>
          <p className="text-white/90 text-sm font-medium leading-relaxed transition-all">
            {tips.tips[tipIndex]}
          </p>
        </div>

        {/* Destination quick stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center">
            <Thermometer size={16} className="text-[#00F5FF] mx-auto mb-1" />
            <div className="text-xs text-white/60">Weather</div>
            <div className="text-xs font-bold text-white mt-0.5">{tips.weather}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center">
            <Clock size={16} className="text-[#00F5FF] mx-auto mb-1" />
            <div className="text-xs text-white/60">Best Time</div>
            <div className="text-xs font-bold text-white mt-0.5">{tips.bestTime}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center">
            <Utensils size={16} className="text-[#00F5FF] mx-auto mb-1" />
            <div className="text-xs text-white/60">Must Try</div>
            <div className="text-xs font-bold text-white mt-0.5 truncate">{tips.cuisine.split(',')[0]}</div>
          </div>
        </div>

        {/* Hotel recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hotel size={14} className="text-[#00F5FF]" />
            <span className="text-xs font-black text-[#00F5FF] uppercase tracking-widest">Hotel Recommendations</span>
            <span className="text-xs text-white/40 ml-auto">via Booking.com</span>
          </div>
          <div className="space-y-2">
            {tips.hotels.map((hotel) => (
              <div
                key={hotel.name}
                className="bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-black">{hotel.rating}★</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">{hotel.name}</div>
                  <div className="text-white/50 text-xs">{hotel.type}</div>
                </div>
                <div className="text-[#00F5FF] font-black text-xs text-right">
                  {hotel.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Must see */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Camera size={14} className="text-[#00F5FF]" />
            <span className="text-xs font-black text-[#00F5FF] uppercase tracking-widest">Must See</span>
          </div>
          <p className="text-white/90 text-sm font-medium">{tips.mustSee}</p>
        </div>

        <div className="pb-6 text-center">
          <p className="text-white/40 text-xs">Results loading in ~{Math.max(1, Math.round((DURATION - (progress / 100) * DURATION) / 1000))}s</p>
        </div>
      </div>
    </div>
  );
}
