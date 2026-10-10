import {
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  NumberInput,
  Select,
  Stack,
  Text,
  Divider,
} from '@mantine/core';
import {
  Controller,
  type Control,
  type UseFormHandleSubmit,
  type FieldErrors,
} from 'react-hook-form';
import type { PlannerFormValues, KartverketPlace } from '@/types/schemas';
import { RegionSearchBar } from '@/components/RegionSearchBar';
import {
  EXPERIENCE_OPTIONS,
  SEASON_OPTIONS,
  MOBILE_INPUT_STYLES,
  PLANNER_LOADING_STEPS,
} from './plannerUtils';

interface PlannerFormProps {
  control: Control<PlannerFormValues>;
  errors: FieldErrors<PlannerFormValues>;
  isSubmitting: boolean;
  loadingIndex: number | null;
  searchingDestinations: boolean;
  destinations: KartverketPlace[];
  selectedPlace: KartverketPlace | null;
  currentTone: 'standard' | 'cautious' | 'ambitious';
  setCurrentTone: (tone: 'standard' | 'cautious' | 'ambitious') => void;
  emphasizeSafetyLocal: boolean;
  setEmphasizeSafetyLocal: (val: boolean) => void;
  handleDestinationChange: (val: string, onChangeFn: (val: string) => void) => void;
  onSubmit: (values: PlannerFormValues) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<PlannerFormValues>;
  isDark: boolean;
  headingColor: string;
  bodyColor: string;
  cardBackground: string;
  borderColor: string;
  accentCardStyle: React.CSSProperties;
  simpleCardStyle: React.CSSProperties;
}

export function PlannerForm({
  control,
  errors,
  isSubmitting,
  loadingIndex,
  searchingDestinations,
  destinations,
  selectedPlace,
  currentTone,
  setCurrentTone,
  emphasizeSafetyLocal,
  setEmphasizeSafetyLocal,
  handleDestinationChange,
  onSubmit,
  handleSubmit,
  isDark,
  headingColor,
  bodyColor,
  borderColor,
  accentCardStyle,
  simpleCardStyle,
}: PlannerFormProps) {
  return (
    <Stack gap="lg">
      <Card
        withBorder={false}
        padding="md"
        radius="md"
        role="region"
        aria-label="Planner Configuration Options"
        style={accentCardStyle}
      >
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="lg" fw={600} id="settings-heading" c={headingColor}>
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

          <Divider color={borderColor} />

          <Checkbox
            label="Emphasize advanced emergency and alpine safety warnings"
            checked={emphasizeSafetyLocal}
            onChange={(e) => setEmphasizeSafetyLocal(e.currentTarget.checked)}
            size="md"
            styles={{ label: { color: bodyColor } }}
          />
        </Stack>
      </Card>

      <Card
        withBorder={false}
        padding="lg"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        role="region"
        aria-label="Trip Configuration Form"
        style={simpleCardStyle}
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
                    <Text size="xs" c={bodyColor}>
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
            <Card
              withBorder={false}
              padding="sm"
              role="status"
              aria-live="polite"
              style={{
                backgroundColor: isDark ? '#14291f' : '#f0f4f1',
                border: `1px solid ${borderColor}`,
              }}
            >
              <Text size="md" fw={600} c={headingColor}>
                Selected: {selectedPlace.name}
              </Text>
              <Text size="md" c={bodyColor} mt={4}>
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
                styles={{ label: { color: bodyColor } }}
              />
            )}
          />

          <Button
            type="submit"
            loading={isSubmitting || loadingIndex !== null}
            loaderProps={{ type: 'dots' }}
            disabled={searchingDestinations}
            color="teal"
            aria-busy={loadingIndex !== null}
            fullWidth
          >
            {loadingIndex !== null ? PLANNER_LOADING_STEPS[loadingIndex] : 'Generate Itinerary'}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}
