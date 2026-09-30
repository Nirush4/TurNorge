import { Card, SegmentedControl, Stack, Text } from '@mantine/core';
import type { KartverketPlace } from '@/types/schemas';
import type { TrailDifficulty } from '@/types';
import { RegionSearchBar } from '../RegionSearchBar';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const { headingColor, cardBackground, borderColor } = useThemeColors();

  const simpleCardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
  };

  return (
    <Card
      withBorder={false}
      padding="md"
      component="aside"
      aria-label="Trail Explore Filters"
      style={simpleCardStyle}
    >
      <Stack gap="md">
        <RegionSearchBar destinations={destinations} region={region} setRegion={setRegion} />

        <Stack gap={4}>
          <Text size="md" fw={500} component="label" id="difficulty-filter-label" c={headingColor}>
            Filter by Difficulty
          </Text>
          <SegmentedControl
            fullWidth
            size="md"
            aria-labelledby="difficulty-filter-label"
            value={difficulty}
            onChange={(value) => {
              setDifficulty(value as TrailDifficulty | 'all');
            }}
            data={DIFFICULTY_OPTIONS}
          />
        </Stack>

        <Stack gap={4}>
          <Text size="md" fw={500} component="label" id="duration-filter-label" c={headingColor}>
            Filter by Duration
          </Text>
          <SegmentedControl
            fullWidth
            size="md"
            aria-labelledby="duration-filter-label"
            value={duration}
            onChange={(value) => {
              setDuration(value as 'all' | 'half' | 'full' | 'long');
            }}
            data={DURATION_OPTIONS}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
