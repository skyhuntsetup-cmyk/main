import { Bell, Clock, TrendingDown, AlertCircle, Plus, Calendar, Trash2, Pencil } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';

const alerts = [
  { route: 'Delhi → London', from: 'DEL', to: 'LHR', flag: '🇬🇧', budget: 35000, current: 45200, status: 'waiting' as const, setDate: 'Mar 1', expiresDate: 'Sep 1' },
  { route: 'Mumbai → New York', from: 'BOM', to: 'JFK', flag: '🇺🇸', budget: 60000, current: 58500, status: 'triggered' as const, savings: 1500, setDate: 'Feb 15', expiresDate: 'Aug 15' },
  { route: 'Bangalore → San Francisco', from: 'BLR', to: 'SFO', flag: '🇺🇸', budget: 55000, current: 62000, status: 'waiting' as const, setDate: 'Mar 10', expiresDate: 'Sep 10' },
];

export function AlertsScreen() {
  const triggered = alerts.filter((a) => a.status === 'triggered').length;

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse shadow-[0_0_8px_rgba(255,107,107,0.8)]" />
              <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-widest">
                {triggered > 0 ? `${triggered} Triggered` : 'AI Monitoring'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Price Alerts</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Watching {alerts.length} routes 24/7</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#f15959] flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,107,0.35)]">
            <Bell size={22} className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-5 no-scrollbar">
        {['All · 3', 'Active · 2', 'Triggered · 1', 'Expired · 0'].map((tab, i) => (
          <button key={tab} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold ${i === 0 ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-md' : 'bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F]/60'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-4">
        {alerts.map((alert, i) => {
          const isTriggered = alert.status === 'triggered';
          const isBelowBudget = alert.current <= alert.budget;
          const pct = Math.abs(Math.round(((alert.current - alert.budget) / alert.budget) * 100));

          return (
            <LiquidGlassCard key={i} pulseIndicator={isTriggered} className={isTriggered ? 'border-[#FF6B6B]/40 shadow-[0_8px_32px_rgba(255,107,107,0.12)]' : ''}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{alert.flag}</span>
                  <div>
                    <div className="font-black text-[#001F3F]">{alert.route}</div>
                    <div className="text-xs text-[#001F3F]/40 font-mono mt-0.5">{alert.from} → {alert.to}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black flex-shrink-0 ${isTriggered ? 'bg-[#FF6B6B] text-white' : 'bg-white/40 border-[1.5px] border-white/60 text-[#001F3F]/50'}`}>
                  {isTriggered ? <AlertCircle size={12} /> : <Clock size={12} />}
                  {isTriggered ? 'TRIGGERED' : 'Watching'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/20">
                  <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase mb-1">Your Budget</div>
                  <div className="text-xl font-black text-[#001F3F]">₹{alert.budget.toLocaleString('en-IN')}</div>
                </div>
                <div className={`p-3 rounded-xl ${isBelowBudget ? 'bg-[#00A854]/10 border border-[#00A854]/20' : 'bg-[#FF6B6B]/8 border border-[#FF6B6B]/15'}`}>
                  <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase mb-1">Current Price</div>
                  <div className={`text-xl font-black ${isBelowBudget ? 'text-[#00A854]' : 'text-[#001F3F]'}`}>₹{alert.current.toLocaleString('en-IN')}</div>
                  <div className={`text-[10px] font-black mt-0.5 ${isBelowBudget ? 'text-[#00A854]' : 'text-[#FF6B6B]'}`}>
                    {isBelowBudget ? `↓ ${pct}% under budget` : `↑ ${pct}% over budget`}
                  </div>
                </div>
              </div>

              {'savings' in alert && alert.savings && isTriggered && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#00A854]/10 border border-[#00A854]/20 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#00A854] flex items-center justify-center flex-shrink-0">
                    <TrendingDown size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#00A854]">Save ₹{alert.savings.toLocaleString('en-IN')} now!</div>
                    <div className="text-xs text-[#001F3F]/50 mt-0.5">Book before it rises again</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#001F3F]/40 font-medium mb-4">
                <Calendar size={12} />
                <span>Set {alert.setDate} · Expires {alert.expiresDate}</span>
              </div>

              <div className="flex gap-2">
                {isTriggered ? (
                  <>
                    <PremiumButton variant="success" className="flex-1">View Deal</PremiumButton>
                    <PremiumButton variant="glass" className="flex-1">Dismiss</PremiumButton>
                  </>
                ) : (
                  <>
                    <PremiumButton variant="glass" size="small"><Pencil size={13} />Edit</PremiumButton>
                    <PremiumButton variant="glass" size="small"><Clock size={13} />History</PremiumButton>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#E74C3C] hover:bg-[#E74C3C]/10 transition-colors ml-auto">
                      <Trash2 size={13} />Delete
                    </button>
                  </>
                )}
              </div>
            </LiquidGlassCard>
          );
        })}

        <LiquidGlassCard hoverable className="border-dashed border-[#0047AB]/30">
          <div className="flex items-center gap-4 py-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-lg flex-shrink-0">
              <Plus size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-black text-[#001F3F]">Create New Alert</div>
              <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">Get notified when prices drop</div>
            </div>
            <PremiumButton variant="primary" size="small">Add</PremiumButton>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
