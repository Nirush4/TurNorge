import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/* Planner                                                                     */
/* -------------------------------------------------------------------------- */

export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'expert'] as const;

export const SEASONS = ['summer_autumn', 'winter'] as const;

export const TRAIL_DIFFICULTIES = ['easy', 'moderate', 'demanding', 'expert'] as const;

export const WATER_SAFETY = ['treated', 'filter', 'boil', 'avoid'] as const;

export const NORWEGIAN_DESTINATIONS = [
  'Jotunheimen',
  'Hardangervidda',
  'Rondane',
  'Dovrefjell',
  'Trollheimen',
  'Lyngsalpene',
  'Lofoten',
  'Nordmarka',
  'Lysefjorden',
  'Femundsmarka',
  'Sylan',
  'Romsdalen',
  'Sunnmørsalpene',
  'Hurrungane',
  'Breheimen',
  'Reinheimen',
  'Jostedalsbreen',
  'Hallingskarvet',
  'Setesdal',
  'Ryfylke',
  'Haukelifjell',
  'Romsdal',
  'Narvikfjellet',
  'Senja',
  'Vesterålen',
  'Helgeland',
  'Saltfjellet',
  'Børgefjell',
  'Rago',
  'Oslo Marka',
] as const;

export const norwegianRegionSchema = z.string().min(1, 'Choose a Norwegian destination.');

export const plannerSchema = z.object({
  destination: norwegianRegionSchema,

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
    .max(14, 'Keep plans to 14 days or fewer.'),

  season: z.enum(SEASONS, {
    required_error: 'Select a season.',
    invalid_type_error: 'Select a season.',
  }),

  includeCabinStay: z.boolean(),
});

export type PlannerFormValues = z.infer<typeof plannerSchema>;

/* -------------------------------------------------------------------------- */
/* MET.no                                                                      */
/* -------------------------------------------------------------------------- */

export const metInstantDetailsSchema = z.object({
  air_temperature: z.number(),
  wind_speed: z.number(),
  relative_humidity: z.number(),
  wind_from_direction: z.number().optional(),
  cloud_area_fraction: z.number().optional(),
  air_pressure_at_sea_level: z.number().optional(),
});

export const metTimeseriesSchema = z.object({
  time: z.string(),

  data: z.object({
    instant: z.object({
      details: metInstantDetailsSchema,
    }),

    next_1_hours: z
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

/* -------------------------------------------------------------------------- */
/* Kartverket                                                                  */
/* -------------------------------------------------------------------------- */

export const kartverketPlaceSchema = z.object({
  ssrId: z.string(),
  name: z.string().min(1),
  municipality: z.string(),
  county: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  mapSheet: z.string(),
});

export type KartverketPlace = z.infer<typeof kartverketPlaceSchema>;
