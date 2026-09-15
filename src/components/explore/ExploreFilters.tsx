import { useMemo } from 'react';
import { Card, SegmentedControl, Select, Stack } from '@mantine/core';

import type { KartverketPlace } from '@/types/schemas';
import { NORWEGIAN_DESTINATIONS } from '@/types/schemas';
import type { TrailDifficulty } from '@/types';

interface ExploreFiltersProps {
  destinations: KartverketPlace[];
  region: string;
  setRegion: (value: string) => void;
  difficulty: TrailDifficulty | 'all';
  setDifficulty: (value: TrailDifficulty | 'all') => void;
  duration: 'all' | 'half' | 'full' | 'long';
  setDuration: (value: 'all' | 'half' | 'full' | 'long') => void;
}

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All grades' },
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'demanding', label: 'Demanding' },
  { value: 'expert', label: 'Expert' },
];

const DURATION_OPTIONS = [
  { value: 'all', label: 'Any length' },
  { value: 'half', label: 'Half day' },
  { value: 'full', label: 'Full day' },
  { value: 'long', label: 'Long day' },
];

export function ExploreFilters({
  destinations,
  region,
  setRegion,
  difficulty,
  setDifficulty,
  duration,
  setDuration,
}: ExploreFiltersProps) {
  const destinationData = useMemo(() => {
    const staticOptions = NORWEGIAN_DESTINATIONS.map((name) => ({
      value: name,
      label: name,
    }));

    const kartverketOptions = destinations
      .filter((destination) => {
        const destinationName = destination.name.toLocaleLowerCase('nb');
        return !NORWEGIAN_DESTINATIONS.some(
          (name) => name.toLocaleLowerCase('nb') === destinationName,
        );
      })
      .map((destination) => ({
        value: destination.name,
        label: destination.municipality
          ? `${destination.name} · ${destination.municipality}`
          : destination.name,
      }));

    const destinationOptions = Array.from(
      new Map(
        [...staticOptions, ...kartverketOptions].map((option) => [
          option.value.toLocaleLowerCase('nb'),
          option,
        ]),
      ).values(),
    ).sort((a, b) => a.label.localeCompare(b.label, 'nb'));

    return [{ value: 'all', label: 'All destinations' }, ...destinationOptions];
  }, [destinations]);

  return (
    <Card withBorder padding="md">
      <Stack gap="md">
        <Select
          label="Destination"
          placeholder="Search Norwegian areas..."
          value={region === 'all' ? null : region}
          onChange={(value) => setRegion(value ?? 'all')}
          data={destinationData}
          searchable
          clearable
          nothingFoundMessage="No Norwegian destination found"
          maxDropdownHeight={350}
          comboboxProps={{
            withinPortal: true,
          }}
        />

        <SegmentedControl
          fullWidth
          aria-label="Difficulty"
          value={difficulty}
          onChange={(value) => {
            setDifficulty(value as TrailDifficulty | 'all');
          }}
          data={DIFFICULTY_OPTIONS}
        />

        <SegmentedControl
          fullWidth
          aria-label="Duration"
          value={duration}
          onChange={(value) => {
            setDuration(value as 'all' | 'half' | 'full' | 'long');
          }}
          data={DURATION_OPTIONS}
        />
      </Stack>
    </Card>
  );
}
