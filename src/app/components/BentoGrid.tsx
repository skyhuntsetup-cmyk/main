import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BentoItem {
  icon: LucideIcon;
  title: string;
  description?: string;
  value?: string;
  gradient: string;
  size?: 'small' | 'medium' | 'large';
  pulseIndicator?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

const sizeClasses = {
  large: 'col-span-12 md:col-span-8 row-span-2',
  medium: 'col-span-12 md:col-span-6',
  small: 'col-span-6 md:col-span-4',
};

export function BentoGrid({ items, className }: BentoGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-12 gap-4', className)}>
      {items.map((item, i) => {
        const Icon = item.icon;
        const isHovered = hoveredIndex === i;

        return (
          <div
            key={i}
            className={cn(
              'relative rounded-2xl bg-white/15 backdrop-blur-[60px] border-[1.5px] border-white/60',
              'shadow-[0_8px_32px_rgba(0,71,171,0.12)] overflow-hidden',
              'transition-all duration-300 cursor-pointer p-5',
              isHovered && 'shadow-[0_12px_40px_rgba(0,71,171,0.22)] scale-[1.02]',
              sizeClasses[item.size ?? 'small']
            )}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Hover gradient orb */}
            <div
              className={cn(
                'absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300',
                `bg-gradient-to-br ${item.gradient}`,
                isHovered ? 'opacity-30' : 'opacity-10'
              )}
            />

            {item.pulseIndicator && (
              <div className="absolute top-3 right-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
                </span>
              </div>
            )}

            <div className="relative z-10 space-y-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  `bg-gradient-to-br ${item.gradient}`
                )}
              >
                <Icon size={20} className="text-white" />
              </div>

              <div>
                <div className="font-bold text-[#001F3F]">{item.title}</div>
                {item.description && (
                  <p className="text-sm text-[#001F3F]/60 mt-1 font-medium leading-snug">
                    {item.description}
                  </p>
                )}
              </div>

              {item.value && (
                <div className="text-2xl font-black text-[#001F3F]">{item.value}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
