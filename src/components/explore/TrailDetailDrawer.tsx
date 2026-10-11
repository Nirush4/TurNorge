import { Drawer, Card, Group, Stack, Text, Title, Badge, Button } from '@mantine/core';
import type { KartverketPlace, MetLocationForecast } from '@/types/schemas';
import type { Trail } from '@/types';
import type { ShopItem } from '@/types/shopItemSchema';
import type { StopPlaceData } from './exploreUtils';
import { TrailTransitBoard } from '@/components/explore/TrailTransitBoard';
import { NearbyShopsCard } from './NearbyShopsCard';

interface TrailDetailDrawerProps {
  selectedPlace: KartverketPlace | null;
  selectedTrail: Trail | null | undefined;
  forecast: MetLocationForecast | null;
  loadingWeather: boolean;
  stationData: StopPlaceData | null;
  loadingTransit: boolean;
  shops: ShopItem[];
  displayedShops: ShopItem[];
  loadingShops: boolean;
  hasMoreShops: boolean;
  savingFavorite: boolean;
  savedFavorite: boolean;
  isDark: boolean;
  headingColor: string;
  bodyColor: string;
  cardBackground: string;
  borderColor: string;
  simpleCardStyle: React.CSSProperties;
  onClose: () => void;
  onLoadMoreShops: () => void;
  onSaveFavorite: () => Promise<void>;
}

export function TrailDetailDrawer({
  selectedPlace,
  selectedTrail,
  forecast,
  loadingWeather,
  stationData,
  loadingTransit,
  shops,
  displayedShops,
  loadingShops,
  hasMoreShops,
  savingFavorite,
  savedFavorite,
  isDark,
  headingColor,
  bodyColor,
  cardBackground,
  borderColor,
  simpleCardStyle,
  onClose,
  onLoadMoreShops,
  onSaveFavorite,
}: TrailDetailDrawerProps) {
  const currentDetails = forecast?.properties.timeseries[0]?.data.instant.details;
  const nextSixHours = forecast?.properties.timeseries[0]?.data.next_6_hours;

  return (
    <Drawer
      opened={selectedPlace !== null}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Text fw={700} fz={{ base: '1.1rem', sm: '1.4rem' }} c={headingColor}>
          {selectedPlace?.name ?? 'Location'}
        </Text>
      }
      aria-label={`Details drawer for ${selectedPlace?.name ?? 'selected location'}`}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100dvh',
          backgroundColor: cardBackground,
          color: headingColor,
        },
        header: {
          backgroundColor: cardBackground,
          color: headingColor,
        },
        body: {
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '2.5rem',
          backgroundColor: cardBackground,
        },
      }}
    >
      {selectedPlace && selectedTrail ? (
        <Stack gap="md" role="region" aria-label="Selected trail information details">
          <Card
            padding={0}
            withBorder={false}
            style={{
              overflow: 'hidden',
              backgroundColor: cardBackground,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '180px' }}>
              <iframe
                title={`Interactive geographic map centered on ${selectedPlace.name}`}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: isDark
                    ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)'
                    : 'none',
                }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPlace.longitude - 0.05}%2C${selectedPlace.latitude - 0.03}%2C${selectedPlace.longitude + 0.05}%2C${selectedPlace.latitude + 0.03}&layer=mapnik&marker=${selectedPlace.latitude}%2C${selectedPlace.longitude}`}
              />
            </div>
          </Card>

          <Card withBorder={false} style={simpleCardStyle}>
            <Group justify="space-between" mb="xs">
              <Title order={4} c={headingColor}>
                Trail Overview
              </Title>
              <Badge
                color="teal"
                size="md"
                tt="capitalize"
                aria-label={`Difficulty rating: ${selectedTrail.difficulty}`}
              >
                {selectedTrail.difficulty}
              </Badge>
            </Group>
            <Text size="md" c={bodyColor} mb="md">
              {selectedTrail.description}
            </Text>
            <Group grow>
              <div>
                <Text size="md" c="dimmed">
                  Distance
                </Text>
                <Text size="md" fw={600} c={headingColor}>
                  {selectedTrail.distanceKm} km
                </Text>
              </div>
              <div>
                <Text size="md" c="dimmed">
                  Duration
                </Text>
                <Text size="md" fw={600} c={headingColor}>
                  {selectedTrail.durationLabel}
                </Text>
              </div>
              <div>
                <Text size="md" c="dimmed">
                  Elevation Gain
                </Text>
                <Text size="md" fw={600} c={headingColor}>
                  {selectedTrail.elevationGainM} m
                </Text>
              </div>
            </Group>
          </Card>

          <NearbyShopsCard
            shops={shops}
            displayedShops={displayedShops}
            loadingShops={loadingShops}
            hasMoreShops={hasMoreShops}
            headingColor={headingColor}
            bodyColor={bodyColor}
            simpleCardStyle={simpleCardStyle}
            onLoadMore={onLoadMoreShops}
          />

          <Card withBorder={false} style={simpleCardStyle}>
            <Title order={4} c={headingColor}>
              MET.no Live Weather Forecast
            </Title>
            {loadingWeather ? (
              <Text size="md" mt="xs" c={bodyColor} role="status" aria-live="polite">
                Fetching real-time atmospheric data...
              </Text>
            ) : currentDetails ? (
              <Stack gap={4} mt="xs" role="region" aria-label="Current weather details">
                <Text size="md" fw={500} c={headingColor}>
                  {currentDetails.air_temperature?.toFixed(1) ?? 'N/A'}°C · Humidity{' '}
                  {currentDetails.relative_humidity ?? 'N/A'}%
                </Text>
                <Text size="md" c={bodyColor}>
                  Wind: {currentDetails.wind_speed?.toFixed(1) ?? 'N/A'} m/s · Pressure:{' '}
                  {currentDetails.air_pressure_at_sea_level ?? 'N/A'} hPa
                </Text>
                <Text size="md" c={bodyColor}>
                  Precipitation (next 6h): {nextSixHours?.details?.precipitation_amount ?? 0} mm
                </Text>
              </Stack>
            ) : (
              <Text size="md" mt="xs" c={bodyColor}>
                Weather info currently unreachable.
              </Text>
            )}
          </Card>

          <TrailTransitBoard loadingTransit={loadingTransit} stationData={stationData} />

          <Button
            color="teal"
            fz="md"
            aria-label={`Save ${selectedPlace.name} to your favorites list`}
            loading={savingFavorite}
            disabled={savedFavorite}
            onClick={onSaveFavorite}
          >
            {savedFavorite ? 'Saved to Favorites' : 'Save Destination to Favorites'}
          </Button>
        </Stack>
      ) : null}
    </Drawer>
  );
}
