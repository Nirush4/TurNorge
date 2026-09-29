import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { AiSettings, GeneratedPlan, SavedRoute } from '@/types';

interface AppStateContextValue {
  aiSettings: AiSettings;
  setAiSettings: (settings: AiSettings) => void;
  savedRoutes: SavedRoute[];
  setSavedRoutes: (routes: SavedRoute[] | ((current: SavedRoute[]) => SavedRoute[])) => void;
  saveRoute: (route: Omit<SavedRoute, 'id' | 'savedAt'>) => void;
  removeRoute: (id: string) => void;
  lastPlan: GeneratedPlan | null;
  setLastPlan: (plan: GeneratedPlan | null) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

const DEFAULT_SETTINGS: AiSettings = {
  conciseItineraries: false,
  emphasizeSafety: true,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [aiSettings, setAiSettings] = useLocalStorage<AiSettings>({
    key: 'nordictrail-ai-settings',
    defaultValue: DEFAULT_SETTINGS,
  });
  const [savedRoutes, setSavedRoutes] = useLocalStorage<SavedRoute[]>({
    key: 'nordictrail-saved-routes',
    defaultValue: [],
  });
  const [lastPlan, setLastPlan] = useState<GeneratedPlan | null>(null);

  const saveRoute = useCallback(
    (route: Omit<SavedRoute, 'id' | 'savedAt'>) => {
      setSavedRoutes((current) => {
        const list = Array.isArray(current) ? current : [];

        const exists = list.some((r) => r.trailId === route.trailId);
        if (exists) {
          return list;
        }

        const next: SavedRoute = {
          ...route,
          id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          savedAt: new Date().toISOString(),
        };
        const updated = [next, ...list].slice(0, 24);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('favoritesUpdated'));
        }

        return updated;
      });
    },
    [setSavedRoutes],
  );

  const removeRoute = useCallback(
    (targetId: string) => {
      setSavedRoutes((current) => {
        const list = Array.isArray(current) ? current : [];
        const updated = list.filter((route) => route.id !== targetId && route.trailId !== targetId);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('favoritesUpdated'));
        }

        return updated;
      });
    },
    [setSavedRoutes],
  );

  const value = useMemo(
    () => ({
      aiSettings,
      setAiSettings,
      savedRoutes,
      setSavedRoutes,
      saveRoute,
      removeRoute,
      lastPlan,
      setLastPlan,
    }),
    [aiSettings, lastPlan, removeRoute, saveRoute, savedRoutes, setAiSettings, setSavedRoutes],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
