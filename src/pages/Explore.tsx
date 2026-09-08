import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Drawer,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { filterTrails } from '@/api/trails';
import { fetchMetForecast } from '@/api/metNo';
import { fetchDynamicNorwegianAreas } from '@/api/kartverket';
import { fetchStationDepartures } from '@/api/enturDepartures';

import { useAppState } from '@/context/AppStateContext';

import type { Trail, TrailDifficulty, NorwegianRegion } from '@/types';
import type { KartverketPlace, MetLocationForecast } from '@/types/schemas';

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
    quay: {
      publicCode: string | null;
    } | null;
    serviceJourney: {
      line: {
        publicCode: string;
        name: string | null;
        transportMode: string;
      };
    };
  }>;
}

const WATER_LABEL: Record<Trail['waterSources'][number]['safety'], string> = {
  treated: 'Treated / tap',
  filter: 'Filter recommended',
  boil: 'Boil recommended',
  avoid: 'Avoid',
};

const STATION_ID_FALLBACKS: Record<string, string> = {
  sognsvann: 'NSR:StopPlace:59887',
};

export function ExplorePage() {
  const { saveRoute } = useAppState();
  const { colorScheme } = useMantineColorScheme();

  const isDark = colorScheme === 'dark';

  const [region, setRegion] = useState<NorwegianRegion | 'all'>('all');
  const [difficulty, setDifficulty] = useState<TrailDifficulty | 'all'>('all');
  const [duration, setDuration] = useState<'all' | 'half' | 'full' | 'long'>('all');

  const [destinations, setDestinations] = useState<KartverketPlace[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  const [trails, setTrails] = useState<Trail[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  const [selected, setSelected] = useState<Trail | null>(null);

  const [forecast, setForecast] = useState<MetLocationForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [stationData, setStationData] = useState<StopPlaceData | null>(null);
  const [loadingTransit, setLoadingTransit] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setLoadingDestinations(true);

    fetchDynamicNorwegianAreas()
      .then((data) => {
        if (isMounted) {
          setDestinations(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load Kartverket destinations:', error);

        if (isMounted) {
          setDestinations([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingDestinations(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    setLoadingTrails(true);

    filterTrails({
      region,
      difficulty,
      duration,
    })
      .then((data) => {
        if (isMounted) {
          setTrails(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load trails:', error);

        if (isMounted) {
          setTrails([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingTrails(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [region, difficulty, duration]);

  useEffect(() => {
    if (!selected) {
      setForecast(null);
      setStationData(null);
      setLoadingWeather(false);
      setLoadingTransit(false);
      return;
    }

    const trail = selected;
    let isMounted = true;

    setForecast(null);
    setStationData(null);
    setLoadingWeather(true);
    setLoadingTransit(true);

    fetchMetForecast(trail.latitude, trail.longitude)
      .then((data) => {
        if (isMounted) {
          setForecast(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load weather:', error);

        if (isMounted) {
          setForecast(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingWeather(false);
        }
      });

    async function loadTransitData() {
      try {
        let stopPlaceId = STATION_ID_FALLBACKS[trail.id];

        if (!stopPlaceId) {
          const nearestQuery = `
            {
              nearest(
                latitude: ${trail.latitude},
                longitude: ${trail.longitude},
                maximumDistance: 30000
              ) {
                edges {
                  node {
                    place {
                      ... on StopPlace {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          `;

          const nearestRes = await fetch('https://api.entur.io/journey-planner/v3/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ET-Client-Name': 'nordictrail-app',
            },
            body: JSON.stringify({
              query: nearestQuery,
            }),
          });

          if (!nearestRes.ok) {
            throw new Error(`Entur API error: ${nearestRes.status}`);
          }

          const nearestJson = await nearestRes.json();
          const edges = nearestJson?.data?.nearest?.edges ?? [];

          if (edges.length > 0) {
            stopPlaceId = edges[0]?.node?.place?.id;
          }
        }

        if (!stopPlaceId) {
          if (isMounted) {
            setStationData(null);
          }

          return;
        }

        const stopData = await fetchStationDepartures(stopPlaceId);

        if (isMounted) {
          setStationData(stopData);
        }
      } catch (error) {
        console.error('Failed to load transit details:', error);

        if (isMounted) {
          setStationData(null);
        }
      } finally {
        if (isMounted) {
          setLoadingTransit(false);
        }
      }
    }

    void loadTransitData();

    return () => {
      isMounted = false;
    };
  }, [selected]);

  const currentDetails = forecast?.properties.timeseries[0]?.data.instant.details;

  const nextSixHours = forecast?.properties.timeseries[0]?.data.next_6_hours;

  const handleResetFilters = () => {
    setRegion('all');
    setDifficulty('all');
    setDuration('all');
  };

  return (
    <Container size="lg" py="xl" px="0">
      <Stack gap="lg">
        <div>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={isDark ? '#eef4f1' : 'dark.7'}>
            Explore Transport
          </Title>

          <Text mt="xs">
            Discover Norwegian hiking areas from live Kartverket data. Open a trail for elevation,
            live MET.no conditions, drinking-water guidance, and real-time public transit access.
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
            Loading Norwegian areas...
          </Text>
        ) : null}

        {!loadingDestinations && destinations.length === 0 ? (
          <Text size="sm" c="dimmed">
            Norwegian destinations are currently unavailable.
          </Text>
        ) : null}

        {loadingTrails ? (
          <Text>Loading trails...</Text>
        ) : trails.length > 0 ? (
          <TrailGrid trails={trails} onSelect={(trail) => setSelected(trail)} />
        ) : (
          <Card withBorder padding="xl" ta="center">
            <Stack gap="sm" align="center">
              <Text fw={500}>No trails match these filters. Try a wider region or duration.</Text>

              <Button variant="outline" size="xs" onClick={handleResetFilters}>
                Reset all filters
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>

      <Drawer
        opened={selected !== null}
        onClose={() => setSelected(null)}
        position="right"
        size="lg"
        title={selected?.name ?? 'Trail'}
      >
        {selected ? (
          <Stack gap="md">
            <Card
              padding={0}
              withBorder
              style={{
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                }}
              >
                <iframe
                  title={`Map of ${selected.name}`}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: isDark
                      ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)'
                      : 'none',
                  }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    selected.longitude - 0.05
                  }%2C${selected.latitude - 0.03}%2C${
                    selected.longitude + 0.05
                  }%2C${selected.latitude + 0.03}&layer=mapnik&marker=${
                    selected.latitude
                  }%2C${selected.longitude}`}
                />
              </div>
            </Card>

            <Text size="sm">{selected.description}</Text>

            <TrailTransitBoard loadingTransit={loadingTransit} stationData={stationData} />

            <Card withBorder>
              <Title order={4}>MET.no live conditions</Title>

              {loadingWeather ? (
                <Text size="sm" mt="xs" c="dimmed">
                  Fetching live weather data...
                </Text>
              ) : currentDetails ? (
                <Stack gap={4} mt="xs">
                  <Text size="sm" fw={500}>
                    {currentDetails.air_temperature.toFixed(1)}°C · Humidity{' '}
                    {currentDetails.relative_humidity}%
                  </Text>

                  <Text size="xs" c="dimmed">
                    Wind: {currentDetails.wind_speed.toFixed(1)} m/s from{' '}
                    {currentDetails.wind_from_direction ?? 'N/A'}° · Pressure:{' '}
                    {currentDetails.air_pressure_at_sea_level ?? 'N/A'} hPa
                  </Text>

                  <Text size="xs" c="dimmed">
                    Cloud cover: {currentDetails.cloud_area_fraction ?? 'N/A'}% · Precip (next 6h):{' '}
                    {nextSixHours?.details?.precipitation_amount ?? 0} mm
                  </Text>
                </Stack>
              ) : (
                <Text size="sm" mt="xs" c="dimmed">
                  Weather data unavailable.
                </Text>
              )}
            </Card>

            <Card withBorder>
              <Title order={4}>Elevation profile</Title>

              <svg
                viewBox="0 0 320 120"
                width="100%"
                height="120"
                role="img"
                aria-label="Elevation profile graph"
              >
                <title>Elevation profile showing altitude changes across distance</title>

                <polyline
                  fill="none"
                  stroke="#2d6a4f"
                  strokeWidth="3"
                  points={selected.elevationProfile
                    .map((point, index, arr) => {
                      const x = (index / Math.max(arr.length - 1, 1)) * 300 + 10;

                      const elevations = arr.map((item) => item.elevationM);

                      const max = Math.max(...elevations);
                      const min = Math.min(...elevations);

                      const y = 100 - ((point.elevationM - min) / Math.max(max - min, 1)) * 80;

                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>

              <Text size="xs">
                Kartverket SSR {selected.kartverketSsrId} · {selected.latitude.toFixed(3)},{' '}
                {selected.longitude.toFixed(3)}
              </Text>
            </Card>

            <Card withBorder>
              <Title order={4}>Water sources</Title>

              {selected.waterSources.map((source) => (
                <Text key={source.name} size="sm" mt="xs">
                  {source.name}: {WATER_LABEL[source.safety]}. {source.note}
                </Text>
              ))}
            </Card>

            <Button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();

                saveRoute({
                  trailId: selected.id,
                  title: selected.name,
                  region: selected.region,
                  notes: selected.description,
                });

                notifications.show({
                  message: `${selected.name} saved in your favorites.`,
                  styles: {
                    root: {
                      backgroundColor: '#28726B',
                    },
                    description: {
                      color: '#FFFFFF',
                    },
                    closeButton: {
                      color: '#FFFFFF',
                    },
                  },
                });
              }}
            >
              Save to favorites
            </Button>
          </Stack>
        ) : null}
      </Drawer>
    </Container>
  );
}
