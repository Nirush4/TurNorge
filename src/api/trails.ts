import type { Trail, TrailDifficulty, NorwegianRegion } from '@/types';

const MOCK_TRAILS: Trail[] = [
  {
    id: 'besseggen',
    name: 'Besseggen Ridge',
    region: 'Jotunheimen',
    difficulty: 'demanding',
    durationHours: 7,
    durationLabel: '7-8 hours',
    distanceKm: 14,
    elevationGainM: 900,
    description: 'Classic ridge hike between Bessvatnet and Gjende with sweeping views.',
    latitude: 61.512,
    longitude: 8.722,
    kartverketSsrId: '123456',
    highlights: [
      'Narrow ridge crossing',
      'Vibrant contrasting lake colors',
      'Historic DNT cabin legacy',
    ],
    elevationProfile: [
      { km: 0, elevationM: 1000 },
      { km: 7, elevationM: 1743 },
      { km: 14, elevationM: 1000 },
    ],
    waterSources: [
      {
        name: 'Stream at trail head',
        safety: 'filter',
        note: 'Clear running water, filter recommended.',
      },
    ],
  },
  {
    id: 'galdhopiggen',
    name: 'Galdhøpiggen Summit',
    region: 'Jotunheimen',
    difficulty: 'demanding',
    durationHours: 6,
    durationLabel: '5-6 hours',
    distanceKm: 10,
    elevationGainM: 1350,
    description: 'Ascend Norway and Northern Europe’s highest peak via Juvvasshytta.',
    latitude: 61.6364,
    longitude: 8.3139,
    kartverketSsrId: '654321',
    highlights: [
      'Highest point in Northern Europe',
      'Panoramic summit view',
      'Glacial crossing elements',
    ],
    elevationProfile: [
      { km: 0, elevationM: 1841 },
      { km: 5, elevationM: 2469 },
      { km: 10, elevationM: 1841 },
    ],
    waterSources: [
      { name: 'Melting snowfield stream', safety: 'boil', note: 'High altitude runoff.' },
    ],
  },
  {
    id: 'sognsvann',
    name: 'Sognsvann Lake Loop',
    region: 'Nordmarka',
    difficulty: 'easy',
    durationHours: 1,
    durationLabel: '1 hour',
    distanceKm: 3.5,
    elevationGainM: 20,
    description: 'Accessible forest and lakeside track just outside Oslo city center.',
    latitude: 59.9705,
    longitude: 10.7495,
    kartverketSsrId: '998877',
    highlights: ['Flat gravel path', 'Great swimming spots', 'Direct subway access (T-bane)'],
    elevationProfile: [
      { km: 0, elevationM: 180 },
      { km: 1.7, elevationM: 190 },
      { km: 3.5, elevationM: 180 },
    ],
    waterSources: [
      { name: 'Filtered tap near station', safety: 'treated', note: 'Safe public taps available.' },
    ],
  },
  {
    id: 'vettisfossen',
    name: 'Vettisfossen Waterfall',
    region: 'Jotunheimen',
    difficulty: 'moderate',
    durationHours: 4,
    durationLabel: '3-4 hours',
    distanceKm: 11,
    elevationGainM: 300,
    description: 'Hike to Norway’s highest unregulated waterfall through Utladalen valley.',
    latitude: 61.3833,
    longitude: 7.9167,
    kartverketSsrId: '445566',
    highlights: [
      'Spectacular 275m vertical drop',
      'Lush valley floor route',
      'Historic farm ruins',
    ],
    elevationProfile: [
      { km: 0, elevationM: 200 },
      { km: 5.5, elevationM: 350 },
      { km: 11, elevationM: 200 },
    ],
    waterSources: [{ name: 'Utla River', safety: 'filter', note: 'Mountain stream runoff.' }],
  },
];

export async function filterTrails(filters: {
  region: NorwegianRegion | 'all';
  difficulty: TrailDifficulty | 'all';
  duration: 'all' | 'half' | 'full' | 'long';
}): Promise<Trail[]> {
  // Simulate network latency matching real regional database requests
  await new Promise((resolve) => setTimeout(resolve, 150));

  return MOCK_TRAILS.filter((trail) => {
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
