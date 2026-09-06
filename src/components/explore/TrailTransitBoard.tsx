import { Badge, Card, Group, List, Stack, Text, Title } from '@mantine/core';

interface StopPlaceData {
  name: string;
  id: string;
  estimatedCalls: Array<{
    expectedDepartureTime: string;
    aimedDepartureTime: string;
    realtime: boolean;
    quay: { publicCode: string | null } | null;
    serviceJourney: {
      line: {
        publicCode: string;
        name: string | null;
        transportMode: string;
      };
    };
  }>;
}

interface TrailTransitBoardProps {
  loadingTransit: boolean;
  stationData: StopPlaceData | null;
}

function getTransportModeBadge(mode: string) {
  switch (mode.toLowerCase()) {
    case 'metro':
      return { label: '🚇 T-bane', color: 'blue' };
    case 'rail':
    case 'train':
      return { label: '🚆 Train', color: 'grape' };
    case 'bus':
      return { label: '🚌 Bus', color: 'orange' };
    case 'tram':
      return { label: '🚋 Tram', color: 'cyan' };
    case 'water':
    case 'ferry':
      return { label: '⛴️ Ferry', color: 'teal' };
    default:
      return { label: `🚏 ${mode}`, color: 'gray' };
  }
}

export function TrailTransitBoard({ loadingTransit, stationData }: TrailTransitBoardProps) {
  return (
    <Card withBorder>
      <Title order={4}>Public Transport & Platform Board (Entur)</Title>
      {loadingTransit ? (
        <Text size="sm" mt="xs" c="dimmed">
          Locating nearby station departures and platform feeds...
        </Text>
      ) : stationData ? (
        <Stack gap="xs" mt="xs">
          <Group justify="space-between">
            <Text size="sm" fw={600}>
              Station: {stationData.name}
            </Text>
          </Group>
          {stationData.estimatedCalls.length > 0 ? (
            <List size="sm" spacing="xs">
              {stationData.estimatedCalls.map((call, index) => {
                const timeStr = new Date(call.expectedDepartureTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const modeInfo = getTransportModeBadge(call.serviceJourney.line.transportMode);

                return (
                  <List.Item key={index}>
                    <Group gap="xs" wrap="nowrap">
                      <Badge size="sm" color={modeInfo.color} variant="light">
                        {modeInfo.label}
                      </Badge>
                      <Badge size="sm" variant="filled">
                        Line {call.serviceJourney.line.publicCode}
                      </Badge>
                      <Text span size="sm" truncate>
                        {call.serviceJourney.line.name || ''}
                      </Text>
                      {call.quay?.publicCode && (
                        <Badge size="sm" variant="outline" color="gray">
                          Platform {call.quay.publicCode}
                        </Badge>
                      )}
                      <Text span fw={500} ml="auto" style={{ whiteSpace: 'nowrap' }}>
                        {timeStr} {call.realtime}
                      </Text>
                    </Group>
                  </List.Item>
                );
              })}
            </List>
          ) : (
            <Text size="sm" c="dimmed">
              No upcoming departures available for this station right now.
            </Text>
          )}
        </Stack>
      ) : (
        <Text size="sm" mt="xs" c="dimmed">
          No public transport station found within range of this trail.
        </Text>
      )}
    </Card>
  );
}
