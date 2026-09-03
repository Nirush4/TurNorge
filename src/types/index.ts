import type {
  EXPERIENCE_LEVELS,
  NORWEGIAN_REGIONS,
  SEASONS,
  TRAIL_DIFFICULTIES,
  WATER_SAFETY,
} from './schemas';

export type NorwegianRegion = (typeof NORWEGIAN_REGIONS)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type Season = (typeof SEASONS)[number];
export type TrailDifficulty = (typeof TRAIL_DIFFICULTIES)[number];
export type WaterSafety = (typeof WATER_SAFETY)[number];

export interface ElevationPoint {
  km: number;
  elevationM: number;
}

export interface Trail {
  id: string;
  name: string;
  region: NorwegianRegion;
  difficulty: TrailDifficulty;
  durationHours: number;
  durationLabel: string;
  distanceKm: number;
  elevationGainM: number;
  description: string;
  highlights: string[];
  waterSources: Array<{
    name: string;
    safety: WaterSafety;
    note: string;
  }>;
  elevationProfile: ElevationPoint[];
  kartverketSsrId: string;
  latitude: number;
  longitude: number;
}

export interface SavedRoute {
  id: string;
  trailId?: string;
  title: string;
  region: NorwegianRegion;
  savedAt: string;
  notes: string;
}

export interface AiSettings {
  conciseItineraries: boolean;
  emphasizeSafety: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
  distanceKm: number;
  elevationGainM: number;
  overnight: string;
  weatherNote: string;
}

export interface GeneratedPlan {
  id: string;
  title: string;
  region: NorwegianRegion;
  season: Season;
  experienceLevel: ExperienceLevel;
  durationDays: number;
  includeCabinStay: boolean;
  overview: string;
  days: ItineraryDay[];
  packingList: string[];
  safetyDisclaimers: string[];
  allemannsrettenNotes: string[];
  generatedAt: string;
}
