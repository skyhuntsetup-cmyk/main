// Comprehensive airport list — major global + all Indian airports
// Format: { code, name, city, country, flag }

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  entityId?: string;
}

export const AIRPORTS: Airport[] = [
  // ── INDIA ──────────────────────────────────────────────────────────────
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India', flag: '🇮🇳' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India', flag: '🇮🇳' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India', flag: '🇮🇳' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', flag: '🇮🇳' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India', flag: '🇮🇳' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India', flag: '🇮🇳' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India', flag: '🇮🇳' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India', flag: '🇮🇳' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India', flag: '🇮🇳' },
  { code: 'GOI', name: 'Goa International (Dabolim)', city: 'Goa', country: 'India', flag: '🇮🇳' },
  { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', country: 'India', flag: '🇮🇳' },
  { code: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', country: 'India', flag: '🇮🇳' },
  { code: 'IXE', name: 'Mangalore International', city: 'Mangalore', country: 'India', flag: '🇮🇳' },
  { code: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', country: 'India', flag: '🇮🇳' },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', country: 'India', flag: '🇮🇳' },
  { code: 'PAT', name: 'Jay Prakash Narayan International', city: 'Patna', country: 'India', flag: '🇮🇳' },
  { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', country: 'India', flag: '🇮🇳' },
  { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International', city: 'Nagpur', country: 'India', flag: '🇮🇳' },
  { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', country: 'India', flag: '🇮🇳' },
  { code: 'IXC', name: 'Shaheed Bhagat Singh International', city: 'Chandigarh', country: 'India', flag: '🇮🇳' },
  { code: 'SXR', name: 'Sheikh ul-Alam International', city: 'Srinagar', country: 'India', flag: '🇮🇳' },
  { code: 'IXZ', name: 'Veer Savarkar International', city: 'Port Blair', country: 'India', flag: '🇮🇳' },
  { code: 'VNS', name: 'Lal Bahadur Shastri International', city: 'Varanasi', country: 'India', flag: '🇮🇳' },
  { code: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', country: 'India', flag: '🇮🇳' },
  { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', country: 'India', flag: '🇮🇳' },
  { code: 'TRZ', name: 'Tiruchirappalli International', city: 'Tiruchirappalli', country: 'India', flag: '🇮🇳' },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International', city: 'Amritsar', country: 'India', flag: '🇮🇳' },
  { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', country: 'India', flag: '🇮🇳' },
  { code: 'RAJ', name: 'Rajkot Airport', city: 'Rajkot', country: 'India', flag: '🇮🇳' },
  { code: 'BBI', name: 'Biju Patnaik International', city: 'Bhubaneswar', country: 'India', flag: '🇮🇳' },
  { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', country: 'India', flag: '🇮🇳' },
  { code: 'CNN', name: 'Kannur International', city: 'Kannur', country: 'India', flag: '🇮🇳' },
  { code: 'HBX', name: 'Hubli Airport', city: 'Hubli', country: 'India', flag: '🇮🇳' },
  { code: 'RDP', name: 'Kazi Nazrul Islam Airport', city: 'Durgapur', country: 'India', flag: '🇮🇳' },
  { code: 'ISK', name: 'Gandhinagar Airport', city: 'Nashik', country: 'India', flag: '🇮🇳' },
  { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', country: 'India', flag: '🇮🇳' },
  { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', country: 'India', flag: '🇮🇳' },
  { code: 'IXA', name: 'Agartala Airport', city: 'Agartala', country: 'India', flag: '🇮🇳' },
  { code: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh', country: 'India', flag: '🇮🇳' },
  { code: 'JRH', name: 'Jorhat Airport', city: 'Jorhat', country: 'India', flag: '🇮🇳' },
  { code: 'KNU', name: 'Kanpur Airport', city: 'Kanpur', country: 'India', flag: '🇮🇳' },
  { code: 'AGR', name: 'Agra Airport', city: 'Agra', country: 'India', flag: '🇮🇳' },

  // ── MIDDLE EAST ────────────────────────────────────────────────────────
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', flag: '🇦🇪' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', country: 'UAE', flag: '🇦🇪' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', flag: '🇶🇦' },
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain', flag: '🇧🇭' },
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait', flag: '🇰🇼' },
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', country: 'Oman', flag: '🇴🇲' },
  { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'TLV', name: 'Ben Gurion International', city: 'Tel Aviv', country: 'Israel', flag: '🇮🇱' },
  { code: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan', flag: '🇯🇴' },

  // ── SOUTH ASIA ─────────────────────────────────────────────────────────
  { code: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵' },
  { code: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', country: 'Bangladesh', flag: '🇧🇩' },
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', country: 'Pakistan', flag: '🇵🇰' },

  // ── SOUTHEAST ASIA ─────────────────────────────────────────────────────
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { code: 'DMK', name: 'Don Mueang International', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'CGK', name: 'Soekarno–Hatta International', city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'DPS', name: 'Ngurah Rai International', city: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', flag: '🇵🇭' },
  { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'RGN', name: 'Yangon International', city: 'Yangon', country: 'Myanmar', flag: '🇲🇲' },
  { code: 'PNH', name: 'Phnom Penh International', city: 'Phnom Penh', country: 'Cambodia', flag: '🇰🇭' },

  // ── EAST ASIA ──────────────────────────────────────────────────────────
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan', flag: '🇯🇵' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', flag: '🇨🇳' },
  { code: 'PKX', name: 'Beijing Daxing International', city: 'Beijing', country: 'China', flag: '🇨🇳' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', flag: '🇨🇳' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan', flag: '🇹🇼' },
  { code: 'MFM', name: 'Macau International', city: 'Macau', country: 'Macau', flag: '🇲🇴' },

  // ── EUROPE ─────────────────────────────────────────────────────────────
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', flag: '🇬🇧' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'UK', flag: '🇬🇧' },
  { code: 'STN', name: 'Stansted Airport', city: 'London', country: 'UK', flag: '🇬🇧' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'UK', flag: '🇬🇧' },
  { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'UK', flag: '🇬🇧' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', flag: '🇩🇪' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', flag: '🇩🇪' },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', flag: '🇩🇪' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', flag: '🇦🇹' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', flag: '🇧🇪' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', flag: '🇩🇰' },
  { code: 'OSL', name: 'Oslo Gardermoen Airport', city: 'Oslo', country: 'Norway', flag: '🇳🇴' },
  { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', flag: '🇸🇪' },
  { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland', flag: '🇫🇮' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', country: 'Spain', flag: '🇪🇸' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { code: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', flag: '🇮🇹' },
  { code: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece', flag: '🇬🇷' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { code: 'SAW', name: 'Sabiha Gökçen International', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland', flag: '🇵🇱' },
  { code: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czech Republic', flag: '🇨🇿' },
  { code: 'BUD', name: 'Budapest Ferenc Liszt International', city: 'Budapest', country: 'Hungary', flag: '🇭🇺' },
  { code: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', flag: '🇮🇪' },
  { code: 'LED', name: 'Pulkovo Airport', city: 'Saint Petersburg', country: 'Russia', flag: '🇷🇺' },
  { code: 'SVO', name: 'Sheremetyevo International', city: 'Moscow', country: 'Russia', flag: '🇷🇺' },

  // ── NORTH AMERICA ──────────────────────────────────────────────────────
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', flag: '🇺🇸' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'USA', flag: '🇺🇸' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA', flag: '🇺🇸' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', flag: '🇺🇸' },
  { code: 'MDW', name: 'Chicago Midway International', city: 'Chicago', country: 'USA', flag: '🇺🇸' },
  { code: 'ATL', name: 'Hartsfield–Jackson Atlanta International', city: 'Atlanta', country: 'USA', flag: '🇺🇸' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', flag: '🇺🇸' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', flag: '🇺🇸' },
  { code: 'SEA', name: 'Seattle–Tacoma International', city: 'Seattle', country: 'USA', flag: '🇺🇸' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', flag: '🇺🇸' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', flag: '🇺🇸' },
  { code: 'IAD', name: 'Dulles International', city: 'Washington D.C.', country: 'USA', flag: '🇺🇸' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', flag: '🇺🇸' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'USA', flag: '🇺🇸' },
  { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA', flag: '🇺🇸' },
  { code: 'HOU', name: 'William P. Hobby Airport', city: 'Houston', country: 'USA', flag: '🇺🇸' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', flag: '🇺🇸' },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', flag: '🇨🇦' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', flag: '🇨🇦' },
  { code: 'YUL', name: 'Montréal–Trudeau International', city: 'Montreal', country: 'Canada', flag: '🇨🇦' },
  { code: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada', flag: '🇨🇦' },
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', flag: '🇲🇽' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'Mexico', flag: '🇲🇽' },

  // ── SOUTH AMERICA ──────────────────────────────────────────────────────
  { code: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brazil', flag: '🇧🇷' },
  { code: 'GIG', name: 'Rio de Janeiro/Galeão International', city: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷' },
  { code: 'EZE', name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷' },
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia', flag: '🇨🇴' },
  { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru', flag: '🇵🇪' },
  { code: 'SCL', name: 'Arturo Merino Benítez International', city: 'Santiago', country: 'Chile', flag: '🇨🇱' },

  // ── AFRICA ─────────────────────────────────────────────────────────────
  { code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦' },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa', flag: '🇿🇦' },
  { code: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
  { code: 'ADD', name: 'Addis Ababa Bole International', city: 'Addis Ababa', country: 'Ethiopia', flag: '🇪🇹' },
  { code: 'LOS', name: 'Murtala Muhammed International', city: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco', flag: '🇲🇦' },

  // ── OCEANIA ────────────────────────────────────────────────────────────
  { code: 'SYD', name: 'Kingsford Smith Airport', city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', flag: '🇦🇺' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', flag: '🇦🇺' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', flag: '🇦🇺' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿' },
];

// Search airports by code, city, name, or country
export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.length < 1) return AIRPORTS.slice(0, limit);
  const q = query.toLowerCase().trim();
  return AIRPORTS.filter(a =>
    a.code.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function getAirportByCode(code: string): Airport | undefined {
  return AIRPORTS.find(a => a.code === code);
}

export function formatAirport(a: Airport): string {
  return `${a.flag} ${a.city} (${a.code})`;
}
