import { z } from 'zod';

export const metInstantDetailsSchema = z.object({
  air_temperature: z.number(),
  wind_speed: z.number(),
  relative_humidity: z.number(),
  wind_from_direction: z.number().optional(),
  cloud_area_fraction: z.number().optional(),
});

export const metTimeseriesSchema = z.object({
  time: z.string(),
  data: z.object({
    instant: z.object({
      details: metInstantDetailsSchema,
    }),
    next_6_hours: z
      .object({
        summary: z.object({
          symbol_code: z.string(),
        }),
        details: z
          .object({
            precipitation_amount: z.number(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export const metLocationForecastSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.array(z.number()).min(2).max(3),
  }),
  properties: z.object({
    meta: z.object({
      updated_at: z.string(),
      units: z.record(z.string()),
    }),
    timeseries: z.array(metTimeseriesSchema),
  }),
});

export type MetLocationForecast = z.infer<typeof metLocationForecastSchema>;

export async function fetchMetForecast(lat: number, lon: number): Promise<MetLocationForecast> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'NorwegianTrailPlanner/1.0 (contact@yourdomain.com)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const json = await response.json();
  return metLocationForecastSchema.parse(json);
}

export function getMockMetForecast(_region: string): MetLocationForecast {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [8.3597, 61.4933, 1000] },
    properties: {
      meta: { updated_at: new Date().toISOString(), units: {} },
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
            next_6_hours: {
              summary: { symbol_code: 'fair_day' },
              details: { precipitation_amount: 0.0 },
            },
          },
        },
      ],
    },
  };
}

export function summarizeForecast(forecast: MetLocationForecast) {
  const instant = forecast.properties.timeseries[0]?.data.instant.details;
  const next6 = forecast.properties.timeseries[0]?.data.next_6_hours;
  return {
    temperatureC: instant?.air_temperature ?? 10,
    windMs: instant?.wind_speed ?? 3,
    precipitationMm: next6?.details?.precipitation_amount ?? 0,
    symbol: next6?.summary?.symbol_code ?? 'clearsky_day',
  };
}
