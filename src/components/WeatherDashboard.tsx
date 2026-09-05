import { Card, Container, Group, SimpleGrid, Stack, Text, Title, ThemeIcon } from '@mantine/core';
import {
  IconCloudRain,
  IconTemperature,
  IconWind,
  IconDroplet,
  IconCompass,
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
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface WeatherDashboardProps {
  forecast: MetForecastResponse;
}

export function WeatherDashboard({ forecast }: WeatherDashboardProps) {
  const latest = forecast.properties.timeseries[0]?.data;
  const instantDetails = latest?.instant.details;
  const symbolCode = latest?.next_1_hours?.summary.symbol_code || 'cloudy';
  const precipitation = latest?.next_1_hours?.details?.precipitation_amount ?? 0;
  const windDirection = instantDetails?.wind_from_direction ?? 0;

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
      tooltip: { enabled: true },
    },
    scales: {
      y: { display: false, grid: { display: false } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const tempChartConfig = {
    labels: chartDataSlots.map((d) => d.time),
    datasets: [
      {
        fill: true,
        data: chartDataSlots.map((d) => d.temperature),
        borderColor: '#2b8a3e',
        backgroundColor: 'rgba(43, 138, 62, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  const windChartConfig = {
    labels: chartDataSlots.map((d) => d.time),
    datasets: [
      {
        fill: false,
        data: chartDataSlots.map((d) => d.windSpeed),
        borderColor: '#1971c2',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>Live Meteorological Conditions</Title>
          <Text size="sm" c="dimmed">
            Coordinates: {lat}°N, {lon}°E · Altitude: {alt}m · Updated:{' '}
            {new Date(forecast.properties.meta.updated_at).toLocaleTimeString()}
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          <Card withBorder padding="md" radius="md">
            <Group>
              <ThemeIcon color="pine" size="lg" radius="md">
                <IconTemperature size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Temperature
                </Text>
                <Text fw={700} size="xl">
                  {instantDetails?.air_temperature}°C
                </Text>
              </div>
            </Group>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group>
              <ThemeIcon color="frost" size="lg" radius="md">
                <IconWind size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Wind & Direction
                </Text>
                <Group gap="xs">
                  <Text fw={700} size="xl">
                    {instantDetails?.wind_speed} m/s
                  </Text>
                  <IconCompass
                    size={22}
                    style={{
                      transform: `rotate(${windDirection}deg)`,
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </Group>
              </div>
            </Group>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group>
              <ThemeIcon color="blue" size="lg" radius="md">
                <IconCloudRain size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Next Hour Rain
                </Text>
                <Text fw={700} size="xl">
                  {precipitation} mm
                </Text>
              </div>
            </Group>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group>
              <ThemeIcon color="teal" size="lg" radius="md">
                <IconDroplet size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Humidity
                </Text>
                <Text fw={700} size="xl">
                  {instantDetails?.relative_humidity}%
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card withBorder padding="lg" radius="md">
            <Title order={3} size="h4" mb="md">
              Temperature Trend (°C)
            </Title>
            <div style={{ height: 220, position: 'relative' }}>
              <Line options={sharedChartOptions} data={tempChartConfig} />
            </div>
          </Card>

          <Card withBorder padding="lg" radius="md">
            <Title order={3} size="h4" mb="md">
              Wind Speed & Gusts (m/s)
            </Title>
            <div style={{ height: 220, position: 'relative' }}>
              <Line options={sharedChartOptions} data={windChartConfig} />
            </div>
          </Card>
        </SimpleGrid>

        <Card withBorder padding="lg" radius="md">
          <Title order={3} mb="md">
            Upcoming Timeline Forecast
          </Title>
          <Stack gap="sm">
            {forecast.properties.timeseries.slice(0, 6).map((slot) => {
              const timeStr = new Date(slot.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const temp = slot.data.instant.details.air_temperature;
              const wind = slot.data.instant.details.wind_speed;
              const symbol = slot.data.next_1_hours?.summary.symbol_code || symbolCode;

              return (
                <Group
                  key={slot.time}
                  justify="space-between"
                  py="xs"
                  style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
                >
                  <Text fw={500}>{timeStr}</Text>
                  <Group gap="xl">
                    <Text size="sm" tt="capitalize" c="dimmed">
                      {symbol.replace('_', ' ')}
                    </Text>
                    <Text fw={700}>{temp}°C</Text>
                    <Text size="sm">{wind} m/s</Text>
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
