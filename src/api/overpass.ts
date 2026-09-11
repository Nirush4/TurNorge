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

// Client-side timeout so a hung proxy/mirror doesn't stall the whole chain.
// This is separate from Overpass's own [timeout:8], which only bounds
// server-side query execution, not how long we wait for a response.
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 8000,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function fetchNearbyAmenities(
  lat: number,
  lon: number,
  radiusMeters = 1500,
): Promise<OsmAmenity[]> {
  const searchRadii = [radiusMeters, 3500];

  for (const radius of searchRadii) {
    const cacheKey = `${lat.toFixed(5)}_${lon.toFixed(5)}_${radius}`;

    if (amenityCache.has(cacheKey)) {
      const cachedElements = amenityCache.get(cacheKey)!;
      if (cachedElements.length > 0 || radius === searchRadii[searchRadii.length - 1]) {
        return cachedElements;
      }
      continue;
    }

    const query = `
      [out:json][timeout:8];
      (
        node(around:${radius},${lat},${lon})[shop=supermarket];
        node(around:${radius},${lat},${lon})[shop=convenience];
      );
      out body;
    `;

    let gotValidResponse = false;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const response = await fetchWithTimeout(
          endpoint,
          {
            method: 'POST',
            body: query,
            headers: {
              'Content-Type': 'text/plain',
              'User-Agent': 'TrailApp/1.0',
            },
          },
          8000,
        );

        if (!response.ok) continue;

        const text = await response.text();
        if (text.includes('timeout') || text.includes('rate_limited') || text.includes('open64')) {
          continue;
        }

        const data = JSON.parse(text);
        const elements = data.elements || [];

        amenityCache.set(cacheKey, elements);
        gotValidResponse = true;

        // A genuinely empty result is still a valid answer — stop trying
        // other mirrors for this radius instead of burning more requests.
        break;
      } catch (err) {
        console.warn(`Overpass mirror failed on ${endpoint}:`, err);
        continue;
      }
    }

    if (gotValidResponse) {
      const elements = amenityCache.get(cacheKey)!;
      if (elements.length > 0 || radius === searchRadii[searchRadii.length - 1]) {
        return elements;
      }
    }
  }

  return [];
}
