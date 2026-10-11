import { useEffect, useState, useMemo, type JSX } from 'react';
import { Button, Container, Group, Stack, Text, Title, Loader, Box } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

import { fetchDynamicNorwegianAreas } from '@/lib/api/kartverket';
import { fetchMetForecast } from '@/lib/api/metNo';
import { fetchNearestStationDepartures } from '@/lib/api/enturDepartures';
import { fetchNorwegianShops } from '@/lib/api/shops';

import type { KartverketPlace, MetLocationForecast } from '@/types/schemas';
import type { TrailDifficulty } from '@/types';
import type { ShopItem } from '@/types/shopItemSchema';

import { ExploreFilters } from '@/components/explore/ExploreFilters';
import { TrailGrid } from '@/components/explore/TrailGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColors } from '@/hooks/useThemeColors';
import { showAppNotification } from '@/utils/notifications';

import { mapDestinationsToTrails, type StopPlaceData } from '@/components/explore/exploreUtils';
import { TrailDetailDrawer } from '@/components/explore/TrailDetailDrawer';

export function ExplorePage(): JSX.Element {
  const { addFavorite } = useFavorites();
  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const simpleCardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
  };

  const [region, setRegion] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<TrailDifficulty | 'all'>('all');
  const [duration, setDuration] = useState<'all' | 'half' | 'full' | 'long'>('all');

  const [destinations, setDestinations] = useState<KartverketPlace[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  const [selectedPlace, setSelectedPlace] = useState<KartverketPlace | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [savedFavorite, setSavedFavorite] = useState(false);

  const [forecast, setForecast] = useState<MetLocationForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [stationData, setStationData] = useState<StopPlaceData | null>(null);
  const [loadingTransit, setLoadingTransit] = useState(false);

  const [shops, setShops] = useState<ShopItem[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [visibleShopCount, setVisibleShopCount] = useState(5);

  const [visibleTrailCount, setVisibleTrailCount] = useState(10);

  useEffect(() => {
    let isMounted = true;
    setLoadingDestinations(true);

    fetchDynamicNorwegianAreas()
      .then((data) => {
        if (isMounted) setDestinations(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to load Kartverket areas:', error);
        if (isMounted) setDestinations([]);
      })
      .finally(() => {
        if (isMounted) setLoadingDestinations(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setVisibleTrailCount(10);
  }, [region, difficulty, duration]);

  const mappedTrails = useMemo(() => mapDestinationsToTrails(destinations), [destinations]);

  const filteredTrails = useMemo(() => {
    return mappedTrails.filter((trail) => {
      const matchDifficulty = difficulty === 'all' || trail.difficulty === difficulty;

      let matchDuration = true;
      if (duration === 'half') matchDuration = trail.durationHours <= 4;
      if (duration === 'full') matchDuration = trail.durationHours > 4 && trail.durationHours <= 8;
      if (duration === 'long') matchDuration = trail.durationHours > 8;

      let matchRegion = true;
      if (region !== 'all') {
        const searchTarget = region.toLowerCase();
        const trailName = trail.name.toLowerCase();
        const trailRegion = trail.region.toLowerCase();
        matchRegion =
          trailName === searchTarget ||
          trailRegion === searchTarget ||
          searchTarget.includes(trailName) ||
          searchTarget.includes(trailRegion);
      }

      return matchDifficulty && matchDuration && matchRegion;
    });
  }, [mappedTrails, difficulty, duration, region]);

  const displayedTrails = useMemo(() => {
    return filteredTrails.slice(0, visibleTrailCount);
  }, [filteredTrails, visibleTrailCount]);

  const hasMoreTrails = visibleTrailCount < filteredTrails.length;

  const selectedTrail = useMemo(() => {
    if (!selectedPlace) return null;
    return (
      mappedTrails.find((t) => t.id === selectedPlace.ssrId || t.name === selectedPlace.name) ??
      null
    );
  }, [selectedPlace, mappedTrails]);

  useEffect(() => {
    setSavedFavorite(false);

    if (!selectedPlace) {
      setForecast(null);
      setStationData(null);
      setShops([]);
      setLoadingWeather(false);
      setLoadingTransit(false);
      setLoadingShops(false);
      setVisibleShopCount(5);
      return;
    }

    let isMounted = true;
    setLoadingWeather(true);
    setLoadingTransit(true);
    setLoadingShops(true);
    setVisibleShopCount(5);

    fetchMetForecast(selectedPlace.latitude, selectedPlace.longitude)
      .then((data) => {
        if (isMounted) setForecast(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to load MET.no weather:', error);
        if (isMounted) setForecast(null);
      })
      .finally(() => {
        if (isMounted) setLoadingWeather(false);
      });

    fetchNearestStationDepartures(
      selectedPlace.latitude,
      selectedPlace.longitude,
      selectedPlace.name,
    )
      .then((data) => {
        if (isMounted) setStationData(data);
      })
      .catch((err: unknown) => {
        console.error('Failed to load Entur transit details:', err);
        if (isMounted) setStationData(null);
      })
      .finally(() => {
        if (isMounted) setLoadingTransit(false);
      });

    fetchNorwegianShops(selectedPlace.latitude, selectedPlace.longitude)
      .then((shopList: ShopItem[]) => {
        if (isMounted) setShops(shopList);
      })
      .catch((err: unknown) => {
        console.error('Failed to load nearby shops:', err);
        if (isMounted) setShops([]);
      })
      .finally(() => {
        if (isMounted) setLoadingShops(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedPlace]);

  const currentDetails = forecast?.properties.timeseries[0]?.data.instant.details;

  const displayedShops = useMemo(() => shops.slice(0, visibleShopCount), [shops, visibleShopCount]);
  const hasMoreShops = visibleShopCount < shops.length;

  const handleSaveDestination = async () => {
    if (!selectedPlace) return;
    setSavingFavorite(true);

    const { error } = await addFavorite({
      location_name: selectedPlace.name,
      location_lat: selectedPlace.latitude,
      location_lng: selectedPlace.longitude,
      elevation_m: null,
      trip_duration_days: null,
      mode: selectedTrail?.difficulty ? selectedTrail.difficulty.toUpperCase() : 'STANDARD',
      external_ref_id: selectedPlace.ssrId ?? null,
      external_provider: 'kartverket',
      notes: `Saved destination at lat: ${selectedPlace.latitude}, lon: ${selectedPlace.longitude}`,
      snapshot_temp_c: currentDetails?.air_temperature ?? null,
      snapshot_wind_mps: currentDetails?.wind_speed ?? null,
      snapshot_condition: null,
    });

    setSavingFavorite(false);

    if (error) {
      showAppNotification({
        message: `Could not save favorite: ${error}`,
        isError: true,
      });
      return;
    }

    setSavedFavorite(true);
    showAppNotification({
      message: `${selectedPlace.name} saved in your favorites`,
      isError: false,
    });
  };

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Stack gap="lg">
        <div>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={headingColor}>
            Live Norwegian Explore
          </Title>
          <Text mt="xs" fz="lg" c={bodyColor}>
            Direct integration with Kartverket maps, MET.no weather stations, and Entur live
            transport networks.
          </Text>
        </div>

        <ExploreFilters
          destinations={destinations}
          region={region}
          setRegion={setRegion}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          duration={duration}
          setDuration={setDuration}
        />

        {loadingDestinations ? (
          <Box role="status" aria-live="polite" py="md">
            <Group gap="xs">
              <Loader size="sm" color="teal" />
              <Text size="md" c={bodyColor}>
                Querying Kartverket database...
              </Text>
            </Group>
          </Box>
        ) : (
          <Stack gap="md" aria-live="polite">
            <Text size="lg" c={bodyColor} id="results-count-announcement">
              Showing {displayedTrails.length} of {filteredTrails.length} available trails
            </Text>

            <Box>
              <TrailGrid
                trails={displayedTrails}
                onSelect={(trail) => {
                  const matchedPlace = destinations.find(
                    (d) => d.ssrId === trail.id || d.name === trail.name,
                  );
                  if (matchedPlace) setSelectedPlace(matchedPlace);
                }}
              />
            </Box>

            {hasMoreTrails && (
              <Group justify="center" mt="md">
                <Button
                  variant="default"
                  color="pine"
                  size="md"
                  leftSection={<IconChevronDown size={16} />}
                  onClick={() => setVisibleTrailCount((prev) => prev + 10)}
                  aria-label="Load more destination trails"
                  style={{
                    backgroundColor: cardBackground,
                    color: headingColor,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  Load More Trails ({filteredTrails.length - visibleTrailCount} remaining)
                </Button>
              </Group>
            )}
          </Stack>
        )}
      </Stack>

      <TrailDetailDrawer
        selectedPlace={selectedPlace}
        selectedTrail={selectedTrail}
        forecast={forecast}
        loadingWeather={loadingWeather}
        stationData={stationData}
        loadingTransit={loadingTransit}
        shops={shops}
        displayedShops={displayedShops}
        loadingShops={loadingShops}
        hasMoreShops={hasMoreShops}
        savingFavorite={savingFavorite}
        savedFavorite={savedFavorite}
        isDark={isDark}
        headingColor={headingColor}
        bodyColor={bodyColor}
        cardBackground={cardBackground}
        borderColor={borderColor}
        simpleCardStyle={simpleCardStyle}
        onClose={() => setSelectedPlace(null)}
        onLoadMoreShops={() => setVisibleShopCount((prev) => prev + 5)}
        onSaveFavorite={handleSaveDestination}
      />
    </Container>
  );
}
