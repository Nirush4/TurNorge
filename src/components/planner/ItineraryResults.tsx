import { Button, Card, Group, List, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconCloudRain } from '@tabler/icons-react';
import type { ExtendedGeneratedPlan } from './plannerUtils';

interface ItineraryResultsProps {
  extendedPlan: ExtendedGeneratedPlan;
  isFavorite: boolean;
  loadingDayId: number | null;
  handleSaveFavorite: () => Promise<void>;
  handleOpenWeatherDashboard: (regionName: string, dayIndex: number) => Promise<void>;
  headingColor: string;
  bodyColor: string;
  accentCardStyle: React.CSSProperties;
  simpleCardStyle: React.CSSProperties;
}

export function ItineraryResults({
  extendedPlan,
  isFavorite,
  loadingDayId,
  handleSaveFavorite,
  handleOpenWeatherDashboard,
  headingColor,
  bodyColor,
  accentCardStyle,
  simpleCardStyle,
}: ItineraryResultsProps) {
  return (
    <Stack gap="md" component="section" aria-label="Generated Itinerary Results">
      <Card withBorder={false} padding="lg" style={accentCardStyle}>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} c={headingColor}>
              {extendedPlan.title}
            </Title>
            <Text size="lg" mt="sm" c={bodyColor}>
              {extendedPlan.overview}
            </Text>
          </div>
          <Button
            variant="filled"
            radius="md"
            color="teal"
            size="md"
            disabled={isFavorite}
            onClick={handleSaveFavorite}
            aria-label={isFavorite ? 'Route saved to favorites' : 'Save route to favorites'}
          >
            {isFavorite ? 'Saved' : 'Save to Favorites'}
          </Button>
        </Group>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {extendedPlan.days.map((day) => (
          <Card
            key={day.day}
            withBorder={false}
            padding="md"
            component="article"
            style={simpleCardStyle}
          >
            <Stack justify="space-between" h="100%">
              <div>
                <Title fz={{ base: '1.4rem', sm: '1.5rem' }} order={3} c={headingColor}>
                  Day {day.day}: {day.title}
                </Title>
                <Text size="md" mt="sm" c={bodyColor}>
                  {day.summary}
                </Text>
                <Text size="lg" mt="sm" fw={500} c={headingColor}>
                  {day.distanceKm} km · {day.elevationGainM} m elevation gain
                </Text>
                <Text size="md" mt={4} c={bodyColor}>
                  {day.overnight}
                </Text>
                <Text size="lg" c="dimmed" mt={4}>
                  {day.weatherNote}
                </Text>
              </div>

              <Button
                variant="light"
                color="teal"
                size="md"
                mt="md"
                radius="md"
                loading={loadingDayId === day.day - 1}
                leftSection={<IconCloudRain size={16} aria-hidden="true" />}
                onClick={() => handleOpenWeatherDashboard(extendedPlan.region, day.day - 1)}
                aria-label={`Open live meteorological dashboard for Day ${day.day}`}
              >
                Live Weather Dashboard
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Card withBorder={false} padding="lg" style={simpleCardStyle}>
        <Title order={3} c={headingColor}>
          Packing List
        </Title>
        <List
          mt="sm"
          fz="lg"
          aria-label="Required packing list items"
          styles={{ item: { color: bodyColor } }}
        >
          {extendedPlan.packingList.map((item) => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
      </Card>

      <Card withBorder={false} padding="lg" style={simpleCardStyle}>
        <Title order={3} c={headingColor}>
          Safety Disclaimers
        </Title>
        <List
          mt="sm"
          fz="lg"
          aria-label="Important safety and emergency notes"
          styles={{ item: { color: bodyColor } }}
        >
          {extendedPlan.safetyDisclaimers.map((item) => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
      </Card>
    </Stack>
  );
}
