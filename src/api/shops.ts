import { shopItemSchema, type ShopItem } from '@/types/shopItemSchema';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '';

export interface GeoapifyFeature {
  properties: {
    place_id: string;
    name?: string;
    street?: string;
    brand?: string;
    categories?: string[];
    lat: number;
    lon: number;
  };
}

export async function fetchNorwegianShops(
  lat: number,
  lon: number,
  radiusMeters = 5000,
): Promise<ShopItem[]> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) {
    return [];
  }

  if (!GEOAPIFY_API_KEY) {
    console.warn('[ShopsService] VITE_GEOAPIFY_API_KEY missing in .env.');
    return [];
  }

  // Guaranteed supported Geoapify place categories
  const categories = 'commercial.supermarket,commercial.convenience';

  const filterParam = `circle:${lon},${lat},${radiusMeters}`;
  const biasParam = `proximity:${lon},${lat}`;

  const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=${filterParam}&bias=${biasParam}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Geoapify Error Response]:', errorBody);
      throw new Error(`Geoapify status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.features)) return [];

    return data.features
      .map((feature: GeoapifyFeature) => {
        const props = feature.properties;
        const rawName = props.name || props.street || 'Dagligvarebutikk';
        const primaryCategory = props.categories?.[0] ?? 'commercial.supermarket';
        const shopType = primaryCategory.split('.').pop() || 'supermarket';

        const parsed = shopItemSchema.safeParse({
          id: props.place_id ? `geoapify_${props.place_id}` : `geo_${Math.random()}`,
          name: rawName,
          brand: props.brand || rawName,
          shopType,
          latitude: props.lat,
          longitude: props.lon,
        });

        return parsed.success ? parsed.data : null;
      })
      .filter((item: ShopItem | null): item is ShopItem => item !== null);
  } catch (err: unknown) {
    console.warn('[ShopsService] Failed to fetch shops:', err);
    return [];
  }
}
