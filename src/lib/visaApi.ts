import { API_CONFIG } from './flightApi';

const BASE_URL = 'https://visa-requirement.p.rapidapi.com/api/v1';

export interface VisaRequirement {
  visa_required: boolean;
  visa_type: string;
  stay_limit: string;
  notes: string;
  passport_validity_required: string;
}

export async function getVisaRequirement(sourceCountry: string, destinationCountry: string) {
  // Note: This API often uses ISO Alpha-2 codes (e.g., IN, US)
  try {
    const response = await fetch(`${BASE_URL}/VisaRequirements?source=${sourceCountry}&destination=${destinationCountry}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.KEY,
        'x-rapidapi-host': 'visa-requirement.p.rapidapi.com'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch visa requirements');

    const data = await response.json();
    return data.data; // Structure based on API analysis
  } catch (error) {
    console.error('Visa API Error:', error);
    return null;
  }
}
