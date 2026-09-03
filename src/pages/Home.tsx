import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Database, Landmark, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';

const FEATURES = [
  {
    icon: Database,
    title: 'Open public data',
    body: 'Trip advice is structured around MET.no locationforecast fields and Kartverket place metadata so plans stay grounded in Norwegian open data.',
  },
  {
    icon: Landmark,
    title: 'Allemannsretten, taught well',
    body: 'The Right to Roam is a civic duty as much as a freedom. Learn campfire rules, distance-to-houses, and how to leave no trace.',
  },
  {
    icon: ShieldCheck,
    title: 'Local-first favorites',
    body: 'Saved routes stay in your browser. Nothing is required to log in; this is a free public utility, not a tracking product.',
  },
] as const;

export function HomePage() {
  const { savedRoutes } = useAppState();

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Card className="hero-gradient" padding="xl" radius="lg" withBorder>
          <Badge variant="light" color="moss" mb="md">
            TurGPT · Norway hiking utility
          </Badge>
          <Title order={1} className="hero-title" maw={720}>
            Plan safer days in the Norwegian mountains with local-first AI.
          </Title>
          <Text mt="md" maw={640} className="hero-copy" size="lg">
            NordicTrail AI blends open geographic guidelines with an on-device trip assistant for
            weather-aware itineraries, packing lists, and Allemannsretten-aware camping advice.
          </Text>
          <Group mt="xl">
            <Button component={Link} to="/planner" size="md" color="moss">
              Plan a Trip with AI
            </Button>
            <Button component={Link} to="/explore" size="md" variant="white" color="pine">
              Explore Trails
            </Button>
          </Group>
        </Card>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {FEATURES.map((feature) => (
            <Card key={feature.title} padding="lg" radius="md" withBorder>
              <feature.icon size={22} aria-hidden="true" />
              <Title order={3} mt="sm">
                {feature.title}
              </Title>
              <Text size="sm" mt="xs">
                {feature.body}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Card withBorder padding="lg">
          <Title order={2}>Saved locally</Title>
          <Text size="sm" mt="xs">
            {savedRoutes.length === 0
              ? 'No saved routes yet. Generate a plan or pin a trail and it will be stored in this browser only.'
              : `${savedRoutes.length} saved route${savedRoutes.length === 1 ? '' : 's'} on this device.`}
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
