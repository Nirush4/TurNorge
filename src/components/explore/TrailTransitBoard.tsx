import { formatDepartureCountdown } from '@/utils/formatDepartureCountdown';
import { Badge, Card, Group, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';

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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#ffffff' : '#112219';
  const bodyColor = isDark ? '#cbd5ce' : '#4a5d53';
  const cardBackground = isDark ? '#0d1c14' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)';

  return (
    <Card
      withBorder={false}
      style={{
        backgroundColor: cardBackground,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Title order={4} mb="xs" c={headingColor}>
        Public Transport & Platform Board (Entur)
      </Title>
      {loadingTransit ? (
        <Text size="sm" mt="xs" c={bodyColor}>
          Locating nearby station departures and platform feeds...
        </Text>
      ) : stationData ? (
        <Stack gap="md" mt="xs">
          <Group justify="space-between">
            <Text size="md" c={headingColor} fw={600}>
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
                const isLong = destinationText.length > 22;

                return (
                  <div key={index}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40% 20% 40%',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      className="mantine-visible-from-sm"
                    >
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
                          <Text
                            size="sm"
                            className={`destination-marquee-text ${isLong ? 'is-scrolling' : ''}`}
                            fw={500}
                            c={headingColor}
                          >
                            {destinationText}
                          </Text>
                        </div>
                      </Stack>

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
                          <Text size="xs" c={bodyColor}>
                            -
                          </Text>
                        )}
                      </div>

                      <Stack
                        gap={2}
                        style={{
                          alignItems: 'flex-start',
                          textAlign: 'left',
                        }}
                      >
                        <Text
                          fw={600}
                          size="md"
                          c={headingColor}
                          style={{ whiteSpace: 'nowrap', lineHeight: 1.2 }}
                        >
                          {timeStr}
                        </Text>
                        <Text
                          size="xs"
                          c={isPast ? bodyColor : isUrgent ? 'red' : 'green'}
                          fw={isUrgent || !isPast ? 600 : 400}
                          style={{ whiteSpace: 'nowrap', lineHeight: 1.2 }}
                        >
                          {countdownStr}
                        </Text>
                      </Stack>
                    </div>

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
                        <Text
                          size="sm"
                          className={`destination-marquee-text ${isLong ? 'is-scrolling' : ''}`}
                          fw={500}
                          c={headingColor}
                        >
                          {destinationText}
                        </Text>
                      </div>

                      <Group
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        style={{ width: '100%' }}
                      >
                        <Text fw={600} size="md" c={headingColor}>
                          {timeStr}
                        </Text>
                        <Text
                          size="sm"
                          c={isPast ? bodyColor : isUrgent ? 'red' : 'green'}
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
            <Text size="md" c={bodyColor}>
              No upcoming departures available for this station right now.
            </Text>
          )}
        </Stack>
      ) : (
        <Text size="md" mt="xs" c={bodyColor}>
          No public transport station found within range of this trail.
        </Text>
      )}
    </Card>
  );
}
