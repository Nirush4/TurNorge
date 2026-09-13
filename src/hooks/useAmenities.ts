import { fetchNearbyAmenities, type AmenityItem } from '@/api/overpass';
import { useState, useEffect, useCallback } from 'react';

interface UseAmenitiesProps {
  lat: number;
  lon: number;
  radius?: number;
}

export const useAmenities = ({ lat, lon, radius }: UseAmenitiesProps) => {
  const [data, setData] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAmenities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchNearbyAmenities({ lat, lon, radius });
      setData(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, radius]);

  useEffect(() => {
    loadAmenities();
  }, [loadAmenities]);

  return { data, loading, error, refetch: loadAmenities };
};
