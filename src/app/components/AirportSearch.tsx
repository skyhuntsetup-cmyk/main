import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { searchAirports, type Airport } from '../../data/airports';
import { searchAirportsByQuery } from '../../lib/flightApi';

interface AirportSearchProps {
  value: Airport | null;
  onChange: (airport: Airport) => void;
  placeholder?: string;
  label: string;
}

export function AirportSearch({ value, onChange, placeholder = 'Search city or airport...', label }: AirportSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Show top results on focus if no query
  useEffect(() => {
    if (focused && !query) {
      setResults(searchAirports('', 8));
      setIsOpen(true);
    }
  }, [focused, query]);

  // Debounced API search
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const apiData = await searchAirportsByQuery(query);
        if (apiData && apiData.length > 0) {
          const formatted = apiData.map(item => ({
            code: item.navigation?.relevantFlightParams?.skyId || '',
            entityId: item.navigation?.entityId || item.navigation?.relevantFlightParams?.entityId || '',
            city: item.presentation?.title || '',
            name: item.presentation?.subtitle || '',
            country: item.presentation?.subtitle || '',
            flag: '✈️'
          })).filter(a => a.code);
          
          if (formatted.length > 0) {
            setResults(formatted);
          } else {
            setResults(searchAirports(query, 8));
          }
        } else {
          setResults(searchAirports(query, 8));
        }
      } catch (err) {
        setResults(searchAirports(query, 8));
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocused(false);
        // Reset query to selected value display
        if (value) setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [value]);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery('');
    setIsOpen(false);
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setIsOpen(true);
    if (!q) {
      setResults(searchAirports('', 8));
    }
  };

  const displayValue = focused ? query : (value ? `${value.flag} ${value.city} (${value.code})` : '');

  return (
    <div className="relative">
      <label className="flex items-center gap-2 text-xs font-black text-[#001F3F]/60 uppercase tracking-wide mb-1.5">
        <MapPin size={12} className="text-[#00F5FF]" />
        {label}
      </label>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => { 
            setFocused(true); 
            setQuery(''); // Clear query on focus to allow fresh search
            setResults(searchAirports('', 8)); 
            setIsOpen(true); 
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full h-12 px-4 rounded-xl bg-white/40 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F] font-semibold text-sm
                     focus:border-[#00F5FF] focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,245,255,0.15)]
                     transition-all placeholder:text-[#001F3F]/40 placeholder:font-normal"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {value && !focused && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-xs font-black text-[#0047AB] bg-[#0047AB]/10 px-2 py-1 rounded-lg">
              {value.code}
            </span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 z-50
                     bg-white/95 backdrop-blur-2xl rounded-2xl
                     border border-white/80 shadow-[0_16px_48px_rgba(0,31,63,0.15)]
                     overflow-hidden"
        >
          {results.map((airport) => (
            <button
              key={airport.code}
              type="button"
              onMouseDown={() => handleSelect(airport)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#0047AB]/5
                         border-b border-[#E8E8E8]/50 last:border-0 transition-colors text-left"
            >
              <span className="text-xl flex-shrink-0">{airport.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#001F3F] text-sm">{airport.city}</div>
                <div className="text-xs text-[#001F3F]/50 truncate">{airport.name}</div>
              </div>
              <span className="text-xs font-black text-[#0047AB] bg-[#0047AB]/10 px-2 py-1 rounded-lg flex-shrink-0">
                {airport.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
