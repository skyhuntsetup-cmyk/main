import { Card } from '../../components/Card';
import { ArrowLeft, HelpCircle, Mail, MessageCircle, FileText, Shield, Star, ExternalLink, ChevronRight } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const faqs = [
    {
      question: 'How does Sky Hunt find the best deals?',
      answer: 'Sky Hunt uses advanced AI algorithms to scan millions of flight combinations across hundreds of airlines in real-time, ensuring you get the absolute best prices available.'
    },
    {
      question: 'Are the prices shown final?',
      answer: 'Prices are updated in real-time from airline sources. Final prices may vary slightly based on availability and booking time. We always show the most current available prices.'
    },
    {
      question: 'How do price alerts work?',
      answer: 'Set your target price for any route, and we\'ll monitor prices 24/7. When prices drop below your target, you\'ll receive instant notifications via your preferred channels.'
    },
    {
      question: 'Can I cancel or modify my booking?',
      answer: 'Cancellation and modification policies depend on the airline and fare type. You can view specific policies before booking and manage bookings through our app.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use bank-level encryption and comply with PCI DSS standards. We never store your complete card details on our servers.'
    }
  ];

  const supportChannels = [
    { icon: Mail, label: 'Email Support', value: 'support@skyhunt.com', color: '#1F77D2' },
    { icon: MessageCircle, label: 'Live Chat', value: 'Available 24/7', color: '#00A854' },
    { icon: FileText, label: 'Help Center', value: 'help.skyhunt.com', color: '#F39C12' }
  ];

  return (
    <div className="pb-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3498DB] via-[#2980b9] to-[#206fa3] px-6 pt-12 pb-8 shadow-xl relative overflow-hidden border-b-2 border-[#3498DB]/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="relative">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Settings</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/30">
              <HelpCircle className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={28} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">About & Help</h1>
              <p className="text-white/90 text-sm mt-1">Get help and learn more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* About Sky Hunt */}
        <Card className="bg-gradient-to-br from-[#1F77D2]/10 to-transparent border-2 border-[#1F77D2]/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F77D2] to-[#1557a0] flex items-center justify-center shadow-xl">
              <span className="text-3xl">✈️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#222222]">Sky Hunt</h2>
              <p className="text-sm text-[#666666] font-medium">Version 1.0.0 (Build 42)</p>
            </div>
          </div>
          <p className="text-[#666666] leading-relaxed">
            Sky Hunt is your AI-powered flight deal hunting companion. We help millions of travelers
            save money by finding the best flight deals through intelligent price monitoring,
            real-time alerts, and predictive analytics.
          </p>
        </Card>

        {/* Support Channels */}
        <Card>
          <h3 className="text-lg font-bold text-[#222222] mb-4">Get Support</h3>
          <div className="space-y-3">
            {supportChannels.map((channel, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#F5F5F5] hover:bg-[#E8E8E8] transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${channel.color}15, ${channel.color}05)` }}
                >
                  <channel.icon style={{ color: channel.color }} size={24} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-[#222222]">{channel.label}</div>
                  <div className="text-sm text-[#666666]">{channel.value}</div>
                </div>
                <ExternalLink className="text-[#999999] group-hover:text-[#1F77D2] transition-colors" size={20} />
              </button>
            ))}
          </div>
        </Card>

        {/* FAQs */}
        <Card>
          <h3 className="text-lg font-bold text-[#222222] mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl border-2 border-[#E8E8E8] overflow-hidden hover:border-[#1F77D2]/30 transition-all"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-[#222222] hover:bg-[#F5F5F5] transition-colors">
                  <span>{faq.question}</span>
                  <ChevronRight className="text-[#666666] group-open:rotate-90 transition-transform" size={20} />
                </summary>
                <div className="px-4 pb-4 text-sm text-[#666666] leading-relaxed border-t border-[#E8E8E8] pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Card>

        {/* Quick Links */}
        <Card>
          <h3 className="text-lg font-bold text-[#222222] mb-4">Quick Links</h3>
          <div className="space-y-2">
            {[
              { icon: Shield, label: 'Privacy Policy', color: '#00A854' },
              { icon: FileText, label: 'Terms of Service', color: '#1F77D2' },
              { icon: Star, label: 'Rate Us', color: '#F39C12' },
              { icon: MessageCircle, label: 'Send Feedback', color: '#9B59B6' }
            ].map((link, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F5] transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${link.color}15, ${link.color}05)` }}
                >
                  <link.icon style={{ color: link.color }} size={20} />
                </div>
                <span className="flex-1 text-left font-semibold text-[#222222]">{link.label}</span>
                <ChevronRight className="text-[#999999] group-hover:text-[#1F77D2] transition-colors" size={20} />
              </button>
            ))}
          </div>
        </Card>

        {/* Features */}
        <Card className="bg-gradient-to-br from-[#00A854]/10 to-transparent">
          <h3 className="text-lg font-bold text-[#222222] mb-4">What We Offer</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🤖', label: 'AI-Powered Search' },
              { emoji: '💰', label: 'Best Price Guarantee' },
              { emoji: '🔔', label: 'Real-time Alerts' },
              { emoji: '📊', label: 'Price Predictions' },
              { emoji: '🌍', label: '500+ Destinations' },
              { emoji: '⚡', label: 'Instant Booking' }
            ].map((feature, index) => (
              <div key={index} className="p-3 rounded-xl bg-white border border-[#E8E8E8] text-center">
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <div className="text-xs font-bold text-[#666666]">{feature.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Legal & Credits */}
        <Card className="bg-gradient-to-br from-[#F5F5F5] to-white border border-[#E8E8E8]">
          <div className="text-xs text-[#666666] text-center space-y-2">
            <div className="font-bold text-sm text-[#222222]">Sky Hunt</div>
            <div>© 2026 Sky Hunt Technologies Pvt. Ltd.</div>
            <div>All rights reserved.</div>
            <div className="pt-3 border-t border-[#E8E8E8] mt-3 space-y-1">
              <div>Built with ❤️ in India</div>
              <div>Powered by Advanced AI & Machine Learning</div>
            </div>
          </div>
        </Card>

        {/* Social Media */}
        <div className="flex justify-center gap-4">
          {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
            <button
              key={social}
              className="w-12 h-12 rounded-xl bg-[#F5F5F5] border-2 border-[#E8E8E8] hover:border-[#1F77D2] hover:bg-[#1F77D2]/5 transition-all flex items-center justify-center font-bold text-xs text-[#666666] hover:text-[#1F77D2]"
            >
              {social[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
