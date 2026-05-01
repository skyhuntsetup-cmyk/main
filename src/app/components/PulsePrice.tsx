interface PulsePriceProps {
  price: number;
  savings?: number;
  isMonitoring?: boolean;
}

export function PulsePrice({ price, savings, isMonitoring = false }: PulsePriceProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex items-center justify-center">
        {isMonitoring && (
          <>
            <span className="absolute inline-flex h-16 w-16 rounded-full bg-[#00F5FF]/20 animate-ping" />
            <span className="absolute inline-flex h-12 w-12 rounded-full bg-[#00F5FF]/30 animate-ping [animation-delay:150ms]" />
          </>
        )}
        <div
          className={`relative z-10 flex items-center justify-center rounded-full w-14 h-14 ${
            isMonitoring
              ? 'bg-gradient-to-br from-[#0047AB] to-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.5)]'
              : 'bg-white/20 border-[1.5px] border-white/60'
          }`}
        >
          <span className={`text-lg font-black ${isMonitoring ? 'text-white' : 'text-[#0047AB]'}`}>
            ₹
          </span>
        </div>
      </div>

      <div>
        <div className="text-3xl font-black text-[#001F3F]">
          ₹{price.toLocaleString('en-IN')}
        </div>
        {savings !== undefined && savings > 0 && (
          <div className="text-sm font-bold text-[#00A854] flex items-center gap-1 mt-0.5">
            <span>↓</span>
            <span>Save ₹{savings.toLocaleString('en-IN')}</span>
          </div>
        )}
        {isMonitoring && (
          <div className="text-xs text-[#00F5FF] font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
            AI monitoring active
          </div>
        )}
      </div>
    </div>
  );
}
