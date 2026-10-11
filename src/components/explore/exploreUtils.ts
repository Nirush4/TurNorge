import type { KartverketPlace } from '@/types/schemas';
import type { TrailDifficulty, Trail } from '@/types';

export interface StopPlaceData {
  name: string;
  id: string;
  estimatedCalls: Array<{
    expectedDepartureTime: string;
    aimedDepartureTime: string;
    realtime: boolean;
    quay: { publicCode: string | null } | null;
    serviceJourney: {
      line: {
        publicCode: string;
        name: string | null;
        transportMode: string;
      };
    };
  }>;
}

export const mapDestinationsToTrails = (destinations: KartverketPlace[]): Trail[] => {
  const difficulties: TrailDifficulty[] = ['easy', 'moderate', 'demanding', 'expert'];
  const durations = [
    { hours: 3, label: 'Half day' },
    { hours: 6, label: 'Full day' },
    { hours: 10, label: 'Long day' },
  ];
  const highlightSets = [
    ['Fjord Vista', 'Summit Ridge', 'Alpine Flora'],
    ['Glacial Valley', 'Waterfall Cascade', 'Historic Cairn'],
    ['Coastal Panorama', 'Sheltered Cove', 'Ridge Crossing'],
    ['High Plateau', 'Crystal Tarn', 'Reindeer Grazing Area'],
  ];

  return destinations.map((place, index) => {
    const hash = Math.abs(Math.sin(place.latitude + place.longitude) * 10000);
    const assignedDifficulty = difficulties[Math.floor(hash % difficulties.length)];
    const assignedDuration = durations[Math.floor(hash % durations.length)];
    const assignedHighlights = highlightSets[Math.floor(hash % highlightSets.length)];

    return {
      id: place.ssrId ?? String(index),
      name: place.name,
      region: place.municipality || place.county || 'Norway',
      difficulty: assignedDifficulty,
      description: `Official Kartverket registry object (Map Sheet: ${place.mapSheet || 'N/A'}). Located at coordinates (${place.latitude.toFixed(4)}°N, ${place.longitude.toFixed(4)}°E) within ${place.municipality || 'Norwegian backcountry'}.`,
      distanceKm: Number((6 + (hash % 14)).toFixed(1)),
      durationHours: assignedDuration.hours,
      durationLabel: assignedDuration.label,
      elevationGainM: Math.round(180 + (hash % 850)),
      latitude: place.latitude,
      longitude: place.longitude,
      highlights: assignedHighlights,
      waterSources: [],
      elevationProfile: [],
      kartverketSsrId: place.ssrId,
    };
  });
};
