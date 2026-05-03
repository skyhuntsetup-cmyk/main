import { useState } from 'react';
import { Sparkles, MapPin, Globe, Calendar, Heart, ArrowRight, Brain, ShieldCheck, CreditCard, Utensils, Smartphone, Plane, Info } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { generateItinerary } from '../../lib/aiApi';
import { getVisaRequirement } from '../../lib/visaApi';
import { getLocationId, searchRestaurants } from '../../lib/attractionApi';

export function ItineraryScreen() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [loadingStep, setLoadingStep] = useState('Analyzing destination data...');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    destination: '',
    nationality: 'Indian',
    sourceCountry: 'India',
    dates: '',
    duration: '5 Days',
    preferences: '',
    budget: 'Moderate'
  });

  const handleGenerate = async () => {
    setError(null);
    setStep('loading');
    
    // Simulate thinking steps for UX
    const steps = [
      'Checking Visa requirements for ' + formData.nationality + '...',
      'Mapping top cuisines in ' + formData.destination + '...',
      'Finding money-saving hacks...',
      'Generating your personalized itinerary...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise(r => setTimeout(r, 1500));
    }

    try {
      // 1. Fetch Live Visa Data
      setLoadingStep('Accessing global visa regulations...');
      const visaData = await getVisaRequirement(formData.sourceCountry, formData.destination);
      
      // 2. Fetch Top Restaurants/Attractions
      setLoadingStep('Scouting the best local dining spots...');
      const locationId = await getLocationId(formData.destination);
      const restaurants = locationId ? await searchRestaurants(locationId) : [];
      
      const extraContext = `
        VISA INFO: ${visaData ? JSON.stringify(visaData) : 'Check local embassy.'}
        TOP RESTAURANTS: ${restaurants && restaurants.length > 0 ? JSON.stringify(restaurants.slice(0, 5)) : 'Suggest famous local spots.'}
      `;

      // 3. Generate AI Itinerary with Live Data
      setLoadingStep('Architecting your perfect trip...');
      const data = await generateItinerary({ ...formData, extraContext });
      setResult(data);
      setStep('result');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate itinerary. Please check your AI API key.');
      setStep('input');
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-[#0047AB]/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#00F5FF] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain size={40} className="text-[#0047AB] animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-[#001F3F] mb-2">AI is Planning...</h2>
        <p className="text-[#0047AB] font-bold animate-pulse">{loadingStep}</p>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="min-h-screen pb-32 px-5 pt-14">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('input')} className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center border border-white/60">
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-2xl font-black text-[#001F3F]">Your Master Plan</h1>
        </div>

        <div className="space-y-6">
          {/* Visa & Travel Essentials */}
          <LiquidGlassCard className="bg-gradient-to-br from-[#0047AB] to-[#0047AB]/80 text-white border-none">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} />
              <h2 className="font-black uppercase tracking-widest text-sm">Visa & Essentials</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-relaxed">{result.visaInfo}</p>
            </div>
          </LiquidGlassCard>

          {/* Itinerary Timeline */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-[#0047AB]" />
              <h2 className="text-lg font-black text-[#001F3F]">Daily Itinerary</h2>
            </div>
            <div className="space-y-4">
              {result.itinerary.map((day: any, i: number) => (
                <LiquidGlassCard key={i} pulseIndicator={i === 0}>
                  <div className="font-black text-[#0047AB] mb-1">Day {i + 1}: {day.title}</div>
                  <p className="text-sm text-[#001F3F]/70 font-medium leading-relaxed">{day.content}</p>
                </LiquidGlassCard>
              ))}
            </div>
          </section>

          {/* Hacks & Money Saving */}
          <section className="grid grid-cols-1 gap-4">
            <LiquidGlassCard className="border-[#F39C12]/30">
              <div className="flex items-center gap-2 mb-3 text-[#F39C12]">
                <CreditCard size={18} />
                <h3 className="font-black text-sm uppercase">Money Saving Hacks</h3>
              </div>
              <ul className="space-y-2">
                {result.hacks.map((hack: string, i: number) => (
                  <li key={i} className="text-sm text-[#001F3F]/70 font-medium flex gap-2">
                    <span className="text-[#F39C12]">•</span> {hack}
                  </li>
                ))}
              </ul>
            </LiquidGlassCard>

            <LiquidGlassCard className="border-[#00A854]/30">
              <div className="flex items-center gap-2 mb-3 text-[#00A854]">
                <Smartphone size={18} />
                <h3 className="font-black text-sm uppercase">Must-Have Apps</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.apps.map((app: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-[#00A854]/10 text-[#00A854] text-xs font-bold">{app}</span>
                ))}
              </div>
            </LiquidGlassCard>
          </section>

          {/* Food & Culture */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiquidGlassCard className="border-[#FF6B6B]/30">
              <div className="flex items-center gap-2 mb-3 text-[#FF6B6B]">
                <Utensils size={18} />
                <h3 className="font-black text-sm uppercase">Cuisines & Dining</h3>
              </div>
              <p className="text-sm text-[#001F3F]/70 font-medium leading-relaxed">{result.foodInfo}</p>
            </LiquidGlassCard>

            <LiquidGlassCard className="border-[#00F5FF]/30">
              <div className="flex items-center gap-2 mb-3 text-[#0047AB]">
                <Globe size={18} />
                <h3 className="font-black text-sm uppercase">Weather & Packing</h3>
              </div>
              <p className="text-sm text-[#001F3F]/70 font-medium leading-relaxed">{result.weatherInfo}</p>
            </LiquidGlassCard>
          </section>

          <PremiumButton onClick={() => setStep('input')} variant="glass" className="w-full">
            Plan Another Trip
          </PremiumButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-5 pt-14">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-[#0047AB]" />
          <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Sky Hunt AI</span>
        </div>
        <h1 className="text-4xl font-black text-[#001F3F] leading-tight">AI Itinerary<br />Master</h1>
        <p className="text-sm text-[#001F3F]/50 font-medium mt-2">Personalized trips, visa hacks & money saving tips.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-start gap-3 animate-shake">
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            <p className="text-[10px] mt-1 opacity-70">Check console for full technical details</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <LiquidGlassCard>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Where to?</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Paris, France"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F] placeholder:text-[#001F3F]/20"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Indian"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]"
                    value={formData.nationality}
                    onChange={e => setFormData({...formData, nationality: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Source</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input 
                    type="text" 
                    placeholder="India"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]"
                    value={formData.sourceCountry}
                    onChange={e => setFormData({...formData, sourceCountry: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Dates</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Jun 15 - Jun 20"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]"
                    value={formData.dates}
                    onChange={e => setFormData({...formData, dates: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Budget</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <select 
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F] appearance-none"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                  >
                    <option>Budget</option>
                    <option>Moderate</option>
                    <option>Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Preferences</label>
              <div className="relative">
                <Heart className="absolute left-4 top-4 text-[#0047AB]" size={18} />
                <textarea 
                  placeholder="e.g. Vegetarian food, love history, avoiding crowds..."
                  className="w-full min-h-[100px] pl-12 pr-4 py-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F] placeholder:text-[#001F3F]/20"
                  value={formData.preferences}
                  onChange={e => setFormData({...formData, preferences: e.target.value})}
                />
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        <PremiumButton 
          onClick={handleGenerate}
          disabled={!formData.destination}
          className="w-full h-16 text-lg"
        >
          Generate Master Plan <Sparkles className="ml-2" />
        </PremiumButton>

        <p className="text-[10px] text-center text-[#001F3F]/30 font-bold uppercase tracking-widest">Powered by Claude 3.5 Sonnet</p>
      </div>
    </div>
  );
}
