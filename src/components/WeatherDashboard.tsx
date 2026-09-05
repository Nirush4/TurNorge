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
} from '@mantine/core';
import {
  IconCloudRain,
  IconTemperature,
  IconWind,
  IconDroplet,
  IconCompass,
  IconAlertTriangle,
  IconSparkles,
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface WeatherDashboardProps {
  forecast: MetForecastResponse;
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
        ticks: { font: { size: 11, weight: 600 }, color: chartTickColor },
      },
    },
  };

  const tempChartConfig = {
    labels: chartDataSlots.map((d) => d.time),
    datasets: [
      {
        fill: true,
        data: chartDataSlots.map((d) => d.temperature),
        borderColor: isDark ? '#38d9a9' : '#2b8a3e',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return isDark ? 'rgba(56, 217, 169, 0.15)' : 'rgba(43, 138, 62, 0.15)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, isDark ? 'rgba(56, 217, 169, 0.35)' : 'rgba(43, 138, 62, 0.35)');
          gradient.addColorStop(1, 'rgba(43, 138, 62, 0.0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isDark ? '#38d9a9' : '#2b8a3e',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const windChartConfig = {
    labels: chartDataSlots.map((d) => d.time),
    datasets: [
      {
        fill: true,
        data: chartDataSlots.map((d) => d.windSpeed),
        borderColor: isDark ? '#74c0fc' : '#1971c2',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return isDark ? 'rgba(116, 192, 252, 0.15)' : 'rgba(25, 113, 194, 0.15)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(
            0,
            isDark ? 'rgba(116, 192, 252, 0.35)' : 'rgba(25, 113, 194, 0.35)',
          );
          gradient.addColorStop(1, 'rgba(25, 113, 194, 0.0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isDark ? '#74c0fc' : '#1971c2',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <Container fluid px={{ base: 'md', lg: 'xl' }} py="md">
      <Stack gap="md" maw={1500} mx="auto">
        <Paper
          withBorder
          p="lg"
          radius="md"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, rgba(27, 67, 50, 0.15) 100%)'
              : 'linear-gradient(135deg, var(--mantine-color-body) 0%, rgba(27, 67, 50, 0.04) 100%)',
            boxShadow: 'var(--mantine-shadow-xs)',
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <div>
              <Group gap="xs" mb={4}>
                <ThemeIcon size="sm" radius="xl" color="teal" variant="light" aria-hidden="true">
                  <IconSparkles size={14} />
                </ThemeIcon>
                <Title order={1} size="h4" fw={700} style={{ letterSpacing: '-0.5px' }}>
                  Meteorological Intelligence
                </Title>
              </Group>
              <Text size="xs" c="dimmed" fw={500}>
                Coordinates: {lat}°N, {lon}°E · Elevation: {alt}m · Synced:{' '}
                {new Date(forecast.properties.meta.updated_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </div>
            <Badge
              variant="gradient"
              gradient={{ from: 'teal', to: 'pine', deg: 135 }}
              size="lg"
              radius="sm"
            >
              MET Norway API
            </Badge>
          </Group>
        </Paper>

        {airTemp < 0 && (
          <Paper
            p="sm"
            radius="md"
            bg={isDark ? 'rgba(217, 72, 15, 0.15)' : 'rgba(217, 72, 15, 0.06)'}
            style={{ border: '1px solid var(--mantine-color-red-6)' }}
            role="alert"
          >
            <Group wrap="nowrap" gap="sm" align="flex-start">
              <ThemeIcon color="red" variant="light" size="lg" radius="md" aria-hidden="true">
                <IconAlertTriangle size={20} />
              </ThemeIcon>
              <Box>
                <Text
                  fw={700}
                  size="xs"
                  c={isDark ? 'red.4' : 'red.7'}
                  tt="uppercase"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Freezing Environment Warning
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  Sub-zero conditions detected along active path profile. Confirm microspikes and
                  insulation layer readiness.
                </Text>
              </Box>
            </Group>
          </Paper>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card withBorder padding="md" radius="md">
            <Group wrap="nowrap" justify="space-between">
              <div>
                <Text
                  size="10px"
                  c="dimmed"
                  tt="uppercase"
                  fw={700}
                  style={{ letterSpacing: '0.05em' }}
                >
                  Temperature
                </Text>
                <Text fw={700} size="xl" lh={1.2} mt={4}>
                  {airTemp}°C
                </Text>
              </div>
              <ThemeIcon color="pine" size="xl" radius="md" variant="light" aria-hidden="true">
                <IconTemperature size={22} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group wrap="nowrap" justify="space-between">
              <Box style={{ flex: 1 }}>
                <Text
                  size="10px"
                  c="dimmed"
                  tt="uppercase"
                  fw={700}
                  style={{ letterSpacing: '0.05em' }}
                >
                  Wind Speed & Gusts
                </Text>
                <Group gap={6} align="center" mt={4}>
                  <Text fw={700} size="xl" lh={1.2}>
                    {instantDetails?.wind_speed}{' '}
                    <Text span size="xs" c="dimmed" fw={500}>
                      m/s
                    </Text>
                  </Text>
                  <IconCompass
                    size={18}
                    style={{
                      transform: `rotate(${windDirection}deg)`,
                      transition: 'transform 0.4s ease',
                      color: isDark ? '#74c0fc' : 'var(--mantine-color-blue-6)',
                    }}
                    aria-label={`Wind direction ${windDirection} degrees`}
                  />
                </Group>
              </Box>
              <ThemeIcon color="blue" size="xl" radius="md" variant="light" aria-hidden="true">
                <IconWind size={22} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group wrap="nowrap" justify="space-between">
              <div>
                <Text
                  size="10px"
                  c="dimmed"
                  tt="uppercase"
                  fw={700}
                  style={{ letterSpacing: '0.05em' }}
                >
                  Precipitation
                </Text>
                <Text fw={700} size="xl" lh={1.2} mt={4}>
                  {precipitation}{' '}
                  <Text span size="xs" c="dimmed" fw={500}>
                    mm
                  </Text>
                </Text>
              </div>
              <ThemeIcon color="cyan" size="xl" radius="md" variant="light" aria-hidden="true">
                <IconCloudRain size={22} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group wrap="nowrap" justify="space-between">
              <div>
                <Text
                  size="10px"
                  c="dimmed"
                  tt="uppercase"
                  fw={700}
                  style={{ letterSpacing: '0.05em' }}
                >
                  Humidity
                </Text>
                <Text fw={700} size="xl" lh={1.2} mt={4}>
                  {instantDetails?.relative_humidity}%
                </Text>
              </div>
              <ThemeIcon color="teal" size="xl" radius="md" variant="light" aria-hidden="true">
                <IconDroplet size={22} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Card withBorder padding="md" radius="md">
            <Group justify="space-between" mb="xs">
              <Title
                order={2}
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: '0.05em' }}
              >
                Temperature Trend (°C)
              </Title>
              <Badge size="xs" variant="dot" color="teal">
                12h Trend
              </Badge>
            </Group>
            <div style={{ height: rem(190), position: 'relative' }}>
              <Line options={sharedChartOptions} data={tempChartConfig} />
            </div>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group justify="space-between" mb="xs">
              <Title
                order={2}
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: '0.05em' }}
              >
                Wind Speed & Gusts (m/s)
              </Title>
              <Badge size="xs" variant="dot" color="blue">
                12h Trend
              </Badge>
            </Group>
            <div style={{ height: rem(190), position: 'relative' }}>
              <Line options={sharedChartOptions} data={windChartConfig} />
            </div>
          </Card>
        </SimpleGrid>

        <Card withBorder padding="md" radius="md">
          <Title
            order={2}
            size="xs"
            fw={700}
            tt="uppercase"
            c="dimmed"
            mb="sm"
            style={{ letterSpacing: '0.05em' }}
          >
            Short-Range Progression Schedule
          </Title>
          <Stack gap={6}>
            {forecast.properties.timeseries.slice(0, 6).map((slot) => {
              const timeStr = new Date(slot.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const temp = slot.data.instant.details.air_temperature;
              const wind = slot.data.instant.details.wind_speed;
              const hum = slot.data.instant.details.relative_humidity;
              const symbol = slot.data.next_1_hours?.summary.symbol_code || symbolCode;

              return (
                <Group
                  key={slot.time}
                  justify="space-between"
                  py={8}
                  px="sm"
                  style={{
                    borderRadius: 'var(--mantine-radius-sm)',
                    backgroundColor: 'var(--mantine-color-default-hover)',
                  }}
                  wrap="nowrap"
                >
                  <Text fw={600} size="xs" w={55}>
                    {timeStr}
                  </Text>
                  <Text
                    size="xs"
                    tt="capitalize"
                    c="dimmed"
                    style={{ flex: 1, textAlign: 'center' }}
                    fw={500}
                  >
                    {symbol.replace('_', ' ')}
                  </Text>
                  <Group gap="xl">
                    <Text size="xs" c="dimmed">
                      💧 {hum}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      🌬️ {wind} m/s
                    </Text>
                    <Text fw={700} size="xs" w={45} ta="right">
                      {temp}°C
                    </Text>
                  </Group>
                </Group>
              );
            })}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
