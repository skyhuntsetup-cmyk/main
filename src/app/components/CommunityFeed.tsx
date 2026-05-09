import { useState, useEffect } from 'react';
import { CheckCircle2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CommunityPost {
  id: string;
  user_name: string;
  destination: string;
  price: number;
  savings: string;
  user_avatar_initial: string;
  created_at: string;
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    if (!supabase) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!supabase) return;
    fetchPosts();

    // Real-time subscription
    const channel = supabase
      .channel('community_posts_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, (payload) => {
        setPosts(prev => [payload.new as CommunityPost, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);


  // Rotate feed display
  const [displayIndex, setDisplayIndex] = useState(0);
  useEffect(() => {
    if (posts.length <= 3) return;
    const interval = setInterval(() => {
      setDisplayIndex(prev => (prev + 1) % posts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [posts]);

  const visiblePosts = posts.length > 0 
    ? [...posts, ...posts].slice(displayIndex, displayIndex + 3)
    : [];

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

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

      <div className="space-y-3 relative h-[210px]">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/20 animate-pulse" />
          ))
        ) : visiblePosts.map((post, i) => (
          <div 
            key={`${post.id}-${i}`}
            className={`flex items-center justify-between p-3 rounded-xl bg-white/60 transition-all duration-700 ease-in-out absolute w-full`}
            style={{ 
              top: `${i * 70}px`,
              opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.3,
              transform: `scale(${1 - i * 0.05}) translateY(${i * 4}px)`,
              zIndex: 3 - i
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#001F3F]/10 to-[#0047AB]/10 flex items-center justify-center border border-[#001F3F]/10 text-xs font-black text-[#001F3F]">
                {post.user_avatar_initial}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#001F3F]">{post.user_name}</span>
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
              <div className="text-[10px] text-[#001F3F]/40 font-bold mt-0.5">{getTimeAgo(post.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

