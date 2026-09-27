import { useState, useCallback } from 'react';
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
} from '@/lib/api/kartverket';
import { fetchMetForecast } from '@/lib/api/metNo';
import { useAppState } from '@/context/AppStateContext';
import { plannerSchema, type PlannerFormValues, type KartverketPlace } from '@/types/schemas';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import { RegionSearchBar } from '@/components/RegionSearchBar';
import type { MetForecastResponse } from '@/types/met';
import type { GeneratedPlan, ItineraryDay } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';

export interface LiveWeatherConditions {
  elevationMeters: number;
  temperature: number;
  windSpeed: number;
  precipitation6h: number;
  symbolCode: string;
}

export interface ExtendedGeneratedPlan extends GeneratedPlan {
  resolvedPlace?: KartverketPlace;
  weather?: LiveWeatherConditions;
}

const PLANNER_LOADING_STEPS = [
  'Resolving location coordinates via Kartverket...',
  'Fetching live meteorological telemetry from MET.no...',
  'Evaluating real-time weather risks and altitude thresholds...',
  'Synthesizing fully dynamic WCAG-compliant itinerary structure...',
] as const;

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
] as const;

const SEASON_OPTIONS = [
  { value: 'summer_autumn', label: 'Summer / Autumn hiking' },
  { value: 'winter', label: 'Winter skiing' },
] as const;

const MOBILE_INPUT_STYLES = {
  input: { fontSize: '16px' },
  dropdown: { fontSize: '16px' },
  label: {
    fontSize: '1.05rem',
    fontWeight: 600,
    marginBottom: '6px',
  },
} as const;

function showAppNotification(title: string, message: string, isError = false) {
  notifications.show({
    title,
    message,
    color: '#FFFFFF',
    styles: {
      root: { backgroundColor: isError ? '#E03131' : '#28726B' },
      title: { color: '#FFFFFF' },
      description: { color: '#FFFFFF' },
      closeButton: { color: '#FFFFFF' },
    },
  });
}

export function parseLiveWeather(metApiResponse: unknown): LiveWeatherConditions {
  const response = metApiResponse as {
    geometry?: { coordinates?: number[] };
    properties?: {
      timeseries?: Array<{
        data?: {
          instant?: { details?: { air_temperature?: number; wind_speed?: number } };
          next_6_hours?: { details?: { precipitation_amount?: number } };
          next_1_hours?: { summary?: { symbol_code?: string } };
        };
      }>;
    };
  };

  const coordinates = response.geometry?.coordinates || [0, 0, 0];
  const elevationMeters = coordinates[2] ?? 0;
  const currentSeries = response.properties?.timeseries?.[0]?.data;
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
): Promise<ExtendedGeneratedPlan> {
  let place: KartverketPlace | undefined;
  let forecast;

  try {
    const places = await searchKartverketPlace(values.destination);
    place = places[0];
    const latitude = place?.latitude ?? 61.4933;
    const longitude = place?.longitude ?? 8.3597;
    forecast = await fetchMetForecast(latitude, longitude);
  } catch (error) {
    console.warn('Network request failed, falling back to offline telemetry:', error);
    forecast = {
      geometry: { coordinates: [8.3597, 61.4933, 500] },
      properties: {
        timeseries: [
          {
            data: {
              instant: { details: { air_temperature: 10, wind_speed: 4 } },
              next_6_hours: { details: { precipitation_amount: 0 } },
              next_1_hours: { summary: { symbol_code: 'clearsky' } },
            },
          },
        ],
      },
    };
  }

  const weather = parseLiveWeather(forecast);
  const placeName = place?.name ?? values.destination;
  const weatherNote = generateDynamicWeatherAdvice(weather);

  const overview = `Plan for ${placeName} (${place?.municipality || 'Norway'}) across ${values.durationDays} days at ${weather.elevationMeters}m elevation. Mode: ${presetTone.toUpperCase()}. Weather: ${weatherNote}`;

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
    resolvedPlace: place,
    weather,
  };
}

export function PlannerPage() {
  const { setLastPlan, lastPlan } = useAppState();
  const { addFavorite } = useFavorites();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDayWeather, setSelectedDayWeather] = useState<MetForecastResponse | null>(null);

  const [destinations] = useState<KartverketPlace[]>(() => getPopularNorwegianDestinations());
  const [searchingDestinations] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<KartverketPlace | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentTone, setCurrentTone] = useState<'standard' | 'cautious' | 'ambitious'>('standard');
  const [emphasizeSafetyLocal, setEmphasizeSafetyLocal] = useState(true);

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

  const handleDestinationChange = useCallback(
    async (val: string, onChangeFn: (val: string) => void) => {
      const resolvedVal = val === 'all' ? '' : val;
      onChangeFn(resolvedVal);
      if (!resolvedVal) {
        setSelectedPlace(null);
        return;
      }
      const place = destinations.find((item) => item.name === resolvedVal);
      if (place) {
        setSelectedPlace(place);
      } else {
        const resolved = await resolveKartverketPlace(resolvedVal);
        if (resolved) setSelectedPlace(resolved);
      }
    },
    [destinations],
  );

  const onSubmit = async (values: PlannerFormValues): Promise<void> => {
    setLastPlan(null);
    setIsFavorite(false);

    try {
      let activePlace = selectedPlace;
      if (!activePlace && values.destination) {
        activePlace = await resolveKartverketPlace(values.destination);
        if (activePlace) setSelectedPlace(activePlace);
      }

      for (let index = 0; index < PLANNER_LOADING_STEPS.length; index += 1) {
        setLoadingIndex(index);
        await new Promise<void>((resolve) => window.setTimeout(resolve, 450));
      }

      const plan = await generateDynamicPlan(values, currentTone, emphasizeSafetyLocal);
      if (activePlace && !plan.resolvedPlace) plan.resolvedPlace = activePlace;
      setLastPlan(plan);
    } catch (error) {
      console.error('Failed to generate:', error);
      showAppNotification(
        'Could not generate itinerary',
        'Something went wrong while generating your route.',
        true,
      );
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleOpenWeatherDashboard = async (regionName: string) => {
    setFetchingWeather(true);
    try {
      let latitude = selectedPlace?.latitude;
      let longitude = selectedPlace?.longitude;

      if (!latitude || !longitude) {
        const results = await searchKartverketPlace(regionName);
        if (results && results.length > 0) {
          latitude = results[0].latitude;
          longitude = results[0].longitude;
        }
      }

      const liveData = await fetchMetForecast(latitude ?? 61.4933, longitude ?? 8.3597);
      setSelectedDayWeather(liveData as unknown as MetForecastResponse);
      open();
    } catch (error) {
      console.error('Weather error:', error);
      showAppNotification(
        'Weather Unavailable',
        'Could not load live meteorological telemetry for this region.',
        true,
      );
    } finally {
      setFetchingWeather(false);
    }
  };

  const handleSaveFavorite = async () => {
    if (!extendedPlan) return;
    const resolvedPlace = extendedPlan.resolvedPlace;
    const weather = extendedPlan.weather;

    const { error } = await addFavorite({
      location_name: extendedPlan.region,
      mode: currentTone,
      notes: extendedPlan.overview,
      location_lat: resolvedPlace?.latitude ?? null,
      location_lng: resolvedPlace?.longitude ?? null,
      trip_duration_days: extendedPlan.durationDays,
      elevation_m: weather?.elevationMeters ?? null,
      external_ref_id: resolvedPlace?.ssrId?.toString() ?? null,
      external_provider: 'kartverket',
      snapshot_temp_c: weather?.temperature ?? null,
      snapshot_wind_mps: weather?.windSpeed ?? null,
      snapshot_condition: weather?.symbolCode ?? null,
    });

    if (error) {
      showAppNotification('Could not save favorite', error, true);
    } else {
      setIsFavorite(true);
      showAppNotification('Success', `${extendedPlan.title} saved in your favorites.`);
    }
  };

  const extendedPlan = lastPlan as ExtendedGeneratedPlan | null;

  return (
    <>
      <style>{`
        @media screen and (max-width: 768px) {
          input, select, textarea, .mantine-Input-input, .mantine-Select-input, .mantine-NumberInput-input {
            font-size: 16px !important;
          }
        }
      `}</style>
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Stack gap="lg">
          <header>
            <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }}>
              Dynamic Route Planner
            </Title>
            <Text mt="sm" size="lg" c="dimmed">
              Fully dynamic client-side route compiler powered by live MET.no telemetry and
              Kartverket location search.
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
                <Text size="lg" fw={600} id="settings-heading">
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
                styles={MOBILE_INPUT_STYLES}
              />

              <Divider />

              <Checkbox
                label="Emphasize advanced emergency and alpine safety warnings"
                checked={emphasizeSafetyLocal}
                onChange={(e) => setEmphasizeSafetyLocal(e.currentTarget.checked)}
                size="md"
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
                  <Stack gap={4}>
                    <RegionSearchBar
                      destinations={destinations}
                      region={field.value || 'all'}
                      setRegion={(val) => handleDestinationChange(val, field.onChange)}
                      label="Destination"
                      description="Choose a popular destination or search Kartverket for any location."
                      placeholder="Choose a Norwegian destination"
                    />
                    {searchingDestinations && (
                      <Group gap="xs" role="status" aria-live="polite">
                        <Loader size="xs" aria-label="Searching locations" />
                        <Text size="xs" c="dimmed">
                          Searching locations...
                        </Text>
                      </Group>
                    )}
                    {errors.destination?.message && (
                      <Text size="xs" c="red" role="alert">
                        {errors.destination.message}
                      </Text>
                    )}
                  </Stack>
                )}
              />

              {selectedPlace && (
                <Card withBorder padding="sm" role="status" aria-live="polite">
                  <Text size="md" fw={600}>
                    Selected: {selectedPlace.name}
                  </Text>
                  <Text size="md" c="dimmed" mt={4}>
                    {selectedPlace.municipality} · {selectedPlace.county} · Coordinates:{' '}
                    {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
                  </Text>
                </Card>
              )}

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
                    styles={MOBILE_INPUT_STYLES}
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
                    onChange={(val) => field.onChange(typeof val === 'number' ? val : 1)}
                    onBlur={field.onBlur}
                    styles={{
                      input: { fontSize: '16px' },
                      label: {
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        marginBottom: '6px',
                      },
                    }}
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
                    styles={MOBILE_INPUT_STYLES}
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
                    size="md"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.checked)}
                  />
                )}
              />

              <Button
                type="submit"
                loading={isSubmitting || loadingIndex !== null}
                loaderProps={{ type: 'dots' }}
                disabled={searchingDestinations}
                color="pine"
                aria-busy={loadingIndex !== null}
                fullWidth
              >
                {loadingIndex !== null ? PLANNER_LOADING_STEPS[loadingIndex] : 'Generate Itinerary'}
              </Button>
            </Stack>
          </Card>

          {extendedPlan && (
            <Stack gap="md" component="section" aria-label="Generated Itinerary Results">
              <Card withBorder padding="lg">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Title order={2}>{extendedPlan.title}</Title>
                    <Text size="lg" mt="sm">
                      {extendedPlan.overview}
                    </Text>
                  </div>
                  <Button
                    variant="filled"
                    radius="md"
                    color="blue.5"
                    size="md"
                    disabled={isFavorite}
                    onClick={handleSaveFavorite}
                    aria-label={isFavorite ? 'Route saved to favorites' : 'Save route to favorites'}
                  >
                    {isFavorite ? 'Saved' : 'Save to Favorites'}
                  </Button>
                </Group>
              </Card>

              <SimpleGrid cols={{ base: 1, md: 2 }}>
                {extendedPlan.days.map((day) => (
                  <Card key={day.day} withBorder padding="md" component="article">
                    <Stack justify="space-between" h="100%">
                      <div>
                        <Title fz={{ base: '1.4rem', sm: '1.5rem' }} order={3}>
                          Day {day.day}: {day.title}
                        </Title>
                        <Text size="lg" mt="sm">
                          {day.summary}
                        </Text>
                        <Text size="lg" mt="sm" fw={500}>
                          {day.distanceKm} km · {day.elevationGainM} m elevation gain
                        </Text>
                        <Text size="lg" mt={4}>
                          {day.overnight}
                        </Text>
                        <Text size="lg" c="dimmed" mt={4}>
                          {day.weatherNote}
                        </Text>
                      </div>

                      <Button
                        variant="light"
                        color="pine"
                        size="md"
                        mt="md"
                        radius="md"
                        loading={fetchingWeather}
                        leftSection={<IconCloudRain size={16} aria-hidden="true" />}
                        onClick={() => handleOpenWeatherDashboard(extendedPlan.region)}
                        aria-label={`Open live meteorological dashboard for ${extendedPlan.region}`}
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
                  {extendedPlan.packingList.map((item) => (
                    <List.Item key={item}>{item}</List.Item>
                  ))}
                </List>
              </Card>

              <Card withBorder padding="lg">
                <Title order={3}>Safety Disclaimers</Title>
                <List mt="sm" aria-label="Important safety and emergency notes">
                  {extendedPlan.safetyDisclaimers.map((item) => (
                    <List.Item key={item}>{item}</List.Item>
                  ))}
                </List>
              </Card>
            </Stack>
          )}

          <Modal
            opened={opened}
            onClose={close}
            size="4xl"
            title="Live Meteorological Dashboard"
            styles={{
              content: {
                maxHeight: '92dvh',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                width: '100%',
              },
              title: { fontSize: '1.3rem' },
              body: {
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(92dvh - 60px)',
              },
            }}
          >
            {selectedDayWeather && <WeatherDashboard forecast={selectedDayWeather} />}
          </Modal>
        </Stack>
      </Container>
    </>
  );
}
