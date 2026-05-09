import { useState } from 'react';
import { Sparkles, MapPin, Globe, Calendar, Heart, ArrowRight, Brain, ShieldCheck, CreditCard, Utensils, Plane, Info, Cloud, Landmark, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { generateItinerary } from '../../lib/aiApi';
import { trackEvent } from '../../lib/analytics';

import { getVisaRequirement } from '../../lib/visaApi';
import { getLocationId, searchRestaurants } from '../../lib/attractionApi';
import { MapComponent } from '../components/MapComponent';

function Section({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} style={{ color }} />
        <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DayCard({ day }: { day: any }) {
  const [open, setOpen] = useState(false);
  return (
    <LiquidGlassCard className="border-[#0047AB]/15">
      <button className="w-full flex items-center justify-between" onClick={() => setOpen(!open)}>
        <div className="text-left">
          <div className="text-xs font-black text-[#0047AB] uppercase tracking-widest">Day {day.day}</div>
          <div className="font-black text-[#001F3F] text-base">{day.theme}</div>
          <div className="text-xs text-[#001F3F]/40 font-medium mt-0.5">{day.area}</div>
        </div>
        {open ? <ChevronUp size={18} className="text-[#001F3F]/30" /> : <ChevronDown size={18} className="text-[#001F3F]/30" />}
      </button>
      {open && (
        <div className="mt-4 space-y-3 border-t border-[#001F3F]/5 pt-4">
          {[['🌅 Morning', day.morning], ['☀️ Afternoon', day.afternoon], ['🌙 Evening', day.evening]].map(([label, text]) => (
            <div key={label as string}>
              <div className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest mb-1">{label}</div>
              <p className="text-sm text-[#001F3F]/70 font-medium leading-relaxed">{text}</p>
            </div>
          ))}
          {day.transit && (
            <div className="p-3 rounded-xl bg-[#0047AB]/5 border border-[#0047AB]/10">
              <span className="text-[10px] font-black text-[#0047AB] uppercase">🚌 Transit · </span>
              <span className="text-xs text-[#001F3F]/60 font-medium">{day.transit}</span>
            </div>
          )}
          {day.insiderTip && (
            <div className="p-3 rounded-xl bg-[#F39C12]/8 border border-[#F39C12]/20">
              <span className="text-[10px] font-black text-[#F39C12] uppercase">💡 Insider Tip · </span>
              <span className="text-xs text-[#001F3F]/60 font-medium">{day.insiderTip}</span>
            </div>
          )}
        </div>
      )}
    </LiquidGlassCard>
  );
}

function ResultView({ result, onReset }: { result: any; onReset: () => void }) {
  return (
    <div className="min-h-screen pb-32 px-5 pt-14">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onReset} className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center border border-white/60">
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#001F3F]">{result.destination}</h1>
          <p className="text-xs text-[#001F3F]/40 font-medium">{result.tripSummary}</p>
        </div>
      </div>

      <div className="space-y-6 mt-6">

        {/* Visa */}
        <LiquidGlassCard className="bg-gradient-to-br from-[#0047AB] to-[#003080] text-white border-none">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} />
            <h2 className="font-black text-sm uppercase tracking-widest">Visa & Entry</h2>
            <span className="ml-auto px-2 py-0.5 rounded-lg bg-white/20 text-xs font-black">{result.visa?.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              ['Cost', result.visa?.cost],
              ['Processing', result.visa?.processingTime],
              ['Validity', result.visa?.validity],
            ].map(([label, val]) => val && (
              <div key={label} className="p-2 rounded-xl bg-white/10">
                <div className="text-[9px] font-black text-white/50 uppercase">{label}</div>
                <div className="text-xs font-black text-white mt-0.5">{val}</div>
              </div>
            ))}
          </div>
          {result.visa?.requirements?.length > 0 && (
            <ul className="space-y-1 mb-3">
              {result.visa.requirements.map((r: string, i: number) => (
                <li key={i} className="text-xs text-white/70 font-medium flex gap-1.5"><span className="text-[#00F5FF]">✓</span>{r}</li>
              ))}
            </ul>
          )}
          {result.visa?.proTip && (
            <div className="p-2 rounded-xl bg-white/10 text-xs text-white/80 font-medium">
              💡 {result.visa.proTip}
            </div>
          )}
        </LiquidGlassCard>

        {/* Weather */}
        <Section icon={Cloud} title="Weather & Packing" color="#00B8D4">
          <LiquidGlassCard className="border-[#00B8D4]/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-2xl font-black text-[#001F3F]">{result.weather?.temperature}</div>
                <div className="text-sm text-[#001F3F]/50 font-medium">{result.weather?.conditions}</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#00B8D4]/10 text-[#00B8D4] text-xs font-black text-right">{result.weather?.summary}</div>
            </div>
            {result.weather?.packingList?.length > 0 && (
              <div>
                <div className="text-[10px] font-black text-[#001F3F]/40 uppercase tracking-widest mb-2">Pack These</div>
                <div className="flex flex-wrap gap-2">
                  {result.weather.packingList.map((item: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-[#00B8D4]/10 text-[#00B8D4] text-xs font-bold">✓ {item}</span>
                  ))}
                </div>
              </div>
            )}
            {result.weather?.avoidItems?.length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-black text-[#FF6B6B]/60 uppercase tracking-widest mb-2">Leave Behind</div>
                <div className="flex flex-wrap gap-2">
                  {result.weather.avoidItems.map((item: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-[#FF6B6B]/8 text-[#FF6B6B] text-xs font-bold">✗ {item}</span>
                  ))}
                </div>
              </div>
            )}
          </LiquidGlassCard>
        </Section>

        {/* Map Visualization */}
        {result.landmarks?.length > 0 && (
          <Section icon={Globe} title="Destination Map" color="#0047AB">
            <MapComponent landmarks={result.landmarks} />
          </Section>
        )}

        {/* Daily Itinerary */}
        <Section icon={Calendar} title="Day-by-Day Itinerary" color="#0047AB">
          <div className="space-y-3">
            {result.itinerary?.map((day: any) => <DayCard key={day.day} day={day} />)}
          </div>
        </Section>

        {/* Food */}
        <Section icon={Utensils} title="Food & Dining" color="#FF6B6B">
          <div className="space-y-3">
            {result.food?.mustTryDishes?.length > 0 && (
              <LiquidGlassCard className="border-[#FF6B6B]/20">
                <div className="text-[10px] font-black text-[#FF6B6B] uppercase tracking-widest mb-3">Must-Try Dishes</div>
                <div className="space-y-3">
                  {result.food.mustTryDishes.map((dish: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center flex-shrink-0 text-sm">🍽️</div>
                      <div>
                        <div className="font-black text-[#001F3F] text-sm">{dish.name}</div>
                        <div className="text-xs text-[#001F3F]/50 font-medium">{dish.description}</div>
                        <div className="text-[10px] text-[#FF6B6B] font-black mt-0.5">Try at: {dish.whereToTry}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </LiquidGlassCard>
            )}
            {result.food?.topRestaurants?.length > 0 && (
              <LiquidGlassCard className="border-[#FF6B6B]/20">
                <div className="text-[10px] font-black text-[#FF6B6B] uppercase tracking-widest mb-3">Top Restaurants</div>
                <div className="space-y-2.5">
                  {result.food.topRestaurants.map((r: any, i: number) => (
                    <div key={i} className="flex items-start justify-between p-2.5 rounded-xl bg-[#FF6B6B]/5">
                      <div>
                        <div className="font-black text-[#001F3F] text-sm">{r.name}</div>
                        <div className="text-xs text-[#001F3F]/40 font-medium">{r.cuisine} · {r.area}</div>
                        <div className="text-xs text-[#001F3F]/60 font-medium mt-0.5">{r.knownFor}</div>
                      </div>
                      <span className="text-xs font-black text-[#00A854] flex-shrink-0 ml-2">{r.priceRange}</span>
                    </div>
                  ))}
                </div>
              </LiquidGlassCard>
            )}
            {result.food?.streetFoodSpots?.length > 0 && (
              <LiquidGlassCard className="border-[#F39C12]/20">
                <div className="text-[10px] font-black text-[#F39C12] uppercase tracking-widest mb-2">Street Food Spots</div>
                <ul className="space-y-1.5">
                  {result.food.streetFoodSpots.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-[#001F3F]/70 font-medium flex gap-2"><span className="text-[#F39C12]">🛒</span>{s}</li>
                  ))}
                </ul>
              </LiquidGlassCard>
            )}
          </div>
        </Section>

        {/* Landmarks */}
        {result.landmarks?.length > 0 && (
          <Section icon={Landmark} title="Must-See Landmarks" color="#8E44AD">
            <div className="space-y-2.5">
              {result.landmarks.map((lm: any, i: number) => (
                <LiquidGlassCard key={i} size="small" className="border-[#8E44AD]/15">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-black text-[#001F3F] text-sm">{lm.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#8E44AD] font-black bg-[#8E44AD]/10 px-1.5 py-0.5 rounded">{lm.type}</span>
                        <span className="text-[10px] text-[#001F3F]/40 font-medium">Best: {lm.bestTime}</span>
                      </div>
                      {lm.tip && <p className="text-xs text-[#001F3F]/50 font-medium mt-1">💡 {lm.tip}</p>}
                    </div>
                    <div className="text-xs font-black text-[#00A854] ml-3 flex-shrink-0">{lm.entryFee}</div>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          </Section>
        )}

        {/* Budget */}
        <Section icon={DollarSign} title="Budget Breakdown" color="#00A854">
          <LiquidGlassCard className="border-[#00A854]/20">
            <div className="grid grid-cols-1 gap-3 mb-4">
              {[
                ['✈️ Flights', result.budget?.flightEstimate],
                ['🏨 Stay', result.budget?.accommodationEstimate],
                ['🗓️ Daily Spend', result.budget?.dailyEstimate],
              ].map(([label, val]) => val && (
                <div key={label} className="flex items-center justify-between p-2.5 rounded-xl bg-[#00A854]/5">
                  <span className="text-sm font-bold text-[#001F3F]">{label}</span>
                  <span className="text-sm font-black text-[#00A854]">{val}</span>
                </div>
              ))}
            </div>
            {result.budget?.hacks?.length > 0 && (
              <div>
                <div className="text-[10px] font-black text-[#F39C12] uppercase tracking-widest mb-2">Money Saving Hacks</div>
                <ul className="space-y-1.5">
                  {result.budget.hacks.map((h: string, i: number) => (
                    <li key={i} className="text-sm text-[#001F3F]/70 font-medium flex gap-2"><span className="text-[#F39C12]">•</span>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </LiquidGlassCard>
        </Section>

        {/* Logistics */}
        {result.logistics && (
          <Section icon={Plane} title="Getting There & Around" color="#3498DB">
            <LiquidGlassCard className="border-[#3498DB]/15 space-y-3">
              {[
                ['✈️ Flights', result.logistics.gettingThere],
                ['🚌 Local Transport', result.logistics.localTransport],
                ['📱 SIM Card', result.logistics.simCard],
                ['💵 Currency', result.logistics.currency],
              ].map(([label, val]) => val && (
                <div key={label}>
                  <div className="text-[10px] font-black text-[#3498DB] uppercase tracking-widest">{label}</div>
                  <p className="text-sm text-[#001F3F]/70 font-medium mt-0.5">{val}</p>
                </div>
              ))}
              {result.logistics.mustHaveApps?.length > 0 && (
                <div>
                  <div className="text-[10px] font-black text-[#00A854] uppercase tracking-widest mb-2">📲 Must-Have Apps</div>
                  <div className="space-y-1.5">
                    {result.logistics.mustHaveApps.map((app: any, i: number) => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="px-2 py-0.5 rounded-lg bg-[#00A854]/10 text-[#00A854] text-xs font-black">{app.name}</span>
                        <span className="text-xs text-[#001F3F]/50 font-medium">{app.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </LiquidGlassCard>
          </Section>
        )}

        <PremiumButton onClick={onReset} variant="glass" className="w-full">Plan Another Trip</PremiumButton>
      </div>
    </div>
  );
}

export function ItineraryScreen() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [loadingStep, setLoadingStep] = useState('');
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
    if (!formData.destination) return;
    setError(null);
    setStep('loading');
    trackEvent('itinerary_generation_started', { 
      destination: formData.destination,
      duration: formData.duration,
      budget: formData.budget
    });


    try {
      setLoadingStep(`Checking visa for ${formData.nationality} passport...`);
      const visaData = await getVisaRequirement(formData.sourceCountry, formData.destination);

      setLoadingStep(`Scouting top restaurants in ${formData.destination}...`);
      const locationId = await getLocationId(formData.destination);
      const restaurants = locationId ? await searchRestaurants(locationId) : [];

      const extraContext = [
        visaData ? `LIVE VISA DATA: ${JSON.stringify(visaData)}` : '',
        restaurants?.length ? `LIVE RESTAURANT DATA: ${JSON.stringify(restaurants.slice(0, 5))}` : '',
      ].filter(Boolean).join('\n');

      setLoadingStep('Generating your personalised itinerary...');
      const data = await generateItinerary({ ...formData, extraContext });
      setResult(data);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Failed to generate. Please try again.');
      setStep('input');
    }
  };

  if (step === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-28 h-28 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-[#0047AB]/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#00F5FF] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain size={36} className="text-[#0047AB] animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-[#001F3F] mb-2">Building Your Plan...</h2>
      <p className="text-sm text-[#0047AB] font-bold animate-pulse max-w-xs">{loadingStep}</p>
    </div>
  );

  if (step === 'result' && result) return <ResultView result={result} onReset={() => setStep('input')} />;

  return (
    <div className="min-h-screen pb-32 px-5 pt-14">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-[#0047AB]" />
          <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Sky Hunt AI</span>
        </div>
        <h1 className="text-4xl font-black text-[#001F3F] leading-tight">AI Itinerary<br />Master</h1>
        <p className="text-sm text-[#001F3F]/50 font-medium mt-2">Hyper-specific plans, visa hacks, real restaurants.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex gap-3">
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <div><p>{error}</p></div>
        </div>
      )}

      <div className="space-y-4">
        <LiquidGlassCard>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Where to?</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                <input type="text" placeholder="e.g. Tokyo, Japan" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F] placeholder:text-[#001F3F]/20" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input type="text" placeholder="Indian" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Flying From</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input type="text" placeholder="India" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]" value={formData.sourceCountry} onChange={e => setFormData({ ...formData, sourceCountry: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Dates</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input type="text" placeholder="Jun 15 – Jun 22" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]" value={formData.dates} onChange={e => setFormData({ ...formData, dates: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Duration</label>
                <select className="w-full h-14 px-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F] appearance-none" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}>
                  {['3 Days', '5 Days', '7 Days', '10 Days', '14 Days'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Budget</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <select className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F] appearance-none" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })}>
                    <option>Budget</option><option>Moderate</option><option>Luxury</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#001F3F]/40 ml-1 mb-1 block tracking-widest">Preferences</label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
                  <input type="text" placeholder="Food, history, beaches..." className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-[#0047AB]/20 font-bold text-[#001F3F]" value={formData.preferences} onChange={e => setFormData({ ...formData, preferences: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        <PremiumButton onClick={handleGenerate} disabled={!formData.destination} className="w-full h-16 text-lg">
          Generate Master Plan <Sparkles className="ml-2" />
        </PremiumButton>
        <p className="text-[10px] text-center text-[#001F3F]/30 font-bold uppercase tracking-widest">Powered by Claude 3.5 Sonnet · Live Data APIs</p>
      </div>
    </div>
  );
}
