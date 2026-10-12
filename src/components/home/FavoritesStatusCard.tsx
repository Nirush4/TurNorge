import { Badge, Box, Button, Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FavoritesStatusCardProps {
  user: unknown;
  activeCount: number;
  headingColor: string;
  bodyColor: string;
  cardStyle: React.CSSProperties;
}

export function FavoritesStatusCard({
  user,
  activeCount,
  headingColor,
  bodyColor,
  cardStyle,
}: FavoritesStatusCardProps) {
  return (
    <Card
      withBorder={false}
      p="lg"
      radius="lg"
      component="section"
      aria-labelledby="favorites-status-heading"
      style={{
        ...cardStyle,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          borderTop: '4px solid #28726B',
        }}
      />

      <Group justify="space-between" align="center" wrap="wrap" gap="xl">
        <Group gap="md" align="flex-start">
          <ThemeIcon size={52} radius="md" variant="light" color="teal" aria-hidden="true">
            <Bookmark size={24} />
          </ThemeIcon>
          <Stack gap={4}>
            <Group gap="sm" align="center">
              <Title
                order={2}
                id="favorites-status-heading"
                size="h3"
                c={headingColor}
                fz={{ base: '1.2rem', sm: '1.35rem' }}
                fw={700}
              >
                {user ? 'Your Saved Adventures' : 'Sign in to see your favorite list'}
              </Title>
              <Badge
                variant="light"
                color={user ? (activeCount > 0 ? 'teal' : 'gray') : 'blue'}
                size="md"
                radius="sm"
              >
                {user ? (activeCount > 0 ? 'Ready to View' : 'No Trips Saved') : 'Account Required'}
              </Badge>
            </Group>
            <Text size="md" c={bodyColor} maw={550} lh={1.5}>
              {user
                ? activeCount === 0
                  ? 'You have no saved trails yet. Explore our maps or use the trip planner to bookmark your favorite hiking routes.'
                  : `You have ${activeCount} saved hike${activeCount === 1 ? '' : 's'} safely stored in your cloud account.`
                : 'Log in to your account to save your preferred trails, view your personalized bookmark list, and keep your hiking plans synced.'}
            </Text>
          </Stack>
        </Group>

        <Group gap="sm">
          <Button
            component={Link}
            to={user ? '/favorites' : '/login'}
            variant="light"
            color={user ? 'teal' : 'blue'}
            size="md"
            radius="md"
            style={{ fontWeight: 600, minHeight: '44px' }}
            rightSection={<ArrowRight size={16} aria-hidden="true" />}
          >
            {user ? 'View Saved Trips' : 'Log In Now'}
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
