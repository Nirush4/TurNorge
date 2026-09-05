import type { Trail, TrailDifficulty, NorwegianRegion } from '@/types';

// Your local array of trails
const TRAILS: Trail[] = [
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
  // ... (keep the rest of your trail items here)
];

/**
 * Dynamically simulate an asynchronous data fetch.
 */
export async function listTrails(): Promise<Trail[]> {
  // Simulate network latency to mimic a real database/API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  return TRAILS;
}

/**
 * Filter dynamic trails based on user criteria asynchronously.
 */
export async function filterTrails(filters: {
  region: NorwegianRegion | 'all';
  difficulty: TrailDifficulty | 'all';
  duration: 'all' | 'half' | 'full' | 'long';
}): Promise<Trail[]> {
  const allTrails = await listTrails();

  return allTrails.filter((trail) => {
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
