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
  ThemeIcon,
  Box,
} from '@mantine/core';
import { Database, Landmark, ShieldCheck, Compass, ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { HikingArticlesSection } from '@/components/home/HikingArticlesSection';

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
  const cardBackground = isDark ? '#14251d' : '#f4f8f5';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  return (
    <Container size="lg" py="xl" px={0} pt="md" pb="xl" component="main" mih="100dvh">
      <Stack gap="xl">
        <Card
          p={{ base: 'lg', md: 'xl' }}
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
            <Grid.Col span={{ base: 12, md: 7 }} p="sm">
              <Stack gap="md">
                <Badge
                  variant="light"
                  color="teal"
                  size="lg"
                  radius="sm"
                  w="fit-content"
                  style={{ textTransform: 'none', fontWeight: 600 }}
                >
                  <Box component="span" mr={6} aria-hidden="true">
                    🇳🇴
                  </Box>{' '}
                  TurNorge · Norway hiking guide
                </Badge>

                <Title
                  id="hero-title"
                  order={1}
                  c={headingColor}
                  fz={{ base: '1.8rem', sm: '2.8rem', md: '3.0rem' }}
                  lh={1.15}
                  fw={700}
                >
                  Explore Norway’s mountains and trails safely.
                </Title>

                <Text size="lg" c={bodyColor} maw={600} lh={1.6}>
                  TurNorge combines open data, weather forecasts, and outdoor guidelines to help you
                  plan routes, packing lists, and responsible camping trips.
                </Text>

                <Group mt="xs" gap="md" wrap="wrap">
                  <Button
                    component={Link}
                    to="/planner"
                    size="md"
                    color="teal"
                    rightSection={<ArrowRight size={16} />}
                    aria-label="Plan your custom trip with TurNorge"
                  >
                    Plan Your Trip
                  </Button>

                  <Button
                    component={Link}
                    to="/explore"
                    size="md"
                    variant="outline"
                    color={isDark ? 'gray' : 'teal'}
                    leftSection={<Compass size={16} />}
                    aria-label="Explore Norwegian hiking trails and transport"
                  >
                    Explore Trails
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box
                aria-hidden="true"
                style={{
                  width: '100%',
                  minHeight: '260px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <img
                  src="/mountain.svg"
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: '100%',
                    maxWidth: '360px',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 1,
                    opacity: isDark ? 0.6 : 0.85,
                    filter: isDark
                      ? 'brightness(0) saturate(100%) invert(75%) sepia(10%) saturate(400%) hue-rotate(120deg)'
                      : 'none',
                  }}
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Features Section */}
        <section aria-labelledby="features-heading">
          <Box mb="md">
            <Title id="features-heading" order={2} size="h2" c={headingColor}>
              Why use TurNorge?
            </Title>
            <Text size="sm" c={bodyColor} mt={4}>
              Built for outdoor enthusiasts who value open standards and local privacy.
            </Text>
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                padding="md"
                radius="md"
                withBorder
                component="article"
                style={{
                  backgroundColor: cardBackground,
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <ThemeIcon
                  size={44}
                  radius="md"
                  variant="light"
                  color="teal"
                  mb="md"
                  aria-hidden="true"
                >
                  <feature.icon size={22} />
                </ThemeIcon>

                <Title order={3} size="h4" c={headingColor} mb={8}>
                  {feature.title}
                </Title>

                <Text size="sm" c={bodyColor} lh={1.6}>
                  {feature.body}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </section>

        {/* Hiking Articles / Guides Section */}
        <HikingArticlesSection
          headingColor={headingColor}
          bodyColor={bodyColor}
          cardBackground={cardBackground}
          borderColor={borderColor}
        />

        <Card
          withBorder
          p="md"
          radius="md"
          component="section"
          aria-labelledby="storage-status-heading"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="md">
              <ThemeIcon size={40} radius="md" variant="light" color="teal" aria-hidden="true">
                <Bookmark size={20} />
              </ThemeIcon>
              <div>
                <Title order={2} id="storage-status-heading" size="h4" c={headingColor}>
                  Local Storage Status
                </Title>
                <Text size="sm" c={bodyColor} mt={2}>
                  {savedRoutes.length === 0
                    ? 'No saved routes yet. Pin a trail or generate a plan to keep it on this device.'
                    : `${savedRoutes.length} active route${savedRoutes.length === 1 ? '' : 's'} securely saved to browser storage.`}
                </Text>
              </div>
            </Group>

            <Button
              component={Link}
              to="/favorites"
              variant="subtle"
              color="teal"
              size="sm"
              rightSection={<ArrowRight size={14} />}
            >
              Manage Favorites
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}
