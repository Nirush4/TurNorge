import {
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Badge,
  Paper,
  Box,
  rem,
  useMantineColorScheme,
  Table,
} from '@mantine/core';
import {
  IconCloudRain,
  IconTemperature,
  IconWind,
  IconDroplet,
  IconCompass,
  IconAlertTriangle,
  IconSparkles,
  IconGauge,
} from '@tabler/icons-react';
import type { MetForecastResponse } from '@/types/met';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import type { ScriptableContext } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ReactNode } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface WeatherDashboardProps {
  forecast: MetForecastResponse;
}

interface MetricCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <Card withBorder padding="lg" radius="md" shadow="xs">
      <Group wrap="nowrap" justify="space-between" align="flex-start">
        <div>
          <Text size="14px" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '0.05em' }}>
            {title}
          </Text>
          <div style={{ marginTop: '6px' }}>{value}</div>
        </div>
        <ThemeIcon color={color} size="xl" radius="md" variant="light" aria-hidden="true">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  );
}

export function WeatherDashboard({ forecast }: WeatherDashboardProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const chartTickColor = isDark ? '#C1C2C5' : '#495057';

  const latest = forecast.properties.timeseries[0]?.data;
  const instantDetails = latest?.instant.details;
  const symbolCode = latest?.next_1_hours?.summary.symbol_code || 'cloudy';
  const precipitation = latest?.next_1_hours?.details?.precipitation_amount ?? 0;
  const windDirection = instantDetails?.wind_from_direction ?? 0;
  const airTemp = instantDetails?.air_temperature ?? 0;
  const airPressure = instantDetails?.air_pressure_at_sea_level ?? 1013;

  const [lon, lat, alt] = forecast.geometry.coordinates;

  const chartDataSlots = forecast.properties.timeseries.slice(0, 12).map((slot) => {
    const timeLabel = new Date(slot.time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      time: timeLabel,
      temperature: slot.data.instant.details.air_temperature,
      windSpeed: slot.data.instant.details.wind_speed,
      humidity: slot.data.instant.details.relative_humidity,
      precipitation: slot.data.next_1_hours?.details?.precipitation_amount ?? 0,
    };
  });

  const sharedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(37, 38, 43, 0.95)' : 'rgba(15, 23, 42, 0.95)',
        titleFont: { size: 12, weight: 'bold' as const, family: 'inherit' },
        bodyFont: { size: 12, family: 'inherit' },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
      },
    },
    scales: {
      y: { display: false, grid: { display: false } },
      x: {
        grid: { display: false },
        ticks: { font: { size: 14, weight: 600 }, color: chartTickColor },
      },
    },
  };

  const createChartConfig = (
    dataKey: 'temperature' | 'windSpeed',
    borderColorDark: string,
    borderColorLight: string,
  ) => ({
    labels: chartDataSlots.map((d) => d.time),
    datasets: [
      {
        fill: true,
        data: chartDataSlots.map((d) => d[dataKey]),
        borderColor: isDark ? borderColorDark : borderColorLight,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { ctx, chartArea } = context.chart;
          const baseColor = isDark ? borderColorDark : borderColorLight;
          if (!chartArea) return `${baseColor}26`;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `${baseColor}59`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isDark ? borderColorDark : borderColorLight,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  });

  const tempChartConfig = createChartConfig('temperature', '#38d9a9', '#2b8a3e');
  const windChartConfig = createChartConfig('windSpeed', '#74c0fc', '#1971c2');

  return (
    <Container fluid px={{ base: 'xs', sm: 'md', lg: 'xl' }} py="md" component="main">
      <Stack gap="lg" maw={1500} mx="auto">
        <Paper
          withBorder
          p={{ base: 'md', sm: 'lg' }}
          radius="lg"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, rgba(27, 67, 50, 0.25) 100%)'
              : 'linear-gradient(135deg, var(--mantine-color-body) 0%, rgba(27, 67, 50, 0.06) 100%)',
            boxShadow: 'var(--mantine-shadow-sm)',
            borderTop: '4px solid #28726B',
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <div>
              <Group gap="xs" mb={6}>
                <ThemeIcon size="md" radius="xl" color="teal" variant="light" aria-hidden="true">
                  <IconSparkles size={24} />
                </ThemeIcon>
                <Title order={1} size="h3" fw={700} style={{ letterSpacing: '-0.5px' }}>
                  Meteorological Intelligence
                </Title>
              </Group>
              <Text size="md" c="dimmed" fw={500}>
                Coordinates: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E · Elevation: {alt}m · Synced:{' '}
                {new Date(forecast.properties.meta.updated_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </div>
            <Badge variant="light" color="teal" size="lg" radius="md">
              Live MET.no Feed
            </Badge>
          </Group>
        </Paper>

        {airTemp < 0 && (
          <Paper
            p="md"
            radius="md"
            bg={isDark ? 'rgba(217, 72, 15, 0.15)' : 'rgba(217, 72, 15, 0.06)'}
            style={{ border: '1px solid var(--mantine-color-red-6)' }}
            role="alert"
          >
            <Group wrap="nowrap" gap="md" align="flex-start">
              <ThemeIcon color="red" variant="light" size="xl" radius="md" aria-hidden="true">
                <IconAlertTriangle size={24} />
              </ThemeIcon>
              <Box>
                <Text
                  fw={700}
                  size="lg"
                  c={isDark ? 'red.4' : 'red.7'}
                  tt="uppercase"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Freezing Environment Warning
                </Text>
                <Text size="md" c="dimmed" mt={4}>
                  Sub-zero conditions detected along active path profile. Confirm microspikes and
                  insulation layer readiness.
                </Text>
              </Box>
            </Group>
          </Paper>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="md">
          <MetricCard
            title="Temperature"
            color="teal"
            icon={<IconTemperature size={24} />}
            value={
              <Text fw={800} size="xl" lh={1.2}>
                {airTemp}°C
              </Text>
            }
          />
          <MetricCard
            title="Wind & Direction"
            color="blue"
            icon={<IconWind size={24} />}
            value={
              <Group gap={6} align="center">
                <Text fw={800} size="xl" lh={1.2}>
                  {instantDetails?.wind_speed}{' '}
                  <Text span size="md" c="dimmed" fw={500}>
                    m/s
                  </Text>
                </Text>
                <IconCompass
                  size={20}
                  style={{
                    transform: `rotate(${windDirection}deg)`,
                    transition: 'transform 0.4s ease',
                    color: isDark ? '#74c0fc' : 'var(--mantine-color-blue-6)',
                  }}
                  aria-label={`Wind direction ${windDirection} degrees`}
                />
              </Group>
            }
          />
          <MetricCard
            title="Precipitation"
            color="cyan"
            icon={<IconCloudRain size={24} />}
            value={
              <Text fw={800} size="xl" lh={1.2}>
                {precipitation}{' '}
                <Text span size="md" c="dimmed" fw={500}>
                  mm
                </Text>
              </Text>
            }
          />
          <MetricCard
            title="Humidity"
            color="teal"
            icon={<IconDroplet size={24} />}
            value={
              <Text fw={800} size="xl" lh={1.2}>
                {instantDetails?.relative_humidity}%
              </Text>
            }
          />
          <MetricCard
            title="Pressure"
            color="violet"
            icon={<IconGauge size={24} />}
            value={
              <Text fw={800} size="xl" lh={1.2}>
                {airPressure}{' '}
                <Text span size="xs" c="dimmed" fw={500}>
                  hPa
                </Text>
              </Text>
            }
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Card withBorder padding="lg" radius="md" shadow="xs">
            <Group justify="space-between" mb="xs">
              <Title
                order={2}
                size="lg"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: '0.05em' }}
              >
                Temperature Trend (°C)
              </Title>
              <Badge size="md" variant="light" color="teal" radius="sm">
                12h Outlook
              </Badge>
            </Group>
            <Text size="md" c="dimmed" mb="md">
              Continuous hourly thermal progression across active terrain elevations.
            </Text>
            <Box
              p="xs"
              style={{
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: isDark
                  ? 'var(--mantine-color-dark-6)'
                  : 'var(--mantine-color-gray-0)',
              }}
            >
              <div style={{ height: rem(210), position: 'relative' }}>
                <Line options={sharedChartOptions} data={tempChartConfig} />
              </div>
            </Box>
          </Card>

          <Card withBorder padding="lg" radius="md" shadow="xs">
            <Group justify="space-between" mb="xs">
              <Title
                order={2}
                size="lg"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: '0.05em' }}
              >
                Wind Speed &amp; Gusts (m/s)
              </Title>
              <Badge size="md" variant="light" color="blue" radius="sm">
                12h Outlook
              </Badge>
            </Group>
            <Text size="md" c="dimmed" mb="md">
              Projected aerodynamic velocity variations along exposed regional coordinates.
            </Text>
            <Box
              p="xs"
              style={{
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: isDark
                  ? 'var(--mantine-color-dark-6)'
                  : 'var(--mantine-color-gray-0)',
              }}
            >
              <div style={{ height: rem(210), position: 'relative' }}>
                <Line options={sharedChartOptions} data={windChartConfig} />
              </div>
            </Box>
          </Card>
        </SimpleGrid>

        <Card
          withBorder
          padding="lg"
          radius="md"
          shadow="xs"
          component="section"
          aria-labelledby="progression-schedule-heading"
        >
          <Title
            id="progression-schedule-heading"
            order={2}
            size="lg"
            fw={700}
            tt="uppercase"
            c="dimmed"
            mb="md"
            style={{ letterSpacing: '0.05em' }}
          >
            Short-Range Progression Schedule
          </Title>
          <Box style={{ overflowX: 'auto' }}>
            <Table horizontalSpacing="md" verticalSpacing="sm" fz="sm" withRowBorders={false}>
              <Table.Thead>
                <Table.Tr
                  style={{
                    borderBottom: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
                  }}
                >
                  <Table.Th scope="col" fz="md" fw={700} c="dimmed">
                    Time
                  </Table.Th>
                  <Table.Th scope="col" fz="md" fw={700} c="dimmed" ta="center">
                    Condition
                  </Table.Th>
                  <Table.Th scope="col" fz="md" fw={700} c="dimmed" ta="right">
                    Precipitation
                  </Table.Th>
                  <Table.Th scope="col" fz="md" fw={700} c="dimmed" ta="right">
                    Humidity
                  </Table.Th>
                  <Table.Th scope="col" fz="md" fw={700} c="dimmed" ta="right">
                    Wind
                  </Table.Th>
                  <Table.Th scope="col" fz="md" fw={700} c="dimmed" ta="right">
                    Temp
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {forecast.properties.timeseries.slice(0, 6).map((slot) => {
                  const timeStr = new Date(slot.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const temp = slot.data.instant.details.air_temperature;
                  const wind = slot.data.instant.details.wind_speed;
                  const hum = slot.data.instant.details.relative_humidity;
                  const precip = slot.data.next_1_hours?.details?.precipitation_amount ?? 0;
                  const symbol = slot.data.next_1_hours?.summary.symbol_code || symbolCode;

                  return (
                    <Table.Tr
                      key={slot.time}
                      style={{
                        backgroundColor: isDark
                          ? 'var(--mantine-color-dark-6)'
                          : 'var(--mantine-color-gray-0)',
                        borderRadius: 'var(--mantine-radius-md)',
                      }}
                    >
                      <Table.Td fw={700} component="th" scope="row">
                        {timeStr}
                      </Table.Td>
                      <Table.Td tt="capitalize" c="dimmed" fw={600} ta="center">
                        {symbol.replace('_', ' ')}
                      </Table.Td>
                      <Table.Td fz="md" ta="right" c="dimmed">
                        <span aria-hidden="true">🌧️ </span>
                        {precip} mm
                      </Table.Td>
                      <Table.Td fz="md" ta="right" c="dimmed">
                        <span aria-hidden="true">💧 </span>
                        {hum}%
                      </Table.Td>
                      <Table.Td fz="md" ta="right" c="dimmed">
                        <span aria-hidden="true">🌬️ </span>
                        {wind} m/s
                      </Table.Td>
                      <Table.Td fz="md" ta="right" fw={800}>
                        {temp}°C
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
