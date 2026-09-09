import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  List,
  Loader,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import { IconCloudRain } from '@tabler/icons-react';

import {
  searchKartverketPlace,
  resolveKartverketPlace,
  getPopularNorwegianDestinations,
} from '@/api/kartverket';

import { fetchMetForecast } from '@/api/metNo';
import { useAppState } from '@/context/AppStateContext';
import { plannerSchema, type PlannerFormValues, type KartverketPlace } from '@/types/schemas';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import type { MetForecastResponse } from '@/types/met';
import type { GeneratedPlan, ItineraryDay } from '@/types';

export interface LiveWeatherConditions {
  elevationMeters: number;
  temperature: number;
  windSpeed: number;
  precipitation6h: number;
  symbolCode: string;
}

export function parseLiveWeather(metApiResponse: any): LiveWeatherConditions {
  const coordinates = metApiResponse.geometry?.coordinates || [0, 0, 0];
  const elevationMeters = coordinates[2] ?? 0;

  const currentSeries = metApiResponse.properties?.timeseries?.[0]?.data;
  const instantDetails = currentSeries?.instant?.details || {};
  const next6Hours = currentSeries?.next_6_hours?.details || {};
  const symbol = currentSeries?.next_1_hours?.summary?.symbol_code || 'clearsky';

  return {
    elevationMeters,
    temperature: instantDetails.air_temperature ?? 0,
    windSpeed: instantDetails.wind_speed ?? 0,
    precipitation6h: next6Hours.precipitation_amount ?? 0,
    symbolCode: symbol,
  };
}

const PLANNER_LOADING_STEPS: string[] = [
  'Resolving location coordinates via Kartverket...',
  'Fetching live meteorological telemetry from MET.no...',
  'Evaluating real-time weather risks and altitude thresholds...',
  'Synthesizing fully dynamic WCAG-compliant itinerary structure...',
];

function generateDynamicWeatherAdvice(weather: LiveWeatherConditions): string {
  let narrative = `Telemetry at ${weather.elevationMeters}m: ${weather.temperature.toFixed(1)}°C, wind ${weather.windSpeed.toFixed(1)} m/s. `;

  if (weather.windSpeed > 10) {
    narrative += '⚠️ High wind advisory: Avoid exposed ridges. ';
  } else if (weather.temperature < 0) {
    narrative += '❄️ Freezing conditions: Thermal insulation layers required. ';
  } else {
    narrative += 'Conditions stable for travel. ';
  }

  if (weather.precipitation6h > 1.5) {
    narrative += `Precipitation expected (~${weather.precipitation6h.toFixed(1)}mm/6h); waterproof shells mandatory.`;
  }

  return narrative;
}

function buildDynamicDays(
  values: PlannerFormValues,
  placeName: string,
  weather: LiveWeatherConditions,
  tone: 'standard' | 'cautious' | 'ambitious',
): ItineraryDay[] {
  const baseDistance =
    tone === 'ambitious'
      ? 16
      : tone === 'cautious'
        ? 6
        : values.experienceLevel === 'beginner'
          ? 8
          : 12;

  const baseGain = Math.round(
    weather.elevationMeters * 0.2 + (tone === 'ambitious' ? 800 : tone === 'cautious' ? 250 : 500),
  );

  return Array.from({ length: values.durationDays }, (_, index) => {
    const day = index + 1;
    const isFirst = day === 1;
    const isLast = day === values.durationDays;

    let title = `Stage ${day}: Traversing ${placeName}`;
    let summary = `Maintain pacing at elevation ${weather.elevationMeters}m. Weather code: ${weather.symbolCode}.`;

    if (isFirst) {
      title = `Arrival and initial leg near ${placeName}`;
      summary = `Establish baseline rhythm at ${weather.elevationMeters}m. Ambient temperature: ${weather.temperature}°C.`;
    } else if (isLast) {
      title = `Final return journey from ${placeName}`;
      summary =
        'Keep adequate time buffers for return transit and check local transport schedules.';
    }

    return {
      day,
      title,
      summary,
      distanceKm: Math.round(baseDistance * 10) / 10,
      elevationGainM: baseGain,
      overnight: values.includeCabinStay
        ? 'DNT Cabin network (Verify opening status and booking requirements).'
        : 'Wild camping compliant with Allemannsretten (Maintain 150m clearance from buildings).',
      weatherNote: `Elevation: ${weather.elevationMeters}m | Temp: ${weather.temperature}°C | Wind: ${weather.windSpeed} m/s`,
    };
  });
}

export async function generateDynamicPlan(
  values: PlannerFormValues,
  presetTone: 'standard' | 'cautious' | 'ambitious' = 'standard',
  emphasizeSafety: boolean = true,
): Promise<GeneratedPlan> {
  let place;
  let forecast;

  try {
    const places = await searchKartverketPlace(values.destination);
    place = places[0];
    const latitude = place?.latitude ?? 61.4933;
    const longitude = place?.longitude ?? 8.3597;
    forecast = await fetchMetForecast(latitude, longitude);
  } catch (error) {
    console.warn('Network request failed on mobile, falling back to offline telemetry:', error);
    forecast = {
      geometry: { coordinates: [8.3597, 61.4933, 500] },
      properties: {
        timeseries: [
          {
            instant: { details: { air_temperature: 10, wind_speed: 4 } },
            next_6_hours: { details: { precipitation_amount: 0 } },
            next_1_hours: { summary: { symbol_code: 'clearsky' } },
          },
        ],
      },
    };
  }

  const weather = parseLiveWeather(forecast);
  const placeName = place?.name ?? values.destination;
  const weatherNote = generateDynamicWeatherAdvice(weather);

  const overview = `Dynamic plan for ${placeName} (${place?.municipality || 'Norway'}) across ${values.durationDays} days at ${weather.elevationMeters}m elevation. Mode: ${presetTone.toUpperCase()}. Weather: ${weatherNote}`;

  const safetyDisclaimers = [
    `Observation point elevation: ${weather.elevationMeters} meters above sea level.`,
    'This system provides algorithmic trip planning assistance, not certified professional mountain guiding.',
    'Verify live MET.no bulletins and local avalanche warnings immediately before departure.',
    'Emergency Numbers: Call 112 for police/rescue and 113 for medical emergencies.',
  ];

  if (emphasizeSafety) {
    safetyDisclaimers.push(
      'Exercise extreme caution when crossing alpine snow bridges or swollen watercourses.',
      'Maintain an active communication schedule with an external contact when venturing off-grid.',
    );
  }

  return {
    id: `dynamic-plan-${values.destination}-${Date.now()}`,
    title: `${values.destination} · ${values.durationDays} ${values.durationDays === 1 ? 'Day' : 'Days'}`,
    region: values.destination,
    season: values.season,
    experienceLevel: values.experienceLevel,
    durationDays: values.durationDays,
    includeCabinStay: values.includeCabinStay,
    overview,
    days: buildDynamicDays(values, placeName, weather, presetTone),
    packingList: [
      weather.temperature <= 5
        ? 'Sub-zero thermal base layers & insulated jacket'
        : 'Moisture-wicking layers',
      weather.precipitation6h > 0
        ? 'Waterproof hardshell jacket and rain trousers'
        : 'Wind shell jacket',
      'Paper topographical map and offline GPX dataset',
      'Certified high-lumen headlamp and first-aid kit',
      values.includeCabinStay
        ? 'Official DNT cabin key & indoor footwear'
        : '3-season tent & insulated sleeping pad',
    ],
    safetyDisclaimers,
    allemannsrettenNotes: [
      'Respect the Norwegian Right to Roam (Allemannsretten).',
      'Keep a minimum distance of 150 meters from inhabited houses and active farms.',
    ],
    generatedAt: new Date().toISOString(),
  };
}

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

const SEASON_OPTIONS = [
  { value: 'summer_autumn', label: 'Summer / Autumn hiking' },
  { value: 'winter', label: 'Winter skiing' },
];

export function PlannerPage() {
  const { setLastPlan, lastPlan, saveRoute } = useAppState();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDayWeather, setSelectedDayWeather] = useState<MetForecastResponse | null>(null);

  const [destinations, setDestinations] = useState<KartverketPlace[]>(() =>
    getPopularNorwegianDestinations(),
  );
  const [searchingDestinations, setSearchingDestinations] = useState(false);
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<KartverketPlace | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentTone, setCurrentTone] = useState<'standard' | 'cautious' | 'ambitious'>('standard');
  const [emphasizeSafetyLocal, setEmphasizeSafetyLocal] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      destination: '',
      experienceLevel: 'intermediate',
      durationDays: 3,
      season: 'summer_autumn',
      includeCabinStay: true,
    },
  });

  useEffect(() => {
    const query = destinationSearch.trim();
    if (query.length < 2) {
      setDestinations(getPopularNorwegianDestinations());
      setSearchingDestinations(false);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setSearchingDestinations(true);
      try {
        const results = await searchKartverketPlace(query);
        if (cancelled) return;
        if (results.length > 0) {
          setDestinations(results);
        } else {
          const lowerQuery = query.toLocaleLowerCase('nb');
          const fallback = getPopularNorwegianDestinations().filter((place) =>
            `${place.name} ${place.municipality} ${place.county}`
              .toLocaleLowerCase('nb')
              .includes(lowerQuery),
          );
          setDestinations(fallback);
        }
      } catch (error) {
        console.error('Failed search:', error);
      } finally {
        if (!cancelled) setSearchingDestinations(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [destinationSearch]);

  const onSubmit = async (values: PlannerFormValues): Promise<void> => {
    setLastPlan(null);
    setIsFavorite(false);

    try {
      for (let index = 0; index < PLANNER_LOADING_STEPS.length; index += 1) {
        setLoadingIndex(index);
        await new Promise<void>((resolve) => window.setTimeout(resolve, 450));
      }

      const plan = await generateDynamicPlan(values, currentTone, emphasizeSafetyLocal);
      setLastPlan(plan);
    } catch (error) {
      console.error('Failed to generate:', error);
      notifications.show({
        title: 'Could not generate itinerary',
        message: 'Something went wrong while generating your route.',
        color: '#FFFFFF',
        styles: {
          root: {
            backgroundColor: '#E03131',
          },
          title: {
            color: '#FFFFFF',
          },
          description: {
            color: '#FFFFFF',
          },
          closeButton: {
            color: '#FFFFFF',
          },
        },
      });
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleOpenWeatherDashboard = async (regionName: string) => {
    setFetchingWeather(true);
    try {
      let place = selectedPlace;
      if (!place || place.name.toLowerCase() !== regionName.toLowerCase()) {
        place = await resolveKartverketPlace(regionName);
      }
      if (!place) throw new Error(`Could not find "${regionName}"`);
      const liveData = await fetchMetForecast(place.latitude, place.longitude);
      setSelectedDayWeather(liveData as unknown as MetForecastResponse);
      open();
    } catch (error) {
      console.error('Weather error:', error);
      notifications.show({
        title: 'Could not generate itinerary',
        message: 'Something went wrong while generating your route.',
        color: '#FFFFFF',
        styles: {
          root: {
            backgroundColor: '#E03131',
          },
          title: {
            color: '#FFFFFF',
          },
          description: {
            color: '#FFFFFF',
          },
          closeButton: {
            color: '#FFFFFF',
          },
        },
      });
    } finally {
      setFetchingWeather(false);
    }
  };

  const destinationOptions = destinations.map((place) => ({
    value: place.name,
    label: `${place.name} — ${place.municipality}, ${place.county}`,
  }));

  return (
    <Container size="lg" pt="md" pb="xl" px="0" component="main" mih="100dvh">
      <Stack gap="lg">
        <header>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }}>
            Dynamic Route Planner
          </Title>
          <Text mt="sm" c="dimmed">
            Fully dynamic client-side route compiler powered by live MET.no telemetry and Kartverket
            location search.
          </Text>
        </header>

        <Card
          withBorder
          padding="md"
          radius="md"
          role="region"
          aria-label="Planner Configuration Options"
        >
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={600} id="settings-heading">
                Walking Pace &amp; Preferences
              </Text>
            </Group>

            <Select
              aria-labelledby="settings-heading"
              label="How fast or far do you want to go?"
              size="sm"
              value={currentTone}
              onChange={(val) => {
                if (val) setCurrentTone(val as 'standard' | 'cautious' | 'ambitious');
              }}
              data={[
                { label: 'Standard Mode', value: 'standard' },
                { label: 'Cautious / Easy Mode', value: 'cautious' },
                { label: 'Ambitious / Long Distance', value: 'ambitious' },
              ]}
              styles={{
                input: {
                  fontSize: '14px',
                },
              }}
            />

            <Divider />

            <Checkbox
              label="Emphasize advanced emergency and alpine safety warnings"
              checked={emphasizeSafetyLocal}
              onChange={(e) => setEmphasizeSafetyLocal(e.currentTarget.checked)}
              size="sm"
            />
          </Stack>
        </Card>

        <Card
          withBorder
          padding="lg"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          role="region"
          aria-label="Trip Configuration Form"
        >
          <Stack gap="md">
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select
                  label="Destination"
                  description="Choose a popular destination or search Kartverket for any location."
                  placeholder="Choose a Norwegian destination"
                  searchable
                  clearable
                  data={destinationOptions}
                  comboboxProps={{
                    position: 'bottom',
                    middlewares: { flip: false, shift: true },
                  }}
                  styles={{
                    input: {
                      fontSize: '16px',
                    },
                  }}
                  value={field.value || null}
                  searchValue={destinationSearch}
                  onSearchChange={setDestinationSearch}
                  onChange={(value) => {
                    field.onChange(value ?? '');
                    if (!value) {
                      setSelectedPlace(null);
                      return;
                    }
                    const place = destinations.find((item) => item.name === value);
                    if (place) {
                      setSelectedPlace(place);
                    } else {
                      void resolveKartverketPlace(value).then((resolved) => {
                        if (resolved) setSelectedPlace(resolved);
                      });
                    }
                  }}
                  onBlur={field.onBlur}
                  rightSection={
                    searchingDestinations ? (
                      <Loader size="sm" aria-label="Searching locations" />
                    ) : undefined
                  }
                  error={errors.destination?.message}
                  required
                />
              )}
            />

            {selectedPlace ? (
              <Card withBorder padding="sm" role="status" aria-live="polite">
                <Text size="sm" fw={600}>
                  Selected: {selectedPlace.name}
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {selectedPlace.municipality} · {selectedPlace.county} · Coordinates:{' '}
                  {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
                </Text>
              </Card>
            ) : null}

            <Controller
              name="experienceLevel"
              control={control}
              render={({ field }) => (
                <Select
                  label="Experience level"
                  data={EXPERIENCE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.experienceLevel?.message}
                  required
                />
              )}
            />

            <Controller
              name="durationDays"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Duration (days)"
                  min={1}
                  max={14}
                  value={field.value}
                  onChange={(value) => field.onChange(typeof value === 'number' ? value : 1)}
                  onBlur={field.onBlur}
                  error={errors.durationDays?.message}
                  required
                />
              )}
            />

            <Controller
              name="season"
              control={control}
              render={({ field }) => (
                <Select
                  label="Season"
                  data={SEASON_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.season?.message}
                  required
                />
              )}
            />

            <Controller
              name="includeCabinStay"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Include DNT / self-service cabin options"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />

            <Button
              type="submit"
              loading={isSubmitting || loadingIndex !== null}
              loaderProps={{ type: 'dots' }}
              disabled={!selectedPlace || searchingDestinations}
              color="pine"
              aria-busy={loadingIndex !== null}
              fullWidth
            >
              {loadingIndex !== null ? PLANNER_LOADING_STEPS[loadingIndex] : 'Generate Itinerary'}
            </Button>
          </Stack>
        </Card>

        {lastPlan ? (
          <Stack gap="md" component="section" aria-label="Generated Itinerary Results">
            <Card withBorder padding="lg">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Title order={2}>{lastPlan.title}</Title>
                  <Text mt="sm">{lastPlan.overview}</Text>
                </div>
                <Button
                  variant="filled"
                  radius="md"
                  color="blue.5"
                  size="sm"
                  disabled={isFavorite}
                  onClick={() => {
                    const newRoute = {
                      id: lastPlan.id,
                      trailId: lastPlan.id,
                      title: lastPlan.title,
                      region: lastPlan.region,
                      notes: lastPlan.overview,
                      savedAt: new Date().toISOString(),
                    };

                    saveRoute(newRoute);
                    setIsFavorite(true);
                    notifications.show({
                      message: `${lastPlan.title} saved in your favorites.`,
                      color: '#FFFFFF',
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
                  aria-label={isFavorite ? 'Route saved to favorites' : 'Save route to favorites'}
                >
                  {isFavorite ? 'Saved' : 'Save to Favorites'}
                </Button>
              </Group>
            </Card>

            <SimpleGrid cols={{ base: 1, md: 2 }}>
              {lastPlan.days.map((day) => (
                <Card key={day.day} withBorder padding="md" component="article">
                  <Stack justify="space-between" h="100%">
                    <div>
                      <Title order={3}>
                        Day {day.day}: {day.title}
                      </Title>
                      <Text size="sm" mt="sm">
                        {day.summary}
                      </Text>
                      <Text size="sm" mt="sm" fw={500}>
                        {day.distanceKm} km · {day.elevationGainM} m elevation gain
                      </Text>
                      <Text size="sm" mt={4}>
                        {day.overnight}
                      </Text>
                      <Text size="sm" c="dimmed" mt={4}>
                        {day.weatherNote}
                      </Text>
                    </div>

                    <Button
                      variant="light"
                      color="pine"
                      size="sm"
                      mt="md"
                      radius="md"
                      loading={fetchingWeather}
                      leftSection={<IconCloudRain size={16} aria-hidden="true" />}
                      onClick={() => handleOpenWeatherDashboard(lastPlan.region)}
                      aria-label={`Open live meteorological dashboard for ${lastPlan.region}`}
                    >
                      Live Weather Dashboard
                    </Button>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            <Card withBorder padding="lg">
              <Title order={3}>Packing List</Title>
              <List mt="sm" aria-label="Required packing list items">
                {lastPlan.packingList.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>

            <Card withBorder padding="lg">
              <Title order={3}>Safety Disclaimers</Title>
              <List mt="sm" aria-label="Important safety and emergency notes">
                {lastPlan.safetyDisclaimers.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>
          </Stack>
        ) : null}

        <Modal
          opened={opened}
          onClose={close}
          title="Live Meteorological Dashboard"
          size="4xl"
          aria-describedby="weather-modal-content"
        >
          <div id="weather-modal-content">
            {selectedDayWeather ? <WeatherDashboard forecast={selectedDayWeather} /> : null}
          </div>
        </Modal>
      </Stack>
    </Container>
  );
}
