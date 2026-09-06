import { Badge, Button, Card, Group, SimpleGrid, Text, Title } from '@mantine/core';
import type { Trail } from '@/types';

interface TrailGridProps {
  trails: Trail[];
  onSelect: (trail: Trail) => void;
}

export function TrailGrid({ trails, onSelect }: TrailGridProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {trails.map((trail) => (
        <Card key={trail.id} withBorder padding="lg">
          <Group justify="space-between">
            <Badge color="pine">{trail.region}</Badge>
            <Badge variant="light">{trail.difficulty}</Badge>
          </Group>
          <Title order={3} mt="sm">
            {trail.name}
          </Title>
          <Text size="sm" mt="xs">
            {trail.description}
          </Text>
          <Text size="sm" mt="md">
            {trail.distanceKm} km · {trail.durationLabel} · {trail.elevationGainM} m gain
          </Text>
          <Button mt="md" onClick={() => onSelect(trail)}>
            Trail details
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  );
}
