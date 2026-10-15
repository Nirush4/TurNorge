export const COVER_HEIGHT = 300;
export const AVATAR_SIZE = 120;

export interface FavoriteRoute {
  id: string;
  location_name: string;
  mode?: string | null;
  notes?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  trip_duration_days?: number | null;
  elevation_m?: number | null;
  added_at?: string | null;
}
