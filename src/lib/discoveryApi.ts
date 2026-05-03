export interface TrendingDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  imageUrl: string;
  description: string;
  priceStart?: number;
}

export async function fetchTrendingDestinations(): Promise<TrendingDestination[]> {
  try {
    // 1. Fetch Trending Cities (Mocking Booking.com data)
    // In a real integration, you'd use:
    // const options = {
    //   method: 'GET',
    //   url: 'https://booking-com.p.rapidapi.com/v1/static/destinations',
    //   headers: { 'X-RapidAPI-Key': 'YOUR_KEY' }
    // };
    
    const trending = [
      { id: '1', name: 'Bali', country: 'Indonesia', region: 'Asia', description: 'Tropical paradise with lush jungles and iconic beaches.' },
      { id: '2', name: 'Santorini', country: 'Greece', region: 'Europe', description: 'White-washed buildings and stunning caldera views.' },
      { id: '3', name: 'Dubai', country: 'UAE', region: 'Middle East', description: 'Futuristic skyline and luxury shopping experiences.' },
      { id: '4', name: 'Kyoto', country: 'Japan', region: 'Asia', description: 'Ancient temples, traditional tea houses and cherry blossoms.' },
      { id: '5', name: 'Paris', country: 'France', region: 'Europe', description: 'The city of light, world-class art, and romantic vibes.' },
      { id: '6', name: 'Amalfi Coast', country: 'Italy', region: 'Europe', description: 'Dramatic cliffs and colorful fishing villages.' }
    ];

    // 2. Fetch High-Quality Photos from Unsplash
    // We'll use a public search endpoint for demo purposes or curated Source IDs
    const destinationsWithPhotos = trending.map(dest => ({
      ...dest,
      imageUrl: `https://source.unsplash.com/featured/800x600?${encodeURIComponent(dest.name + ' travel')}`,
      priceStart: Math.floor(Math.random() * 20000) + 15000 // Synthetic starting price
    }));

    return destinationsWithPhotos;
  } catch (error) {
    console.error('Error fetching trending destinations:', error);
    return [];
  }
}
