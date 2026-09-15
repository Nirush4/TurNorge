import { useEffect, useState } from 'react';
import { fetchNearbyAmenities, type AmenityItem } from '@/api/overpass';

interface UseAmenitiesOptions {
  lat: number;
  lon: number;
  radius?: number;
  destinationName?: string;
}

interface UseAmenitiesResult {
  data: AmenityItem[];
  loading: boolean;
  error: string | null;
  source: 'live' | 'fallback' | null;
}

export function useAmenities({
  lat,
  lon,
  radius = 3000,
  destinationName,
}: UseAmenitiesOptions): UseAmenitiesResult {
  const [data, setData] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'fallback' | null>(null);

  useEffect(() => {
    if (!lat || !lon) {
      setData([]);
      setLoading(false);
      setError(null);
      setSource(null);
      return;
    }

    // Deps are primitives, so this only re-runs when the destination really
    // changes - not on every parent render. Identical concurrent lookups are
    // deduped inside fetchNearbyAmenities, so StrictMode's double-invoke in
    // development costs one Overpass query, not two.
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchNearbyAmenities({ lat, lon, radius, destinationName, signal: controller.signal })
      .then((result) => {
        setData(result.data);
        setSource(result.source);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return; // superseded, ignore
        console.error('useAmenities: failed to load amenities', err);
        setError('Unable to load nearby shops right now.');
        setData([]);
        setSource(null);
        setLoading(false);
      });

    return () => controller.abort();
  }, [lat, lon, radius, destinationName]);

  return { data, loading, error, source };
}
