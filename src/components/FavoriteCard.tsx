import { Badge, Box, Button, Card, Group, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import { Calendar, Compass, MapPin, Mountain, Trash2 } from 'lucide-react';

export interface FavoriteRoute {
  id: string;
  location_name: string;
  mode?: string | null;
  notes?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  trip_duration_days?: number | null;
  elevation_m?: number | null;
  added_at?: string | null;
}

interface FavoriteCardProps {
  favorite: FavoriteRoute;
  isDark: boolean;
  headingColor: string;
  bodyColor: string;
  borderColor: string;
  cardStyle: React.CSSProperties;
  onRemove: (id: string, name: string) => void;
}

export function FavoriteCard({
  favorite: fav,
  isDark,
  headingColor,
  bodyColor,
  borderColor,
  cardStyle,
  onRemove,
}: FavoriteCardProps) {
  return (
    <Card
      padding="xl"
      radius="lg"
      withBorder
      component="article"
      aria-label={`Favorite route: ${fav.location_name}`}
      style={cardStyle}
    >
      <div>
        <Group justify="space-between" align="flex-start" mb="md">
          <div>
            {fav.mode && (
              <Badge
                size="md"
                variant="light"
                color="teal"
                radius="sm"
                mb={8}
                style={{ textTransform: 'uppercase' }}
              >
                {fav.mode}
              </Badge>
            )}
            <Title
              order={3}
              size="h3"
              c={headingColor}
              fw={700}
              style={{ letterSpacing: '-0.01em' }}
            >
              {fav.location_name}
            </Title>
          </div>
          <Button
            variant="outline"
            color="red"
            size="xs"
            radius="md"
            leftSection={<Trash2 size={14} aria-hidden="true" />}
            onClick={() => onRemove(fav.id, fav.location_name)}
            style={{ fontWeight: 600, minHeight: '36px' }}
          >
            Remove
          </Button>
        </Group>

        {fav.notes && (
          <Box
            mb="lg"
            p="md"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(17,34,25,0.02)',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
            }}
          >
            <Text size="md" c={bodyColor} style={{ lineHeight: 1.6 }}>
              {fav.notes}
            </Text>
          </Box>
        )}
      </div>

      <SimpleGrid
        cols={{ base: 2, sm: 4 }}
        spacing="sm"
        pt="md"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        {fav.location_lat != null && fav.location_lng != null && (
          <Group gap={6} wrap="nowrap">
            <ThemeIcon size={28} radius="sm" variant="light" color="teal">
              <MapPin size={14} aria-hidden="true" />
            </ThemeIcon>
            <div>
              <Text size="12px" c="dimmed" tt="uppercase" fw={700}>
                Coords
              </Text>
              <Text size="xs" c={headingColor} fw={600}>
                {fav.location_lat.toFixed(1)}°, {fav.location_lng.toFixed(1)}°
              </Text>
            </div>
          </Group>
        )}

        {fav.trip_duration_days && (
          <Group gap={6} wrap="nowrap">
            <ThemeIcon size={28} radius="sm" variant="light" color="teal">
              <Compass size={14} aria-hidden="true" />
            </ThemeIcon>
            <div>
              <Text size="12px" c="dimmed" tt="uppercase" fw={700}>
                Duration
              </Text>
              <Text size="xs" c={headingColor} fw={600}>
                {fav.trip_duration_days} Day{fav.trip_duration_days === 1 ? '' : 's'}
              </Text>
            </div>
          </Group>
        )}

        {fav.elevation_m && (
          <Group gap={6} wrap="nowrap">
            <ThemeIcon size={28} radius="sm" variant="light" color="teal">
              <Mountain size={14} aria-hidden="true" />
            </ThemeIcon>
            <div>
              <Text size="12px" c="dimmed" tt="uppercase" fw={700}>
                Elevation
              </Text>
              <Text size="xs" c={headingColor} fw={600}>
                {fav.elevation_m}m
              </Text>
            </div>
          </Group>
        )}

        <Group gap={6} wrap="nowrap">
          <ThemeIcon size={28} radius="sm" variant="light" color="teal">
            <Calendar size={14} aria-hidden="true" />
          </ThemeIcon>
          <div>
            <Text size="12px" c="dimmed" tt="uppercase" fw={700}>
              Saved
            </Text>
            <Text size="xs" c={headingColor} fw={600}>
              {fav.added_at ? new Date(fav.added_at).toLocaleDateString() : 'Recent'}
            </Text>
          </div>
        </Group>
      </SimpleGrid>
    </Card>
  );
}
