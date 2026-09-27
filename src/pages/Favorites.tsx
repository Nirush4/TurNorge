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
  Loader,
  Center,
  ThemeIcon,
  useMantineColorScheme,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  BookmarkCheck,
  Trash2,
  MapPin,
  Calendar,
  Compass,
  Mountain,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteRoute {
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

export function Favorites(): JSX.Element {
  const { user } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#f1f5f2' : '#112219';
  const bodyColor = isDark ? '#cbd5ce' : '#4a5d53';
  const cardBackground = isDark ? '#112219' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)';

  const handleRemove = async (id: string, name: string) => {
    const { error } = await removeFavorite(id);
    if (error) {
      notifications.show({ color: 'red', title: 'Could not remove', message: error });
    } else {
      notifications.show({
        styles: {
          root: { backgroundColor: '#28726B' },
          description: { color: '#FFFFFF' },
          closeButton: { color: '#FFFFFF' },
        },
        message: `${name} removed from favorites.`,
      });
    }
  };

  if (!user) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Stack align="center" ta="center" py={80} maw={500} mx="auto">
          <ThemeIcon size={64} radius="xl" variant="light" color="teal">
            <BookmarkCheck size={32} />
          </ThemeIcon>
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={headingColor}>
            Saved Favorites
          </Title>
          <Text c={bodyColor} size="lg">
            Log in to access your personal collection of saved Norwegian trails and expedition
            plans.
          </Text>
          <Button component={Link} to="/login" color="teal" size="md" radius="md" mt="md">
            Sign In to Account
          </Button>
        </Stack>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Center py={120}>
          <Loader color="teal" size="lg" />
        </Center>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Stack align="center" ta="center" py={80} maw={500} mx="auto">
          <ThemeIcon size={64} radius="xl" variant="light" color="teal">
            <Compass size={32} />
          </ThemeIcon>
          <Title order={1} fz={{ base: '1.8rem', sm: '2.4rem' }} c={headingColor} fw={800}>
            No Saved Routes Yet
          </Title>
          <Text c={bodyColor} size="lg" lh={1.6}>
            Explore breathtaking alpine ridges and coastal peaks, or use the Trip Planner to save
            your custom routes here!
          </Text>
          <Button
            component={Link}
            to="/explore"
            color="teal"
            size="md"
            radius="md"
            mt="md"
            rightSection={<ArrowUpRight size={16} />}
          >
            Explore Trails
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      {/* Header section */}
      <Group
        justify="space-between"
        align="flex-end"
        mb="xl"
        pb="md"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <div>
          <Badge variant="light" color="teal" size="sm" radius="sm" mb="xs">
            Personal Collection
          </Badge>
          <Title
            order={1}
            fz={{ base: '1.7rem', sm: '2.5rem' }}
            c={headingColor}
            style={{ letterSpacing: '-0.02em' }}
          >
            Saved Favorites
          </Title>
          <Text size="lg" c={bodyColor} mt={4}>
            Your bookmarked Norwegian hiking routes, peaks, and customized plans.
          </Text>
        </div>
        <Badge
          variant="light"
          color="teal"
          size="lg"
          radius="sm"
          leftSection={<BookmarkCheck size={16} />}
          py="auto"
          px={14}
        >
          {favorites.length} Route{favorites.length === 1 ? '' : 's'} Saved
        </Badge>
      </Group>

      {/* Grid List */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {favorites.map((fav: FavoriteRoute) => (
          <Card
            key={fav.id}
            padding="xl"
            radius="lg"
            withBorder
            component="article"
            style={{
              backgroundColor: cardBackground,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(17,34,25,0.03)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div>
              {/* Card Top Row */}
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
                  leftSection={<Trash2 size={14} />}
                  onClick={() => handleRemove(fav.id, fav.location_name)}
                  style={{ fontWeight: 600 }}
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

            {/* Metrics Footer Grid */}
            <SimpleGrid
              cols={{ base: 2, sm: 4 }}
              spacing="sm"
              pt="md"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              {fav.location_lat !== null &&
                fav.location_lat !== undefined &&
                fav.location_lng !== null &&
                fav.location_lng !== undefined && (
                  <Group gap={6} wrap="nowrap">
                    <ThemeIcon size={32} radius="sm" variant="light" color="teal">
                      <MapPin size={14} />
                    </ThemeIcon>
                    <div>
                      <Text size="12px" c="dimmed" tt="uppercase" fw={700}>
                        Coords
                      </Text>
                      <Text size="sm" c={headingColor} fw={600}>
                        {fav.location_lat.toFixed(1)}°, {fav.location_lng.toFixed(1)}°
                      </Text>
                    </div>
                  </Group>
                )}

              {fav.trip_duration_days && (
                <Group gap={6} wrap="nowrap">
                  <ThemeIcon size={28} radius="sm" variant="light" color="teal">
                    <Compass size={14} />
                  </ThemeIcon>
                  <div>
                    <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
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
                    <Mountain size={14} />
                  </ThemeIcon>
                  <div>
                    <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
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
                  <Calendar size={14} />
                </ThemeIcon>
                <div>
                  <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                    Saved
                  </Text>
                  <Text size="xs" c={headingColor} fw={600}>
                    {fav.added_at ? new Date(fav.added_at).toLocaleDateString() : 'Recent'}
                  </Text>
                </div>
              </Group>
            </SimpleGrid>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
