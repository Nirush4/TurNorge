import { Badge, Button, Card, Group, SimpleGrid, Text, Title } from '@mantine/core';
import type { Trail } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

interface TrailGridProps {
  trails: Trail[];
  onSelect: (trail: Trail) => void;
}

export function TrailGrid({ trails, onSelect }: TrailGridProps) {
  const { headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const simpleCardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {trails.map((trail) => (
        <Card key={trail.id} withBorder={false} padding="lg" style={simpleCardStyle}>
          <Group justify="space-between">
            <Badge color="pine">{trail.region}</Badge>
            <Badge variant="light" color="teal" tt="capitalize">
              {trail.difficulty}
            </Badge>
          </Group>
          <Title order={3} mt="sm" c={headingColor} fz="h4">
            {trail.name}
          </Title>
          <Text size="sm" mt="xs" c={bodyColor} lineClamp={2}>
            {trail.description}
          </Text>
          <Text size="sm" mt="md" c={bodyColor}>
            {trail.distanceKm} km · {trail.durationLabel} · {trail.elevationGainM} m gain
          </Text>
          <Button
            mt="md"
            color="teal"
            variant="light"
            onClick={() => onSelect(trail)}
            aria-label={`View trail details for ${trail.name}`}
          >
            Trail details
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  );
}
