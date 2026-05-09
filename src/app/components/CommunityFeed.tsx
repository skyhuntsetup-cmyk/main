import { useState, useEffect } from 'react';
import { CheckCircle2, Users } from 'lucide-react';

const MOCK_COMMUNITY_POSTS = [
  { id: 1, user: 'Rahul S.', destination: 'London', price: 34500, timeAgo: '2m ago', savings: '₹36,500' },
  { id: 2, user: 'Priya D.', destination: 'Dubai', price: 14200, timeAgo: '15m ago', savings: '₹8,200' },
  { id: 3, user: 'Ankit M.', destination: 'Tokyo', price: 28900, timeAgo: '45m ago', savings: '₹43,100' },
  { id: 4, user: 'Neha K.', destination: 'Bangkok', price: 12500, timeAgo: '1h ago', savings: '₹5,500' },
];

export function CommunityFeed() {
  const [posts, setPosts] = useState(MOCK_COMMUNITY_POSTS);

  // Rotate feed
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-4 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A854] to-[#0047AB] flex items-center justify-center">
            <Users size={16} className="text-white" />
          </div>
          <div>
            <div className="text-xs font-black text-[#001F3F] uppercase tracking-widest">Community Feed</div>
            <div className="text-[10px] text-[#001F3F]/50 font-bold">Live deals confirmed by users</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#00A854]/10 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00A854] animate-pulse" />
          <span className="text-[9px] font-black text-[#00A854] uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="space-y-3 relative">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/40 to-transparent z-10" />
        
        {posts.slice(0, 3).map((post, i) => (
          <div 
            key={`${post.id}-${i}`}
            className={`flex items-center justify-between p-3 rounded-xl bg-white/60 transition-all duration-500 ease-in-out ${
              i === 0 ? 'opacity-100 translate-y-0 shadow-sm border border-[#00A854]/20' : 
              i === 1 ? 'opacity-70 translate-y-0 scale-[0.98]' : 
              'opacity-30 translate-y-0 scale-[0.95]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#001F3F]/5 flex items-center justify-center border border-[#001F3F]/10 text-xs font-black text-[#001F3F]">
                {post.user.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#001F3F]">{post.user}</span>
                  <span className="text-[10px] text-[#001F3F]/50">booked</span>
                </div>
                <div className="text-sm font-black text-[#0047AB]">{post.destination}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs font-black text-[#00A854] justify-end">
                <CheckCircle2 size={12} />
                ₹{post.price.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#001F3F]/40 font-bold mt-0.5">{post.timeAgo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
