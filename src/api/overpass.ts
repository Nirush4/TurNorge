// src/api/overpass.ts
export interface OsmAmenity {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    natural?: string;
    shop?: string;
    operator?: string;
  };
}

const amenityCache = new Map<string, OsmAmenity[]>();

const OVERPASS_ENDPOINTS = [
  '/api/overpass/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

export async function fetchNearbyAmenities(
  lat: number,
  lon: number,
  radiusMeters = 1500, // Safe lightweight starting radius
): Promise<OsmAmenity[]> {
  // Use tight, fast incremental radii to prevent heavy server load
  const searchRadii = [radiusMeters, 3500];

  for (const radius of searchRadii) {
    const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}_${radius}`;

    if (amenityCache.has(cacheKey)) {
      const cachedElements = amenityCache.get(cacheKey)!;
      if (cachedElements.length > 0 || radius === searchRadii[searchRadii.length - 1]) {
        return cachedElements;
      }
      continue;
    }

    // Explicit indexed union query instead of slow regex
    const query = `
      [out:json][timeout:8];
      (
        node(around:${radius},${lat},${lon})[shop=supermarket];
        node(around:${radius},${lat},${lon})[shop=convenience];
      );
      out body;
    `;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: query,
          headers: {
            'Content-Type': 'text/plain',
            'User-Agent': 'TrailApp/1.0',
          },
        });

        if (!response.ok) continue;

        const text = await response.text();
        if (text.includes('timeout') || text.includes('rate_limited') || text.includes('open64')) {
          continue;
        }

        const data = JSON.parse(text);
        const elements = data.elements || [];

        amenityCache.set(cacheKey, elements);

        if (elements.length > 0) {
          return elements;
        }
      } catch (err) {
        console.warn(`Overpass mirror failed on ${endpoint}:`, err);
        continue;
      }
    }
  }

  return [];
}
