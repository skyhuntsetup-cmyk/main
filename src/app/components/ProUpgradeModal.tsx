import { useState } from 'react';
import { X, Zap, Bell, Shield, Brain, Star, Check, Crown } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { trackEvent } from '../../lib/analytics';


interface ProUpgradeModalProps {
  onClose: () => void;
  trigger?: string; // which feature triggered this modal
}

const proFeatures = [
  { icon: Zap, label: 'Unlimited Flash Deal Alerts', sub: 'All routes, all cabin classes', color: '#F39C12' },
  { icon: Bell, label: 'Mistake Fare Detector', sub: 'Rare pricing errors — act in minutes', color: '#FF6B6B' },
  { icon: Brain, label: 'AI "Book Now or Wait" Advisor', sub: 'Price predictions on every route', color: '#0047AB' },
  { icon: Shield, label: 'Smart Document Vault', sub: 'Cloud-synced passport & visa reminders', color: '#00A854' },
  { icon: Star, label: 'Business & First Class Deals', sub: 'Premium cabin alert access', color: '#8E44AD' },
];

export function ProUpgradeModal({ onClose, trigger }: ProUpgradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const setAccountTier = useStore((state) => state.setAccountTier);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!supabase) {
      alert('Supabase connection not established.');
      return;
    }

    setIsProcessing(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    trackEvent('upgrade_initiated', { trigger, userId: authUser?.id });
    const res = await loadRazorpay();

    if (!res) {
      trackEvent('razorpay_sdk_load_failed');
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    // 1. Create a Razorpay Order via Supabase Edge Function
    const { data: userRecord } = await supabase.auth.getUser();
    const user = userRecord.user;
    if (!user) {
      alert('Please log in to upgrade');
      setIsProcessing(false);
      return;
    }

    const { data: order, error: orderError } = await supabase.functions.invoke('razorpay-create-order', {
      body: { userId: user.id, amount: 999 }
    });

    if (orderError || !order?.id) {
      console.error('Order Error:', orderError);
      alert('Failed to create payment order. Using demo mode.');
      // Fallback for demo if function is not set up with keys
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere', 
      amount: 999 * 100,
      currency: 'INR',
      name: 'Sky Hunt',
      description: 'Sky Hunt Pro - Annual Subscription',
      image: 'https://skyhunt.com/logo.png',
      order_id: order?.id, // Use the real order ID if available
      handler: async function (response: any) {
        console.log('Payment Success:', response.razorpay_payment_id);
        trackEvent('upgrade_payment_success', { 
          paymentId: response.razorpay_payment_id,
          orderId: order?.id
        });
        // The webhook will handle the account tier update, 
        // but we update locally for immediate UX
        setAccountTier('pro');
        onClose();
      },
      notes: {
        userId: user.id
      },
      prefill: {
        name: user.user_metadata?.full_name || 'Sky Hunt User',
        email: user.email,
      },
      theme: {
        color: '#0047AB',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      console.error('Payment Failed:', response.error.description);
      alert('Payment failed. Please try again.');
    });
    
    paymentObject.open();
    setIsProcessing(false);
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#001F3F]/60 backdrop-blur-md px-4 pb-4 pt-4">
      <div className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-[slide-up_0.35s_cubic-bezier(0.34,1.56,0.64,1)]">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-[#001F3F] via-[#0047AB] to-[#00B8D4] p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#00F5FF]/20 rounded-full blur-2xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white/70 hover:bg-white/25 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F39C12] to-[#E67E22] flex items-center justify-center shadow-lg">
                <Crown size={20} className="text-white" />
              </div>
              <span className="text-[#00F5FF] text-xs font-black uppercase tracking-widest">Sky Hunt Pro</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Unlock Every<br />Deal. Beat<br />Every Price.
            </h2>
            {trigger && (
              <p className="text-white/60 text-sm font-medium mt-2">
                ↑ This feature requires Pro
              </p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white px-6 pt-5 pb-2">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-black text-[#001F3F]">₹999</span>
            <span className="text-[#001F3F]/40 font-bold pb-2">/year</span>
            <span className="ml-auto px-3 py-1.5 rounded-xl bg-[#00A854]/10 text-[#00A854] text-xs font-black">
              ₹83/month
            </span>
          </div>
          <p className="text-xs text-[#001F3F]/40 font-medium mb-4">
            Less than Zomunk. Infinitely more powerful.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-5">
            {proFeatures.map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon size={15} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-[#001F3F]">{label}</div>
                  <div className="text-[11px] text-[#001F3F]/40 font-medium">{sub}</div>
                </div>
                <Check size={16} className="text-[#00A854] flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* 7-day guarantee */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#00A854]/8 border border-[#00A854]/20 mb-5">
            <Shield size={16} className="text-[#00A854] flex-shrink-0" />
            <p className="text-xs font-bold text-[#00A854]">7-day no-questions-asked refund guarantee</p>
          </div>

          <PremiumButton variant="primary" size="large" className="w-full mb-3" onClick={handleUpgrade} disabled={isProcessing}>
            <Crown size={18} className="mr-2" />
            {isProcessing ? 'Processing...' : 'Upgrade to Pro — ₹999/yr'}
          </PremiumButton>
          <button
            onClick={onClose}
            className="w-full py-3 text-xs font-black text-[#001F3F]/30 uppercase tracking-widest"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
