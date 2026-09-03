import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  List,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
  NumberInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import { generatePlan, PLANNER_LOADING_STEPS } from '@/api/aiPlanner';
import { useAppState } from '@/context/AppStateContext';
import { NORWEGIAN_REGIONS, plannerSchema, type PlannerFormValues } from '@/types/schemas';

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
  const { aiSettings, setAiSettings, setLastPlan, lastPlan, saveRoute } = useAppState();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      destination: 'Jotunheimen',
      experienceLevel: 'intermediate',
      durationDays: 3,
      season: 'summer_autumn',
      includeCabinStay: true,
    },
  });

  const onSubmit = async (values: PlannerFormValues): Promise<void> => {
    setLastPlan(null);
    for (let index = 0; index < PLANNER_LOADING_STEPS.length; index += 1) {
      setLoadingIndex(index);
      await new Promise((resolve) => {
        window.setTimeout(resolve, 550);
      });
    }
    const plan = await generatePlan(values, {
      concise: aiSettings.conciseItineraries,
      emphasizeSafety: aiSettings.emphasizeSafety,
    });
    setLastPlan(plan);
    setLoadingIndex(null);
    notifications.show({
      title: 'Itinerary ready',
      message: `${plan.title} compiled from MET.no and Kartverket mock schemas.`,
      color: 'pine',
    });
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>AI Trip Planner</Title>
          <Text mt="xs">
            Validated with Zod. Output is a structured simulation for trip thinking — always
            cross-check live MET Norway, Kartverket maps, and DNT cabin status.
          </Text>
        </div>

        <Card withBorder padding="lg">
          <Group justify="space-between" mb="md">
            <Title order={2}>Assistant settings</Title>
          </Group>
          <Stack>
            <Switch
              checked={aiSettings.emphasizeSafety}
              onChange={(event) =>
                setAiSettings({ ...aiSettings, emphasizeSafety: event.currentTarget.checked })
              }
              label="Emphasize safety turnaround rules"
            />
            <Switch
              checked={aiSettings.conciseItineraries}
              onChange={(event) =>
                setAiSettings({ ...aiSettings, conciseItineraries: event.currentTarget.checked })
              }
              label="Prefer concise overviews"
            />
          </Stack>
        </Card>

        <Card withBorder padding="lg" component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Select
                  label="Destination"
                  placeholder="Choose a Norwegian region"
                  data={[...NORWEGIAN_REGIONS]}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={
                    errors.destination ? (
                      <Text c="red" size="xs">
                        {errors.destination.message}
                      </Text>
                    ) : undefined
                  }
                  required
                />
              )}
            />
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
                  error={
                    errors.experienceLevel ? (
                      <Text c="red" size="xs">
                        {errors.experienceLevel.message}
                      </Text>
                    ) : undefined
                  }
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
                  error={
                    errors.durationDays ? (
                      <Text c="red" size="xs">
                        {errors.durationDays.message}
                      </Text>
                    ) : undefined
                  }
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
                  error={
                    errors.season ? (
                      <Text c="red" size="xs">
                        {errors.season.message}
                      </Text>
                    ) : undefined
                  }
                  required
                />
              )}
            />
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
            <Button type="submit" loading={isSubmitting} color="pine">
              Generate itinerary
            </Button>
          </Stack>
        </Card>

        {loadingIndex !== null ? (
          <Card withBorder padding="lg" aria-live="polite">
            <Group>
              <Loader color="frost" />
              <Text>{PLANNER_LOADING_STEPS[loadingIndex]}</Text>
            </Group>
          </Card>
        ) : null}

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
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              {lastPlan.days.map((day) => (
                <Card key={day.day} withBorder padding="md">
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
                </Card>
              ))}
            </SimpleGrid>
            <Card withBorder padding="lg">
              <Title order={3}>Packing list</Title>
              <List mt="sm">
                {lastPlan.packingList.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>
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
      </Stack>
    </Container>
  );
}
