import { formatDepartureCountdown } from '@/utils/formatDepartureCountdown';
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';

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

import { IconBus, IconTrain, IconShip, IconMapPin } from '@tabler/icons-react';

function getTransportModeBadge(mode: string) {
  switch (mode.toLowerCase()) {
    case 'metro':
      return { label: 'Metro', color: 'blue', icon: <IconTrain size={14} /> };
    case 'rail':
    case 'train':
      return { label: 'Train', color: 'grape', icon: <IconTrain size={14} /> };
    case 'bus':
      return { label: 'Bus', color: 'orange', icon: <IconBus size={14} /> };
    case 'tram':
      return { label: 'Tram', color: 'cyan', icon: <IconTrain size={14} /> };
    case 'water':
    case 'ferry':
      return { label: 'Ferry', color: 'teal', icon: <IconShip size={14} /> };
    default:
      return {
        label: mode.charAt(0).toUpperCase() + mode.slice(1),
        color: 'gray',
        icon: <IconMapPin size={14} />,
      };
  }
}

export function TrailTransitBoard({ loadingTransit, stationData }: TrailTransitBoardProps) {
  return (
    <Card withBorder>
      <Title order={4} mb="xs">
        Public Transport & Platform Board (Entur)
      </Title>
      {loadingTransit ? (
        <Text size="sm" mt="xs" c="dimmed">
          Locating nearby station departures and platform feeds...
        </Text>
      ) : stationData ? (
        <Stack gap="md" mt="xs">
          <Group justify="space-between">
            <Text size="md" c="lime" fw={600}>
              Station: {stationData.name}
            </Text>
          </Group>
          {stationData.estimatedCalls.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stationData.estimatedCalls.map((call, index) => {
                const { timeStr, countdownStr, isUrgent, isPast } = formatDepartureCountdown(
                  call.expectedDepartureTime,
                );
                const modeInfo = getTransportModeBadge(call.serviceJourney.line.transportMode);
                const destinationText = call.serviceJourney.line.name || '';

                return (
                  <div key={index}>
                    {/* Desktop / Tablet Grid Table Layout with Aligned Center Items */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40% 20% 40%',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      className="mantine-visible-from-sm"
                    >
                      {/* Column 1: Route & Destination */}
                      <Stack
                        gap={4}
                        style={{
                          alignItems: 'flex-start',
                          textAlign: 'left',
                          paddingRight: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <Group gap="xs" wrap="nowrap" justify="flex-start">
                          <Badge
                            size="md"
                            color={modeInfo.color}
                            variant="light"
                            leftSection={modeInfo.icon}
                            style={{ flexShrink: 0 }}
                          >
                            {modeInfo.label}
                          </Badge>
                          <Badge size="md" variant="filled" style={{ flexShrink: 0 }}>
                            Line {call.serviceJourney.line.publicCode}
                          </Badge>
                        </Group>
                        <div className="destination-marquee-container" style={{ width: '100%' }}>
                          <Text size="sm" className="destination-marquee-text" fw={500}>
                            {destinationText}
                          </Text>
                        </div>
                      </Stack>

                      {/* Column 2: Platform */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                      >
                        {call.quay?.publicCode ? (
                          <Badge size="md" variant="outline" color="gray">
                            Pl. {call.quay.publicCode}
                          </Badge>
                        ) : (
                          <Text size="xs" c="dimmed">
                            -
                          </Text>
                        )}
                      </div>

                      {/* Column 3: Time & Countdown */}
                      <Stack
                        gap={2}
                        style={{
                          alignItems: 'flex-start',
                          textAlign: 'left',
                        }}
                      >
                        <Text fw={600} size="md" style={{ whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                          {timeStr}
                        </Text>
                        <Text
                          size="xs"
                          c={isPast ? 'dimmed' : isUrgent ? 'red' : 'green'}
                          fw={isUrgent || !isPast ? 600 : 400}
                          style={{ whiteSpace: 'nowrap', lineHeight: 1.2 }}
                        >
                          {countdownStr}
                        </Text>
                      </Stack>
                    </div>

                    {/* Mobile Stack Layout */}
                    <Stack gap={4} hiddenFrom="sm" style={{ width: '100%', textAlign: 'left' }}>
                      <Group gap="xs" wrap="nowrap" justify="space-between">
                        <Group gap="xs" wrap="nowrap">
                          <Badge
                            size="md"
                            color={modeInfo.color}
                            variant="light"
                            leftSection={modeInfo.icon}
                          >
                            {modeInfo.label}
                          </Badge>
                          <Badge size="sm" variant="filled">
                            Line {call.serviceJourney.line.publicCode}
                          </Badge>
                        </Group>
                        {call.quay?.publicCode && (
                          <Badge size="md" variant="outline" color="gray">
                            Pl. {call.quay.publicCode}
                          </Badge>
                        )}
                      </Group>

                      <div className="destination-marquee-container" style={{ width: '100%' }}>
                        <Text size="sm" className="destination-marquee-text" fw={500}>
                          {destinationText}
                        </Text>
                      </div>

                      <Group
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        style={{ width: '100%' }}
                      >
                        <Text fw={600} size="md">
                          {timeStr}
                        </Text>
                        <Text
                          size="sm"
                          c={isPast ? 'dimmed' : isUrgent ? 'red' : 'green'}
                          fw={isUrgent || !isPast ? 600 : 500}
                        >
                          {countdownStr}
                        </Text>
                      </Group>
                    </Stack>
                  </div>
                );
              })}
            </div>
          ) : (
            <Text size="md" c="dimmed">
              No upcoming departures available for this station right now.
            </Text>
          )}
        </Stack>
      ) : (
        <Text size="md" mt="xs" c="dimmed">
          No public transport station found within range of this trail.
        </Text>
      )}
    </Card>
  );
}
