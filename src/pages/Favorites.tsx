import { type JSX } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  Stack,
  Badge,
  useMantineColorScheme,
} from '@mantine/core';
import { BookmarkCheck, Trash2, MapPin, Calendar } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';

export function Favorites(): JSX.Element {
  const { savedRoutes, removeRoute } = useAppState();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (savedRoutes.length === 0) {
    return (
      <Container size="md" py="xl">
        <Title order={2} mb="xs" c={isDark ? '#eef4f1' : 'dark.7'}>
          Saved Favorites
        </Title>
        <Text c="dimmed">
          No saved routes found in your browser storage yet. Explore trails or use the Trip Planner
          to save your favorites!
        </Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} c={isDark ? '#eef4f1' : 'dark.7'}>
            Saved Favorites
          </Title>
          <Text size="sm" c="dimmed">
            Your locally stored Norwegian hiking routes and plans.
          </Text>
        </div>
        <Badge variant="light" color="forest" size="lg" leftSection={<BookmarkCheck size={14} />}>
          {savedRoutes.length} Saved
        </Badge>
      </Group>

      <Stack gap="md">
        {savedRoutes.map((route) => (
          <Card
            key={route.id || route.trailId}
            padding="lg"
            radius="md"
            style={{
              backgroundColor: isDark ? '#182c23' : '#f4f8f5',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Group justify="space-between" mb="xs">
              <Title order={4} c={isDark ? '#eef4f1' : 'dark.7'}>
                {route.title}
              </Title>
              <Button
                variant="subtle"
                color="red"
                size="xs"
                leftSection={<Trash2 size={14} />}
                onClick={() => {
                  const targetId = route.id ?? route.trailId;
                  if (targetId) {
                    removeRoute(targetId);
                  }
                }}
              >
                Remove
              </Button>
            </Group>
            <Group gap="md" mb="sm">
              <Group gap={4}>
                <MapPin size={14} color="#82aca0" />
                <Text size="xs" c={isDark ? 'forest.3' : 'forest.7'}>
                  {route.region}
                </Text>
              </Group>
              <Group gap={4}>
                <Calendar size={14} color="#82aca0" />
                <Text size="xs" c="dimmed">
                  {route.savedAt ? new Date(route.savedAt).toLocaleDateString() : 'Recent'}
                </Text>
              </Group>
            </Group>
            <Text size="sm" c={isDark ? '#c3d1c9' : 'dark.6'} style={{ lineHeight: 1.5 }}>
              {route.notes}
            </Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
