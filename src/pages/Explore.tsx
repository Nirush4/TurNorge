import { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Card,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  List,
  ThemeIcon,
  useMantineColorScheme,
  Loader,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconShoppingBag, IconChevronDown } from '@tabler/icons-react';

import { fetchDynamicNorwegianAreas } from '@/api/kartverket';
import { fetchMetForecast } from '@/api/metNo';
import { fetchNearestStationDepartures } from '@/api/enturDepartures';
import { fetchNorwegianShops } from '@/api/shops';

import { useAppState } from '@/context/AppStateContext';
import type { KartverketPlace, MetLocationForecast } from '@/types/schemas';
import type { TrailDifficulty, Trail } from '@/types';
import type { ShopItem } from '@/types/shopItemSchema';

import { ExploreFilters } from '@/components/explore/ExploreFilters';
import { TrailGrid } from '@/components/explore/TrailGrid';
import { TrailTransitBoard } from '@/components/explore/TrailTransitBoard';

interface StopPlaceData {
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

// Pure mapping utility to keep component lean and decoupled
const mapDestinationsToTrails = (destinations: KartverketPlace[]): Trail[] => {
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

export function ExplorePage() {
  const { saveRoute } = useAppState();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [region, setRegion] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<TrailDifficulty | 'all'>('all');
  const [duration, setDuration] = useState<'all' | 'half' | 'full' | 'long'>('all');

  const [destinations, setDestinations] = useState<KartverketPlace[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  const [selectedPlace, setSelectedPlace] = useState<KartverketPlace | null>(null);

  const [forecast, setForecast] = useState<MetLocationForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [stationData, setStationData] = useState<StopPlaceData | null>(null);
  const [loadingTransit, setLoadingTransit] = useState(false);

  const [shops, setShops] = useState<ShopItem[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [visibleShopCount, setVisibleShopCount] = useState(5);

  const [visibleTrailCount, setVisibleTrailCount] = useState(10);

  // Load destination data on mount
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

  // Reset pagination on filter change
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
    return mappedTrails.find((t) => t.id === selectedPlace.ssrId || t.name === selectedPlace.name);
  }, [selectedPlace, mappedTrails]);

  // Load contextual data for the selected place drawer
  useEffect(() => {
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
  const nextSixHours = forecast?.properties.timeseries[0]?.data.next_6_hours;

  const displayedShops = useMemo(() => shops.slice(0, visibleShopCount), [shops, visibleShopCount]);
  const hasMoreShops = visibleShopCount < shops.length;

  return (
    <Container size="lg" py="md" px="0" pb={70} component="main" mih="100dvh">
      <Stack gap="lg">
        <div>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={isDark ? '#eef4f1' : 'dark.7'}>
            Live Norwegian Explore
          </Title>
          <Text mt="xs" c={isDark ? 'gray.4' : 'dark.3'}>
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
              <Text size="sm" c="dimmed">
                Querying Kartverket database...
              </Text>
            </Group>
          </Box>
        ) : (
          <Stack gap="md" aria-live="polite">
            <Text size="sm" c="dimmed" id="results-count-announcement">
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
                  variant="defalut"
                  color="pine"
                  leftSection={<IconChevronDown size={16} />}
                  onClick={() => setVisibleTrailCount((prev) => prev + 10)}
                  aria-label="Load more destination trails"
                >
                  Load More Trails ({filteredTrails.length - visibleTrailCount} remaining)
                </Button>
              </Group>
            )}
          </Stack>
        )}
      </Stack>

      <Drawer
        opened={selectedPlace !== null}
        onClose={() => setSelectedPlace(null)}
        position="right"
        size="lg"
        title={
          <Text fw={700} fz={{ base: '1.1rem', sm: '1.4rem' }} c={isDark ? 'white' : 'dark'}>
            {selectedPlace?.name ?? 'Location'}
          </Text>
        }
        aria-label={`Details drawer for ${selectedPlace?.name ?? 'selected location'}`}
      >
        {selectedPlace && selectedTrail ? (
          <Stack gap="md" role="region" aria-label="Selected trail information details">
            <Card padding={0} withBorder style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <iframe
                  title={`Interactive geographic map centered on ${selectedPlace.name}`}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: isDark
                      ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)'
                      : 'none',
                  }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPlace.longitude - 0.05}%2C${selectedPlace.latitude - 0.03}%2C${selectedPlace.longitude + 0.05}%2C${selectedPlace.latitude + 0.03}&layer=mapnik&marker=${selectedPlace.latitude}%2C${selectedPlace.longitude}`}
                />
              </div>
            </Card>

            <Card withBorder>
              <Group justify="space-between" mb="xs">
                <Title order={4}>Trail Overview</Title>
                <Badge
                  color="teal"
                  tt="capitalize"
                  aria-label={`Difficulty rating: ${selectedTrail.difficulty}`}
                >
                  {selectedTrail.difficulty}
                </Badge>
              </Group>
              <Text size="sm" c={isDark ? 'gray.3' : 'dark.3'} mb="md">
                {selectedTrail.description}
              </Text>
              <Group grow>
                <div>
                  <Text size="sm" c="dimmed">
                    Distance
                  </Text>
                  <Text size="sm" fw={600}>
                    {selectedTrail.distanceKm} km
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Duration
                  </Text>
                  <Text size="sm" fw={600}>
                    {selectedTrail.durationLabel}
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Elevation Gain
                  </Text>
                  <Text size="sm" fw={600}>
                    {selectedTrail.elevationGainM} m
                  </Text>
                </div>
              </Group>
            </Card>

            <Card withBorder radius="md" p="md" shadow="sm">
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <ThemeIcon color="teal" variant="light" size="lg" radius="md">
                    <IconShoppingBag size={18} />
                  </ThemeIcon>
                  <div>
                    <Title order={5} size="sm">
                      Nearby Supplies & Shops
                    </Title>
                    <Text size="xs" c="dimmed">
                      Local grocery & convenience stores
                    </Text>
                  </div>
                </Group>
                {!loadingShops && shops.length > 0 && (
                  <Badge color="teal" variant="dot" size="sm">
                    {shops.length} found
                  </Badge>
                )}
              </Group>

              {loadingShops ? (
                <Stack py="sm" gap={4} role="status" aria-live="polite">
                  <Group gap="xs">
                    <Loader size="xs" color="teal" />
                    <Text size="sm" c="dimmed">
                      Searching for nearby stores...
                    </Text>
                  </Group>
                </Stack>
              ) : displayedShops.length > 0 ? (
                <Stack gap="sm">
                  <List
                    spacing="sm"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon
                        color="teal"
                        size={26}
                        radius="xl"
                        variant="filled"
                        aria-hidden="true"
                      >
                        <IconShoppingBag size={15} />
                      </ThemeIcon>
                    }
                  >
                    {displayedShops.map((shop) => (
                      <List.Item key={shop.id}>
                        <Group justify="space-between" wrap="nowrap" gap="xs">
                          <Text size="sm" fw={500} lineClamp={1}>
                            {shop.name}
                          </Text>
                          <Badge size="xs" variant="light" color="teal" tt="capitalize">
                            {shop.shopType}
                          </Badge>
                        </Group>
                      </List.Item>
                    ))}
                  </List>

                  {hasMoreShops && (
                    <Button
                      variant="light"
                      color="teal"
                      size="xs"
                      fullWidth
                      mt="xs"
                      onClick={() => setVisibleShopCount((prev) => prev + 5)}
                      aria-label="Load more nearby shops"
                    >
                      View more shops ({shops.length - visibleShopCount} remaining)
                    </Button>
                  )}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed" fs="italic">
                  No supermarkets or convenience stores found within 15km. This location may be in a
                  remote mountain or wilderness area—consider stocking up in nearby towns before
                  heading out!
                </Text>
              )}
            </Card>

            <Card withBorder>
              <Title order={4}>MET.no Live Weather Forecast</Title>
              {loadingWeather ? (
                <Text size="sm" mt="xs" c="dimmed" role="status" aria-live="polite">
                  Fetching real-time atmospheric data...
                </Text>
              ) : currentDetails ? (
                <Stack gap={4} mt="xs" role="region" aria-label="Current weather details">
                  <Text size="sm" fw={500}>
                    {currentDetails.air_temperature?.toFixed(1) ?? 'N/A'}°C · Humidity{' '}
                    {currentDetails.relative_humidity ?? 'N/A'}%
                  </Text>
                  <Text size="sm" c={isDark ? 'gray.4' : 'dimmed'}>
                    Wind: {currentDetails.wind_speed?.toFixed(1) ?? 'N/A'} m/s · Pressure:{' '}
                    {currentDetails.air_pressure_at_sea_level ?? 'N/A'} hPa
                  </Text>
                  <Text size="sm" c={isDark ? 'gray.4' : 'dimmed'}>
                    Precipitation (next 6h): {nextSixHours?.details?.precipitation_amount ?? 0} mm
                  </Text>
                </Stack>
              ) : (
                <Text size="sm" mt="xs" c="dimmed">
                  Weather info currently unreachable.
                </Text>
              )}
            </Card>

            <TrailTransitBoard loadingTransit={loadingTransit} stationData={stationData} />

            <Button
              aria-label={`Save ${selectedPlace.name} to your favorites list`}
              onClick={() => {
                saveRoute({
                  trailId: selectedPlace.ssrId,
                  title: selectedPlace.name,
                  region: selectedPlace.municipality,
                  notes: `Saved destination at lat: ${selectedPlace.latitude}, lon: ${selectedPlace.longitude}`,
                });

                notifications.show({
                  message: `${selectedPlace.name} saved in your favorites`,
                  styles: {
                    root: { backgroundColor: '#28726B' },
                    description: { color: '#FFFFFF' },
                    closeButton: { color: '#FFFFFF' },
                  },
                });
              }}
            >
              Save Destination to Favorites
            </Button>
          </Stack>
        ) : null}
      </Drawer>
    </Container>
  );
}
