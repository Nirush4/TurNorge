import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
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

  const headingColor = isDark ? '#f1f5f2' : '#183024';
  const bodyColor = isDark ? '#d5e0d9' : '#43544b';
  const cardBackground = isDark ? '#182c23' : '#f4f8f5';
  const borderColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)';

  return (
    <Container size="lg" py="md" px="0" component="main" mih="100dvh">
      <Stack gap="xl">
        <Card
          padding="xl"
          radius="lg"
          withBorder
          component="section"
          aria-labelledby="hero-title"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Grid gutter={{ base: 'xl', md: '2xl' }} align="center">
            <Grid.Col span={{ base: 12, md: 6 }} p={0}>
              <Stack gap="md">
                <Badge variant="light" color="moss" size="lg" w="fit-content">
                  TurNorge · Norway hiking guide
                </Badge>

                <Title
                  id="hero-title"
                  order={1}
                  c={headingColor}
                  styles={{
                    root: {
                      fontSize: 'clamp(2.5rem, 5vw, 3.2rem)',
                      lineHeight: 1.15,
                    },
                  }}
                >
                  Explore Norway’s mountains and ski slopes safely.
                </Title>

                <Text size="lg" c={bodyColor} maw={640} lh={1.6}>
                  TurNorge brings together open geographic data, weather information, and Norwegian
                  outdoor guidelines to help you plan routes, packing lists, and
                  Allemannsretten-aware camping trips.
                </Text>

                <Group mt="sm" gap="md" wrap="wrap">
                  <Button
                    component={Link}
                    to="/planner"
                    size="md"
                    color="moss"
                    aria-label="Plan your custom trip with TurNorge"
                    styles={{
                      root: {
                        minHeight: '44px',
                        '&:focus-visible': {
                          outline: '3px solid #f0c75e',
                          outlineOffset: '3px',
                        },
                      },
                    }}
                  >
                    Plan Your Trip
                  </Button>

                  <Button
                    component={Link}
                    to="/explore"
                    size="md"
                    variant="outline"
                    color={isDark ? 'gray' : 'pine'}
                    aria-label="Explore Norwegian hiking trails and transport"
                    styles={{
                      root: {
                        minHeight: '44px',
                        '&:focus-visible': {
                          outline: '3px solid #f0c75e',
                          outlineOffset: '3px',
                        },
                      },
                    }}
                  >
                    Explore Transport
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <div
                aria-hidden="true"
                style={{
                  width: '100%',
                  minHeight: '280px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '65%',
                    height: '65%',
                  }}
                />

                <img
                  src="/mountain.svg"
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 1,
                    opacity: isDark ? 0.8 : 0.7,
                    filter: isDark ? 'brightness(0) invert(1)' : 'grayscale(1) brightness(0.7)',
                  }}
                />
              </div>
            </Grid.Col>
          </Grid>
        </Card>

        <section aria-labelledby="features-heading">
          <Title id="features-heading" order={2} size="h2" c={headingColor} mb="md">
            Why use TurNorge?
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                padding="lg"
                radius="md"
                withBorder
                component="article"
                style={{
                  backgroundColor: cardBackground,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <feature.icon size={24} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />

                <Title order={3} mt="sm" size="h4" c={headingColor}>
                  {feature.title}
                </Title>

                <Text size="sm" mt="xs" c={bodyColor} lh={1.6}>
                  {feature.body}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </section>

        <Card
          withBorder
          padding="lg"
          component="section"
          aria-labelledby="storage-status-heading"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
          <Title order={2} id="storage-status-heading" size="h3" c={headingColor}>
            Saved locally
          </Title>

          <Text size="sm" mt="xs" c={bodyColor} lh={1.6}>
            {savedRoutes.length === 0
              ? 'No saved routes yet. Generate a plan or pin a trail and it will be stored in this browser only.'
              : `${savedRoutes.length} saved route${
                  savedRoutes.length === 1 ? '' : 's'
                } on this device.`}
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
