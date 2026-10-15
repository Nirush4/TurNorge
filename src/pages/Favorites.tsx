import type { JSX } from 'react';
import {
  Badge,
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ArrowUpRight, BookmarkCheck, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColors } from '@/hooks/useThemeColors';
import { showAppNotification } from '@/utils/notifications';
import { FavoriteCard } from '@/components/FavoriteCard';

export function Favorites(): JSX.Element {
  const { user } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();
  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const handleRemove = async (id: string, name: string) => {
    const { error } = await removeFavorite(id);
    if (error) {
      showAppNotification({ message: `Could not remove: ${error}`, isError: true });
    } else {
      showAppNotification({ message: `${name} removed from favorites.`, isError: false });
    }
  };

  const cardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(17,34,25,0.03)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  if (!user) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Stack
          align="center"
          ta="center"
          py={80}
          maw={500}
          mx="auto"
          component="section"
          aria-labelledby="auth-required-title"
        >
          <ThemeIcon size={64} radius="xl" variant="light" color="teal">
            <BookmarkCheck size={32} aria-hidden="true" />
          </ThemeIcon>
          <Title
            order={1}
            fz={{ base: '1.7rem', sm: '2.5rem' }}
            c={headingColor}
            id="auth-required-title"
          >
            Saved Favorites
          </Title>
          <Text c={bodyColor} size="lg">
            Log in to access your personal collection of saved Norwegian trails and expedition
            plans.
          </Text>
          <Button
            component={Link}
            to="/login"
            color="teal"
            size="md"
            radius="md"
            mt="md"
            style={{ minHeight: '44px' }}
          >
            Sign In to Account
          </Button>
        </Stack>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Center py={120} role="status" aria-live="polite">
          <Loader color="teal" size="lg" />
        </Center>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
        <Stack
          align="center"
          ta="center"
          py={80}
          maw={500}
          mx="auto"
          component="section"
          aria-labelledby="no-favorites-title"
        >
          <ThemeIcon size={64} radius="xl" variant="light" color="teal">
            <Compass size={32} aria-hidden="true" />
          </ThemeIcon>
          <Title
            order={1}
            fz={{ base: '1.8rem', sm: '2.4rem' }}
            c={headingColor}
            fw={800}
            id="no-favorites-title"
          >
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
            rightSection={<ArrowUpRight size={16} aria-hidden="true" />}
            style={{ minHeight: '44px' }}
          >
            Explore Trails
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Group
        justify="space-between"
        align="flex-end"
        mb="xl"
        pb="md"
        style={{ borderBottom: `1px solid ${borderColor}` }}
        component="section"
        aria-labelledby="favorites-header-title"
      >
        <div>
          <Badge variant="light" color="teal" size="sm" radius="sm" mb="xs">
            Personal Collection
          </Badge>
          <Title
            order={1}
            fz={{ base: '1.7rem', sm: '2.5rem' }}
            c={headingColor}
            id="favorites-header-title"
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
          leftSection={<BookmarkCheck size={16} aria-hidden="true" />}
          py="auto"
          px={14}
        >
          {favorites.length} Route{favorites.length === 1 ? '' : 's'} Saved
        </Badge>
      </Group>

      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing="lg"
        component="section"
        aria-label="Saved routes list"
      >
        {favorites.map((fav) => (
          <FavoriteCard
            key={fav.id}
            favorite={fav}
            isDark={isDark}
            headingColor={headingColor}
            bodyColor={bodyColor}
            borderColor={borderColor}
            cardStyle={cardStyle}
            onRemove={handleRemove}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
