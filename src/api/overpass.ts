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
  center?: { lat: number; lon: number };
}

export interface FetchAmenitiesOptions {
  lat: number;
  lon: number;
  radius?: number;
  destinationName?: string;
  signal?: AbortSignal;
}

export interface FetchAmenitiesResult {
  data: AmenityItem[];
  source: 'live' | 'fallback';
}

interface CacheEntry {
  data: AmenityItem[];
  timestamp: number;
  source: 'live' | 'fallback';
}

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const SHOP_TYPES = 'supermarket|convenience|grocery|greengrocer|bakery';
const PER_REQUEST_TIMEOUT_MS = 15000;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const RATE_LIMIT_COOLDOWN_MS = 5 * 60 * 1000;
const ERROR_COOLDOWN_MS = 60 * 1000;

const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<FetchAmenitiesResult>>();
const cooldownUntil = new Map<string, number>();

function buildQuery(lat: number, lon: number, radius: number): string {
  return `[out:json][timeout:20];nwr["shop"~"^(${SHOP_TYPES})$"](around:${radius},${lat},${lon});out center;`;
}

function getFallbackAmenities(lat: number, lon: number, destinationName?: string): AmenityItem[] {
  const prefix = destinationName ? `${destinationName} ` : '';
  return [
    {
      id: 900001,
      tags: { name: `${prefix}Kiwi Market`, shop: 'supermarket', brand: 'Kiwi' },
      lat: lat + 0.002,
      lon: lon + 0.001,
    },
    {
      id: 900002,
      tags: { name: `${prefix}REMA 1000`, shop: 'supermarket', brand: 'REMA 1000' },
      lat: lat - 0.002,
      lon: lon + 0.002,
    },
    {
      id: 900003,
      tags: { name: `${prefix}Coop Extra`, shop: 'supermarket', brand: 'Coop' },
      lat: lat + 0.001,
      lon: lon - 0.002,
    },
    {
      id: 900004,
      tags: { name: `${prefix}Narvesen Kiosk`, shop: 'convenience', brand: 'Narvesen' },
      lat: lat - 0.001,
      lon: lon - 0.001,
    },
  ];
}

function readPersisted(key: string): CacheEntry | null {
  try {
    const raw = window.localStorage.getItem(`overpass:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writePersisted(key: string, entry: CacheEntry): void {
  try {
    window.localStorage.setItem(`overpass:${key}`, JSON.stringify(entry));
  } catch {}
}

function raceWithAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
  });
}

async function requestFromMirrors(
  lat: number,
  lon: number,
  radius: number,
  destinationName?: string,
): Promise<FetchAmenitiesResult> {
  const query = buildQuery(lat, lon, radius);
  let lastError: unknown = null;
  let attemptedAny = false;

  for (const endpoint of ENDPOINTS) {
    if (Date.now() < (cooldownUntil.get(endpoint) ?? 0)) continue;
    attemptedAny = true;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PER_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: controller.signal,
      });

      if (response.status === 429) {
        cooldownUntil.set(endpoint, Date.now() + RATE_LIMIT_COOLDOWN_MS);
        lastError = new Error(`${endpoint} rate limited (429)`);
        continue;
      }
      if (!response.ok) {
        cooldownUntil.set(endpoint, Date.now() + ERROR_COOLDOWN_MS);
        lastError = new Error(`${endpoint} responded ${response.status}`);
        continue;
      }

      const json = await response.json();
      const rawElements: any[] = Array.isArray(json.elements) ? json.elements : [];

      // Normalize elements so ways/relations with `center` populate flat lat/lon safely
      const elements: AmenityItem[] = rawElements.map((el) => ({
        ...el,
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
      }));

      cooldownUntil.delete(endpoint);
      return { data: elements, source: 'live' };
    } catch (err) {
      cooldownUntil.set(endpoint, Date.now() + ERROR_COOLDOWN_MS);
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }

  if (attemptedAny) {
    console.warn('[overpass] all mirrors unavailable, using fallback:', lastError);
  }
  return { data: getFallbackAmenities(lat, lon, destinationName), source: 'fallback' };
}

export const fetchNearbyAmenities = async ({
  lat,
  lon,
  radius = 3000,
  destinationName,
  signal,
}: FetchAmenitiesOptions): Promise<FetchAmenitiesResult> => {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) {
    return { data: [], source: 'live' };
  }

  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}_${radius}`;

  const memHit = memoryCache.get(cacheKey);
  if (memHit && Date.now() - memHit.timestamp < CACHE_TTL_MS) {
    return { data: memHit.data, source: memHit.source };
  }

  const diskHit = readPersisted(cacheKey);
  if (diskHit) {
    memoryCache.set(cacheKey, diskHit);
    return { data: diskHit.data, source: diskHit.source };
  }

  let pending = inflight.get(cacheKey);
  if (!pending) {
    pending = requestFromMirrors(lat, lon, radius, destinationName)
      .then((result) => {
        const entry: CacheEntry = {
          data: result.data,
          timestamp: Date.now(),
          source: result.source,
        };
        memoryCache.set(cacheKey, entry);
        if (result.source === 'live') writePersisted(cacheKey, entry);
        return result;
      })
      .finally(() => inflight.delete(cacheKey));
    inflight.set(cacheKey, pending);
  }

  return raceWithAbort(pending, signal);
};
