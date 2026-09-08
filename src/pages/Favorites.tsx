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
  SimpleGrid,
  useMantineColorScheme,
} from '@mantine/core';
import { BookmarkCheck, Trash2, MapPin, Calendar, Compass, Footprints } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';

export function Favorites(): JSX.Element {
  const { savedRoutes, removeRoute } = useAppState();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (savedRoutes.length === 0) {
    return (
      <Container size="md" py="xl" px="0">
        <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={isDark ? '#eef4f1' : 'dark.7'}>
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
    <Container size="md" py="xl" px="0">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={isDark ? '#eef4f1' : 'dark.7'}>
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
        {savedRoutes.map((item) => {
          const route = item as Record<string, any>;
          const targetId = route.id ?? route.trailId;

          return (
            <Card
              key={targetId}
              padding="lg"
              radius="md"
              style={{
                backgroundColor: isDark ? '#182c23' : '#f4f8f5',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <Group justify="space-between" mb="xs" align="flex-start">
                <div>
                  <Title order={4} c={isDark ? '#eef4f1' : 'dark.7'}>
                    {route.title}
                  </Title>
                  {route.difficulty && (
                    <Badge size="xs" variant="outline" mt={4} color="forest">
                      {route.difficulty}
                    </Badge>
                  )}
                  {route.experienceLevel && (
                    <Badge
                      size="xs"
                      variant="outline"
                      mt={4}
                      color="forest"
                      ml={route.difficulty ? 6 : 0}
                    >
                      {route.experienceLevel}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="subtle"
                  color="red"
                  size="xs"
                  leftSection={<Trash2 size={14} />}
                  onClick={() => {
                    if (targetId) {
                      removeRoute(targetId);
                    }
                  }}
                >
                  Remove
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mb="sm">
                {route.region && (
                  <Group gap={4}>
                    <MapPin size={14} color="#82aca0" />
                    <Text size="xs" c={isDark ? 'forest.3' : 'forest.7'}>
                      {route.region}
                    </Text>
                  </Group>
                )}
                {route.durationDays && (
                  <Group gap={4}>
                    <Compass size={14} color="#82aca0" />
                    <Text size="xs" c={isDark ? 'forest.3' : 'forest.7'}>
                      {route.durationDays} Days
                    </Text>
                  </Group>
                )}
                {route.season && (
                  <Group gap={4}>
                    <Footprints size={14} color="#82aca0" />
                    <Text size="xs" c={isDark ? 'forest.3' : 'forest.7'}>
                      {route.season}
                    </Text>
                  </Group>
                )}
                <Group gap={4}>
                  <Calendar size={14} color="#82aca0" />
                  <Text size="xs" c="dimmed">
                    {route.savedAt ? new Date(route.savedAt).toLocaleDateString() : 'Recent'}
                  </Text>
                </Group>
              </SimpleGrid>

              {route.notes && (
                <Text size="sm" c={isDark ? '#c3d1c9' : 'dark.6'} style={{ lineHeight: 1.5 }}>
                  {route.notes}
                </Text>
              )}
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
