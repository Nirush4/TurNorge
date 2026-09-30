import { Group, Text, Box } from '@mantine/core';
import { Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { JSX } from 'react/jsx-runtime';

export function BrandLogo(): JSX.Element {
  return (
    <Box
      component={Link}
      to="/"
      aria-label="NordicTrail home"
      style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
    >
      <Group gap="xs" wrap="nowrap">
        <Trees size={26} color="var(--mantine-color-moss-4)" aria-hidden="true" />
        <div>
          <Text fw={700} lh={1.1} c="pine.4" size="xl">
            TurNorge
          </Text>
          <Text size="sm" c="dimmed" lh={1.2}>
            Norway hiking guide
          </Text>
        </div>
      </Group>
    </Box>
  );
}
