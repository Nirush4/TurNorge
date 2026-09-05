import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  Drawer,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { filterTrails } from '@/api/trails';
import { type MetLocationForecast, fetchMetForecast } from '@/api/metNo';
import { useAppState } from '@/context/AppStateContext';
import type { Trail, TrailDifficulty } from '@/types';
import { NORWEGIAN_REGIONS } from '@/types/schemas';
import type { NorwegianRegion } from '@/types';

const WATER_LABEL: Record<Trail['waterSources'][number]['safety'], string> = {
  treated: 'Treated / tap',
  filter: 'Filter recommended',
  boil: 'Boil recommended',
  avoid: 'Avoid',
};

export function ExplorePage() {
  const { saveRoute } = useAppState();
  const [region, setRegion] = useState<NorwegianRegion | 'all'>('all');
  const [difficulty, setDifficulty] = useState<TrailDifficulty | 'all'>('all');
  const [duration, setDuration] = useState<'all' | 'half' | 'full' | 'long'>('all');
  const [selected, setSelected] = useState<Trail | null>(null);

  const [trails, setTrails] = useState<Trail[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  const [forecast, setForecast] = useState<MetLocationForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch trails asynchronously whenever filters change
  useEffect(() => {
    let isMounted = true;
    setLoadingTrails(true);

    filterTrails({ region, difficulty, duration })
      .then((data) => {
        if (isMounted) {
          setTrails(data);
          setLoadingTrails(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingTrails(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [region, difficulty, duration]);

  // Fetch real MET.no forecast whenever a trail is selected
  useEffect(() => {
    if (!selected) {
      setForecast(null);
      return;
    }

    let isMounted = true;
    setLoadingWeather(true);

    fetchMetForecast(selected.latitude, selected.longitude)
      .then((data) => {
        if (isMounted) {
          setForecast(data);
          setLoadingWeather(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingWeather(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selected]);

  const currentDetails = forecast?.properties.timeseries[0]?.data.instant.details;
  const nextSixHours = forecast?.properties.timeseries[0]?.data.next_6_hours;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Explore Trails</Title>
          <Text mt="xs">
            Filter popular Norwegian routes. Open a trail for elevation, live MET.no conditions, and
            drinking-water guidance.
          </Text>
        </div>

        <Card withBorder padding="md">
          <Stack gap="md">
            <Select
              label="Region"
              value={region}
              onChange={(value) => setRegion((value as NorwegianRegion | 'all') ?? 'all')}
              data={[
                { value: 'all', label: 'All regions' },
                ...NORWEGIAN_REGIONS.map((item) => ({ value: item, label: item })),
              ]}
            />
            <SegmentedControl
              aria-label="Difficulty"
              value={difficulty}
              onChange={(value) => setDifficulty(value as TrailDifficulty | 'all')}
              data={[
                { value: 'all', label: 'All grades' },
                { value: 'easy', label: 'Easy' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'demanding', label: 'Demanding' },
                { value: 'expert', label: 'Expert' },
              ]}
            />
            <SegmentedControl
              aria-label="Duration"
              value={duration}
              onChange={(value) => setDuration(value as 'all' | 'half' | 'full' | 'long')}
              data={[
                { value: 'all', label: 'Any length' },
                { value: 'half', label: 'Half day' },
                { value: 'full', label: 'Full day' },
                { value: 'long', label: 'Long day' },
              ]}
            />
          </Stack>
        </Card>

        {loadingTrails ? (
          <Text>Loading trails...</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {trails.map((trail) => (
              <Card key={trail.id} withBorder padding="lg">
                <Group justify="space-between">
                  <Badge color="pine">{trail.region}</Badge>
                  <Badge variant="light">{trail.difficulty}</Badge>
                </Group>
                <Title order={3} mt="sm">
                  {trail.name}
                </Title>
                <Text size="sm" mt="xs">
                  {trail.description}
                </Text>
                <Text size="sm" mt="md">
                  {trail.distanceKm} km · {trail.durationLabel} · {trail.elevationGainM} m gain
                </Text>
                <Button mt="md" onClick={() => setSelected(trail)}>
                  Trail details
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {!loadingTrails && trails.length === 0 ? (
          <Text>No trails match these filters. Try a wider region or duration.</Text>
        ) : null}
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
            <div className="mock-map" aria-label={`Mock map of ${selected.name}`}>
              <div className="mock-map__contour" />
              <div className="mock-map__pin" style={{ left: '58%', top: '42%' }} />
            </div>
            <Text size="sm">{selected.description}</Text>

            <Card withBorder>
              <Title order={4}>MET.no live conditions</Title>
              {loadingWeather ? (
                <Text size="sm" mt="xs" c="dimmed">
                  Fetching live weather data...
                </Text>
              ) : currentDetails ? (
                <Text size="sm" mt="xs">
                  {currentDetails.air_temperature.toFixed(1)}°C · wind{' '}
                  {currentDetails.wind_speed.toFixed(1)} m/s · precip{' '}
                  {nextSixHours?.details?.precipitation_amount ?? 0} mm ·{' '}
                  {nextSixHours?.summary?.symbol_code?.replaceAll('_', ' ') ?? 'Clear'}
                </Text>
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
                aria-label="Elevation profile"
              >
                <polyline
                  fill="none"
                  stroke="#2d6a4f"
                  strokeWidth="3"
                  points={selected.elevationProfile
                    .map((point, index, arr) => {
                      const x = (index / Math.max(arr.length - 1, 1)) * 300 + 10;
                      const max = Math.max(...arr.map((item) => item.elevationM));
                      const min = Math.min(...arr.map((item) => item.elevationM));
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
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                saveRoute({
                  trailId: selected.id,
                  title: selected.name,
                  region: selected.region,
                  notes: selected.description,
                });
                notifications.show({ message: 'Trail saved in your favorites.', color: 'frost' });
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
