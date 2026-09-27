import { Anchor, Group, Text } from '@mantine/core';

export function AppFooter() {
  return (
    <Group
      h="100%"
      px="md"
      py="md"
      justify="space-between"
      wrap="wrap"
      gap="0"
      style={{ overflowX: 'hidden' }}
    >
      <Text size="sm">
        Free public utility. Not an official MET Norway, Kartverket, or DNT service.
      </Text>
      <Group gap="sm">
        <Anchor href="https://www.met.no/" target="_blank" rel="noreferrer" size="sm">
          Weather data: MET.no
        </Anchor>
        <Anchor href="https://www.kartverket.no/" target="_blank" rel="noreferrer" size="sm">
          Map data: Kartverket
        </Anchor>
        <Anchor href="https://www.dnt.no/" target="_blank" rel="noreferrer" size="sm">
          DNT
        </Anchor>
      </Group>
      <Text size="md" c="red" fw={600}>
        Emergency 112 / 113
      </Text>
    </Group>
  );
}
