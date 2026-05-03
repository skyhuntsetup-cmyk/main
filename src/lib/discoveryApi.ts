export interface TrendingDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  imageUrl: string;
  description: string;
  priceStart?: number;
  airportCode: string;
  aiInsight: string;
  bestTime: string;
}

export async function fetchTrendingDestinations(): Promise<TrendingDestination[]> {
  try {
    const trending = [
      { 
        id: '1', 
        name: 'Bali', 
        country: 'Indonesia', 
        region: 'Asia', 
        airportCode: 'DPS',
        aiInsight: 'Visa hack: Get a VOA (Visa on Arrival) online to skip the 45-min airport queue.',
        bestTime: 'April to October',
        description: 'Tropical paradise with lush jungles, iconic rice terraces, and pristine beaches.', 
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' 
      },
      { 
        id: '2', 
        name: 'Santorini', 
        country: 'Greece', 
        region: 'Europe', 
        airportCode: 'JTR',
        aiInsight: 'Pro tip: Visit Oia at 7 AM to get the famous blue-dome photos without the crowds.',
        bestTime: 'September to October',
        description: 'Breathtaking white-washed buildings perched on volcanic cliffs overlooking the Aegean Sea.', 
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036763?auto=format&fit=crop&w=1200&q=80' 
      },
      { 
        id: '3', 
        name: 'Dubai', 
        country: 'UAE', 
        region: 'Middle East', 
        airportCode: 'DXB',
        aiInsight: 'Money hack: Use the Metro "Gold Class" for panoramic views of the skyline for just a few extra Dirhams.',
        bestTime: 'November to March',
        description: 'A futuristic oasis of luxury shopping, ultramodern architecture, and vibrant nightlife.', 
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5eaad0df3e07?auto=format&fit=crop&w=1200&q=80' 
      },
      { 
        id: '4', 
        name: 'Kyoto', 
        country: 'Japan', 
        region: 'Asia', 
        airportCode: 'ITM',
        aiInsight: 'Cultural tip: Book a morning tea ceremony in Gion 3 weeks in advance for an authentic experience.',
        bestTime: 'March to May',
        description: 'The cultural heart of Japan, home to ancient temples, traditional tea houses, and cherry blossoms.', 
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' 
      },
      { 
        id: '5', 
        name: 'Paris', 
        country: 'France', 
        region: 'Europe', 
        airportCode: 'CDG',
        aiInsight: 'Secret spot: Skip the Eiffel Tower lines; head to the Montparnasse Tower for the best view of the Eiffel itself.',
        bestTime: 'June to August',
        description: 'The global center for art, fashion, and gastronomy, famous for the Eiffel Tower and cafes.', 
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' 
      },
      { 
        id: '6', 
        name: 'Amalfi Coast', 
        country: 'Italy', 
        region: 'Europe', 
        airportCode: 'NAP',
        aiInsight: 'Transport hack: The SITA buses are cheap but crowded; take the ferry for the best coastal views.',
        bestTime: 'May to September',
        description: 'A 50-kilometer stretch of coastline with sheer cliffs and a rugged shoreline dotted with small beaches.', 
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' 
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
