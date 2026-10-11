import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  List,
  ThemeIcon,
  Loader,
  Button,
} from '@mantine/core';
import { IconShoppingBag } from '@tabler/icons-react';
import type { ShopItem } from '@/types/shopItemSchema';

interface NearbyShopsCardProps {
  shops: ShopItem[];
  displayedShops: ShopItem[];
  loadingShops: boolean;
  hasMoreShops: boolean;
  headingColor: string;
  bodyColor: string;
  simpleCardStyle: React.CSSProperties;
  onLoadMore: () => void;
}

export function NearbyShopsCard({
  shops,
  displayedShops,
  loadingShops,
  hasMoreShops,
  headingColor,
  bodyColor,
  simpleCardStyle,
  onLoadMore,
}: NearbyShopsCardProps) {
  return (
    <Card withBorder={false} radius="md" p="md" shadow="sm" style={simpleCardStyle}>
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <ThemeIcon color="teal" variant="light" size="lg" radius="md">
            <IconShoppingBag size={18} />
          </ThemeIcon>
          <div>
            <Title order={5} size="md" c={headingColor}>
              Nearby Supplies &amp; Shops
            </Title>
            <Text size="sm" c={bodyColor}>
              Local grocery &amp; convenience stores
            </Text>
          </div>
        </Group>
        {!loadingShops && shops.length > 0 && (
          <Badge color="teal" variant="dot" size="md">
            {shops.length} found
          </Badge>
        )}
      </Group>

      {loadingShops ? (
        <Stack py="sm" gap={4} role="status" aria-live="polite">
          <Group gap="xs">
            <Loader size="md" color="teal" />
            <Text size="md" c={bodyColor}>
              Searching for nearby stores...
            </Text>
          </Group>
        </Stack>
      ) : displayedShops.length > 0 ? (
        <Stack gap="sm">
          <List
            spacing="sm"
            size="md"
            center
            icon={
              <ThemeIcon color="teal" size={26} radius="xl" variant="filled" aria-hidden="true">
                <IconShoppingBag size={15} />
              </ThemeIcon>
            }
          >
            {displayedShops.map((shop) => (
              <List.Item key={shop.id}>
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Text size="md" fw={500} lineClamp={1} c={headingColor}>
                    {shop.name}
                  </Text>
                  <Badge size="md" variant="light" color="teal" tt="capitalize">
                    {shop.shopType}
                  </Badge>
                </Group>
              </List.Item>
            ))}
          </List>

          {hasMoreShops && (
            <Button
              variant="light"
              color="teal"
              size="md"
              fullWidth
              mt="xs"
              onClick={onLoadMore}
              aria-label="Load more nearby shops"
            >
              View more shops ({shops.length - displayedShops.length} remaining)
            </Button>
          )}
        </Stack>
      ) : (
        <Text size="md" c={bodyColor} fs="italic">
          No supermarkets or convenience stores found within 15km. This location may be in a remote
          mountain or wilderness area—consider stocking up in nearby towns before heading out!
        </Text>
      )}
    </Card>
  );
}
