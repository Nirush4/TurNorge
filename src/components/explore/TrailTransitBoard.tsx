import { formatDepartureCountdown } from '@/api/utils/formatDepartureCountdown';
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
        <Stack gap="md" mt="xs">
          <Group justify="space-between">
            <Text size="sm" c="lime" fw={600}>
              Station: {stationData.name}
            </Text>
          </Group>
          {stationData.estimatedCalls.length > 0 ? (
            <List size="sm" spacing="md">
              {stationData.estimatedCalls.map((call, index) => {
                const { timeStr, countdownStr, isUrgent } = formatDepartureCountdown(
                  call.expectedDepartureTime,
                );
                const modeInfo = getTransportModeBadge(call.serviceJourney.line.transportMode);
                const destinationText = call.serviceJourney.line.name || '';

                return (
                  <List.Item key={index}>
                    {/* Desktop / Tablet Row Layout (50/50 split) */}
                    <Group align="center" wrap="nowrap" visibleFrom="sm" style={{ width: '100%' }}>
                      <Stack
                        gap={2}
                        style={{
                          flex: '0 0 50%',
                          minWidth: '160px',
                          paddingRight: '12px',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                        }}
                      >
                        <Group gap="xs" wrap="nowrap" justify="flex-start">
                          <Badge
                            size="sm"
                            color="blue"
                            pt={2}
                            variant="light"
                            style={{ flexShrink: 0 }}
                          >
                            {modeInfo.label}
                          </Badge>
                          <Badge size="sm" variant="filled" style={{ flexShrink: 0 }}>
                            Line {call.serviceJourney.line.publicCode}
                          </Badge>
                        </Group>
                        <Text
                          size="xs"
                          truncate
                          style={{ paddingLeft: '2px', width: '100%', textAlign: 'left' }}
                        >
                          {destinationText}
                        </Text>
                      </Stack>

                      <Group
                        gap="xs"
                        align="center"
                        style={{
                          flex: '0 0 50%',
                          minWidth: '160px',
                          justifyContent: 'flex-start',
                          paddingLeft: '22px',
                        }}
                      >
                        {call.quay?.publicCode && (
                          <Badge size="sm" variant="outline" color="gray" style={{ flexShrink: 0 }}>
                            Pl. {call.quay.publicCode}
                          </Badge>
                        )}
                        <Stack
                          gap={0}
                          style={{ minWidth: 0, alignItems: 'flex-start', textAlign: 'left' }}
                        >
                          <Text
                            fw={600}
                            size="sm"
                            style={{ whiteSpace: 'nowrap', textAlign: 'left', lineHeight: 1.2 }}
                          >
                            {timeStr}
                          </Text>
                          <Text
                            size="xs"
                            c={isUrgent ? 'red' : 'dimmed'}
                            fw={isUrgent ? 600 : 400}
                            style={{ whiteSpace: 'nowrap', textAlign: 'left', lineHeight: 1.2 }}
                          >
                            {countdownStr}
                          </Text>
                        </Stack>
                      </Group>
                    </Group>

                    <Stack gap={6} hiddenFrom="sm" style={{ width: '100%', textAlign: 'left' }}>
                      <Group gap="xs" wrap="nowrap" justify="space-between">
                        <Group gap="xs" wrap="nowrap">
                          <Badge size="sm" color="blue" variant="light">
                            {modeInfo.label}
                          </Badge>
                          <Badge size="sm" variant="filled">
                            Line {call.serviceJourney.line.publicCode}
                          </Badge>
                        </Group>
                        {call.quay?.publicCode && (
                          <Badge size="sm" variant="outline" color="gray">
                            Pl. {call.quay.publicCode}
                          </Badge>
                        )}
                      </Group>

                      <Text size="xs" truncate style={{ width: '100%' }}>
                        {destinationText}
                      </Text>

                      <Group justify="space-between" align="center" style={{ width: '100%' }}>
                        <Text fw={600} size="sm">
                          {timeStr}
                        </Text>
                        <Text size="xs" c={isUrgent ? 'red' : 'dimmed'} fw={isUrgent ? 600 : 400}>
                          {countdownStr}
                        </Text>
                      </Group>
                    </Stack>
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
