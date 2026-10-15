import { Badge, Center, Group, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { BookmarkCheck } from 'lucide-react';
import { FavoriteCard, type FavoriteRoute } from '@/components/FavoriteCard';

interface FavoritesListSectionProps {
  favorites: FavoriteRoute[];
  favoritesLoading: boolean;
  isDark: boolean;
  headingColor: string;
  bodyColor: string;
  borderColor: string;
  cardStyle: React.CSSProperties;
  onRemoveFavorite: (id: string, name: string) => Promise<void>;
}

export function FavoritesListSection({
  favorites,
  favoritesLoading,
  isDark,
  headingColor,
  bodyColor,
  borderColor,
  cardStyle,
  onRemoveFavorite,
}: FavoritesListSectionProps) {
  return (
    <section aria-labelledby="saved-favorites-heading">
      <Group justify="space-between" my="lg">
        <Title
          order={3}
          fz={{ base: '1.5rem', sm: '2rem' }}
          c={headingColor}
          id="saved-favorites-heading"
        >
          Saved Favorites
        </Title>
        {favorites.length > 0 && (
          <Badge
            variant="light"
            color="teal"
            size="xl"
            leftSection={<BookmarkCheck size={12} aria-hidden="true" />}
          >
            {favorites.length}
          </Badge>
        )}
      </Group>

      {favoritesLoading ? (
        <Center py="md" role="status" aria-live="polite">
          <Loader color="teal" size="sm" />
        </Center>
      ) : favorites.length === 0 ? (
        <Text size="md" c={bodyColor}>
          No saved routes yet. Explore trails to add some favorites!
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav.id}
              favorite={fav}
              isDark={isDark}
              headingColor={headingColor}
              bodyColor={bodyColor}
              borderColor={borderColor}
              cardStyle={cardStyle}
              onRemove={onRemoveFavorite}
            />
          ))}
        </SimpleGrid>
      )}
    </section>
  );
}
