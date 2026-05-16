import { Plane, User, Bell, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

interface TopNavigationProps {
  onLogout: () => void;
}

export function TopNavigation({ onLogout }: TopNavigationProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_24px_rgba(0,71,171,0.08)] animate-[slide-down_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-lg">
            <Plane className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#0047AB] to-[#00F5FF] bg-clip-text text-transparent">
            Sky Hunt
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm font-semibold text-[#001F3F] hover:text-[#00F5FF] transition-colors">
            Explore
          </button>
          <button className="text-sm font-semibold text-[#001F3F] hover:text-[#00F5FF] transition-colors">
            My Trips
          </button>
          <button className="text-sm font-semibold text-[#001F3F] hover:text-[#00F5FF] transition-colors">
            Deals
          </button>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl hover:bg-white/60 transition-colors">
            <Bell size={20} className="text-[#001F3F]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B6B] rounded-full border-2 border-white"></div>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="hidden md:block text-sm font-semibold text-[#001F3F]">Rishabh</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,71,171,0.15)] overflow-hidden animate-[fade-in_0.2s_ease-out]">
                <div className="p-4 border-b border-white/30">
                  <div className="font-bold text-[#001F3F]">Rishabh Arora</div>
                  <div className="text-sm text-[#001F3F]/60">rishabh@example.com</div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/60 transition-colors text-left">
                    <User size={18} className="text-[#00F5FF]" />
                    <span className="text-sm font-medium text-[#001F3F]">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/60 transition-colors text-left">
                    <Settings size={18} className="text-[#00F5FF]" />
                    <span className="text-sm font-medium text-[#001F3F]">Settings</span>
                  </button>
                </div>
                <div className="p-2 border-t border-white/30">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={18} className="text-red-500" />
                    <span className="text-sm font-medium text-red-500">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
