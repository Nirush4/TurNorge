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
  useMantineColorScheme,
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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Container size="lg" py="xl" px="0" component="main">
      <Stack gap="xl">
        <Card
          padding="xl"
          radius="lg"
          withBorder
          component="section"
          aria-labelledby="hero-title"
          style={{
            backgroundColor: isDark ? '#182c23' : '#f4f8f5',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Badge variant="light" color="moss" mb="md" aria-label="Application badge">
            TurNorge · Norway hiking guide
          </Badge>

          <Title
            id="hero-title"
            order={1}
            maw={720}
            c={isDark ? '#eef4f1' : 'dark.8'}
            styles={{
              root: {
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              },
            }}
          >
            Plan safer days in the Norwegian mountains with trusted local guidance.
          </Title>

          <Text mt="md" maw={640} size="lg" c={isDark ? '#c3d1c9' : 'dimmed'}>
            TurNorge brings together open geographic data, weather information, and Norwegian
            outdoor guidelines to help you plan routes, packing lists, and Allemannsretten-aware
            camping trips.
          </Text>

          <Group mt="xl">
            <Button
              component={Link}
              to="/planner"
              size="md"
              color="moss"
              aria-label="Plan your custom trip"
            >
              Plan Your Trip
            </Button>

            <Button
              component={Link}
              to="/explore"
              size="md"
              variant="white"
              color="pine"
              aria-label="Explore popular Norwegian trails"
            >
              Explore Transport
            </Button>
          </Group>
        </Card>

        <SimpleGrid
          cols={{ base: 1, sm: 3 }}
          spacing="md"
          component="section"
          aria-label="Core platform features"
        >
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              padding="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: isDark ? '#182c23' : '#f4f8f5',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <feature.icon size={22} color="#2d7a2f" aria-hidden="true" />

              <Title order={3} mt="sm" size="h4" c={isDark ? '#eef4f1' : 'dark.8'}>
                {feature.title}
              </Title>

              <Text size="sm" mt="xs" c={isDark ? '#c3d1c9' : 'dimmed'}>
                {feature.body}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Card
          withBorder
          padding="lg"
          component="section"
          aria-labelledby="storage-status-heading"
          style={{
            backgroundColor: isDark ? '#182c23' : '#f4f8f5',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Title order={2} id="storage-status-heading" size="h3" c={isDark ? '#eef4f1' : 'dark.8'}>
            Saved locally
          </Title>

          <Text size="sm" mt="xs" c={isDark ? '#c3d1c9' : 'dimmed'}>
            {savedRoutes.length === 0
              ? 'No saved routes yet. Generate a plan or pin a trail and it will be stored in this browser only.'
              : `${savedRoutes.length} saved route${savedRoutes.length === 1 ? '' : 's'} on this device.`}
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
