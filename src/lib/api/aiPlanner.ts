import { fetchMetForecast } from '@/lib/api/metNo';
import { searchKartverketPlace } from '@/lib/api/kartverket';

import type { GeneratedPlan, ItineraryDay } from '@/types';
import type { PlannerFormValues } from '@/types/schemas';

/* -------------------------------------------------------------------------- */
/* Types & Interfaces                                                         */
/* -------------------------------------------------------------------------- */

export interface GeneratePlanSettings {
  concise?: boolean;
  emphasizeSafety?: boolean;
}

export interface LiveWeatherConditions {
  elevationMeters: number;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation6h: number;
  symbolCode: string;
}

/* -------------------------------------------------------------------------- */
/* Loading steps for ARIA live announcements                                  */
/* -------------------------------------------------------------------------- */

export const PLANNER_LOADING_STEPS: string[] = [
  'Querying Kartverket for precise destination coordinates...',
  'Fetching live MET.no meteorological telemetry and elevation profile...',
  'Evaluating real-time weather risks and altitude thresholds...',
  'Synthesizing fully dynamic WCAG-compliant itinerary structure...',
];

/* -------------------------------------------------------------------------- */
/* Live Weather Parser                                                        */
/* -------------------------------------------------------------------------- */

export function parseLiveWeather(metApiResponse: any): LiveWeatherConditions {
  const coordinates = metApiResponse.geometry?.coordinates || [0, 0, 0];
  const elevationMeters = coordinates[2] ?? 0;

  const currentSeries = metApiResponse.properties?.timeseries?.[0]?.data;
  const instantDetails = currentSeries?.instant?.details || {};
  const next6Hours = currentSeries?.next_6_hours?.details || {};
  const symbol = currentSeries?.next_1_hours?.summary?.symbol_code || 'clearsky';

  return {
    elevationMeters,
    temperature: instantDetails.air_temperature ?? 0,
    windSpeed: instantDetails.wind_speed ?? 0,
    windDirection: instantDetails.wind_from_direction ?? 0,
    humidity: instantDetails.relative_humidity ?? 0,
    precipitation6h: next6Hours.precipitation_amount ?? 0,
    symbolCode: symbol,
  };
}

/* -------------------------------------------------------------------------- */
/* Dynamic Overnight Rule Engine                                              */
/* -------------------------------------------------------------------------- */

function resolveDynamicOvernight(
  values: PlannerFormValues,
  weather: LiveWeatherConditions,
): string {
  if (values.includeCabinStay) {
    return `DNT staffed or self-service cabin network. Note: Active elevation is ${weather.elevationMeters}m; verify seasonal opening schedules and online booking portals before departure.`;
  }

  if (values.season === 'winter' || weather.temperature <= 0) {
    return `Winter-rated tent or snow shelter required. Current ambient temperature is ${weather.temperature}°C with winds at ${weather.windSpeed} m/s. Confirm local avalanche bulletins.`;
  }

  return `Wild camping compliant with Allemannsretten. Maintain mandatory 150-meter distance from inhabited infrastructure and protect fragile alpine flora.`;
}

/* -------------------------------------------------------------------------- */
/* Dynamic Packing List Engine                                                */
/* -------------------------------------------------------------------------- */

function resolveDynamicPackingList(
  values: PlannerFormValues,
  weather: LiveWeatherConditions,
): string[] {
  const list = [
    'Paper topographical map and offline GPX route dataset',
    'Certified high-lumen headlamp with backup power cells',
    'Comprehensive wilderness first-aid kit',
    'Thermal emergency bivy sack or bivouac shelter',
  ];

  if (weather.temperature <= 5 || values.season === 'winter') {
    list.push(
      'Sub-zero rated thermal base layers and heavy insulating mid-layers',
      'Windproof and waterproof hardshell jacket and rain trousers',
      'Insulated winter gloves, balaclava, and windproof goggles',
    );
  } else {
    list.push(
      'Moisture-wicking base layers and versatile wind shell',
      'UV-blocking sunglasses and broad-spectrum sunscreen',
    );
  }

  if (weather.precipitation6h > 0) {
    list.push(
      `Waterproof pack cover and dry bags (Precipitation forecast: ${weather.precipitation6h} mm / 6h)`,
    );
  }

  if (values.includeCabinStay) {
    list.push(
      'Official DNT cabin key',
      'Lightweight indoor cabin footwear',
      'Hygienic sleeping bag liner',
    );
  } else {
    list.push(
      '3-season structural tent',
      'Insulated sleeping pad with high R-value rating',
      'Backpacking cooking stove and fuel canister',
    );
  }

  return list;
}

/* -------------------------------------------------------------------------- */
/* Dynamic Itinerary Day Builder                                              */
/* -------------------------------------------------------------------------- */

function buildDynamicDays(
  values: PlannerFormValues,
  placeName: string,
  weather: LiveWeatherConditions,
  concise: boolean,
): ItineraryDay[] {
  const baseDistance =
    values.experienceLevel === 'beginner' ? 7 : values.experienceLevel === 'intermediate' ? 12 : 16;
  const baseGain = Math.round(
    weather.elevationMeters * 0.25 + (values.experienceLevel === 'expert' ? 700 : 400),
  );

  return Array.from({ length: values.durationDays }, (_, index) => {
    const day = index + 1;
    const isFirst = day === 1;
    const isLast = day === values.durationDays;

    let title = `Stage ${day}: Traversing ${placeName}`;
    let summary = `Altitude reference: ${weather.elevationMeters}m. Ambient air temperature is ${weather.temperature}°C with wind speeds recorded at ${weather.windSpeed} m/s.`;

    if (isFirst) {
      title = `Arrival and Initial Ascent near ${placeName}`;
      summary = `Establish baseline rhythm at ${weather.elevationMeters}m altitude. Current weather condition symbol: ${weather.symbolCode}. Monitor physical exertion closely.`;
    } else if (isLast) {
      title = `Final Descent and Return Buffer`;
      summary = `Maintain structural timing for return transit. Factor in cumulative fatigue and changing meteorological horizons.`;
    }

    if (weather.windSpeed > 10) {
      summary += ` ⚠️ High Wind Hazard: Winds at ${weather.windSpeed} m/s require avoiding exposed ridgelines.`;
    }

    if (weather.precipitation6h > 1.0) {
      summary += ` 🌧️ Precipitation Alert: Expected rainfall/snowfall of ${weather.precipitation6h} mm over the next 6 hours.`;
    }

    const finalSummary = concise ? summary.split('. ')[0] + '.' : summary;

    return {
      day,
      title,
      summary: finalSummary,
      distanceKm: Math.round((baseDistance + (isFirst || isLast ? -2 : 0)) * 10) / 10,
      elevationGainM: baseGain,
      overnight: resolveDynamicOvernight(values, weather),
      weatherNote: `${weather.temperature.toFixed(1)}°C, Wind: ${weather.windSpeed.toFixed(1)} m/s, Precip: ${weather.precipitation6h.toFixed(1)} mm (MET.no)`,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Main Generation Function                                                   */
/* -------------------------------------------------------------------------- */

export async function generatePlan(
  values: PlannerFormValues,
  settings: GeneratePlanSettings = {},
): Promise<GeneratedPlan> {
  const { concise = false, emphasizeSafety = true } = settings;

  const places = await searchKartverketPlace(values.destination);
  const place = places[0];

  const latitude = place?.latitude ?? 61.4933;
  const longitude = place?.longitude ?? 8.3597;

  const forecast = await fetchMetForecast(latitude, longitude);
  const weather = parseLiveWeather(forecast);

  const placeName = place?.name ?? values.destination;
  const municipality = place?.municipality ?? 'Norway';
  const county = place?.county ?? 'Norway';

  const overviewParts = [
    `Dynamic ${values.durationDays}-day route for ${placeName} (${municipality}, ${county}) at ${weather.elevationMeters}m elevation.`,
    `Experience level: ${values.experienceLevel}. Season: ${values.season}.`,
    values.includeCabinStay
      ? 'DNT cabin network integrated.'
      : 'Independent wilderness camping selected.',
    `Live telemetry: ${weather.temperature}°C, ${weather.windSpeed} m/s wind.`,
  ];

  const overview = concise
    ? [overviewParts[0], overviewParts[3]].join(' ')
    : overviewParts.join(' ');

  const safetyDisclaimers: string[] = [
    `Observation point telemetry: Coordinates [${longitude.toFixed(2)}, ${latitude.toFixed(2)}] at ${weather.elevationMeters} meters elevation.`,
    'This system provides algorithmic routing assistance, not certified professional mountain-guiding services.',
    'Weather metrics fluctuate rapidly in alpine terrain. Verify live MET.no updates immediately prior to step-off.',
    'Emergency Contact Numbers: Call 112 for police/rescue services and 113 for medical emergencies.',
  ];

  if (emphasizeSafety) {
    if (weather.windSpeed > 8) {
      safetyDisclaimers.push(
        `🚨 Active Wind Advisory: Wind speed is ${weather.windSpeed} m/s. Exercise extreme caution on exposed alpine passes.`,
      );
    }
    if (weather.temperature <= 2) {
      safetyDisclaimers.push(
        `❄️ Thermal Alert: Ambient temperature is ${weather.temperature}°C. Risk of hypothermia and windchill is elevated.`,
      );
    }
    safetyDisclaimers.push(
      'Enforce strict turnaround thresholds if visibility drops or physical exhaustion manifests.',
    );
  }

  const allemannsrettenNotes = [
    'Comply fully with the Norwegian Outdoor Recreation Act (Allemannsretten).',
    'Preserve absolute respect for private property: maintain minimum 150m clearance from houses and cabins.',
    'Pack out all waste items completely; never discard organic waste near water sources.',
    'Exercise strict adherence to regional fire bans and seasonal campfire legislation.',
  ];

  return {
    id: `dynamic-plan-${values.destination}-${Date.now()}`,
    title: `${values.destination} · ${values.durationDays} Day Live Itinerary`,
    region: values.destination,
    season: values.season,
    experienceLevel: values.experienceLevel,
    durationDays: values.durationDays,
    includeCabinStay: values.includeCabinStay,
    overview,
    days: buildDynamicDays(values, placeName, weather, concise),
    packingList: resolveDynamicPackingList(values, weather),
    safetyDisclaimers,
    allemannsrettenNotes,
    generatedAt: new Date().toISOString(),
  };
}
