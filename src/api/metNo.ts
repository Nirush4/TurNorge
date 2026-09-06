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

  return metLocationForecastSchema.parse(json);
}

export function getMockMetForecast(_region: string): MetLocationForecast {
  return {
    type: 'Feature',

    geometry: {
      type: 'Point',
      coordinates: [8.3597, 61.4933, 1000],
    },

    properties: {
      meta: {
        updated_at: new Date().toISOString(),
        units: {},
      },

      timeseries: [
        {
          time: new Date().toISOString(),

          data: {
            instant: {
              details: {
                air_temperature: 12.5,
                wind_speed: 4.2,
                relative_humidity: 75,
              },
            },

            next_1_hours: {
              summary: {
                symbol_code: 'fair_day',
              },

              details: {
                precipitation_amount: 0,
              },
            },
          },
        },
      ],
    },
  };
}

export function summarizeForecast(forecast: MetLocationForecast) {
  const firstTimeseries = forecast.properties.timeseries[0];

  const instant = firstTimeseries?.data.instant.details;

  const nextInterval = firstTimeseries?.data.next_1_hours ?? firstTimeseries?.data.next_6_hours;

  return {
    temperatureC: instant?.air_temperature ?? 10,

    windMs: instant?.wind_speed ?? 3,

    precipitationMm: nextInterval?.details?.precipitation_amount ?? 0,

    symbol: nextInterval?.summary?.symbol_code ?? 'clearsky_day',
  };
}

export type { MetLocationForecast };
