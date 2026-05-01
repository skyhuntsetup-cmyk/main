import { Star, Clock, MapPin } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { PremiumButton } from './PremiumButton';
import { PulsePrice } from './PulsePrice';

interface EnhancedFlightCardProps {
  airline: string;
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
  onClick?: () => void;
}

export function EnhancedFlightCard({
  airline,
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
  onClick,
}: EnhancedFlightCardProps) {
  return (
    <LiquidGlassCard hoverable pulseIndicator={isMonitoring} onClick={onClick}>
      <div className="space-y-4">
        {/* Airline row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center">
              <span className="text-white text-xs font-black">{airline.slice(0, 2).toUpperCase()}</span>
            </div>
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
            <div className="flex items-center gap-1 text-xs text-[#001F3F]/50 font-medium">
              <MapPin size={11} />
              <span>{stops}</span>
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
            <PremiumButton variant="glass" size="small">Details</PremiumButton>
            <PremiumButton variant="primary" size="small" onClick={onClick}>Book Now</PremiumButton>
          </div>
        </div>
      </div>
    </LiquidGlassCard>
  );
}
