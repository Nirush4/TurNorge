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
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HikingArticlesSection } from '@/components/home/HikingArticlesSection';
import { useAppState } from '@/context/AppStateContext';

const FEATURES = [
  {
    icon: Database,
    title: 'Open public data',
    body: 'Trip advice is structured around MET.no locationforecast fields and Kartverket place metadata so plans stay grounded in Norwegian open data.',
    badge: 'Core Protocol',
  },
  {
    icon: Landmark,
    title: 'Allemannsretten, taught well',
    body: 'The Right to Roam is a civic duty as much as a freedom. Learn campfire rules, distance-to-houses, and how to leave no trace.',
    badge: 'Civic Standard',
  },
  {
    icon: ShieldCheck,
    title: 'Account synced favorites',
    body: 'Log in to save your favorite routes and access them securely across any device, keeping your hiking plans backed up.',
    badge: 'Cloud Synced',
  },
] as const;

const POPULAR_REGIONS = [
  {
    title: 'Jotunheimen National Park',
    subtitle: 'Home to Galdhøpiggen & Besseggen ridge trails',
    image:
      'https://jotunheimen.com/media/rygha0hw/i-veodalen.jpg?rmode=max&width=1920&height=1920&upscale=false&v=1dacfa2a4980a10',
    tag: 'Alpine Ridges',
    elevation: '2,469m peak',
    routesCount: '42 trails',
  },
  {
    title: 'Lofoten Islands',
    subtitle: 'Dramatic peaks rising straight from the Arctic sea',
    image:
      'https://images.unsplash.com/photo-1601823984263-b87b59798b70?q=80&w=1000&auto=format&fit=crop',
    tag: 'Coastal Peaks',
    elevation: 'Sea to Summit',
    routesCount: '28 trails',
  },
  {
    title: 'Hardangervidda',
    subtitle: 'Europe’s largest mountain plateau wilderness',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tag: 'Vast Plateaus',
    elevation: 'High Plateau',
    routesCount: '35 trails',
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
            <Stack align="center" ta="center" mb={50} maw={700} mx="auto">
              <Badge variant="light" color="teal" size="md" radius="sm">
                Platform Standards
              </Badge>
              <Title
                id="features-heading"
                order={2}
                size="h1"
                c={headingColor}
                fz={{ base: '1.8rem', sm: '2.5rem' }}
                style={{ letterSpacing: '-0.02em' }}
              >
                Why use TurNorge?
              </Title>
              <Text size="lg" c={bodyColor}>
                Built for outdoor enthusiasts who value open standards, safety, and local privacy.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  padding="xl"
                  radius="lg"
                  withBorder={false}
                  component="article"
                  style={{
                    backgroundColor: cardBackground,
                    borderTop: '4px solid #28726B',
                    borderBottom: `1px solid ${borderColor}`,
                    borderLeft: `1px solid ${borderColor}`,
                    borderRight: `1px solid ${borderColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark
                      ? '0 10px 30px rgba(0,0,0,0.3)'
                      : '0 10px 30px rgba(17,34,25,0.02)',
                  }}
                >
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <ThemeIcon
                        size={50}
                        radius="md"
                        variant="light"
                        color="teal"
                        aria-hidden="true"
                      >
                        <feature.icon size={24} />
                      </ThemeIcon>
                      <Badge variant="outline" color="teal" size="sm">
                        {feature.badge}
                      </Badge>
                    </Group>

                    <Title
                      order={3}
                      size="h3"
                      c={headingColor}
                      fz={{ base: '1.3rem', sm: '1.5rem' }}
                      fw={700}
                    >
                      {feature.title}
                    </Title>

                    <Text size="md" c={bodyColor} lh={1.7}>
                      {feature.body}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          <Box component="section" aria-labelledby="regions-heading">
            <Group justify="space-between" align="flex-end" mb="xl" wrap="wrap" gap="md">
              <Box maw={600}>
                <Badge
                  variant="light"
                  color="teal"
                  size="md"
                  radius="sm"
                  mb="xs"
                  leftSection={<Sparkles size={14} />}
                >
                  Destinations
                </Badge>
                <Title
                  id="regions-heading"
                  order={2}
                  size="h1"
                  c={headingColor}
                  fz={{ base: '1.7rem', sm: '2.5rem' }}
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
                size="lg"
                rightSection={<ArrowRight size={16} />}
                visibleFrom="sm"
                style={{ fontWeight: 600 }}
              >
                View all trails
              </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {POPULAR_REGIONS.map((region) => (
                <Card
                  key={region.title}
                  padding="lg"
                  radius="lg"
                  component={Link}
                  to="/explore"
                  withBorder={false}
                  style={{
                    backgroundColor: 'transparent',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundImage: `linear-gradient(to top, rgba(7,16,11,0.92) 0%, rgba(7,16,11,0.15) 50%), url(${region.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: isDark
                      ? '0 10px 30px rgba(0,0,0,0.4)'
                      : '0 10px 30px rgba(17,34,25,0.06)',
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Badge
                      variant="filled"
                      color="teal"
                      size="sm"
                      radius="sm"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      {region.tag}
                    </Badge>
                    <Group
                      gap={6}
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <MapPin size={13} color="#38bdf8" />
                      <Text size="xs" c="white" fw={600}>
                        {region.routesCount}
                      </Text>
                    </Group>
                  </Group>

                  <Stack gap={6}>
                    <Text
                      size="md"
                      c="teal"
                      fw={600}
                      tt="uppercase"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      {region.elevation}
                    </Text>
                    <Title
                      order={3}
                      size="h3"
                      c="#ffffff"
                      style={{ letterSpacing: '-0.02em' }}
                      fz={{ base: '1.25rem', sm: '1.4rem' }}
                    >
                      {region.title}
                    </Title>
                    <Text size="md" c="rgba(255,255,255,0.85)" lineClamp={2}>
                      {region.subtitle}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            <Button
              component={Link}
              to="/explore"
              variant="light"
              color="teal"
              size="md"
              fullWidth
              mt="xl"
              hiddenFrom="sm"
              rightSection={<ArrowRight size={16} />}
              style={{ fontWeight: 600 }}
            >
              View all trails
            </Button>
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
              borderTop: `1px solid ${borderColor}`,
              borderBottom: `1px solid ${borderColor}`,
              borderLeft: `1px solid ${borderColor}`,
              borderRight: `1px solid ${borderColor}`,
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
                  fz={{ base: '1.7rem', sm: '2.5rem' }}
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Mountain Safety Code for Safe Trips
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
                    withBorder={false}
                    style={{
                      backgroundColor: cardBackground,
                      borderTop: `1px solid ${borderColor}`,
                      borderBottom: `1px solid ${borderColor}`,
                      borderLeft: `1px solid ${borderColor}`,
                      borderRight: `1px solid ${borderColor}`,
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
                    <Text size="lg" c={bodyColor} lh={1.7}>
                      {tip.description}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Box>

          <Card
            withBorder={false}
            p="xl"
            radius="lg"
            component="section"
            aria-labelledby="storage-status-heading"
            style={{
              backgroundColor: cardBackground,
              borderTop: `1px solid ${borderColor}`,
              borderBottom: `1px solid ${borderColor}`,
              borderLeft: `1px solid ${borderColor}`,
              borderRight: `1px solid ${borderColor}`,
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(17,34,25,0.03)',
            }}
          >
            <Group justify="space-between" align="center" wrap="wrap" gap="lg">
              <Group gap="lg">
                <ThemeIcon size={54} radius="md" variant="light" color="teal" aria-hidden="true">
                  <Bookmark size={26} />
                </ThemeIcon>
                <div>
                  <Title
                    order={2}
                    id="storage-status-heading"
                    size="h3"
                    c={headingColor}
                    fz={{ base: '1.2rem', sm: '1.4rem' }}
                  >
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
