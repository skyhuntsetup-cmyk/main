import { Card } from './Card';
import { Button } from './Button';
import { Star } from 'lucide-react';

interface FlightCardProps {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: number;
  savings?: number;
  rating?: number;
  reviews?: number;
  onClick?: () => void;
}

export function FlightCard({
  airline,
  departureTime,
  arrivalTime,
  duration,
  stops,
  price,
  savings,
  rating,
  reviews,
  onClick
}: FlightCardProps) {
  return (
    <Card hoverable onClick={onClick}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium text-[#222222]">{airline}</div>
        </div>

        <div className="space-y-1">
          <div className="text-lg font-medium text-[#222222]">
            {departureTime} → {arrivalTime} <span className="text-sm text-[#666666]">({duration})</span>
          </div>
          <div className="text-sm text-[#666666]">{stops}</div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#1F77D2]">₹{price.toLocaleString()}</div>
            {savings && (
              <div className="text-sm text-[#00A854]">✨ SAVE ₹{savings.toLocaleString()}</div>
            )}
          </div>
          {rating && reviews && (
            <div className="flex items-center gap-1 text-sm text-[#666666]">
              <Star size={16} className="fill-[#F39C12] text-[#F39C12]" />
              {rating}/5 ({reviews.toLocaleString()} reviews)
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outlined" size="medium" className="flex-1">
            DETAILS
          </Button>
          <Button variant="primary" size="medium" className="flex-1">
            BOOK
          </Button>
        </div>
      </div>
    </Card>
  );
}
