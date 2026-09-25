export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  location: string | null;
  home_lat: number | null;
  home_lng: number | null;
  unit_preference: 'metric' | 'imperial';
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  location_name: string;
  location_lat: number | null;
  location_lng: number | null;
  elevation_m: number | null;
  trip_duration_days: number | null;
  mode: string;
  external_ref_id: string | null;
  external_provider: string | null;
  notes: string | null;
  snapshot_temp_c: number | null;
  snapshot_wind_mps: number | null;
  snapshot_condition: string | null;
  added_at: string;
  last_synced_at: string | null;
}
