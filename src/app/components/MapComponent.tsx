import { Map, Marker, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoic2t5aHVudCIsImEiOiJjbHdidHh4eGowMGJpMmptdnR4eGowMGJpIn0.test'; // Fallback token

interface Landmark {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
}

export function MapComponent({ landmarks }: { landmarks: Landmark[] }) {
  if (!landmarks || landmarks.length === 0) return null;

  // Calculate center
  const center = landmarks.reduce(
    (acc, curr) => ({
      lat: acc.lat + curr.coordinates.lat / landmarks.length,
      lng: acc.lng + curr.coordinates.lng / landmarks.length,
    }),
    { lat: 0, lng: 0 }
  );

  return (
    <div className="w-full h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-white/80 relative">
      <Map
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        
        {landmarks.map((lm, i) => (
          <Marker
            key={i}
            longitude={lm.coordinates.lng}
            latitude={lm.coordinates.lat}
            anchor="bottom"
          >
            <div className="group relative">
              <MapPin className="text-[#0047AB] fill-white" size={24} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#001F3F] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {lm.name}
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
