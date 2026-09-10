import { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Card,
  Container,
  Drawer,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Badge,
  useMantineColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { fetchDynamicNorwegianAreas } from '@/api/kartverket';
import { fetchMetForecast } from '@/api/metNo';
import { fetchNearestStationDepartures } from '@/api/enturDepartures';

import { useAppState } from '@/context/AppStateContext';
import type { KartverketPlace, MetLocationForecast } from '@/types/schemas';
import type { TrailDifficulty } from '@/types';
import { ExploreFilters } from '@/components/explore/ExploreFilters';
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

  useEffect(() => {
    let isMounted = true;
    setLoadingDestinations(true);

    fetchDynamicNorwegianAreas()
      .then((data) => {
        if (isMounted) setDestinations(data);
      })
      .catch((error) => {
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

  const filteredDestinations = useMemo(() => {
    return destinations.filter((place) => {
      const matchRegion = region === 'all' || place.name.toLowerCase() === region.toLowerCase();
      return matchRegion;
    });
  }, [destinations, region]);

  useEffect(() => {
    if (!selectedPlace) {
      setForecast(null);
      setStationData(null);
      setLoadingWeather(false);
      setLoadingTransit(false);
      return;
    }

    let isMounted = true;
    setLoadingWeather(true);
    setLoadingTransit(true);

    fetchMetForecast(selectedPlace.latitude, selectedPlace.longitude)
      .then((data) => {
        if (isMounted) setForecast(data);
      })
      .catch((error) => {
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
      .catch((err) => {
        console.error('Failed to load Entur transit details:', err);
        if (isMounted) setStationData(null);
      })
      .finally(() => {
        if (isMounted) setLoadingTransit(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedPlace]);

  const currentDetails = forecast?.properties.timeseries[0]?.data.instant.details;
  const nextSixHours = forecast?.properties.timeseries[0]?.data.next_6_hours;

  return (
    <Container size="lg" py="md" px="0" component="main" mih="100dvh">
      <Stack gap="lg">
        <div>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={isDark ? '#eef4f1' : 'dark.7'}>
            Live Norwegian Explore
          </Title>
          <Text mt="xs">
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
          <Text size="sm" c="dimmed">
            Querying Kartverket database...
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {filteredDestinations.map((place) => (
              <Card key={place.ssrId} withBorder padding="lg">
                <Group justify="space-between">
                  <Badge color="pine">{place.county}</Badge>
                  <Badge variant="light">{place.municipality}</Badge>
                </Group>
                <Title order={3} mt="sm">
                  {place.name}
                </Title>
                <Text size="sm" mt="xs" c="dimmed">
                  Coordinates: {place.latitude.toFixed(2)}, {place.longitude.toFixed(2)}
                </Text>
                <Button mt="md" onClick={() => setSelectedPlace(place)}>
                  Open Live Conditions
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <Drawer
        opened={selectedPlace !== null}
        onClose={() => setSelectedPlace(null)}
        position="right"
        size="lg"
        title={selectedPlace?.name ?? 'Location'}
      >
        {selectedPlace ? (
          <Stack gap="md">
            <Card padding={0} withBorder style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <iframe
                  title={`Map of ${selectedPlace.name}`}
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
              <Title order={4}>MET.no Live Weather Forecast</Title>
              {loadingWeather ? (
                <Text size="sm" mt="xs" c="dimmed">
                  Fetching real-time atmospheric data...
                </Text>
              ) : currentDetails ? (
                <Stack gap={4} mt="xs">
                  <Text size="sm" fw={500}>
                    {currentDetails.air_temperature?.toFixed(1) ?? 'N/A'}°C · Humidity{' '}
                    {currentDetails.relative_humidity ?? 'N/A'}%
                  </Text>
                  <Text size="xs" c="dimmed">
                    Wind: {currentDetails.wind_speed?.toFixed(1) ?? 'N/A'} m/s · Pressure:{' '}
                    {currentDetails.air_pressure_at_sea_level ?? 'N/A'} hPa
                  </Text>
                  <Text size="xs" c="dimmed">
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
              onClick={() => {
                saveRoute({
                  trailId: selectedPlace.ssrId,
                  title: selectedPlace.name,
                  region: selectedPlace.municipality,
                  notes: `Saved destination at lat: ${selectedPlace.latitude}, lon: ${selectedPlace.longitude}`,
                });
                notifications.show({
                  message: `${selectedPlace.name} saved successfully!`,
                  color: 'teal',
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
