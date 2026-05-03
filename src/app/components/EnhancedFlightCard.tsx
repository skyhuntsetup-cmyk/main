import { useState } from 'react';
import { Star, Clock, MapPin, Plane, ChevronDown, ChevronUp } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { PremiumButton } from './PremiumButton';
import { PulsePrice } from './PulsePrice';
import type { FlightSegment } from '../../lib/flightApi';

interface EnhancedFlightCardProps {
  airline: string;
  airlineLogo?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: number;
  savings?: number;
  rating?: number;
  reviews?: number;
  delay?: number;
  isMonitoring?: boolean;
  isBest?: boolean;
  segments?: FlightSegment[];
  onClick?: () => void;
  onBook?: () => void;
  onDetails?: () => void;
}
export function EnhancedFlightCard({
  airline,
  airlineLogo,
  departureTime,
  arrivalTime,
  duration,
  stops,
  price,
  savings,
  rating,
  reviews,
  delay = 0,
  isMonitoring = true,
  isBest = false,
  segments = [],
  onClick,
  onBook,
  onDetails,
}: EnhancedFlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to format ISO time to HH:mm
  const formatTime = (isoStr: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  // Helper to calculate layover between two segments
  const calculateLayover = (arrivalIso: string, departureIso: string) => {
    try {
      const diff = new Date(departureIso).getTime() - new Date(arrivalIso).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return 'N/A';
    }
  };

  return (
    <LiquidGlassCard hoverable pulseIndicator={isMonitoring} onClick={onClick}>
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex gap-2">
          {isBest && (
            <div className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wider border border-amber-200">
              ✨ Best Rated
            </div>
          )}
          {savings && savings > 0 && (
            <div className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-wider border border-green-200">
              ₹{savings.toLocaleString()} Saving
            </div>
          )}
        </div>

        {/* Airline row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {airlineLogo ? (
              <img src={airlineLogo} alt={airline} className="w-8 h-8 rounded-lg object-contain bg-white p-1" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center">
                <span className="text-white text-xs font-black">{airline.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <span className="font-bold text-[#001F3F]">{airline}</span>
          </div>
          {rating !== undefined && reviews !== undefined && (
            <div className="flex items-center gap-1 text-sm text-[#001F3F]/60">
              <Star size={14} className="fill-[#F39C12] text-[#F39C12]" />
              <span className="font-semibold text-[#001F3F]">{rating}</span>
              <span>({reviews.toLocaleString()})</span>
            </div>
          )}
        </div>

        {/* Times row */}
        <div className="flex items-center gap-3">
          <div className="text-xl font-black text-[#001F3F]">{departureTime}</div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-[#001F3F]/50 font-medium">
              <Clock size={11} />
              <span>{duration}</span>
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-[#0047AB]" />
              <div className="flex-1 h-px bg-gradient-to-r from-[#0047AB] to-[#00F5FF]" />
              <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
            </div>
            <div className="flex items-center gap-1 text-xs text-[#001F3F]/50 font-medium text-center">
              <MapPin size={11} />
              <span className="truncate max-w-[100px]">{stops}</span>
            </div>
          </div>
          <div className="text-xl font-black text-[#001F3F]">{arrivalTime}</div>
        </div>

        {delay > 0 && (
          <div className="text-xs text-amber-600 font-semibold bg-amber-50 rounded-lg px-3 py-1.5">
            ⚠ Average delay: {delay} min
          </div>
        )}

        {/* Price & actions */}
        <div className="flex items-end justify-between pt-1 border-t border-white/30">
          <PulsePrice price={price} savings={savings} isMonitoring={isMonitoring} />
          <div className="flex flex-col gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); onDetails?.(); }}
              className="flex items-center justify-center gap-1 text-[10px] font-black text-[#001F3F]/40 uppercase tracking-widest hover:text-[#0047AB] transition-colors"
            >
              {isExpanded ? 'Hide Details' : 'Details'}
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <PremiumButton 
              variant="primary" 
              size="small" 
              onClick={(e) => { e.stopPropagation(); onBook?.(); }}
            >
              Book Now
            </PremiumButton>
          </div>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && segments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#001F3F]/10 animate-fade-in space-y-4">
            {segments.map((seg, idx) => (
              <div key={idx}>
                {/* Segment Details */}
                <div className="relative pl-6 border-l-2 border-[#001F3F]/10 py-1 space-y-1">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#0047AB] flex items-center justify-center">
                    <Plane size={8} className="text-[#0047AB]" />
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-black text-[#001F3F] uppercase tracking-wide">
                        {formatTime(seg.departure.time)} · {seg.departure.code}
                      </div>
                      <div className="text-[10px] text-[#001F3F]/50 font-medium">
                        {seg.departure.airport}
                      </div>
                    </div>
                    <div className="text-[10px] text-[#001F3F]/40 font-bold uppercase tracking-wider">
                      {seg.duration}
                    </div>
                  </div>

                  <div className="py-2 flex items-center gap-2">
                    <img src={seg.airlineLogo} alt={seg.airline} className="w-4 h-4 object-contain" />
                    <span className="text-[10px] font-bold text-[#001F3F]/70">
                      {seg.airline} · {seg.flightNumber} · {seg.aircraft}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-black text-[#001F3F] uppercase tracking-wide">
                        {formatTime(seg.arrival.time)} · {seg.arrival.code}
                      </div>
                      <div className="text-[10px] text-[#001F3F]/50 font-medium">
                        {seg.arrival.airport}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layover Detail */}
                {idx < segments.length - 1 && (
                  <div className="my-3 py-2 px-3 bg-[#F0F4F8] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-[#0047AB]" />
                      <span className="text-[10px] font-black text-[#001F3F]/60 uppercase tracking-widest">
                        Layover in {seg.arrival.code}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-[#0047AB]">
                      {calculateLayover(seg.arrival.time, segments[idx + 1].departure.time)}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            <div className="bg-[#00A854]/5 rounded-xl p-3 border border-[#00A854]/10">
              <div className="flex justify-between items-center text-[10px] font-black text-[#00A854] uppercase tracking-widest">
                <span>Standard Baggage</span>
                <span>Included</span>
              </div>
              <p className="text-[9px] text-[#00A854]/60 font-medium mt-1">
                1 Cabin Bag (7kg) + 1 Check-in Bag (15kg-23kg depending on airline)
              </p>
            </div>
          </div>
        )}
      </div>
    </LiquidGlassCard>
  );
}
