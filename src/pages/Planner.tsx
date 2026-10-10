import { useState, useCallback, type JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from 'react-hook-form';

import {
  searchKartverketPlace,
  resolveKartverketPlace,
  getPopularNorwegianDestinations,
} from '@/lib/api/kartverket';
import { fetchMetForecast } from '@/lib/api/metNo';
import { useAppState } from '@/context/AppStateContext';
import { plannerSchema, type PlannerFormValues, type KartverketPlace } from '@/types/schemas';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import type { MetForecastResponse } from '@/types/met';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColors } from '@/hooks/useThemeColors';
import { showAppNotification } from '@/utils/notifications';
import {
  generateDynamicPlan,
  PLANNER_LOADING_STEPS,
  type ExtendedGeneratedPlan,
} from '@/components/planner/plannerUtils';
import { PlannerForm } from '@/components/planner/PlannerForm';
import { ItineraryResults } from '@/components/planner/ItineraryResults';

export function PlannerPage(): JSX.Element {
  const { setLastPlan, lastPlan } = useAppState();
  const { addFavorite } = useFavorites();
  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [loadingDayId, setLoadingDayId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDayWeather, setSelectedDayWeather] = useState<MetForecastResponse | null>(null);

  const [destinations] = useState<KartverketPlace[]>(() => getPopularNorwegianDestinations());
  const [searchingDestinations] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<KartverketPlace | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentTone, setCurrentTone] = useState<'standard' | 'cautious' | 'ambitious'>('standard');
  const [emphasizeSafetyLocal, setEmphasizeSafetyLocal] = useState(true);

  const accentCardStyle = {
    backgroundColor: cardBackground,
    borderTop: '4px solid #28726B',
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
  };

  const simpleCardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
  };

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
      showAppNotification({
        message: 'Could not generate itinerary: Something went wrong while generating your route.',
        isError: true,
      });
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleOpenWeatherDashboard = async (regionName: string, dayIndex: number) => {
    setLoadingDayId(dayIndex);
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

      const liveData = (await fetchMetForecast(
        latitude ?? 61.4933,
        longitude ?? 8.3597,
      )) as MetForecastResponse;

      if (liveData?.properties?.timeseries) {
        const offset = Math.min(dayIndex * 12, liveData.properties.timeseries.length - 1);
        liveData.properties.timeseries = liveData.properties.timeseries.slice(offset);
      }

      setSelectedDayWeather(liveData);
      open();
    } catch (error) {
      console.error('Weather error:', error);
      showAppNotification({
        message:
          'Weather Unavailable: Could not load live meteorological telemetry for this region.',
        isError: true,
      });
    } finally {
      setLoadingDayId(null);
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
      showAppNotification({
        message: `Could not save favorite: ${error}`,
        isError: true,
      });
    } else {
      setIsFavorite(true);
      showAppNotification({
        message: `${extendedPlan.title} saved in your favorites.`,
        isError: false,
      });
    }
  };

  const extendedPlan = lastPlan as ExtendedGeneratedPlan | null;

  return (
    <>
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Stack gap="lg">
          <header>
            <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={headingColor}>
              Smart Route Planner
            </Title>
            <Text mt="sm" size="lg" c={bodyColor}>
              Instantly plans your route and updates you with live weather and location search as
              you go.
            </Text>
          </header>

          <PlannerForm
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            loadingIndex={loadingIndex}
            searchingDestinations={searchingDestinations}
            destinations={destinations}
            selectedPlace={selectedPlace}
            currentTone={currentTone}
            setCurrentTone={setCurrentTone}
            emphasizeSafetyLocal={emphasizeSafetyLocal}
            setEmphasizeSafetyLocal={setEmphasizeSafetyLocal}
            handleDestinationChange={handleDestinationChange}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            isDark={isDark}
            headingColor={headingColor}
            bodyColor={bodyColor}
            cardBackground={cardBackground}
            borderColor={borderColor}
            accentCardStyle={accentCardStyle}
            simpleCardStyle={simpleCardStyle}
          />

          {extendedPlan && (
            <ItineraryResults
              extendedPlan={extendedPlan}
              isFavorite={isFavorite}
              loadingDayId={loadingDayId}
              handleSaveFavorite={handleSaveFavorite}
              handleOpenWeatherDashboard={handleOpenWeatherDashboard}
              headingColor={headingColor}
              bodyColor={bodyColor}
              accentCardStyle={accentCardStyle}
              simpleCardStyle={simpleCardStyle}
            />
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
                backgroundColor: cardBackground,
                color: headingColor,
              },
              header: {
                backgroundColor: cardBackground,
                color: headingColor,
              },
              title: { fontSize: '1.3rem', fontWeight: 700, color: headingColor },
              body: {
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(92dvh - 60px)',
                backgroundColor: cardBackground,
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
