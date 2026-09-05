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

export const REGION_COORDINATES: Record<
  (typeof NORWEGIAN_REGIONS)[number],
  { lat: number; lon: number; altitude: number }
> = {
  Jotunheimen: { lat: 61.4933, lon: 8.3597, altitude: 1060 },
  Nordmarka: { lat: 60.0333, lon: 10.6667, altitude: 350 },
  Hardangervidda: { lat: 60.2833, lon: 7.4167, altitude: 1200 },
  Lofoten: { lat: 68.3285, lon: 14.5656, altitude: 20 },
  Rondane: { lat: 61.85, lon: 9.7167, altitude: 1000 },
  Lyngsalpene: { lat: 69.5833, lon: 20.2167, altitude: 140 },
  Trollheimen: { lat: 62.8, lon: 9.25, altitude: 700 },
  Lysefjorden: { lat: 58.9333, lon: 6.2667, altitude: 50 },
};

export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'expert'] as const;
export const SEASONS = ['summer_autumn', 'winter'] as const;
export const TRAIL_DIFFICULTIES = ['easy', 'moderate', 'demanding', 'expert'] as const;
export const WATER_SAFETY = ['treated', 'filter', 'boil', 'avoid'] as const;

export const plannerSchema = z.object({
  destination: z.enum(NORWEGIAN_REGIONS, {
    required_error: 'Choose a Norwegian region.',
    invalid_type_error: 'Choose a Norwegian region.',
  }),
  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    required_error: 'Select your experience level.',
    invalid_type_error: 'Select your experience level.',
  }),
  durationDays: z
    .number({
      required_error: 'Enter trip length in days.',
      invalid_type_error: 'Trip length must be a number between 1 and 14.',
    })
    .int('Use whole days only.')
    .min(1, 'Trips must be at least 1 day.')
    .max(14, 'Keep public-utility plans to 14 days or fewer.'),
  season: z.enum(SEASONS, {
    required_error: 'Select a season.',
    invalid_type_error: 'Select a season.',
  }),
  includeCabinStay: z.boolean(),
});

export type PlannerFormValues = z.infer<typeof plannerSchema>;

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
