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
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import { IconCloudRain } from '@tabler/icons-react';

import { generatePlan, PLANNER_LOADING_STEPS } from '@/api/aiPlanner';

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

const EXPERIENCE_OPTIONS = [
  {
    value: 'beginner',
    label: 'Beginner',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
  },
  {
    value: 'expert',
    label: 'Expert',
  },
];

const SEASON_OPTIONS = [
  {
    value: 'summer_autumn',
    label: 'Summer / Autumn hiking',
  },
  {
    value: 'winter',
    label: 'Winter skiing',
  },
];

export function PlannerPage() {
  const { aiSettings, setAiSettings, setLastPlan, lastPlan, saveRoute } = useAppState();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const [fetchingWeather, setFetchingWeather] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const [selectedDayWeather, setSelectedDayWeather] = useState<MetForecastResponse | null>(null);

  /**
   * Always start with popular Norwegian destinations.
   * This means the dropdown has options immediately.
   */
  const [destinations, setDestinations] = useState<KartverketPlace[]>(() =>
    getPopularNorwegianDestinations(),
  );

  const [searchingDestinations, setSearchingDestinations] = useState(false);

  const [destinationSearch, setDestinationSearch] = useState('');

  const [selectedPlace, setSelectedPlace] = useState<KartverketPlace | null>(null);

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

  /**
   * Search Kartverket when the user types.
   *
   * With an empty search box we show the full popular list.
   */
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

        if (cancelled) {
          return;
        }

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
        console.error('Failed to search Kartverket destinations:', error);

        if (!cancelled) {
          const lowerQuery = query.toLocaleLowerCase('nb');

          setDestinations(
            getPopularNorwegianDestinations().filter((place) =>
              `${place.name} ${place.municipality} ${place.county}`
                .toLocaleLowerCase('nb')
                .includes(lowerQuery),
            ),
          );
        }
      } finally {
        if (!cancelled) {
          setSearchingDestinations(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [destinationSearch]);

  /**
   * Generate itinerary.
   */
  const onSubmit = async (values: PlannerFormValues): Promise<void> => {
    setLastPlan(null);

    try {
      for (let index = 0; index < PLANNER_LOADING_STEPS.length; index += 1) {
        setLoadingIndex(index);

        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 550);
        });
      }

      const plan = await generatePlan(values, {
        concise: aiSettings.conciseItineraries,

        emphasizeSafety: aiSettings.emphasizeSafety,
      });

      setLastPlan(plan);

      notifications.show({
        title: 'Itinerary ready',
        message: `${plan.title} compiled successfully.`,
        color: 'pine',
      });
    } catch (error) {
      console.error('Failed to generate itinerary:', error);

      notifications.show({
        title: 'Could not generate itinerary',
        message: 'Something went wrong while generating your itinerary.',
        color: 'red',
      });
    } finally {
      setLoadingIndex(null);
    }
  };

  /**
   * Open live weather for the selected destination.
   */
  const handleOpenWeatherDashboard = async (regionName: string) => {
    setFetchingWeather(true);

    try {
      let place = selectedPlace;

      if (!place || place.name.toLocaleLowerCase('nb') !== regionName.toLocaleLowerCase('nb')) {
        place = await resolveKartverketPlace(regionName);
      }

      if (!place) {
        throw new Error(`Could not find "${regionName}" in Kartverket.`);
      }

      const liveData = await fetchMetForecast(place.latitude, place.longitude);

      setSelectedDayWeather(liveData as unknown as MetForecastResponse);

      open();
    } catch (error) {
      console.error('Failed to load weather:', error);

      notifications.show({
        title: 'Error loading weather',
        message: 'Could not resolve the destination or fetch live meteorological data.',
        color: 'red',
      });
    } finally {
      setFetchingWeather(false);
    }
  };

  /**
   * Convert destinations into Mantine Select options.
   */
  const destinationOptions = destinations.map((place) => ({
    value: place.name,
    label: `${place.name} — ${place.municipality}, ${place.county}`,
  }));

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1}>AI Trip Planner</Title>

          <Text mt="xs">
            Choose a Norwegian hiking destination, select your experience level and trip length,
            then generate your itinerary using live weather data.
          </Text>
        </div>

        {/* Assistant settings */}
        <Card withBorder padding="lg">
          <Title order={2} mb="md">
            Assistant settings
          </Title>

          <Stack>
            <Switch
              checked={aiSettings.emphasizeSafety}
              onChange={(event) =>
                setAiSettings({
                  ...aiSettings,

                  emphasizeSafety: event.currentTarget.checked,
                })
              }
              label="Emphasize safety turnaround rules"
            />

            <Switch
              checked={aiSettings.conciseItineraries}
              onChange={(event) =>
                setAiSettings({
                  ...aiSettings,

                  conciseItineraries: event.currentTarget.checked,
                })
              }
              label="Prefer concise overviews"
            />
          </Stack>
        </Card>

        {/* Planner form */}
        <Card withBorder padding="lg" component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            {/* Destination */}
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select
                  label="Destination"
                  description="Choose a Norwegian hiking destination or search for another place."
                  placeholder="Search Norwegian areas..."
                  searchable
                  clearable
                  required

                  data={destinationOptions}

                  value={field.value || null}

                  searchValue={destinationSearch}

                  onSearchChange={setDestinationSearch}

                  onChange={(value) => {
                    const destination = value ?? '';

                    field.onChange(destination);

                    if (!destination) {
                      setSelectedPlace(null);
                      return;
                    }

                    const place = destinations.find((item) => item.name === destination);

                    if (place) {
                      setSelectedPlace(place);
                      return;
                    }

                    void resolveKartverketPlace(destination).then((resolved) => {
                      if (resolved) {
                        setSelectedPlace(resolved);
                      }
                    });
                  }}

                  onBlur={field.onBlur}

                  rightSection={searchingDestinations ? <Loader size="xs" /> : undefined}

                  nothingFoundMessage={
                    destinationSearch.trim().length < 2
                      ? 'No destination found'
                      : 'No Norwegian place found'
                  }

                  error={errors.destination?.message}
                />
              )}
            />

            {/* Selected destination */}
            {selectedPlace ? (
              <Card withBorder padding="sm">
                <Text size="sm" fw={600}>
                  {selectedPlace.name}
                </Text>

                <Text size="xs" c="dimmed" mt={4}>
                  {selectedPlace.municipality}
                  {' · '}
                  {selectedPlace.county}
                  {' · '}
                  {selectedPlace.latitude.toFixed(4)}
                  {', '}
                  {selectedPlace.longitude.toFixed(4)}
                </Text>
              </Card>
            ) : null}

            {/* Experience */}
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

            {/* Duration */}
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

            {/* Season */}
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

            {/* Cabin */}
            <Controller
              name="includeCabinStay"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Looking for DNT / self-service cabins"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />

            {/* Generate */}
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!selectedPlace || searchingDestinations}
              color="pine"
            >
              Generate itinerary
            </Button>
          </Stack>
        </Card>

        {/* Loading */}
        {loadingIndex !== null ? (
          <Card withBorder padding="lg" aria-live="polite">
            <Group>
              <Loader color="frost" />

              <Text>{PLANNER_LOADING_STEPS[loadingIndex]}</Text>
            </Group>
          </Card>
        ) : null}

        {/* Generated plan */}
        {lastPlan ? (
          <Stack gap="md">
            <Card withBorder padding="lg">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Title order={2}>{lastPlan.title}</Title>

                  <Text mt="sm">{lastPlan.overview}</Text>
                </div>

                <Button
                  variant="light"
                  onClick={() => {
                    saveRoute({
                      title: lastPlan.title,
                      region: lastPlan.region,
                      notes: lastPlan.overview,
                    });

                    notifications.show({
                      message: 'Saved in your favorites.',
                      color: 'frost',
                    });
                  }}
                >
                  Save locally
                </Button>
              </Group>
            </Card>

            {/* Days */}
            <SimpleGrid
              cols={{
                base: 1,
                md: 2,
              }}
            >
              {lastPlan.days.map((day) => (
                <Card key={day.day} withBorder padding="md">
                  <Stack justify="space-between" h="100%">
                    <div>
                      <Title order={3}>
                        Day {day.day}: {day.title}
                      </Title>

                      <Text size="sm" mt="xs">
                        {day.summary}
                      </Text>

                      <Text size="sm" mt="sm">
                        {day.distanceKm} km · {day.elevationGainM} m gain
                      </Text>

                      <Text size="sm">{day.overnight}</Text>

                      <Text size="sm" c="frost.6">
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
                      leftSection={<IconCloudRain size={16} />}
                      onClick={() => handleOpenWeatherDashboard(lastPlan.region)}
                    >
                      Live Weather Dashboard
                    </Button>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            {/* Packing */}
            <Card withBorder padding="lg">
              <Title order={3}>Packing list</Title>

              <List mt="sm">
                {lastPlan.packingList.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>

            {/* Safety */}
            <Card withBorder padding="lg">
              <Title order={3}>Safety disclaimers</Title>

              <List mt="sm">
                {lastPlan.safetyDisclaimers.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>

              <Title order={3} mt="md">
                Allemannsretten notes
              </Title>

              <List mt="sm">
                {lastPlan.allemannsrettenNotes.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>
          </Stack>
        ) : null}

        {/* Weather modal */}
        <Modal opened={opened} onClose={close} title="Live Meteorological Dashboard" size="4xl">
          {selectedDayWeather ? <WeatherDashboard forecast={selectedDayWeather} /> : null}
        </Modal>
      </Stack>
    </Container>
  );
}
