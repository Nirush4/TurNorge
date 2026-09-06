import { Card, SegmentedControl, Select, Stack } from '@mantine/core';

import type { KartverketPlace } from '@/types/schemas';
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

/**
 * These are always available in the dropdown.
 * Kartverket results are added on top of these.
 */
const NORWEGIAN_DESTINATIONS = [
  'Jotunheimen',
  'Hardangervidda',
  'Rondane',
  'Dovrefjell',
  'Trollheimen',
  'Lyngsalpene',
  'Lofoten',
  'Nordmarka',
  'Østmarka',
  'Finnemarka',
  'Kjekstadmarka',
  'Krokskogen',
  'Vestmarka',
  'Maridalsmarka',
  'Sørmarka',
  'Follomarka',
  'Bærumsmarka',
  'Romeriksåsene',
  'Nittedalsmarka',
  'Ringkollen',
  'Breheimen',
  'Reinheimen',
  'Jostedalsbreen',
  'Hallingskarvet',
  'Setesdal',
  'Ryfylke',
  'Lysefjorden',
  'Haukelifjell',
  'Romsdalen',
  'Romsdal',
  'Sunnmørsalpene',
  'Hurrungane',
  'Narvikfjellet',
  'Senja',
  'Vesterålen',
  'Helgeland',
  'Saltfjellet',
  'Børgefjell',
  'Rago',
  'Femundsmarka',
  'Sylan',
  'Forollhogna',
  'Skarvheimen',
  'Breheimen',
  'Tafjordfjella',
  'Sunndalsfjella',
  'Dovrefjell',
  'Romsdal',
  'Eikesdalen',
  'Innerdalen',
  'Geiranger',
  'Stryn',
  'Loen',
  'Olden',
  'Aurlandsdalen',
  'Flåmsdalen',
  'Nærøyfjorden',
  'Sognefjorden',
  'Hardangerfjorden',
  'Trolltunga',
  'Preikestolen',
  'Kjerag',
  'Lysebotn',
  'Kvitfjell',
  'Sjusjøen',
  'Venabygdsfjellet',
  'Beitostølen',
  'Valdres',
  'Gålå',
  'Rjukan',
  'Gaustatoppen',
  'Telemark',
  'Jomfruland',
  'Femundsmarka',
  'Engerdal',
  'Trysil',
  'Hamar',
  'Lillehammer',
  'Oslo',
  'Bergen',
  'Trondheim',
  'Tromsø',
] as const;

export function ExploreFilters({
  destinations,
  region,
  setRegion,
  difficulty,
  setDifficulty,
  duration,
  setDuration,
}: ExploreFiltersProps) {
  /**
   * Create options from the built-in destination list.
   */
  const staticOptions = NORWEGIAN_DESTINATIONS.map((name) => ({
    value: name,
    label: name,
  }));

  /**
   * Add Kartverket places.
   *
   * We only add a place if it isn't already represented
   * by the static destination list.
   */
  const kartverketOptions = destinations
    .filter(
      (destination) =>
        !NORWEGIAN_DESTINATIONS.some(
          (name) => name.toLocaleLowerCase('nb') === destination.name.toLocaleLowerCase('nb'),
        ),
    )
    .map((destination) => ({
      value: destination.name,
      label: destination.municipality
        ? `${destination.name} · ${destination.municipality}`
        : destination.name,
    }));

  /**
   * Remove duplicate option values.
   */
  const destinationOptions = Array.from(
    new Map(
      [...staticOptions, ...kartverketOptions].map((option) => [
        option.value.toLocaleLowerCase('nb'),
        option,
      ]),
    ).values(),
  ).sort((a, b) => a.label.localeCompare(b.label, 'nb'));

  return (
    <Card withBorder padding="md">
      <Stack gap="md">
        <Select
          label="Destination"
          required
          placeholder="Search Norwegian areas..."
          value={region === 'all' ? null : region}
          onChange={(value) => setRegion(value ?? 'all')}
          data={[
            {
              value: 'all',
              label: 'All destinations',
            },
            ...destinationOptions,
          ]}
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
          data={[
            {
              value: 'all',
              label: 'All grades',
            },
            {
              value: 'easy',
              label: 'Easy',
            },
            {
              value: 'moderate',
              label: 'Moderate',
            },
            {
              value: 'demanding',
              label: 'Demanding',
            },
            {
              value: 'expert',
              label: 'Expert',
            },
          ]}
        />

        <SegmentedControl
          fullWidth
          aria-label="Duration"
          value={duration}
          onChange={(value) => {
            setDuration(value as 'all' | 'half' | 'full' | 'long');
          }}
          data={[
            {
              value: 'all',
              label: 'Any length',
            },
            {
              value: 'half',
              label: 'Half day',
            },
            {
              value: 'full',
              label: 'Full day',
            },
            {
              value: 'long',
              label: 'Long day',
            },
          ]}
        />
      </Stack>
    </Card>
  );
}
