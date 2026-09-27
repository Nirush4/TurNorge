import { useState, useMemo } from 'react';
import { Select } from '@mantine/core';
import type { KartverketPlace } from '@/types/schemas';
import { NORWEGIAN_DESTINATIONS } from '@/types/schemas';

interface RegionSearchBarProps {
  destinations: KartverketPlace[];
  region: string;
  setRegion: (value: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
}

export function RegionSearchBar({
  destinations,
  region,
  setRegion,
  label = 'Destination',
  description = 'Filter trails by specific region or destination area',
  placeholder = 'Search Norwegian areas...',
}: RegionSearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

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
    <Select
      label={label}
      description={description}
      placeholder={placeholder}
      value={region === 'all' ? null : region}
      onChange={(value) => {
        setRegion(value ?? 'all');
        if (!value || value === 'all') setSearchValue('');
      }}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      data={destinationData}
      searchable
      clearable
      nothingFoundMessage="No Norwegian destination found"
      maxDropdownHeight={350}
      comboboxProps={{
        withinPortal: true,
      }}
      styles={{
        label: {
          fontSize: '1.05rem',
          fontWeight: 600,
          marginBottom: '6px',
        },
        description: {
          fontSize: '1rem',
        },
        input: {
          fontSize: '16px',
        },
        option: {
          fontSize: '1rem',
          padding: '10px 14px',
        },
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          const query = searchValue.trim().toLowerCase();
          if (!query) {
            setRegion('all');
            return;
          }

          const matchedOption = destinationData.find(
            (item) =>
              item.label.toLowerCase().includes(query) || item.value.toLowerCase().includes(query),
          );

          if (matchedOption) {
            setRegion(matchedOption.value);
            setSearchValue(matchedOption.label);
          }
        }
      }}
    />
  );
}
