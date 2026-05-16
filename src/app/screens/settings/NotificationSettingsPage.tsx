import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ArrowLeft, Bell, Mail, MessageSquare, Smartphone, TrendingDown, Zap, Save } from 'lucide-react';

interface NotificationSettingsPageProps {
  onBack: () => void;
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    // Channel Preferences
    email: true,
    push: true,
    sms: false,

    // Alert Types
    priceDrops: true,
    dealAlerts: true,
    flashSales: true,
    routeAlerts: true,

    // Frequency
    realTime: true,
    daily: false,
    weekly: false,

    // Special Notifications
    bookingConfirmations: true,
    flightReminders: true,
    checkInReminders: true,
    boardingReminders: true,

    // Marketing
    newsletters: true,
    promotions: false,
    surveys: false
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6B6B] via-[#f15959] to-[#e74c4c] px-6 pt-12 pb-8 shadow-xl relative overflow-hidden border-b-2 border-[#FF6B6B]/50">
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
              <Bell className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" size={28} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">Notifications</h1>
              <p className="text-white/90 text-sm mt-1">Manage how you receive alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Notification Channels */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F77D2] to-[#1557a0] flex items-center justify-center shadow-lg">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Notification Channels</h3>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email' as const, icon: Mail, label: 'Email Notifications', desc: 'Receive alerts via email', color: '#1F77D2' },
              { key: 'push' as const, icon: Smartphone, label: 'Push Notifications', desc: 'Mobile and desktop notifications', color: '#00A854' },
              { key: 'sms' as const, icon: MessageSquare, label: 'SMS Notifications', desc: 'Text message alerts', color: '#F39C12' }
            ].map((channel) => (
              <div
                key={channel.key}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-[#E8E8E8] hover:border-[#1F77D2]/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${channel.color}15, ${channel.color}05)` }}
                  >
                    <channel.icon style={{ color: channel.color }} size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-[#222222]">{channel.label}</div>
                    <div className="text-xs text-[#666666]">{channel.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(channel.key)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifications[channel.key] ? 'bg-[#00A854]' : 'bg-[#E8E8E8]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      notifications[channel.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Price & Deal Alerts */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A854] to-[#008f47] flex items-center justify-center shadow-lg">
              <TrendingDown className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Price & Deal Alerts</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'priceDrops' as const, label: 'Price Drops', desc: 'When prices drop below your target' },
              { key: 'dealAlerts' as const, label: 'Deal Alerts', desc: 'Special deals and limited offers' },
              { key: 'flashSales' as const, label: 'Flash Sales', desc: 'Time-limited flash sales' },
              { key: 'routeAlerts' as const, label: 'Route Alerts', desc: 'Updates for your saved routes' }
            ].map((alert) => (
              <div
                key={alert.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F5] hover:bg-[#E8E8E8] transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-[#222222] text-sm">{alert.label}</div>
                  <div className="text-xs text-[#666666]">{alert.desc}</div>
                </div>
                <button
                  onClick={() => handleToggle(alert.key)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[alert.key] ? 'bg-[#00A854]' : 'bg-[#CCCCCC]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      notifications[alert.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Notification Frequency */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F39C12] to-[#e89c0c] flex items-center justify-center shadow-lg">
              <Zap className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Frequency</h3>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-[#666666] mb-3">Choose how often you want to receive deal notifications</p>
            {[
              { key: 'realTime' as const, label: 'Real-time', desc: 'Get notified instantly when deals appear' },
              { key: 'daily' as const, label: 'Daily Digest', desc: 'One email per day with all deals' },
              { key: 'weekly' as const, label: 'Weekly Summary', desc: 'Weekly roundup of best deals' }
            ].map((freq) => (
              <button
                key={freq.key}
                onClick={() => {
                  setNotifications({
                    ...notifications,
                    realTime: freq.key === 'realTime',
                    daily: freq.key === 'daily',
                    weekly: freq.key === 'weekly'
                  });
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  notifications[freq.key]
                    ? 'border-[#F39C12] bg-[#F39C12]/10'
                    : 'border-[#E8E8E8] hover:border-[#F39C12]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      notifications[freq.key] ? 'border-[#F39C12]' : 'border-[#CCCCCC]'
                    }`}
                  >
                    {notifications[freq.key] && (
                      <div className="w-3 h-3 rounded-full bg-[#F39C12]"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#222222]">{freq.label}</div>
                    <div className="text-xs text-[#666666]">{freq.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Travel Reminders */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3498DB] to-[#2980b9] flex items-center justify-center shadow-lg">
              <span className="text-xl">✈️</span>
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Travel Reminders</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'bookingConfirmations' as const, label: 'Booking Confirmations', desc: 'Instant booking confirmations' },
              { key: 'flightReminders' as const, label: 'Flight Reminders', desc: '24 hours before departure' },
              { key: 'checkInReminders' as const, label: 'Check-in Reminders', desc: 'When web check-in opens' },
              { key: 'boardingReminders' as const, label: 'Boarding Reminders', desc: '2 hours before boarding' }
            ].map((reminder) => (
              <div
                key={reminder.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F5] hover:bg-[#E8E8E8] transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-[#222222] text-sm">{reminder.label}</div>
                  <div className="text-xs text-[#666666]">{reminder.desc}</div>
                </div>
                <button
                  onClick={() => handleToggle(reminder.key)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[reminder.key] ? 'bg-[#3498DB]' : 'bg-[#CCCCCC]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      notifications[reminder.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Marketing & Updates */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9B59B6] to-[#8E44AD] flex items-center justify-center shadow-lg">
              <span className="text-xl">📧</span>
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Marketing & Updates</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'newsletters' as const, label: 'Newsletters', desc: 'Travel tips and industry news' },
              { key: 'promotions' as const, label: 'Promotional Offers', desc: 'Special promotions from partners' },
              { key: 'surveys' as const, label: 'Surveys & Feedback', desc: 'Help us improve Sky Hunt' }
            ].map((marketing) => (
              <div
                key={marketing.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F5] hover:bg-[#E8E8E8] transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-[#222222] text-sm">{marketing.label}</div>
                  <div className="text-xs text-[#666666]">{marketing.desc}</div>
                </div>
                <button
                  onClick={() => handleToggle(marketing.key)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[marketing.key] ? 'bg-[#9B59B6]' : 'bg-[#CCCCCC]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      notifications[marketing.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <Button
          variant="primary"
          size="large"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Settings...
            </div>
          ) : (
            <>
              <Save size={20} />
              Save Notification Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
