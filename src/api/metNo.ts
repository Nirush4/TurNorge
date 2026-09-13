import { metLocationForecastSchema, type MetLocationForecast } from '@/types/schemas';

export async function fetchMetForecast(lat: number, lon: number): Promise<MetLocationForecast> {
  const url =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact` +
    `?lat=${encodeURIComponent(lat)}` +
    `&lon=${encodeURIComponent(lon)}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'NorwegianTrailPlanner/1.0 (contact@yourdomain.com)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
  }

  const json: unknown = await response.json();

  const result = metLocationForecastSchema.safeParse(json);
  if (!result.success) {
    console.warn('MetForecast schema validation warning:', result.error);

    return json as MetLocationForecast;
  }

  return result.data;
}

export type { MetLocationForecast };
