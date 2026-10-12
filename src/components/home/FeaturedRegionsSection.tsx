import { Badge, Box, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { POPULAR_REGIONS } from './homeData';

interface FeaturedRegionsSectionProps {
  headingColor: string;
  bodyColor: string;
}

export function FeaturedRegionsSection({ headingColor, bodyColor }: FeaturedRegionsSectionProps) {
  return (
    <Box component="section" aria-labelledby="regions-heading">
      <Group justify="space-between" align="flex-end" mb="xl" wrap="wrap" gap="md">
        <Box maw={600}>
          <Badge
            variant="light"
            color="teal"
            size="md"
            radius="sm"
            mb="xs"
            leftSection={<Sparkles size={14} aria-hidden="true" />}
          >
            Destinations
          </Badge>
          <Title
            id="regions-heading"
            order={2}
            size="h1"
            c={headingColor}
            fz={{ base: '1.6rem', sm: '2.5rem' }}
            style={{ letterSpacing: '-0.02em' }}
          >
            Featured Regions
          </Title>
          <Text size="md" c={bodyColor} mt={12}>
            Discover breathtaking landscapes mapped for hikers and nature lovers.
          </Text>
        </Box>
        <Button
          component={Link}
          to="/explore"
          variant="subtle"
          color="teal"
          size="lg"
          rightSection={<ArrowRight size={16} aria-hidden="true" />}
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
            aria-label={`Explore region: ${region.title}`}
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
                <MapPin size={13} color="#38bdf8" aria-hidden="true" />
                <Text size="xs" c="white" fw={600}>
                  {region.routesCount}
                </Text>
              </Group>
            </Group>

            <Stack gap={6}>
              <Text size="md" c="teal" fw={600} tt="uppercase" style={{ letterSpacing: '0.05em' }}>
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
        rightSection={<ArrowRight size={16} aria-hidden="true" />}
        style={{ fontWeight: 600, minHeight: '44px' }}
      >
        View all trails
      </Button>
    </Box>
  );
}
