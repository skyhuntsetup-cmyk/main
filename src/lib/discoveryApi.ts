export interface TrendingDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  imageUrl: string;
  videoUrl: string;
  description: string;
  priceStart?: number;
  airportCode: string;
  aiInsight: string;
  bestTime: string;
  mood: 'Adventure' | 'Relax' | 'Culture' | 'Luxury' | 'Wellness';
  weatherForecast?: {
    temp: string;
    condition: string;
  };
  budgetScore: 'Economy' | 'Moderate' | 'Premium';
  localSecret: string;
}

export async function fetchTrendingDestinations(): Promise<TrendingDestination[]> {
  try {
    const trending: TrendingDestination[] = [
      { 
        id: '1', 
        name: 'Bali', 
        country: 'Indonesia', 
        region: 'Asia', 
        airportCode: 'DPS',
        mood: 'Relax',
        aiInsight: 'Wellness Alert: The Ubud spiritual retreat season peaks in May. Book your sound healing sessions early.',
        bestTime: 'April to October',
        description: 'Tropical paradise with lush jungles, iconic rice terraces, and pristine beaches.', 
        imageUrl: '/src/assets/destinations/bali.png',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-beach-and-the-sea-4309-large.mp4',
        weatherForecast: { temp: '28°C', condition: 'Sunny' },
        budgetScore: 'Economy',
        localSecret: 'Visit the "Hidden Canyon" in Beji Guwang for a breathtaking trek through narrow rock walls.'
      },
      { 
        id: '2', 
        name: 'Santorini', 
        country: 'Greece', 
        region: 'Europe', 
        airportCode: 'JTR',
        mood: 'Luxury',
        aiInsight: 'Photo Hack: The most vibrant sunsets are actually from Imerovigli, not Oia, with 80% fewer tourists.',
        bestTime: 'September to October',
        description: 'Breathtaking white-washed buildings perched on volcanic cliffs overlooking the Aegean Sea.', 
        imageUrl: '/src/assets/destinations/santorini.png',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-of-the-sea-14-large.mp4',
        weatherForecast: { temp: '22°C', condition: 'Breezy' },
        budgetScore: 'Premium',
        localSecret: 'Dine at "Ammoudi Fish Tavern" at the base of the Oia cliffs for the freshest octopus you will ever taste.'
      },
      { 
        id: '3', 
        name: 'Dubai', 
        country: 'UAE', 
        region: 'Middle East', 
        airportCode: 'DXB',
        mood: 'Luxury',
        aiInsight: 'Luxury Tip: The new "Museum of the Future" requires tickets at least 2 weeks in advance.',
        bestTime: 'November to March',
        description: 'A futuristic oasis of luxury shopping, ultramodern architecture, and vibrant nightlife.', 
        imageUrl: '/src/assets/destinations/dubai.png',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dubai-cityscape-at-night-4228-large.mp4',
        weatherForecast: { temp: '34°C', condition: 'Clear' },
        budgetScore: 'Premium',
        localSecret: 'Take an "Abra" boat ride across the Dubai Creek for just 1 AED to experience the old-world charm.'
      },
      { 
        id: '4', 
        name: 'Kyoto', 
        country: 'Japan', 
        region: 'Asia', 
        airportCode: 'ITM',
        mood: 'Culture',
        aiInsight: 'Cultural Depth: Visit the Arashiyama Bamboo Grove at 6 AM for a meditative experience.',
        bestTime: 'March to May',
        description: 'The cultural heart of Japan, home to ancient temples and traditional tea houses.', 
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crowds-of-people-walking-on-a-street-in-tokyo-4402-large.mp4',
        weatherForecast: { temp: '18°C', condition: 'Cool' },
        budgetScore: 'Moderate',
        localSecret: 'The "Path of Philosophy" is most beautiful during sunset when the cherry blossoms glow under the lanterns.'
      },
      { 
        id: '5', 
        name: 'Iceland', 
        country: 'Iceland', 
        region: 'Europe', 
        airportCode: 'KEF',
        mood: 'Adventure',
        aiInsight: 'Adventure Alert: The Northern Lights are most active from late September to March.',
        bestTime: 'September to March',
        description: 'A land of fire and ice, featuring glaciers, hot springs, and dramatic volcanic landscapes.', 
        imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-small-waterfall-in-the-middle-of-the-forest-4444-large.mp4',
        weatherForecast: { temp: '4°C', condition: 'Snowy' },
        budgetScore: 'Premium',
        localSecret: 'Skip the Blue Lagoon; go to the "Secret Lagoon" in Flúðir for a more authentic and quiet experience.'
      },
      { 
        id: '6', 
        name: 'Swiss Alps', 
        country: 'Switzerland', 
        region: 'Europe', 
        airportCode: 'ZRH',
        mood: 'Wellness',
        aiInsight: 'Wellness Secret: The thermal baths in Vals offer a unique architectural and sensory relaxation experience.',
        bestTime: 'December to March',
        description: 'Pristine mountain peaks, crystal-clear lakes, and world-class ski resorts.', 
        imageUrl: '/src/assets/destinations/swiss.png',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-coastal-road-4263-large.mp4',
        weatherForecast: { temp: '-2°C', condition: 'Clear' },
        budgetScore: 'Premium',
        localSecret: 'Try the "Fondue in a Gondola" experience in Gstaad for a truly magical alpine meal.'
      }
    ];

    return trending.map(dest => ({
      ...dest,
      priceStart: Math.floor(Math.random() * 20000) + 25000 
    }));
  } catch (error) {
    console.error('Error fetching trending destinations:', error);
    return [];
  }
}

