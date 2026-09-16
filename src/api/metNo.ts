import { metLocationForecastSchema, type MetLocationForecast } from '@/types/schemas';

export async function fetchMetForecast(lat: number, lon: number): Promise<MetLocationForecast> {
  const safeLat = Number(lat).toFixed(4);
  const safeLon = Number(lon).toFixed(4);

  const url =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact` +
    `?lat=${safeLat}` +
    `&lon=${safeLon}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'NorwegianTrailPlannerApp/2.0 (https://github.com/your-repo; contact@yourdomain.com)',
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
  } catch (error) {
    console.error('MET.no fetch failed on mobile client:', error);
    throw error;
  }
}

export type { MetLocationForecast };
