import { Home, Search, Bell, Zap, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  activeTab: 'home' | 'search' | 'alerts' | 'deals' | 'settings';
  onTabChange: (tab: 'home' | 'search' | 'alerts' | 'deals' | 'settings') => void;
}

const tabs = [
  { id: 'home' as const, icon: Home, label: 'Home' },
  { id: 'search' as const, icon: Search, label: 'Search' },
  { id: 'alerts' as const, icon: Bell, label: 'Alerts' },
  { id: 'deals' as const, icon: Zap, label: 'Deals' },
  { id: 'settings' as const, icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="w-full max-w-md bg-white/25 backdrop-blur-2xl border-[1.5px] border-white/70 rounded-2xl shadow-[0_8px_32px_rgba(0,71,171,0.18)]">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map(({ id, icon: Icon, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  'relative flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all duration-200',
                  active
                    ? 'bg-gradient-to-br from-[#0047AB] to-[#00F5FF] shadow-[0_4px_12px_rgba(0,71,171,0.35)]'
                    : 'hover:bg-white/30'
                )}
              >
                <Icon
                  size={20}
                  className={active ? 'text-white' : 'text-[#001F3F]/50'}
                />
                <span
                  className={cn(
                    'text-[10px] mt-0.5 font-bold',
                    active ? 'text-white' : 'text-[#001F3F]/40'
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
