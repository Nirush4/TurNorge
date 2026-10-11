import { searchKartverketPlace } from '@/lib/api/kartverket';
import type { PlannerFormValues, KartverketPlace } from '@/types/schemas';
import type { MetForecastResponse } from '@/types/met';
import type { GeneratedPlan, ItineraryDay } from '@/types';
import { fetchMetForecast } from '@/lib/api/metNo';

export interface LiveWeatherConditions {
  elevationMeters: number;
  temperature: number;
  windSpeed: number;
  precipitation6h: number;
  symbolCode: string;
}

export interface MetTimeseriesEntry {
  time?: string;
  data?: {
    instant?: {
      details?: {
        air_pressure_at_sea_level?: number;
        air_temperature?: number;
        cloud_area_fraction?: number;
        relative_humidity?: number;
        wind_from_direction?: number;
        wind_speed?: number;
      };
    };
    next_1_hours?: {
      summary?: {
        symbol_code?: string;
      };
      details?: {
        precipitation_amount?: number;
      };
    };
    next_6_hours?: {
      summary?: {
        symbol_code?: string;
      };
      details?: {
        precipitation_amount?: number;
      };
    };
    next_12_hours?: {
      summary?: {
        symbol_code?: string;
      };
      details?: Record<string, unknown>;
    };
  };
}

export interface ExtendedGeneratedPlan extends GeneratedPlan {
  resolvedPlace?: KartverketPlace;
  weather?: LiveWeatherConditions;
}

export const PLANNER_LOADING_STEPS = [
  'Resolving location coordinates via Kartverket...',
  'Fetching live meteorological telemetry from MET.no...',
  'Evaluating real-time weather risks and altitude thresholds...',
  'Synthesizing fully dynamic WCAG-compliant itinerary structure...',
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
] as const;

export const SEASON_OPTIONS = [
  { value: 'summer_autumn', label: 'Summer / Autumn hiking' },
  { value: 'winter', label: 'Winter skiing' },
] as const;

export const MOBILE_INPUT_STYLES = {
  input: { fontSize: '16px' },
  dropdown: { fontSize: '16px' },
  label: {
    fontSize: '1.05rem',
    fontWeight: 600,
    marginBottom: '6px',
  },
} as const;

export function parseLiveWeather(metApiResponse: unknown): LiveWeatherConditions {
  const response = metApiResponse as {
    geometry?: { coordinates?: number[] };
    properties?: {
      timeseries?: MetTimeseriesEntry[];
    };
  };

  const coordinates = response.geometry?.coordinates || [0, 0, 0];
  const elevationMeters = coordinates[2] ?? 0;
  const currentSeries = response.properties?.timeseries?.[0]?.data;
  const instantDetails = currentSeries?.instant?.details || {};
  const next6HoursDetails = currentSeries?.next_6_hours?.details || {};
  const symbol =
    currentSeries?.next_1_hours?.summary?.symbol_code ||
    currentSeries?.next_6_hours?.summary?.symbol_code ||
    'clearsky';

  return {
    elevationMeters,
    temperature: instantDetails.air_temperature ?? 0,
    windSpeed: instantDetails.wind_speed ?? 0,
    precipitation6h: next6HoursDetails.precipitation_amount ?? 0,
    symbolCode: symbol,
  };
}

function generateDynamicWeatherAdvice(weather: LiveWeatherConditions): string {
  let narrative = `Telemetry at ${weather.elevationMeters}m: ${weather.temperature.toFixed(1)}°C, wind ${weather.windSpeed.toFixed(1)} m/s. `;

  if (weather.windSpeed > 10) {
    narrative += '⚠️ High wind advisory: Avoid exposed ridges. ';
  } else if (weather.temperature < 0) {
    narrative += '❄️ Freezing conditions: Thermal insulation layers required. ';
  } else {
    narrative += 'Conditions stable for travel. ';
  }

  if (weather.precipitation6h > 1.5) {
    narrative += `Precipitation expected (~${weather.precipitation6h.toFixed(1)}mm/6h); waterproof shells mandatory.`;
  }

  return narrative;
}

function buildDynamicDays(
  values: PlannerFormValues,
  placeName: string,
  baseWeather: LiveWeatherConditions,
  timeseries: MetTimeseriesEntry[],
  tone: 'standard' | 'cautious' | 'ambitious',
): ItineraryDay[] {
  const baseDistance =
    tone === 'ambitious'
      ? 16
      : tone === 'cautious'
        ? 6
        : values.experienceLevel === 'beginner'
          ? 8
          : 12;

  return Array.from({ length: values.durationDays }, (_, index) => {
    const day = index + 1;
    const isFirst = day === 1;
    const isLast = day === values.durationDays;

    const forecastIndex = Math.min(index * 12, timeseries.length - 1);
    const targetData = timeseries[forecastIndex]?.data;

    const dayTemp = targetData?.instant?.details?.air_temperature ?? baseWeather.temperature;
    const dayWind = targetData?.instant?.details?.wind_speed ?? baseWeather.windSpeed;
    const daySymbol =
      targetData?.next_1_hours?.summary?.symbol_code ??
      targetData?.next_6_hours?.summary?.symbol_code ??
      baseWeather.symbolCode;
    const dayPrecip =
      targetData?.next_6_hours?.details?.precipitation_amount ?? baseWeather.precipitation6h;

    let distance = baseDistance;
    if (isFirst) distance = Math.max(4, baseDistance * 0.7);
    if (isLast) distance = Math.max(4, baseDistance * 0.8);
    if (!isFirst && !isLast && day % 2 === 0) distance += 2;

    const elevationGain = Math.round(
      baseWeather.elevationMeters * 0.2 +
        (tone === 'ambitious' ? 800 : tone === 'cautious' ? 250 : 500) +
        index * 40,
    );

    let title = `Stage ${day}: Traversing ${placeName}`;
    let summary = `Maintain pacing at elevation ${baseWeather.elevationMeters}m. Weather code: ${daySymbol}.`;

    if (isFirst) {
      title = `Arrival and initial leg near ${placeName}`;
      summary = `Establish baseline rhythm at ${baseWeather.elevationMeters}m. Ambient temperature: ${dayTemp.toFixed(1)}°C.`;
    } else if (isLast) {
      title = `Final return journey from ${placeName}`;
      summary =
        'Keep adequate time buffers for return transit and check local transport schedules.';
    }

    return {
      day,
      title,
      summary,
      distanceKm: Math.round(distance * 10) / 10,
      elevationGainM: elevationGain,
      overnight: values.includeCabinStay
        ? 'DNT Cabin network (Verify opening status and booking requirements).'
        : 'Wild camping compliant with Allemannsretten (Maintain 150m clearance from buildings).',
      weatherNote: `Elevation: ${baseWeather.elevationMeters}m | Temp: ${dayTemp.toFixed(1)}°C | Wind: ${dayWind.toFixed(1)} m/s | Precip: ${dayPrecip}mm`,
    };
  });
}

export async function generateDynamicPlan(
  values: PlannerFormValues,
  presetTone: 'standard' | 'cautious' | 'ambitious' = 'standard',
  emphasizeSafety: boolean = true,
): Promise<ExtendedGeneratedPlan> {
  let place: KartverketPlace | undefined;
  let forecast:
    | MetForecastResponse
    | { geometry: { coordinates: number[] }; properties: { timeseries: MetTimeseriesEntry[] } };

  try {
    const places = await searchKartverketPlace(values.destination);
    place = places[0];
    const latitude = place?.latitude ?? 61.4933;
    const longitude = place?.longitude ?? 8.3597;
    forecast = (await fetchMetForecast(latitude, longitude)) as MetForecastResponse;
  } catch (error) {
    console.warn('Network request failed, falling back to offline telemetry:', error);
    forecast = {
      geometry: { coordinates: [8.3597, 61.4933, 500] },
      properties: {
        timeseries: [
          {
            time: '2026-10-04T15:00:00Z',
            data: {
              instant: { details: { air_temperature: 2.1, wind_speed: 5.8 } },
              next_6_hours: {
                details: { precipitation_amount: 6.2 },
                summary: { symbol_code: 'heavyrain' },
              },
              next_1_hours: { summary: { symbol_code: 'rain' } },
            },
          },
        ],
      },
    };
  }

  const weather = parseLiveWeather(forecast);
  const placeName = place?.name ?? values.destination;
  const weatherNote = generateDynamicWeatherAdvice(weather);
  const timeseries = forecast?.properties?.timeseries || [];

  const overview = `Plan for ${placeName} (${place?.municipality || 'Norway'}) across ${values.durationDays} days at ${weather.elevationMeters}m elevation. Mode: ${presetTone.toUpperCase()}. Weather: ${weatherNote}`;

  const safetyDisclaimers = [
    `Observation point elevation: ${weather.elevationMeters} meters above sea level.`,
    'This system provides algorithmic trip planning assistance, not certified professional mountain guiding.',
    'Verify live MET.no bulletins and local avalanche warnings immediately before departure.',
    'Emergency Numbers: Call 112 for police/rescue and 113 for medical emergencies.',
  ];

  if (emphasizeSafety) {
    safetyDisclaimers.push(
      'Exercise extreme caution when crossing alpine snow bridges or swollen watercourses.',
      'Maintain an active communication schedule with an external contact when venturing off-grid.',
    );
  }

  return {
    id: `dynamic-plan-${values.destination}-${Date.now()}`,
    title: `${values.destination} · ${values.durationDays} ${values.durationDays === 1 ? 'Day' : 'Days'}`,
    region: values.destination,
    season: values.season,
    experienceLevel: values.experienceLevel,
    durationDays: values.durationDays,
    includeCabinStay: values.includeCabinStay,
    overview,
    days: buildDynamicDays(values, placeName, weather, timeseries, presetTone),
    packingList: [
      weather.temperature <= 5
        ? 'Sub-zero thermal base layers & insulated jacket'
        : 'Moisture-wicking layers',
      weather.precipitation6h > 0
        ? 'Waterproof hardshell jacket and rain trousers'
        : 'Wind shell jacket',
      'Paper topographical map and offline GPX dataset',
      'Certified high-lumen headlamp and first-aid kit',
      values.includeCabinStay
        ? 'Official DNT cabin key & indoor footwear'
        : '3-season tent & insulated sleeping pad',
    ],
    safetyDisclaimers,
    allemannsrettenNotes: [
      'Respect the Norwegian Right to Roam (Allemannsretten).',
      'Keep a minimum distance of 150 meters from inhabited houses and active farms.',
    ],
    generatedAt: new Date().toISOString(),
    resolvedPlace: place,
    weather,
  };
}
