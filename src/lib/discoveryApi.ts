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
      { id: '1', name: 'Bali', country: 'Indonesia', region: 'Asia', description: 'Tropical paradise with lush jungles and iconic beaches.', imgId: 'ql9Xn4_O_3Y' },
      { id: '2', name: 'Santorini', country: 'Greece', region: 'Europe', description: 'White-washed buildings and stunning caldera views.', imgId: 'v8vp82YS_1k' },
      { id: '3', name: 'Dubai', country: 'UAE', region: 'Middle East', description: 'Futuristic skyline and luxury shopping experiences.', imgId: 'M7XW5m0G-Ww' },
      { id: '4', name: 'Kyoto', country: 'Japan', region: 'Asia', description: 'Ancient temples, traditional tea houses and cherry blossoms.', imgId: '7R_Wp_7o7j4' },
      { id: '5', name: 'Paris', country: 'France', region: 'Europe', description: 'The city of light, world-class art, and romantic vibes.', imgId: '689Y8074N18' },
      { id: '6', name: 'Amalfi Coast', country: 'Italy', region: 'Europe', description: 'Dramatic cliffs and colorful fishing villages.', imgId: 'vRscZp8T8o8' }
    ];

    // 2. Map with Reliable Image URLs
    const destinationsWithPhotos = trending.map(dest => ({
      ...dest,
      imageUrl: `https://images.unsplash.com/photo-${dest.imgId}?auto=format&fit=crop&w=1200&q=80`,
      priceStart: Math.floor(Math.random() * 20000) + 15000 
    }));

    return destinationsWithPhotos;
  } catch (error) {
    console.error('Error fetching trending destinations:', error);
    return [];
  }
}
