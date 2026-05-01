import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ArrowLeft, Settings, Plane, Star, Save } from 'lucide-react';

interface PreferencesPageProps {
  onBack: () => void;
}

export function PreferencesPage({ onBack }: PreferencesPageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    cabinClass: 'economy',
    seatPreference: 'window',
    mealPreference: 'vegetarian',
    flightTiming: 'morning',
    airlines: ['indigo', 'airindia'],
    maxStops: '1',
    priceAlerts: true,
    dealNotifications: true,
    currency: 'INR',
    language: 'en'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const toggleAirline = (airline: string) => {
    setPreferences(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter(a => a !== airline)
        : [...prev.airlines, airline]
    }));
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00A854] via-[#008f47] to-[#00763a] px-6 pt-12 pb-8 shadow-xl relative overflow-hidden border-b-2 border-[#00A854]/50">
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
              <Settings className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={28} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">Preferences</h1>
              <p className="text-white/90 text-sm mt-1">Customize your travel experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Flight Preferences */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F77D2] to-[#1557a0] flex items-center justify-center shadow-lg">
              <Plane className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Flight Preferences</h3>
          </div>

          <div className="space-y-4">
            {/* Cabin Class */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#666666]">Preferred Cabin Class</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'economy', label: 'Economy', icon: '💺' },
                  { value: 'premium', label: 'Premium', icon: '🪑' },
                  { value: 'business', label: 'Business', icon: '✈️' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPreferences({ ...preferences, cabinClass: option.value })}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      preferences.cabinClass === option.value
                        ? 'border-[#1F77D2] bg-[#1F77D2]/10 text-[#1F77D2]'
                        : 'border-[#E8E8E8] text-[#666666] hover:border-[#1F77D2]/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Preference */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#666666]">Seat Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'window', label: 'Window' },
                  { value: 'middle', label: 'Middle' },
                  { value: 'aisle', label: 'Aisle' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPreferences({ ...preferences, seatPreference: option.value })}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      preferences.seatPreference === option.value
                        ? 'border-[#1F77D2] bg-[#1F77D2]/10 text-[#1F77D2]'
                        : 'border-[#E8E8E8] text-[#666666] hover:border-[#1F77D2]/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight Timing */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#666666]">Preferred Flight Timing</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'morning', label: 'Morning', time: '6 AM - 12 PM', icon: '🌅' },
                  { value: 'afternoon', label: 'Afternoon', time: '12 PM - 6 PM', icon: '☀️' },
                  { value: 'evening', label: 'Evening', time: '6 PM - 12 AM', icon: '🌆' },
                  { value: 'night', label: 'Night', time: '12 AM - 6 AM', icon: '🌙' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPreferences({ ...preferences, flightTiming: option.value })}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                      preferences.flightTiming === option.value
                        ? 'border-[#1F77D2] bg-[#1F77D2]/10 text-[#1F77D2]'
                        : 'border-[#E8E8E8] text-[#666666] hover:border-[#1F77D2]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{option.icon}</span>
                      <span className="font-bold">{option.label}</span>
                    </div>
                    <div className="text-xs opacity-70">{option.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Stops */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#666666]">Maximum Stops</label>
              <select
                value={preferences.maxStops}
                onChange={(e) => setPreferences({ ...preferences, maxStops: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         transition-all duration-200"
              >
                <option value="0">Non-stop only</option>
                <option value="1">Up to 1 stop</option>
                <option value="2">Up to 2 stops</option>
                <option value="any">Any number of stops</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Preferred Airlines */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A854] to-[#008f47] flex items-center justify-center shadow-lg">
              <Star className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Preferred Airlines</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'indigo', name: 'IndiGo', logo: '🟦' },
              { id: 'airindia', name: 'Air India', logo: '🟥' },
              { id: 'vistara', name: 'Vistara', logo: '🟪' },
              { id: 'spicejet', name: 'SpiceJet', logo: '🟧' },
              { id: 'goair', name: 'Go First', logo: '🟩' },
              { id: 'akasa', name: 'Akasa Air', logo: '⬜' }
            ].map((airline) => (
              <button
                key={airline.id}
                onClick={() => toggleAirline(airline.id)}
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                  preferences.airlines.includes(airline.id)
                    ? 'border-[#00A854] bg-[#00A854]/10 text-[#00A854]'
                    : 'border-[#E8E8E8] text-[#666666] hover:border-[#00A854]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{airline.logo}</span>
                  <span>{airline.name}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Meal Preference */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F39C12] to-[#e89c0c] flex items-center justify-center shadow-lg">
              <span className="text-xl">🍽️</span>
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Meal Preference</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
              { value: 'non-vegetarian', label: 'Non-Vegetarian', icon: '🍗' },
              { value: 'vegan', label: 'Vegan', icon: '🌱' },
              { value: 'none', label: 'No Preference', icon: '🍴' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPreferences({ ...preferences, mealPreference: option.value })}
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  preferences.mealPreference === option.value
                    ? 'border-[#F39C12] bg-[#F39C12]/10 text-[#F39C12]'
                    : 'border-[#E8E8E8] text-[#666666] hover:border-[#F39C12]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Regional Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3498DB] to-[#2980b9] flex items-center justify-center shadow-lg">
              <span className="text-xl">🌍</span>
            </div>
            <h3 className="text-lg font-bold text-[#222222]">Regional Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#666666]">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         transition-all duration-200"
              >
                <option value="INR">🇮🇳 Indian Rupee (INR)</option>
                <option value="USD">🇺🇸 US Dollar (USD)</option>
                <option value="EUR">🇪🇺 Euro (EUR)</option>
                <option value="GBP">🇬🇧 British Pound (GBP)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#666666]">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         transition-all duration-200"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
              </select>
            </div>
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
              Saving Preferences...
            </div>
          ) : (
            <>
              <Save size={20} />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
