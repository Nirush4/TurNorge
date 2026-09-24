import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import {
  ArrowRight,
  Bookmark,
  Compass,
  Database,
  Landmark,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HikingArticlesSection } from '@/components/home/HikingArticlesSection';
import { useAppState } from '@/context/AppStateContext';

const FEATURES = [
  {
    icon: Database,
    title: 'Open public data',
    body: 'Trip advice is structured around MET.no locationforecast fields and Kartverket place metadata so plans stay grounded in Norwegian open data.',
    featured: true,
  },
  {
    icon: Landmark,
    title: 'Allemannsretten, taught well',
    body: 'The Right to Roam is a civic duty as much as a freedom. Learn campfire rules, distance-to-houses, and how to leave no trace.',
    featured: false,
  },
  {
    icon: ShieldCheck,
    title: 'Local-first favorites',
    body: 'Saved routes stay in your browser. Nothing is required to log in; this is a free public utility, not a tracking product.',
    featured: false,
  },
] as const;

const POPULAR_REGIONS = [
  {
    title: 'Jotunheimen National Park',
    subtitle: 'Home to Galdhøpiggen & Besseggen ridge trails',
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    tag: 'Alpine Ridges',
    main: true,
  },
  {
    title: 'Lofoten Islands',
    subtitle: 'Dramatic peaks rising straight from the Arctic sea',
    image:
      'https://images.unsplash.com/photo-1601823984263-b87b59798b70?q=80&w=1000&auto=format&fit=crop',
    tag: 'Coastal Peaks',
    main: false,
  },
  {
    title: 'Hardangervidda',
    subtitle: 'Europe’s largest mountain plateau wilderness',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tag: 'Vast Plateaus',
    main: false,
  },
] as const;

const SAFETY_TIPS = [
  {
    title: 'Plan according to ability',
    description:
      'Know your route, check physical fitness requirements, and always consult local weather updates before departure.',
  },
  {
    title: 'Respect the weather',
    description:
      'Mountain weather changes rapidly in Norway. Always carry wind/waterproof layers, maps, and a compass.',
  },
  {
    title: 'Turn back in time',
    description:
      'There is no shame in turning back if conditions deteriorate or fatigue sets in. Safety always comes before summiting.',
  },
] as const;

export function HomePage() {
  const { savedRoutes } = useAppState();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#f1f5f2' : '#112219';
  const bodyColor = isDark ? '#cbd5ce' : '#4a5d53';
  const cardBackground = isDark ? '#112219' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)';

  return (
    <Box
      component="main"
      style={{
        width: '100%',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
      }}
    >
      <Box
        component="section"
        aria-labelledby="hero-title"
        style={{
          width: '100vw',
          minHeight: '100vh',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          backgroundImage: `linear-gradient(to bottom, rgba(7,16,11,0.2) 0%, rgba(7,16,11,0.6) 70%, rgba(7,16,11,0.85) 100%), url('https://images.unsplash.com/photo-1752350180629-89eedb2f31cd?q=80&w=1470&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '6rem',
        }}
      >
        <Container
          size="lg"
          style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 2 }}
        >
          <Box p={{ base: 'md', md: 'xl' }}>
            <Grid gutter={{ base: 'xl', md: '2xl' }} align="center">
              <Grid.Col span={{ base: 12, md: 9 }} p="sm">
                <Stack gap="xl">
                  <Badge
                    variant="light"
                    color="teal"
                    size="lg"
                    radius="sm"
                    w="fit-content"
                    style={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: 'rgba(17, 34, 25, 0.65)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <Box component="span" mr={6} aria-hidden="true">
                      🇳🇴
                    </Box>{' '}
                    TurNorge · Norway hiking guide
                  </Badge>

                  <Title
                    id="hero-title"
                    order={1}
                    c="#ffffff"
                    fz={{ base: '2rem', sm: '2.8rem', md: '3.4rem' }}
                    lh={1.15}
                    fw={700}
                    style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
                  >
                    Explore Norway’s mountains and trails safely.
                  </Title>

                  <Text
                    size="xl"
                    c="rgba(255,255,255,0.9)"
                    maw={650}
                    lh={1.6}
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                  >
                    TurNorge combines open data, weather forecasts, and outdoor guidelines to help
                    you plan routes, packing lists, and responsible camping trips.
                  </Text>

                  <Group mt="md" gap="md" wrap="wrap">
                    <Button
                      component={Link}
                      to="/planner"
                      size="lg"
                      color="teal"
                      radius="md"
                      rightSection={<ArrowRight size={18} />}
                      style={{ fontWeight: 600, boxShadow: '0 8px 25px rgba(0, 150, 130, 0.3)' }}
                      aria-label="Plan your custom trip with TurNorge"
                    >
                      Plan Your Trip
                    </Button>

                    <Button
                      component={Link}
                      to="/explore"
                      size="lg"
                      variant="outline"
                      color="white"
                      radius="md"
                      leftSection={<Compass size={18} />}
                      aria-label="Explore Norwegian hiking trails and transport"
                      style={{
                        color: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      Explore Trails
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container size="lg" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <Stack gap={120} pb={100}>
          <Box component="section" aria-labelledby="features-heading">
            <Box mb="xl" maw={600}>
              <Badge variant="outline" color="teal" size="sm" radius="sm" mb="xs">
                Platform Standards
              </Badge>
              <Title
                id="features-heading"
                order={2}
                size="h1"
                c={headingColor}
                fw={800}
                style={{ letterSpacing: '-0.02em' }}
              >
                Why use TurNorge?
              </Title>
              <Text size="lg" c={bodyColor} mt={12}>
                Built for outdoor enthusiasts who value open standards and local privacy.
              </Text>
            </Box>

            <Grid gutter="lg">
              {FEATURES.map((feature) => {
                const isFeatured = feature.featured;
                return (
                  <Grid.Col key={feature.title} span={{ base: 12, md: isFeatured ? 7 : 5 }}>
                    <Card
                      padding="xl"
                      radius="lg"
                      withBorder
                      component="article"
                      style={{
                        backgroundColor: cardBackground,
                        border: `1px solid ${borderColor}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isDark
                          ? '0 10px 30px rgba(0,0,0,0.3)'
                          : '0 10px 30px rgba(17,34,25,0.02)',
                      }}
                    >
                      <div>
                        <Group justify="space-between" align="flex-start" mb="xl">
                          <ThemeIcon
                            size={56}
                            radius="md"
                            variant="light"
                            color="teal"
                            aria-hidden="true"
                          >
                            <feature.icon size={28} />
                          </ThemeIcon>
                          {isFeatured && (
                            <Badge variant="light" color="teal" size="sm">
                              Core Protocol
                            </Badge>
                          )}
                        </Group>

                        <Title
                          order={3}
                          size={isFeatured ? 'h2' : 'h3'}
                          c={headingColor}
                          mb={12}
                          fw={700}
                        >
                          {feature.title}
                        </Title>

                        <Text size="md" c={bodyColor} lh={1.7}>
                          {feature.body}
                        </Text>
                      </div>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Box>

          <Box component="section" aria-labelledby="regions-heading">
            <Group justify="space-between" align="flex-end" mb="xl">
              <Box maw={600}>
                <Badge variant="outline" color="teal" size="sm" radius="sm" mb="xs">
                  Destinations
                </Badge>
                <Title
                  id="regions-heading"
                  order={2}
                  size="h1"
                  c={headingColor}
                  fw={800}
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Featured Regions
                </Title>
                <Text size="lg" c={bodyColor} mt={12}>
                  Discover breathtaking landscapes mapped for hikers and nature lovers.
                </Text>
              </Box>
              <Button
                component={Link}
                to="/explore"
                variant="subtle"
                color="teal"
                size="md"
                rightSection={<ArrowRight size={16} />}
                visibleFrom="sm"
                style={{ fontWeight: 600 }}
              >
                View all trails
              </Button>
            </Group>

            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Card
                  padding="xl"
                  radius="lg"
                  withBorder
                  component={Link}
                  to="/explore"
                  style={{
                    backgroundColor: cardBackground,
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    backgroundImage: `linear-gradient(to top, rgba(7,16,11,0.95) 0%, rgba(7,16,11,0.7) 45%, rgba(7,16,11,0.25) 75%, transparent 100%), url(${POPULAR_REGIONS[0].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <Badge
                    variant="filled"
                    color="teal"
                    size="sm"
                    radius="sm"
                    w="fit-content"
                    mb="sm"
                  >
                    {POPULAR_REGIONS[0].tag}
                  </Badge>
                  <Title
                    order={3}
                    size="h1"
                    c="#ffffff"
                    mb={8}
                    fw={800}
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {POPULAR_REGIONS[0].title}
                  </Title>
                  <Text size="lg" c="rgba(255,255,255,0.85)">
                    {POPULAR_REGIONS[0].subtitle}
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack h="100%" justify="space-between" gap="lg">
                  {POPULAR_REGIONS.slice(1).map((region) => (
                    <Card
                      key={region.title}
                      padding="lg"
                      radius="lg"
                      withBorder
                      component={Link}
                      to="/explore"
                      style={{
                        backgroundColor: cardBackground,
                        height: '194px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        backgroundImage: `linear-gradient(to top, rgba(7,16,11,0.95) 0%, rgba(7,16,11,0.7) 45%, rgba(7,16,11,0.2) 80%, transparent 100%), url(${region.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        textDecoration: 'none',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Badge
                        variant="filled"
                        color="teal"
                        size="xs"
                        radius="sm"
                        w="fit-content"
                        mb="xs"
                      >
                        {region.tag}
                      </Badge>
                      <Title order={3} size="h3" c="#ffffff" mb={4} fw={700}>
                        {region.title}
                      </Title>
                      <Text size="sm" c="rgba(255,255,255,0.8)">
                        {region.subtitle}
                      </Text>
                    </Card>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Box>

          <Box component="section">
            <HikingArticlesSection
              headingColor={headingColor}
              bodyColor={bodyColor}
              cardBackground={cardBackground}
              borderColor={borderColor}
            />
          </Box>

          <Box
            component="section"
            aria-labelledby="safety-heading"
            style={{
              backgroundColor: isDark ? 'rgba(17, 34, 25, 0.4)' : 'rgba(235, 245, 239, 0.5)',
              borderRadius: '24px',
              border: `1px solid ${borderColor}`,
              padding: '4rem 2.5rem',
            }}
          >
            <Stack gap="xl">
              <Box ta="center" maw={700} mx="auto">
                <Badge variant="light" color="teal" size="lg" radius="sm" mb="sm">
                  Mountain Code
                </Badge>
                <Title
                  id="safety-heading"
                  order={2}
                  size="h1"
                  c={headingColor}
                  fw={800}
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Fjellvettreglene for Safe Trips
                </Title>
                <Text size="lg" c={bodyColor} mt={12}>
                  Norway's historic code of conduct for safe mountain touring, adapted for modern
                  explorers.
                </Text>
              </Box>

              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mt="md">
                {SAFETY_TIPS.map((tip, idx) => (
                  <Card
                    key={tip.title}
                    padding="xl"
                    radius="lg"
                    withBorder
                    style={{
                      backgroundColor: cardBackground,
                      border: `1px solid ${borderColor}`,
                      boxShadow: isDark
                        ? '0 4px 20px rgba(0,0,0,0.2)'
                        : '0 4px 20px rgba(0,0,0,0.02)',
                    }}
                  >
                    <Group gap="sm" mb="lg">
                      <ThemeIcon size={40} radius="md" variant="light" color="teal">
                        <CheckCircle2 size={22} />
                      </ThemeIcon>
                      <Text fw={700} size="lg" c={headingColor}>
                        Rule 0{idx + 1}
                      </Text>
                    </Group>
                    <Title order={3} size="h3" c={headingColor} mb={10} fw={700}>
                      {tip.title}
                    </Title>
                    <Text size="md" c={bodyColor} lh={1.7}>
                      {tip.description}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Box>

          <Card
            withBorder
            p="xl"
            radius="lg"
            component="section"
            aria-labelledby="storage-status-heading"
            style={{
              backgroundColor: cardBackground,
              border: `1px solid ${borderColor}`,
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(17,34,25,0.03)',
            }}
          >
            <Group justify="space-between" align="center" wrap="wrap" gap="lg">
              <Group gap="lg">
                <ThemeIcon size={54} radius="md" variant="light" color="teal" aria-hidden="true">
                  <Bookmark size={26} />
                </ThemeIcon>
                <div>
                  <Title order={2} id="storage-status-heading" size="h3" c={headingColor} fw={700}>
                    Local Storage Status
                  </Title>
                  <Text size="md" c={bodyColor} mt={4}>
                    {savedRoutes.length === 0
                      ? 'No saved routes yet. Pin a trail or generate a plan to keep it on this device.'
                      : `${savedRoutes.length} active route${savedRoutes.length === 1 ? '' : 's'} securely saved to browser storage.`}
                  </Text>
                </div>
              </Group>

              <Button
                component={Link}
                to="/favorites"
                variant="light"
                color="teal"
                size="md"
                radius="md"
                style={{ fontWeight: 600 }}
                rightSection={<ArrowRight size={16} />}
              >
                Manage Favorites
              </Button>
            </Group>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
