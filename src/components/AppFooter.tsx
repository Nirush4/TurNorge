import { Anchor, Group, Text } from '@mantine/core';

export function AppFooter() {
  return (
    <Group h="100%" px="md" justify="space-between" wrap="wrap" gap="xs">
      <Text size="sm">
        Free public utility. Not an official MET Norway, Kartverket, or DNT service.
      </Text>
      <Group gap="md">
        <Anchor href="https://www.met.no/" target="_blank" rel="noreferrer" size="sm">
          MET.no
        </Anchor>
        <Anchor href="https://www.kartverket.no/" target="_blank" rel="noreferrer" size="sm">
          Kartverket
        </Anchor>
        <Anchor href="https://www.dnt.no/" target="_blank" rel="noreferrer" size="sm">
          DNT
        </Anchor>
        <Text size="sm" fw={600}>
          Emergency 112 / 113
        </Text>
      </Group>
    </Group>
  );
}
