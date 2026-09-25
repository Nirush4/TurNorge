import {
  Accordion,
  Badge,
  Card,
  Checkbox,
  Container,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ShieldAlert, Compass, Flame, Droplets, PhoneCall, Backpack } from 'lucide-react';

const CHECKLIST = [
  { id: 'map', label: 'Paper Kartverket topographical map and offline GPS track' },
  { id: 'weather', label: 'Cross-checked MET Norway mountain forecasts (not just app summaries)' },
  { id: 'distance', label: 'Campsite planned at least 150m from nearest house/cabin' },
  { id: 'fire', label: 'Portable stove packed; checked for active fire bans (bålforbud)' },
  { id: 'waste', label: 'Pack-out waste bag, trowel, and secure trash container' },
  { id: 'sos', label: 'Emergency numbers (112/113) saved & itinerary shared with someone' },
] as const;

export function ToolkitPage() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [checked, setChecked] = useLocalStorage<string[]>({
    key: 'nordictrail-safety-checklist',
    defaultValue: [],
  });

  const toggle = (id: string): void => {
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Stack gap="lg">
        <section aria-labelledby="toolkit-heading">
          <Title order={1} fz={{ base: '1.7rem', sm: '2.5rem' }} c={isDark ? '#eef4f1' : 'dark.7'}>
            Allemannsretten & Safety Toolkit
          </Title>

          <Text mt="xs" c={isDark ? '#c3d1c9' : 'dimmed'}>
            Norway’s Right to Roam gives you open access to nature, balanced by strict
            responsibilities to protect fragile wilderness, prevent wildfires, and ensure personal
            mountain safety.
          </Text>
        </section>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card withBorder padding="md" radius="md">
            <Group gap="xs" mb="xs">
              <Compass size={18} color="#2d7a4f" aria-hidden="true" />
              <Text fw={600} size="sm" c={isDark ? '#eef4f1' : 'dark.8'}>
                Utmark vs. Innmark
              </Text>
            </Group>
            <Text size="xs" c={isDark ? '#c3d1c9' : 'dimmed'}>
              Roam freely on uncultivated land (utmark). Keep clear of fenced pastures, private
              gardens, and active farmland (innmark).
            </Text>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group gap="xs" mb="xs">
              <Flame size={18} color="#e07a5f" aria-hidden="true" />
              <Text fw={600} size="sm" c={isDark ? '#eef4f1' : 'dark.8'}>
                Bålforbud Season
              </Text>
            </Group>
            <Text size="xs" c={isDark ? '#c3d1c9' : 'dimmed'}>
              Strict general ban on open campfires in or near forests from April 15 to September 15.
              Use approved stoves on rock.
            </Text>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Group gap="xs" mb="xs">
              <ShieldAlert size={18} color="#d90429" aria-hidden="true" />
              <Text fw={600} size="sm" c={isDark ? '#eef4f1' : 'dark.8'}>
                Weather Volatility
              </Text>
            </Group>
            <Text size="xs" c={isDark ? '#c3d1c9' : 'dimmed'}>
              Mountain weather changes instantly. Fog, snow, and severe wind can set in even during
              summer months above the treeline.
            </Text>
          </Card>
        </SimpleGrid>

        <Accordion variant="separated" defaultValue="roam">
          <Accordion.Item value="roam">
            <Accordion.Control
              icon={<Compass size={16} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />}
            >
              <Text fw={600} c={isDark ? '#eef4f1' : 'dark.8'}>
                The Right to Roam (Allemannsretten)
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c={isDark ? '#c3d1c9' : 'dark.7'} style={{ lineHeight: 1.6 }}>
                Enshrined in the Outdoor Recreation Act of 1957, everyone can walk, ski, and cycle
                on uncultivated land. You are permitted to forage for wild berries, mushrooms, and
                flowers (except protected species). Always close farm gates behind you and respect
                grazing livestock.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="camp">
            <Accordion.Control
              icon={
                <Backpack size={16} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />
              }
            >
              <Text fw={600} c={isDark ? '#eef4f1' : 'dark.8'}>
                Wild Camping Rules & Distance Limits
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c={isDark ? '#c3d1c9' : 'dark.7'} style={{ lineHeight: 1.6 }}>
                You may pitch a tent for up to two nights in the same spot on uncultivated land
                without landowner permission. Tents must be placed at least{' '}
                <strong style={{ color: isDark ? '#ffffff' : 'inherit' }}>150 metres</strong> away
                from the nearest inhabited house or mountain cabin. In vulnerable areas or national
                parks, look for designated campsites to protect sensitive alpine flora.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="fire">
            <Accordion.Control
              icon={<Flame size={16} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />}
            >
              <Text fw={600} c={isDark ? '#eef4f1' : 'dark.8'}>
                Campfires & Outdoor Cooking Regulations
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c={isDark ? '#c3d1c9' : 'dark.7'} style={{ lineHeight: 1.6 }}>
                Open fires are prohibited from{' '}
                <strong style={{ color: isDark ? '#ffffff' : 'inherit' }}>
                  April 15 to September 15
                </strong>{' '}
                near forests and woodlands. Gas and liquid-fueled camping stoves are generally
                allowed unless conditions are exceptionally dry. If a fire is legally permitted, use
                existing fire rings on mineral ground (rock/sand), never on moss or peat.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="waste">
            <Accordion.Control
              icon={
                <Droplets size={16} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />
              }
            >
              <Text fw={600} c={isDark ? '#eef4f1' : 'dark.8'}>
                Water Safety & Leave No Trace Waste
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c={isDark ? '#c3d1c9' : 'dark.7'} style={{ lineHeight: 1.6 }}>
                While Norwegian mountain water looks pristine, always check app advisories or
                boil/filter water downstream from grazing animals. Pack out all trash, fruit peels,
                and wet wipes. Human waste should be buried 15–20 cm deep at least 60 metres away
                from lakes, streams, and trails.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="emergency">
            <Accordion.Control
              icon={
                <PhoneCall size={16} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />
              }
            >
              <Text fw={600} c={isDark ? '#eef4f1' : 'dark.8'}>
                Emergency Contacts & Mountain Rescue
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing="xs" c={isDark ? '#c3d1c9' : 'dark.7'}>
                <List.Item>
                  <strong style={{ color: isDark ? '#ffffff' : 'inherit' }}>112</strong> — Police &
                  Main Rescue Coordination Centre (JRCC)
                </List.Item>
                <List.Item>
                  <strong style={{ color: isDark ? '#ffffff' : 'inherit' }}>113</strong> — Medical
                  Emergency (Ambulance / Air Ambulance)
                </List.Item>
                <List.Item>
                  <strong style={{ color: isDark ? '#ffffff' : 'inherit' }}>110</strong> — Fire &
                  Rescue
                </List.Item>
                <List.Item>
                  <strong style={{ color: isDark ? '#ffffff' : 'inherit' }}>116 117</strong> —
                  Non-emergency medical consultation (Legevakt)
                </List.Item>
              </List>
              <Text size="sm" mt="sm" c={isDark ? '#c3d1c9' : 'dark.7'} style={{ lineHeight: 1.6 }}>
                Cell coverage can be sparse in deep valleys. Note your precise coordinates using
                Kartverket grids before calling.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Card
          withBorder
          padding="lg"
          component="section"
          aria-labelledby="checklist-heading"
          style={{
            backgroundColor: isDark ? '#182c23' : '#f4f8f1',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Group justify="space-between">
            <Title order={3} id="checklist-heading" c={isDark ? '#eef4f1' : 'dark.7'}>
              Pre-Hike Safety Checklist
            </Title>
            <Badge variant="light" color="forest" size="lg">
              {checked.length} / {CHECKLIST.length} ready
            </Badge>
          </Group>
          <Text size="sm" mt="xs" mb="md" c={isDark ? '#c3d1c9' : 'dimmed'}>
            Your progress is saved automatically in your browser storage.
          </Text>
          <Stack gap="md">
            {CHECKLIST.map((item) => (
              <Checkbox
                key={item.id}
                label={
                  <Text size="sm" c={isDark ? '#eef4f1' : 'dark.8'}>
                    {item.label}
                  </Text>
                }
                checked={checked.includes(item.id)}
                onChange={() => toggle(item.id)}
                color="#2d7a4f"
                aria-label={item.label}
              />
            ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
