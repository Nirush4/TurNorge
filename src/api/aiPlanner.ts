import { getMockMetForecast, summarizeForecast } from '@/api/metNo';
import { getKartverketPlaceByRegion } from '@/api/kartverket';
import type { GeneratedPlan, ItineraryDay } from '@/types';
import type { PlannerFormValues } from '@/types/schemas';

const LOADING_STEPS = [
  'Analyzing MET.no weather patterns...',
  'Checking Allemannsretten trail regulations...',
  'Mapping DNT and self-service cabin availability...',
  'Composing a day-by-day itinerary...',
] as const;

export const PLANNER_LOADING_STEPS: readonly string[] = LOADING_STEPS;

const CABIN_HINTS: Record<PlannerFormValues['destination'], string> = {
  Jotunheimen: 'Gjendebu / Memurubu / Glitterheim corridor',
  Nordmarka: 'Kikutstua or Ullevålseter day stops (limited overnight cabins)',
  Hardangervidda: 'Krækkja, Sandhaug, or Litlos self-service network',
  Lofoten: 'Limited DNT; plan coastal rorbuer or legal wild camps 150 m from houses',
  Rondane: 'Rondvassbu and Dørålseter staffed season',
  Lyngsalpene: 'Few staffed huts; carry a four-season tent as backup',
  Trollheimen: 'Gjevilvasshytta – Jøldalshytta – Trollheimshytta triangle',
  Lysefjorden: 'Preikestolen area is day-use heavy; overnight farther from the trailhead',
};

function overnightFor(values: PlannerFormValues): string {
  if (values.includeCabinStay) {
    return `DNT / self-service option: ${CABIN_HINTS[values.destination]} (confirm opening hours).`;
  }
  if (values.season === 'winter') {
    return 'Snow-shelter or mountain cabin only — wild camping on snow requires avalanche-aware siting.';
  }
  return 'Legal wild camp: tent more than 150 m from inhabited houses, leave no trace, one-night ethic in popular spots.';
}

function packingList(values: PlannerFormValues): string[] {
  const shared = [
    'Paper map (Kartverket N50) plus offline GPX',
    'Headlamp, first aid, emergency bivy',
    '1+ litre bottles and a filter or iodine',
    'Windproof layer even in July',
  ];

  if (values.season === 'winter') {
    return [
      ...shared,
      'Metal-edged skis or snowshoes, transceiver/probe/shovel if avalanche terrain',
      'Extra insulation and a stove that works in cold',
      'Goggles and a buff for spindrift',
    ];
  }

  const summer = [
    ...shared,
    'Mosquito headnet for plateau evenings',
    'Sun protection on snowfields and water',
  ];

  if (values.experienceLevel === 'beginner') {
    summer.push('Trekking poles and a conservative turnaround time');
  }
  if (values.includeCabinStay) {
    summer.push('DNT key, silk liner, and cabin slippers');
  } else {
    summer.push('Three-season tent, stove, and bear-safe food storage habits (foxes/crows)');
  }
  return summer;
}

function buildDays(values: PlannerFormValues, weatherNote: string): ItineraryDay[] {
  const place = getKartverketPlaceByRegion(values.destination);
  const baseDistance =
    values.experienceLevel === 'beginner' ? 8 : values.experienceLevel === 'intermediate' ? 12 : 16;
  const baseGain =
    values.experienceLevel === 'beginner' ? 250 : values.experienceLevel === 'intermediate' ? 500 : 850;

  return Array.from({ length: values.durationDays }, (_, index) => {
    const day = index + 1;
    const isFirst = day === 1;
    const isLast = day === values.durationDays;
    const winter = values.season === 'winter';

    let title = `Traverse near ${place.name}`;
    let summary = `Follow marked DNT routes around ${values.destination}. Stay on cairns in poor visibility.`;

    if (isFirst) {
      title = winter ? `Ski approach to ${place.name}` : `Arrive and shake-down near ${place.name}`;
      summary = winter
        ? `Check avalanche varsom.no, freeze-thaw crust, and daylight. Keep the first ski day short.`
        : `Register intentions, refill treated water, and walk an easy loop to calibrate pace and weather.`;
    } else if (isLast) {
      title = 'Exit, waste check, and travel buffer';
      summary =
        'Build a weather window for boats, buses, or mountain-pass roads. Pack out all waste including toilet paper.';
    } else if (values.includeCabinStay) {
      title = `Cabin-to-cabin stage ${day - 1}`;
      summary = `Move between staffed or self-service cabins. Book peak-season beds; carry a backup tent if unlocked cabins are full.`;
    }

    return {
      day,
      title,
      summary,
      distanceKm: Math.round((baseDistance + (isFirst || isLast ? -2 : 1)) * 10) / 10,
      elevationGainM: isFirst ? Math.round(baseGain * 0.6) : baseGain,
      overnight: overnightFor(values),
      weatherNote,
    };
  });
}

export async function generatePlan(
  values: PlannerFormValues,
  options: { concise: boolean; emphasizeSafety: boolean },
): Promise<GeneratedPlan> {
  const forecast = getMockMetForecast(values.destination);
  const summary = summarizeForecast(forecast);
  const weatherNote = `${summary.temperatureC.toFixed(1)}°C, wind ${summary.windMs.toFixed(1)} m/s, precip ${summary.precipitationMm.toFixed(1)} mm (MET.no schema mock).`;
  const place = getKartverketPlaceByRegion(values.destination);

  const overview = options.concise
    ? `${values.durationDays}-day ${values.destination} plan from ${place.name} (${place.mapSheet}). ${weatherNote}`
    : `Local-first plan for ${values.destination} using Kartverket place ${place.name} (${place.municipality}, ${place.county}, ${place.mapSheet}) and a MET Norway-style locationforecast. ${weatherNote} Experience: ${values.experienceLevel}. This is decision support, not a mountain guide.`;

  const safetyDisclaimers = [
    'NordicTrail AI is a free public utility simulation. Conditions change; verify MET Norway, Kartverket, DNT, and varsom.no before you go.',
    'Allemannsretten is a right with duties: no damage, no litter, no disturbance, and extra care on farmland and nesting bird islands.',
    'Call 112 for police/rescue and 113 for medical emergencies. In the mountains, also notify local tourist offices if you change plans.',
  ];

  if (options.emphasizeSafety || values.experienceLevel === 'beginner') {
    safetyDisclaimers.push(
      'Turn around if visibility collapses, river crossings rise, or anyone in the party is behind schedule before 14:00 in shoulder season.',
    );
  }
  if (values.season === 'winter') {
    safetyDisclaimers.push(
      'Winter travel can include avalanche terrain. Without education and rescue gear, stay on marked, low-angle ski tracks.',
    );
  }

  return {
    id: `plan-${values.destination}-${values.durationDays}-${Date.now()}`,
    title: `${values.destination} · ${values.durationDays} day${values.durationDays > 1 ? 's' : ''}`,
    region: values.destination,
    season: values.season,
    experienceLevel: values.experienceLevel,
    durationDays: values.durationDays,
    includeCabinStay: values.includeCabinStay,
    overview,
    days: buildDays(values, weatherNote),
    packingList: packingList(values),
    safetyDisclaimers,
    allemannsrettenNotes: [
      'Camp at least 150 metres from inhabited houses (friluftsloven).',
      'Campfires are banned or restricted from 15 April to 15 September; use stoves and check municipal bålforbud.',
      'Human waste: bury or pack out; never near water sources used for drinking.',
    ],
    generatedAt: new Date().toISOString(),
  };
}
