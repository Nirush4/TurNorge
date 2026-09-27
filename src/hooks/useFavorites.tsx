import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import type { Favorite } from '@/types/database/types';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (!error && data) setFavorites(data as Favorite[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (id: string) => {
    const previous = favorites;
    setFavorites((prev) => prev.filter((f) => f.id !== id));

    const { error } = await supabase.from('favorites').delete().eq('id', id);

    if (error) {
      setFavorites(previous);
      return { error: error.message };
    }
    return { error: null };
  };

  const addFavorite = async (
    favorite: Omit<Favorite, 'id' | 'user_id' | 'added_at' | 'last_synced_at'>,
  ) => {
    if (!user) return { error: 'You must be logged in to save favorites.' };

    const { data, error } = await supabase
      .from('favorites')
      .insert({ ...favorite, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setFavorites((prev) => [data as Favorite, ...prev]);
    }
    return { error: error?.message ?? null };
  };

  return { favorites, loading, removeFavorite, addFavorite, refetch: fetchFavorites };
}
