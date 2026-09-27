import { kartverketPlaceSchema, type KartverketPlace } from '@/types/schemas';

type KartverketApiPlace = {
  ssrId?: string | number;
  skrivemåte?: string;
  navn?: string;
  representasjonspunkt?: {
    lat?: number;
    lon?: number;
  };
  kommuner?: Array<{
    kommunenavn?: string;
    kommunenummer?: string;
  }>;
  fylker?: Array<{
    fylkesnavn?: string;
    fylkesnummer?: string;
  }>;
};

type KartverketApiResponse = {
  navn?: KartverketApiPlace[];
};

/**
 * Default Norwegian hiking destinations.
 *
 * These are shown immediately in the Planner so the user
 * does not have to type into the search field first.
 *
 * Kartverket search can still be used to find additional
 * destinations.
 */
const POPULAR_NORWEGIAN_DESTINATIONS: KartverketPlace[] = [
  {
    ssrId: 'jotunheimen',
    name: 'Jotunheimen',
    municipality: 'Lom',
    county: 'Innlandet',
    latitude: 61.4933,
    longitude: 8.3597,
    mapSheet: 'N50',
  },
  {
    ssrId: 'hardangervidda',
    name: 'Hardangervidda',
    municipality: 'Eidfjord',
    county: 'Vestland',
    latitude: 60.05,
    longitude: 7.4,
    mapSheet: 'N50',
  },
  {
    ssrId: 'rondane',
    name: 'Rondane',
    municipality: 'Dovre',
    county: 'Innlandet',
    latitude: 61.9,
    longitude: 9.85,
    mapSheet: 'N50',
  },
  {
    ssrId: 'nordmarka',
    name: 'Nordmarka',
    municipality: 'Oslo',
    county: 'Oslo',
    latitude: 60.05,
    longitude: 10.7,
    mapSheet: 'N50',
  },
  {
    ssrId: 'lofoten',
    name: 'Lofoten',
    municipality: 'Vågan',
    county: 'Nordland',
    latitude: 68.2,
    longitude: 13.8,
    mapSheet: 'N50',
  },
  {
    ssrId: 'lyngsalpene',
    name: 'Lyngsalpene',
    municipality: 'Lyngen',
    county: 'Troms',
    latitude: 69.6,
    longitude: 20.0,
    mapSheet: 'N50',
  },
  {
    ssrId: 'trollheimen',
    name: 'Trollheimen',
    municipality: 'Surnadal',
    county: 'Møre og Romsdal',
    latitude: 62.65,
    longitude: 9.0,
    mapSheet: 'N50',
  },
  {
    ssrId: 'lysefjorden',
    name: 'Lysefjorden',
    municipality: 'Sandnes',
    county: 'Rogaland',
    latitude: 59.0,
    longitude: 6.35,
    mapSheet: 'N50',
  },
  {
    ssrId: 'preikestolen',
    name: 'Preikestolen',
    municipality: 'Strand',
    county: 'Rogaland',
    latitude: 58.9865,
    longitude: 6.1908,
    mapSheet: 'N50',
  },
  {
    ssrId: 'kjerag',
    name: 'Kjerag',
    municipality: 'Sandnes',
    county: 'Rogaland',
    latitude: 59.0536,
    longitude: 6.5962,
    mapSheet: 'N50',
  },
  {
    ssrId: 'dovrefjell',
    name: 'Dovrefjell',
    municipality: 'Dovre',
    county: 'Innlandet',
    latitude: 62.3,
    longitude: 9.6,
    mapSheet: 'N50',
  },
  {
    ssrId: 'skardstinden',
    name: 'Skardstinden',
    municipality: 'Lom',
    county: 'Innlandet',
    latitude: 61.65,
    longitude: 8.35,
    mapSheet: 'N50',
  },
  {
    ssrId: 'breheimen',
    name: 'Breheimen',
    municipality: 'Luster',
    county: 'Vestland',
    latitude: 61.7,
    longitude: 7.5,
    mapSheet: 'N50',
  },
  {
    ssrId: 'reinheimen',
    name: 'Reinheimen',
    municipality: 'Rauma',
    county: 'Møre og Romsdal',
    latitude: 62.35,
    longitude: 8.45,
    mapSheet: 'N50',
  },
  {
    ssrId: 'sunmorsalpene',
    name: 'Sunnmørsalpene',
    municipality: 'Ørsta',
    county: 'Møre og Romsdal',
    latitude: 62.25,
    longitude: 6.05,
    mapSheet: 'N50',
  },
  {
    ssrId: 'rago',
    name: 'Rago',
    municipality: 'Sørfold',
    county: 'Nordland',
    latitude: 67.45,
    longitude: 15.9,
    mapSheet: 'N50',
  },
  {
    ssrId: 'saltfjellet',
    name: 'Saltfjellet',
    municipality: 'Saltdal',
    county: 'Nordland',
    latitude: 66.6,
    longitude: 15.3,
    mapSheet: 'N50',
  },
  {
    ssrId: 'seiland',
    name: 'Seiland',
    municipality: 'Hammerfest',
    county: 'Finnmark',
    latitude: 70.45,
    longitude: 23.55,
    mapSheet: 'N50',
  },
  {
    ssrId: 'varangerhalvoya',
    name: 'Varangerhalvøya',
    municipality: 'Vadsø',
    county: 'Finnmark',
    latitude: 70.25,
    longitude: 30.0,
    mapSheet: 'N50',
  },
  {
    ssrId: 'stetind',
    name: 'Stetind',
    municipality: 'Narvik',
    county: 'Nordland',
    latitude: 68.1667,
    longitude: 16.5833,
    mapSheet: 'N50',
  },
  {
    ssrId: 'svolvaer',
    name: 'Svolvær',
    municipality: 'Vågan',
    county: 'Nordland',
    latitude: 68.2342,
    longitude: 14.5683,
    mapSheet: 'N50',
  },
  {
    ssrId: 'senja',
    name: 'Senja',
    municipality: 'Senja',
    county: 'Troms',
    latitude: 69.3,
    longitude: 17.5,
    mapSheet: 'N50',
  },
  {
    ssrId: 'lofoten-reine',
    name: 'Reine',
    municipality: 'Moskenes',
    county: 'Nordland',
    latitude: 67.9325,
    longitude: 13.0896,
    mapSheet: 'N50',
  },
  {
    ssrId: 'gaustatoppen',
    name: 'Gaustatoppen',
    municipality: 'Tinn',
    county: 'Telemark',
    latitude: 59.854,
    longitude: 8.65,
    mapSheet: 'N50',
  },
  {
    ssrId: 'huldreheimen',
    name: 'Huldreheimen',
    municipality: 'Nord-Aurdal',
    county: 'Innlandet',
    latitude: 61.05,
    longitude: 9.8,
    mapSheet: 'N50',
  },
  {
    ssrId: 'fjellheimen',
    name: 'Fjellheimen',
    municipality: 'Voss',
    county: 'Vestland',
    latitude: 60.75,
    longitude: 7.05,
    mapSheet: 'N50',
  },
  {
    ssrId: 'nordland',
    name: 'Nordland',
    municipality: 'Bodø',
    county: 'Nordland',
    latitude: 67.2804,
    longitude: 14.4049,
    mapSheet: 'N50',
  },
  {
    ssrId: 'rogaland',
    name: 'Rogaland',
    municipality: 'Stavanger',
    county: 'Rogaland',
    latitude: 58.97,
    longitude: 5.7331,
    mapSheet: 'N50',
  },
  {
    ssrId: 'vestland',
    name: 'Vestland',
    municipality: 'Bergen',
    county: 'Vestland',
    latitude: 60.3913,
    longitude: 5.3221,
    mapSheet: 'N50',
  },
  {
    ssrId: 'innlandet',
    name: 'Innlandet',
    municipality: 'Lillehammer',
    county: 'Innlandet',
    latitude: 61.1153,
    longitude: 10.4662,
    mapSheet: 'N50',
  },
];

/**
 * Convert a Kartverket API item into our application type.
 */
function mapKartverketPlace(
  item: KartverketApiPlace,
  fallbackQuery: string,
): KartverketPlace | null {
  const point = item.representasjonspunkt;

  if (typeof point?.lat !== 'number' || typeof point?.lon !== 'number') {
    return null;
  }

  const result = {
    ssrId: item.ssrId ? String(item.ssrId) : crypto.randomUUID(),
    name: item.skrivemåte ?? item.navn ?? fallbackQuery,
    municipality: item.kommuner?.[0]?.kommunenavn ?? 'Unknown',
    county: item.fylker?.[0]?.fylkesnavn ?? 'Unknown',
    latitude: point.lat,
    longitude: point.lon,
    mapSheet: 'N50',
  };

  const parsed = kartverketPlaceSchema.safeParse(result);

  return parsed.success ? parsed.data : null;
}

/**
 * Search Kartverket directly.
 *
 * IMPORTANT:
 * This intentionally does NOT use allorigins.win.
 *
 * If your browser blocks this request because of CORS,
 * move this function to a backend/server endpoint instead
 * of adding another public CORS proxy.
 */
export async function searchKartverketPlace(query: string): Promise<KartverketPlace[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const targetUrl =
    `https://api.kartverket.no/stedsnavn/v1/navn` +
    `?sok=${encodeURIComponent(trimmedQuery)}` +
    `&treffprosent=100`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Kartverket API error: ${response.status}`);
    }

    const data: KartverketApiResponse = await response.json();

    if (!Array.isArray(data.navn)) {
      return [];
    }

    return data.navn
      .map((item) => mapKartverketPlace(item, trimmedQuery))
      .filter((item): item is KartverketPlace => item !== null);
  } catch (error) {
    console.error('Failed to fetch Kartverket data:', error);

    /**
     * Return matching built-in destinations as a fallback.
     * This means the Planner still works even if Kartverket
     * is temporarily unavailable.
     */
    const lowerQuery = trimmedQuery.toLocaleLowerCase('nb');

    return POPULAR_NORWEGIAN_DESTINATIONS.filter((place) =>
      `${place.name} ${place.municipality} ${place.county}`
        .toLocaleLowerCase('nb')
        .includes(lowerQuery),
    );
  }
}

/**
 * Resolve one place.
 *
 * First check our popular destination list.
 * Then query Kartverket.
 */
export async function resolveKartverketPlace(query: string): Promise<KartverketPlace | null> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return null;
  }

  const lowerQuery = trimmedQuery.toLocaleLowerCase('nb');

  const popularMatch = POPULAR_NORWEGIAN_DESTINATIONS.find(
    (place) => place.name.toLocaleLowerCase('nb') === lowerQuery,
  );

  if (popularMatch) {
    return popularMatch;
  }

  const places = await searchKartverketPlace(trimmedQuery);

  return places[0] ?? null;
}

/**
 * Return destinations that should be displayed in dropdowns.
 *
 * This is intentionally synchronous and does not depend on
 * Kartverket being available.
 */
export function getPopularNorwegianDestinations(): KartverketPlace[] {
  return [...POPULAR_NORWEGIAN_DESTINATIONS];
}

/**
 * Dynamic areas used by Explore.
 *
 * The popular destinations are included first so Explore
 * always has useful content even when the external API fails.
 */
export async function fetchDynamicNorwegianAreas(): Promise<KartverketPlace[]> {
  const queries = [
    'Jotunheimen',
    'Hardangervidda',
    'Rondane',
    'Nordmarka',
    'Lofoten',
    'Lyngsalpene',
    'Trollheimen',
    'Lysefjorden',
  ];

  const results = await Promise.all(queries.map((query) => searchKartverketPlace(query)));

  const unique = new Map<string, KartverketPlace>();

  for (const place of POPULAR_NORWEGIAN_DESTINATIONS) {
    unique.set(place.name.toLocaleLowerCase('nb'), place);
  }

  for (const places of results) {
    for (const place of places) {
      unique.set(place.name.toLocaleLowerCase('nb'), place);
    }
  }

  return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name, 'nb'));
}
