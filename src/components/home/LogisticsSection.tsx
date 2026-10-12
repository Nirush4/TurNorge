import { Badge, Box, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Bus, Store } from 'lucide-react';

interface LogisticsSectionProps {
  headingColor: string;
  bodyColor: string;
  cardStyle: React.CSSProperties;
  sectionBoxStyle: React.CSSProperties;
}

export function LogisticsSection({
  headingColor,
  bodyColor,
  cardStyle,
  sectionBoxStyle,
}: LogisticsSectionProps) {
  return (
    <Box component="section" aria-labelledby="logistics-heading" style={sectionBoxStyle} p="lg">
      <Stack gap="xl">
        <Box ta="center" maw={700} mx="auto">
          <Badge variant="light" color="teal" size="md" radius="sm" mb="sm">
            Live Field Data
          </Badge>
          <Title
            id="logistics-heading"
            order={2}
            size="h1"
            c={headingColor}
            fz={{ base: '1.6rem', sm: '2.3rem' }}
            style={{ letterSpacing: '-0.02em' }}
          >
            Supplies & Real-Time Transit
          </Title>
          <Text size="md" c={bodyColor} mt={10}>
            Seamlessly connect your hiking destination with nearby local shops, gear suppliers, and
            live public transport updates.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card p="lg" radius="lg" withBorder={false} style={cardStyle}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <ThemeIcon size={46} radius="md" variant="light" color="teal">
                  <Store size={22} aria-hidden="true" />
                </ThemeIcon>
                <Badge variant="outline" color="teal" size="sm">
                  Provisions & Gear
                </Badge>
              </Group>
              <Title
                order={3}
                size="h3"
                c={headingColor}
                fz={{ base: '1.2rem', sm: '1.35rem' }}
                fw={700}
              >
                Nearby Supplies & Shops
              </Title>
              <Text size="md" c={bodyColor} lh={1.6}>
                Locate nearest grocery stores, mountain gear outlets, and gas stations relative to
                your selected destination so you never run out of food, fuel, or emergency
                provisions.
              </Text>
            </Stack>
          </Card>

          <Card padding="xl" radius="lg" withBorder={false} style={cardStyle}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <ThemeIcon size={46} radius="md" variant="light" color="teal">
                  <Bus size={22} aria-hidden="true" />
                </ThemeIcon>
                <Badge variant="outline" color="teal" size="sm">
                  Entur Real-Time API
                </Badge>
              </Group>
              <Title
                order={3}
                size="h3"
                c={headingColor}
                fz={{ base: '1.2rem', sm: '1.35rem' }}
                fw={700}
              >
                Public Transport & Platform Board (Entur)
              </Title>
              <Text size="md" c={bodyColor} lh={1.6}>
                Check live platform departures, regional buses, and train schedules in real time for
                trailheads and mountain transit hubs across Norway.
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
