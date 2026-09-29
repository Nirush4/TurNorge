import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import type { Trail } from '@/types';

interface TrailGridProps {
  trails: Trail[];
  onSelect: (trail: Trail) => void;
}

export function TrailGrid({ trails, onSelect }: TrailGridProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#ffffff' : '#112219';
  const bodyColor = isDark ? '#cbd5ce' : '#4a5d53';
  const cardBackground = isDark ? '#0d1c14' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)';

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {trails.map((trail) => (
        <Card
          key={trail.id}
          withBorder={false}
          padding="lg"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
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
