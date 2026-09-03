import type { Trail, TrailDifficulty } from '@/types';
import type { NorwegianRegion } from '@/types';

export const TRAILS: Trail[] = [
  {
    id: 'besseggen',
    name: 'Besseggen Ridge',
    region: 'Jotunheimen',
    difficulty: 'demanding',
    durationHours: 8,
    durationLabel: 'Full day',
    distanceKm: 14,
    elevationGainM: 1100,
    description:
      'Classic knife-edge traverse between Gjende and Bessvatnet with steep exposure and unforgettable turquoise views.',
    highlights: ['Knife-edge ridge', 'Boat across Gjende', 'High alpine weather'],
    waterSources: [
      { name: 'Bessvatnet shoreline', safety: 'filter', note: 'Clear but glacial silt possible.' },
      { name: 'Gjendesheim tap', safety: 'treated', note: 'Use cabin/staffed water before start.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 995 },
      { km: 3, elevationM: 1280 },
      { km: 6, elevationM: 1743 },
      { km: 9, elevationM: 1460 },
      { km: 14, elevationM: 984 },
    ],
    kartverketSsrId: 'SSR-1501',
    latitude: 61.5,
    longitude: 8.82,
  },
  {
    id: 'sognsvann-ullevaalseeter',
    name: 'Sognsvann to Ullevålseter',
    region: 'Nordmarka',
    difficulty: 'easy',
    durationHours: 3,
    durationLabel: 'Half day',
    distanceKm: 9,
    elevationGainM: 180,
    description:
      'Forest gravel and boardwalk close to Oslo, ideal for first-time Right to Roam practice and year-round commuting hikers.',
    highlights: ['Marka blue trail', 'Kiosk at Ullevålseter', 'Lake swim spots'],
    waterSources: [
      { name: 'Sognsvann kiosk', safety: 'treated', note: 'Municipal drinking water.' },
      { name: 'Forest streams', safety: 'boil', note: 'Avoid after heavy rain near trails.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 198 },
      { km: 4, elevationM: 280 },
      { km: 9, elevationM: 240 },
    ],
    kartverketSsrId: 'SSR-2210',
    latitude: 59.973,
    longitude: 10.729,
  },
  {
    id: 'hardanger-finse',
    name: 'Finse to Krækkja plateau',
    region: 'Hardangervidda',
    difficulty: 'moderate',
    durationHours: 7,
    durationLabel: 'Full day',
    distanceKm: 18,
    elevationGainM: 420,
    description:
      'Open tundra walking with cairns, reindeer country, and sudden whiteouts even in July.',
    highlights: ['Cairned plateau', 'DNT cabins', 'Arctic-alpine flora'],
    waterSources: [
      { name: 'Snowmelt becks', safety: 'filter', note: 'High plateau, low livestock density.' },
      { name: 'Krækkja cabin', safety: 'treated', note: 'Cabin water when staffed/open.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 1222 },
      { km: 8, elevationM: 1350 },
      { km: 18, elevationM: 1290 },
    ],
    kartverketSsrId: 'SSR-3302',
    latitude: 60.602,
    longitude: 7.504,
  },
  {
    id: 'reinebringen',
    name: 'Reinebringen',
    region: 'Lofoten',
    difficulty: 'moderate',
    durationHours: 3,
    durationLabel: 'Half day',
    distanceKm: 3.4,
    elevationGainM: 448,
    description:
      'Steep stone-stair ascent above Reine. Short, crowded, and spectacular; turn back in high winds.',
    highlights: ['Sherpa stairs', 'Fjord panorama', 'Coastal wind'],
    waterSources: [
      { name: 'Reine village', safety: 'treated', note: 'Fill bottles before the stairs.' },
      { name: 'Ridge seeps', safety: 'avoid', note: 'Unreliable and heavily trafficked.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 12 },
      { km: 1.2, elevationM: 250 },
      { km: 1.7, elevationM: 448 },
    ],
    kartverketSsrId: 'SSR-4411',
    latitude: 67.932,
    longitude: 13.089,
  },
  {
    id: 'rondane-rondvassbu',
    name: 'Rondvassbu circuit',
    region: 'Rondane',
    difficulty: 'moderate',
    durationHours: 6,
    durationLabel: 'Full day',
    distanceKm: 16,
    elevationGainM: 650,
    description:
      'Dry, rocky national-park walking with Rondeslottet massif views and well-marked DNT routes.',
    highlights: ['National park', 'Dry climate', 'Staffed cabin hub'],
    waterSources: [
      { name: 'Rondvatnet', safety: 'filter', note: 'Lake water; filter for sediment.' },
      { name: 'Rondvassbu', safety: 'treated', note: 'Cabin tap when open.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 1174 },
      { km: 7, elevationM: 1480 },
      { km: 16, elevationM: 1174 },
    ],
    kartverketSsrId: 'SSR-5520',
    latitude: 61.875,
    longitude: 9.795,
  },
  {
    id: 'lyngen-blamann',
    name: 'Blåmannen approach',
    region: 'Lyngsalpene',
    difficulty: 'expert',
    durationHours: 10,
    durationLabel: 'Long day',
    distanceKm: 12,
    elevationGainM: 1400,
    description:
      'Steep alpine terrain above Lyngenfjord. Glacier-adjacent; not a casual hike. Local conditions change fast.',
    highlights: ['Arctic alpine', 'Glacier proximity', 'Midnight sun season'],
    waterSources: [
      { name: 'Meltwater gullies', safety: 'filter', note: 'Glacial silt common.' },
      { name: 'Valley farms', safety: 'avoid', note: 'Do not take water from private yards.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 20 },
      { km: 5, elevationM: 900 },
      { km: 8, elevationM: 1420 },
      { km: 12, elevationM: 20 },
    ],
    kartverketSsrId: 'SSR-6634',
    latitude: 69.576,
    longitude: 20.219,
  },
  {
    id: 'trollheimen-triangle',
    name: 'Trollheimen triangle (day 1)',
    region: 'Trollheimen',
    difficulty: 'demanding',
    durationHours: 7,
    durationLabel: 'Full day',
    distanceKm: 15,
    elevationGainM: 780,
    description:
      'First leg of the famous cabin triangle: forest, high lakes, and reliable DNT waymarking.',
    highlights: ['Cabin-to-cabin', 'Red Ts', 'Lake basins'],
    waterSources: [
      { name: 'Gjevilvatnet', safety: 'filter', note: 'Large lake; filter recommended.' },
      { name: 'Cabin kitchens', safety: 'treated', note: 'Self-service water when unlocked.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 700 },
      { km: 6, elevationM: 1100 },
      { km: 15, elevationM: 890 },
    ],
    kartverketSsrId: 'SSR-7745',
    latitude: 62.689,
    longitude: 9.382,
  },
  {
    id: 'preikestolen',
    name: 'Preikestolen',
    region: 'Lysefjorden',
    difficulty: 'moderate',
    durationHours: 4,
    durationLabel: 'Half day',
    distanceKm: 8,
    elevationGainM: 500,
    description:
      'Norway’s most famous cliff plateau. Well-built path, heavy traffic, and serious drop-offs. Stay well back from the edge.',
    highlights: ['Cliff plateau', 'Stone staircases', 'Fjord 604 m below'],
    waterSources: [
      { name: 'Trailhead kiosk', safety: 'treated', note: 'Fill before you climb.' },
      { name: 'Mountain tarns', safety: 'boil', note: 'High visitor load in summer.' },
    ],
    elevationProfile: [
      { km: 0, elevationM: 270 },
      { km: 2, elevationM: 430 },
      { km: 4, elevationM: 604 },
    ],
    kartverketSsrId: 'SSR-8856',
    latitude: 58.986,
    longitude: 6.188,
  },
];

export function listTrails(): Trail[] {
  return TRAILS;
}

export function filterTrails(filters: {
  region: NorwegianRegion | 'all';
  difficulty: TrailDifficulty | 'all';
  duration: 'all' | 'half' | 'full' | 'long';
}): Trail[] {
  return TRAILS.filter((trail) => {
    const regionOk = filters.region === 'all' || trail.region === filters.region;
    const difficultyOk = filters.difficulty === 'all' || trail.difficulty === filters.difficulty;
    const durationOk =
      filters.duration === 'all' ||
      (filters.duration === 'half' && trail.durationHours <= 4) ||
      (filters.duration === 'full' && trail.durationHours > 4 && trail.durationHours <= 8) ||
      (filters.duration === 'long' && trail.durationHours > 8);
    return regionOk && difficultyOk && durationOk;
  });
}
