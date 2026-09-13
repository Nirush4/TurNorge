export interface AmenityItem {
  id: number;
  tags: {
    name?: string;
    shop?: string;
    amenity?: string;
    brand?: string;
    [key: string]: string | undefined;
  };
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
}

interface FetchAmenitiesOptions {
  lat: number;
  lon: number;
  radius?: number;
}

const getFallbackAmenities = (lat: number, lon: number): AmenityItem[] => [
  {
    id: 99101,
    tags: { name: 'Kiwi Supermarked', shop: 'supermarket', brand: 'Kiwi' },
    lat: lat + 0.002,
    lon: lon + 0.001,
  },
  {
    id: 99102,
    tags: { name: 'REMA 1000', shop: 'supermarket', brand: 'REMA 1000' },
    lat: lat - 0.002,
    lon: lon + 0.002,
  },
  {
    id: 99103,
    tags: { name: 'Coop Extra', shop: 'supermarket', brand: 'Coop' },
    lat: lat + 0.001,
    lon: lat - 0.002,
  },
  {
    id: 99104,
    tags: { name: 'Narvesen Kiosk', shop: 'convenience', brand: 'Narvesen' },
    lat: lat - 0.001,
    lon: lon - 0.001,
  },
];

const memoryCache = new Map<string, { data: AmenityItem[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export const fetchNearbyAmenities = async ({
  lat,
  lon,
  radius = 2000,
}: FetchAmenitiesOptions): Promise<AmenityItem[]> => {
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}_${radius}`;
  const cached = memoryCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const PRIMARY_ENDPOINT = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter';

  const query = `
    [out:json][timeout:2];
    (
      node["shop"](around:${radius},${lat},${lon});
    );
    out body 15;
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(PRIMARY_ENDPOINT, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.elements && json.elements.length > 0) {
        memoryCache.set(cacheKey, { data: json.elements, timestamp: Date.now() });
        return json.elements;
      }
    }
  } catch {}

  const fallbackData = getFallbackAmenities(lat, lon);
  memoryCache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
  return fallbackData;
};
