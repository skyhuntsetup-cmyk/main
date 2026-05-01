import { Plane, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#001F3F] via-[#002854] to-[#001F3F] text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F77D2] to-[#1557a0] flex items-center justify-center shadow-lg">
                <Plane className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold">Sky Hunter</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your AI-powered flight deal hunting companion. Save up to 60% on every booking with intelligent price monitoring.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'X', href: '#' },
                { label: 'fb', href: '#' },
                { label: 'in', href: '#' },
                { label: 'li', href: '#' }
              ].map((social, index) => (
                <button
                  key={index}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all hover:scale-110 text-white text-xs font-bold"
                >
                  {social.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Search Flights', 'Price Alerts', 'Deals', 'My Bookings'].map((link) => (
                <li key={link}>
                  <button className="text-white/70 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <button className="text-white/70 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#1F77D2] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">Email</div>
                  <div className="text-white/70 text-sm">support@skyhunter.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#1F77D2] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">Phone</div>
                  <div className="text-white/70 text-sm">+91 1800-HUNTER</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1F77D2] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">Address</div>
                  <div className="text-white/70 text-sm">Bangalore, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/60 text-center md:text-left">
              © {currentYear} Sky Hunter Technologies Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Built with</span>
              <Heart size={14} className="text-red-400 fill-red-400" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
