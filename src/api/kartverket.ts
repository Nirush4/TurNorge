import { z } from 'zod';

export const NORWEGIAN_REGIONS = [
  'Jotunheimen',
  'Nordmarka',
  'Hardangervidda',
  'Lofoten',
  'Rondane',
  'Lyngsalpene',
  'Trollheimen',
  'Lysefjorden',
] as const;

export const REGION_COORDINATES: Record<string, { lat: number; lon: number }> = {
  Jotunheimen: { lat: 61.4933, lon: 8.3597 },
  Nordmarka: { lat: 60.0333, lon: 10.6667 },
  Hardangervidda: { lat: 60.0356, lon: 7.4589 },
  Lofoten: { lat: 68.3168, lon: 14.5658 },
  Rondane: { lat: 61.8833, lon: 9.7833 },
  Lyngsalpene: { lat: 69.5833, lon: 20.2167 },
  Trollheimen: { lat: 62.8333, lon: 9.3333 },
  Lysefjorden: { lat: 58.9333, lon: 6.25 },
};

export const kartverketPlaceSchema = z.object({
  ssrId: z.string(),
  name: z.string().min(1),
  municipality: z.string(),
  county: z.string(),
  region: z.enum(NORWEGIAN_REGIONS),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  mapSheet: z.string(),
});

export type KartverketPlace = z.infer<typeof kartverketPlaceSchema>;

export async function searchKartverketPlace(query: string): Promise<KartverketPlace[]> {
  const url = `https://api.kartverket.no/stedsnavn/v1/navn?sok=${encodeURIComponent(query)}&treffprosent=100`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Kartverket API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data?.navn || !Array.isArray(data.navn)) {
    return [];
  }

  return data.navn
    .map((item: Record<string, unknown>) => {
      const lat = (item.representasjonspunkt as { lat?: number })?.lat;
      const lon = (item.representasjonspunkt as { lon?: number })?.lon;
      const name = (item.navn as string) || (item.skrivemåte as string) || query;

      const parsed = kartverketPlaceSchema.safeParse({
        ssrId: item.ssrId ? String(item.ssrId) : 'SSR-UNKNOWN',
        name,
        municipality:
          (item.kommuner as Array<{ kommunenummer?: string }>)?.[0]?.kommunenummer ?? 'Unknown',
        county: (item.fylker as Array<{ fylkesnavn?: string }>)?.[0]?.fylkesnavn ?? 'Unknown',
        region: 'Jotunheimen',
        latitude: typeof lat === 'number' ? lat : 61.5,
        longitude: typeof lon === 'number' ? lon : 8.5,
        mapSheet: (item.skrivemåte as string) ?? 'N/A',
      });

      return parsed.success ? parsed.data : null;
    })
    .filter((item: KartverketPlace | null): item is KartverketPlace => item !== null);
}
