import { useState } from 'react';
import { Bell, Clock, AlertCircle, Plus, Calendar, Trash2, X } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { useStore } from '../../store/useStore';

export function AlertsScreen() {
  const alerts = useStore((state) => state.alerts);
  const addAlert = useStore((state) => state.addAlert);
  const deleteAlert = useStore((state) => state.deleteAlert);
  const toggleAlert = useStore((state) => state.toggleAlert);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlertForm, setNewAlertForm] = useState({
    route: 'Delhi → London',
    fromCode: 'DEL',
    toCode: 'LHR',
    targetPrice: 35000
  });

  const activeAlerts = alerts.filter((a) => a.active);
  const triggered = alerts.filter((a) => a.currentPrice && a.currentPrice <= a.targetPrice && a.active).length;

  const handleCreateAlert = () => {
    addAlert({
      route: newAlertForm.route,
      fromCode: newAlertForm.fromCode,
      toCode: newAlertForm.toCode,
      targetPrice: Number(newAlertForm.targetPrice),
      currency: 'INR',
      active: true,
      currentPrice: undefined // It will monitor later
    });
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${triggered > 0 ? 'bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.8)]' : 'bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.8)]'} animate-pulse`} />
              <span className={`text-xs font-bold ${triggered > 0 ? 'text-[#FF6B6B]' : 'text-[#00F5FF]'} uppercase tracking-widest`}>
                {triggered > 0 ? `${triggered} Triggered` : 'AI Monitoring'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Price Alerts</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Watching {activeAlerts.length} routes 24/7</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#f15959] flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,107,0.35)]">
            <Bell size={22} className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-5 no-scrollbar">
        {[`All · ${alerts.length}`, `Active · ${activeAlerts.length}`, `Triggered · ${triggered}`].map((tab, i) => (
          <button key={tab} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold ${i === 0 ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-md' : 'bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F]/60'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-4">
        {alerts.length === 0 && !showCreateForm && (
          <div className="text-center py-10 opacity-60">
            <Bell size={48} className="mx-auto mb-4 text-[#001F3F]/30" />
            <p className="text-[#001F3F] font-bold">No active alerts</p>
            <p className="text-sm text-[#001F3F]/70 mt-1">Create an alert to monitor prices automatically.</p>
          </div>
        )}

        {alerts.map((alert) => {
          const isTriggered = !!(alert.currentPrice && alert.currentPrice <= alert.targetPrice);
          const pct = alert.currentPrice ? Math.abs(Math.round(((alert.currentPrice - alert.targetPrice) / alert.targetPrice) * 100)) : 0;
          const dateStr = new Date(alert.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <LiquidGlassCard key={alert.id} pulseIndicator={isTriggered} className={isTriggered ? 'border-[#FF6B6B]/40 shadow-[0_8px_32px_rgba(255,107,107,0.12)]' : ''}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-black text-[#001F3F]">{alert.route}</div>
                    <div className="text-xs text-[#001F3F]/40 font-mono mt-0.5">{alert.fromCode} → {alert.toCode}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black flex-shrink-0 ${isTriggered ? 'bg-[#FF6B6B] text-white' : 'bg-white/40 border-[1.5px] border-white/60 text-[#001F3F]/50'}`}>
                  {isTriggered ? <AlertCircle size={12} /> : <Clock size={12} />}
                  {isTriggered ? 'TRIGGERED' : alert.active ? 'Watching' : 'Paused'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/20">
                  <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase mb-1">Your Target</div>
                  <div className="text-xl font-black text-[#001F3F]">₹{alert.targetPrice.toLocaleString('en-IN')}</div>
                </div>
                <div className={`p-3 rounded-xl ${alert.currentPrice ? (isTriggered ? 'bg-[#00A854]/10 border border-[#00A854]/20' : 'bg-[#FF6B6B]/8 border border-[#FF6B6B]/15') : 'bg-white/20'}`}>
                  <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase mb-1">Current Price</div>
                  <div className={`text-xl font-black ${isTriggered ? 'text-[#00A854]' : 'text-[#001F3F]'}`}>
                    {alert.currentPrice ? `₹${alert.currentPrice.toLocaleString('en-IN')}` : 'Scanning...'}
                  </div>
                  {alert.currentPrice && (
                    <div className={`text-[10px] font-black mt-0.5 ${isTriggered ? 'text-[#00A854]' : 'text-[#FF6B6B]'}`}>
                      {isTriggered ? `↓ ${pct}% under target` : `↑ ${pct}% over target`}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#001F3F]/40 font-medium mb-4">
                <Calendar size={12} />
                <span>Added {dateStr}</span>
              </div>

              <div className="flex gap-2">
                <PremiumButton variant="glass" size="small" onClick={() => toggleAlert(alert.id)}>
                  <Bell size={13} /> {alert.active ? 'Pause' : 'Resume'}
                </PremiumButton>
                <button 
                  onClick={() => deleteAlert(alert.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#E74C3C] hover:bg-[#E74C3C]/10 transition-colors ml-auto"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </LiquidGlassCard>
          );
        })}

        {!showCreateForm ? (
          <LiquidGlassCard hoverable className="border-dashed border-[#0047AB]/30" onClick={() => setShowCreateForm(true)}>
            <div className="flex items-center gap-4 py-1 cursor-pointer">
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
        ) : (
          <LiquidGlassCard className="border-[#0047AB]/30 shadow-[0_8px_32px_rgba(0,71,171,0.12)]">
            <div className="flex items-center justify-between mb-4">
              <div className="font-black text-[#001F3F]">Configure Alert</div>
              <button onClick={() => setShowCreateForm(false)} className="text-[#001F3F]/40 hover:text-[#001F3F]">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#001F3F]/50 uppercase mb-1">Route (e.g. Delhi → London)</label>
                <input 
                  type="text"
                  value={newAlertForm.route}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, route: e.target.value })}
                  className="w-full bg-white/50 border-[1.5px] border-white/60 rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:outline-none focus:border-[#00F5FF] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#001F3F]/50 uppercase mb-1">From Code</label>
                  <input 
                    type="text"
                    value={newAlertForm.fromCode}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, fromCode: e.target.value.toUpperCase() })}
                    className="w-full bg-white/50 border-[1.5px] border-white/60 rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:outline-none focus:border-[#00F5FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#001F3F]/50 uppercase mb-1">To Code</label>
                  <input 
                    type="text"
                    value={newAlertForm.toCode}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, toCode: e.target.value.toUpperCase() })}
                    className="w-full bg-white/50 border-[1.5px] border-white/60 rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:outline-none focus:border-[#00F5FF] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#001F3F]/50 uppercase mb-1">Target Price (INR)</label>
                <input 
                  type="number"
                  value={newAlertForm.targetPrice}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, targetPrice: Number(e.target.value) })}
                  className="w-full bg-white/50 border-[1.5px] border-white/60 rounded-xl px-4 py-3 text-sm font-bold text-[#001F3F] focus:outline-none focus:border-[#00F5FF] transition-colors"
                />
              </div>
              
              <PremiumButton onClick={handleCreateAlert} variant="primary" className="w-full mt-2">
                Save Alert
              </PremiumButton>
            </div>
          </LiquidGlassCard>
        )}
      </div>
    </div>
  );
}
