import { fetchMetForecast } from '@/api/metNo';
import { searchKartverketPlace } from '@/api/kartverket';

import type { GeneratedPlan, ItineraryDay } from '@/types';
import type { PlannerFormValues } from '@/types/schemas';

/* -------------------------------------------------------------------------- */
/* Planner settings                                                            */
/* -------------------------------------------------------------------------- */

export interface GeneratePlanSettings {
  concise?: boolean;
  emphasizeSafety?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Loading steps                                                               */
/* -------------------------------------------------------------------------- */

export const PLANNER_LOADING_STEPS: string[] = [
  'Finding the destination...',
  'Checking live MET.no weather...',
  'Checking cabin and camping considerations...',
  'Building your day-by-day itinerary...',
];

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_COORDINATES = {
  lat: 61.4933,
  lon: 8.3597,
};

const CABIN_HINTS: Record<string, string> = {
  Jotunheimen: 'Consider the Gjendebu, Memurubu, Glitterheim and surrounding DNT network.',

  Nordmarka:
    'Consider Kikutstua or Ullevålseter for day stops; overnight cabin availability is limited.',

  Hardangervidda: 'Consider the Krækkja, Sandhaug and Litlos self-service/staffed cabin network.',

  Lofoten: 'DNT cabin options are limited. Consider legal camping or suitable local accommodation.',

  Rondane: 'Rondvassbu and Dørålseter are important options depending on season and opening dates.',

  Lyngsalpene:
    'Cabin availability is limited. Carry suitable backup equipment for independent travel.',

  Trollheimen: 'Consider the Gjevilvasshytta, Jøldalshytta and Trollheimshytta network.',

  Lysefjorden:
    'Preikestolen is heavily day-use oriented. Consider staying farther from the main trailhead.',
};

/* -------------------------------------------------------------------------- */
/* Overnight                                                                   */
/* -------------------------------------------------------------------------- */

function overnightFor(values: PlannerFormValues): string {
  if (values.includeCabinStay) {
    const cabinHint =
      CABIN_HINTS[values.destination] ??
      'Check nearby DNT or self-service cabins and confirm opening dates and availability before departure.';

    return `Cabin option: ${cabinHint}`;
  }

  if (values.season === 'winter') {
    return (
      'Winter overnight: use a suitable mountain cabin or winter-capable shelter. ' +
      'Check weather and avalanche conditions before choosing a camping location.'
    );
  }

  return (
    'Camping option: camp responsibly and follow current Norwegian outdoor-access ' +
    'and local restrictions. Keep well away from inhabited houses and avoid sensitive areas.'
  );
}

/* -------------------------------------------------------------------------- */
/* Packing list                                                                */
/* -------------------------------------------------------------------------- */

function packingList(values: PlannerFormValues): string[] {
  const shared = [
    'Paper map plus offline map/GPX backup',
    'Headlamp',
    'First-aid kit',
    'Emergency bivy or emergency shelter',
    'Windproof and waterproof outer layer',
    'Enough food and drinking water for the planned section',
    'Charged phone and power bank',
  ];

  if (values.season === 'winter') {
    return [
      ...shared,
      'Winter-capable clothing and spare insulation',
      'Suitable skis or snowshoes for the route',
      'Goggles and face protection',
      'Cold-weather stove and fuel if camping',
      'Avalanche equipment and appropriate training if entering avalanche terrain',
    ];
  }

  const warmSeason = [
    ...shared,
    'Sun protection',
    'Insect protection where appropriate',
    'Trekking poles if useful for the terrain',
  ];

  if (values.includeCabinStay) {
    warmSeason.push(
      'DNT key if required',
      'Cabin sleeping liner',
      'Small towel and cabin footwear',
    );
  } else {
    warmSeason.push(
      'Three-season tent suitable for expected conditions',
      'Sleeping bag and sleeping mat',
      'Stove and fuel',
    );
  }

  if (values.experienceLevel === 'beginner') {
    warmSeason.push('Allow additional time for navigation and weather changes');
  }

  return warmSeason;
}

/* -------------------------------------------------------------------------- */
/* Days                                                                        */
/* -------------------------------------------------------------------------- */

function buildDays(
  values: PlannerFormValues,
  placeName: string,
  weatherNote: string,
  concise: boolean,
): ItineraryDay[] {
  const baseDistance =
    values.experienceLevel === 'beginner' ? 8 : values.experienceLevel === 'intermediate' ? 12 : 16;

  const baseGain =
    values.experienceLevel === 'beginner'
      ? 250
      : values.experienceLevel === 'intermediate'
        ? 500
        : 850;

  return Array.from({ length: values.durationDays }, (_, index) => {
    const day = index + 1;
    const isFirst = day === 1;
    const isLast = day === values.durationDays;
    const winter = values.season === 'winter';

    let title = `Explore ${placeName}`;

    let summary = `Follow suitable marked routes around ${placeName}. Check the forecast and route conditions before setting out.`;

    if (isFirst) {
      title = winter
        ? `Winter approach near ${placeName}`
        : `Arrival and introductory hike near ${placeName}`;

      summary = winter
        ? 'Start conservatively. Check avalanche forecasts, daylight, snow conditions and the weather window before committing to longer terrain.'
        : 'Use the first day to establish a comfortable pace, check navigation and adapt the plan to current conditions.';
    } else if (isLast) {
      title = `Return and travel buffer from ${placeName}`;

      summary =
        'Keep enough time for the return journey. Allow for slower travel, weather changes and transport delays.';
    } else if (values.includeCabinStay) {
      title = `Cabin-to-cabin stage ${day - 1}`;

      summary =
        'Travel between suitable DNT or self-service cabin areas where available. Confirm opening status, access and booking requirements before departure.';
    } else {
      title = `Full hiking day near ${placeName}`;

      summary =
        'Choose a route appropriate for your experience and current conditions. Keep a conservative turnaround time and maintain a navigation backup.';
    }

    const distanceAdjustment = isFirst || isLast ? -2 : 1;

    const normalSummary = concise ? summary.split('. ')[0] + '.' : summary;

    return {
      day,
      title,
      summary: normalSummary,
      distanceKm: Math.round((baseDistance + distanceAdjustment) * 10) / 10,
      elevationGainM: isFirst ? Math.round(baseGain * 0.6) : baseGain,
      overnight: overnightFor(values),
      weatherNote,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Generate plan                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Generate a hiking itinerary from the planner form.
 *
 * `settings` is optional so existing calls such as:
 *
 *   generatePlan(values)
 *
 * continue to work.
 *
 * The PlannerPage can also use:
 *
 *   generatePlan(values, {
 *     concise: true,
 *     emphasizeSafety: true,
 *   })
 */
export async function generatePlan(
  values: PlannerFormValues,
  settings: GeneratePlanSettings = {},
): Promise<GeneratedPlan> {
  const { concise = false, emphasizeSafety = true } = settings;

  /* ------------------------------------------------------------------------ */
  /* Resolve destination                                                       */
  /* ------------------------------------------------------------------------ */

  const places = await searchKartverketPlace(values.destination);

  const place = places[0];

  const latitude = place?.latitude ?? DEFAULT_COORDINATES.lat;

  const longitude = place?.longitude ?? DEFAULT_COORDINATES.lon;

  /* ------------------------------------------------------------------------ */
  /* Fetch live weather                                                        */
  /* ------------------------------------------------------------------------ */

  const forecast = await fetchMetForecast(latitude, longitude);

  const currentInstant = forecast.properties.timeseries[0]?.data.instant.details;

  const temp = currentInstant?.air_temperature ?? 0;

  const wind = currentInstant?.wind_speed ?? 0;

  const precip =
    forecast.properties.timeseries[0]?.data.next_6_hours?.details?.precipitation_amount ?? 0;

  const weatherNote =
    `${temp.toFixed(1)}°C, wind ${wind.toFixed(1)} m/s, ` +
    `precipitation ${precip.toFixed(1)} mm over the next 6 hours (MET.no).`;

  /* ------------------------------------------------------------------------ */
  /* Destination information                                                   */
  /* ------------------------------------------------------------------------ */

  const placeName = place?.name ?? values.destination;

  const municipality = place?.municipality ?? 'Norway';

  const county = place?.county ?? 'Norway';

  /* ------------------------------------------------------------------------ */
  /* Overview                                                                  */
  /* ------------------------------------------------------------------------ */

  const overviewParts = [
    `${values.durationDays}-day hiking plan for ${placeName} (${municipality}, ${county}).`,
    `Experience level: ${values.experienceLevel}.`,
    `Season: ${values.season === 'winter' ? 'winter' : 'summer/autumn'}.`,
    values.includeCabinStay ? 'Cabin options included.' : 'Independent camping considered.',
    weatherNote,
  ];

  const overview = concise
    ? [overviewParts[0], overviewParts[3], overviewParts[4]].join(' ')
    : overviewParts.join(' ');

  /* ------------------------------------------------------------------------ */
  /* Safety                                                                    */
  /* ------------------------------------------------------------------------ */

  const safetyDisclaimers: string[] = [];

  if (emphasizeSafety) {
    safetyDisclaimers.push(
      'This itinerary is planning assistance, not professional mountain-guiding advice.',

      'Weather, snow, river crossings, trail conditions and transport can change quickly. Check current conditions immediately before departure.',

      'Check MET.no and relevant Norwegian mountain/weather warnings before travelling.',

      'Turn around when visibility, weather, timing or physical conditions make continuing unsafe.',

      'Carry offline navigation and do not rely on mobile coverage in remote areas.',

      'Call 112 for emergencies requiring police or rescue assistance and 113 for medical emergencies.',
    );

    if (values.season === 'winter') {
      safetyDisclaimers.push(
        'For winter trips, check avalanche conditions before entering avalanche terrain and only travel there with appropriate knowledge and equipment.',

        'Winter travel requires appropriate clothing, navigation, daylight planning and equipment for the actual snow and weather conditions.',
      );
    }

    if (values.experienceLevel === 'beginner') {
      safetyDisclaimers.push(
        'As a beginner, choose conservative routes, allow extra time and establish a clear turnaround time before starting.',
      );
    }
  } else {
    safetyDisclaimers.push(
      'Check current weather, route conditions and local restrictions before departure.',
      'Turn around if conditions become unsafe.',
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Allemannsretten                                                           */
  /* ------------------------------------------------------------------------ */

  const allemannsrettenNotes = [
    'Respect the Norwegian right of access and the duties that come with it.',
    'Keep your distance from homes and cabins and respect local restrictions and cultivated land.',
    'Follow local fire restrictions and seasonal campfire rules.',
    'Do not leave litter or toilet waste where it can affect people, animals or water sources.',
    'Avoid disturbing wildlife, nesting birds and grazing animals.',
    'Use established paths and campsites where appropriate in sensitive or heavily visited areas.',
  ];

  /* ------------------------------------------------------------------------ */
  /* Return generated plan                                                     */
  /* ------------------------------------------------------------------------ */

  return {
    id: `plan-${values.destination}-${values.durationDays}-${Date.now()}`,

    title:
      `${values.destination} · ${values.durationDays} day` +
      `${values.durationDays === 1 ? '' : 's'}`,

    region: values.destination,

    season: values.season,

    experienceLevel: values.experienceLevel,

    durationDays: values.durationDays,

    includeCabinStay: values.includeCabinStay,

    overview,

    days: buildDays(values, placeName, weatherNote, concise),

    packingList: packingList(values),

    safetyDisclaimers,

    allemannsrettenNotes,

    generatedAt: new Date().toISOString(),
  };
}
