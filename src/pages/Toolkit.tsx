import {
  Accordion,
  Badge,
  Card,
  Checkbox,
  Container,
  Group,
  List,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  ShieldAlert,
  Compass,
  Flame,
  Droplets,
  PhoneCall,
  Backpack,
  CheckCircle2,
} from 'lucide-react';
import { useThemeColors } from '@/hooks/useThemeColors';

const CHECKLIST = [
  { id: 'map', label: 'Paper Kartverket topographical map and offline GPS track' },
  { id: 'weather', label: 'Cross-checked MET Norway mountain forecasts (not just app summaries)' },
  { id: 'distance', label: 'Campsite planned at least 150m from nearest house/cabin' },
  { id: 'fire', label: 'Portable stove packed; checked for active fire bans (bålforbud)' },
  { id: 'waste', label: 'Pack-out waste bag, trowel, and secure trash container' },
  { id: 'sos', label: 'Emergency numbers (112/113) saved & itinerary shared with someone' },
] as const;

export function ToolkitPage() {
  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const [checked, setChecked] = useLocalStorage<string[]>({
    key: 'nordictrail-safety-checklist',
    defaultValue: [],
  });

  const toggle = (id: string): void => {
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const progressPercentage = Math.round((checked.length / CHECKLIST.length) * 100);

  const simpleCardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const accordionItemStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '12px',
  };

  const checklistCardStyle = {
    backgroundColor: isDark ? '#182c23' : '#f4f8f1',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
    borderRadius: '16px',
  };

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Stack gap="lg">
        {/* Header Section */}
        <section aria-labelledby="toolkit-heading">
          <Group justify="space-between" align="flex-start" mb="sm">
            <Badge variant="light" color="teal" size="lg" radius="sm">
              Wilderness Guide & Regulations
            </Badge>
          </Group>
          <Title
            order={1}
            fz={{ base: '1.7rem', sm: '2.5rem' }}
            c={headingColor}
            id="toolkit-heading"
          >
            Allemannsretten & Safety Toolkit
          </Title>

          <Text mt="xs" size="lg" c={bodyColor}>
            Norway’s Right to Roam gives you open access to nature, balanced by strict
            responsibilities to protect fragile wilderness, prevent wildfires, and ensure personal
            mountain safety.
          </Text>
        </section>

        {/* Quick Info Grid */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card withBorder padding="md" radius="md" style={simpleCardStyle}>
            <Group gap="xs" mb="xs">
              <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                <Compass size={20} aria-hidden="true" />
              </ThemeIcon>
              <Text fw={600} size="lg" c={headingColor}>
                Utmark vs. Innmark
              </Text>
            </Group>
            <Text size="md" c={bodyColor}>
              Roam freely on uncultivated land (utmark). Keep clear of fenced pastures, private
              gardens, and active farmland (innmark).
            </Text>
          </Card>

          <Card withBorder padding="md" radius="md" style={simpleCardStyle}>
            <Group gap="xs" mb="xs">
              <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                <Flame size={20} aria-hidden="true" />
              </ThemeIcon>
              <Text fw={600} size="lg" c={headingColor}>
                Bålforbud Season
              </Text>
            </Group>
            <Text size="md" c={bodyColor}>
              Strict general ban on open campfires in or near forests from April 15 to September 15.
              Use approved stoves on rock.
            </Text>
          </Card>

          <Card withBorder padding="md" radius="md" style={simpleCardStyle}>
            <Group gap="xs" mb="xs">
              <ThemeIcon variant="light" color="red" size="lg" radius="md">
                <ShieldAlert size={20} aria-hidden="true" />
              </ThemeIcon>
              <Text fw={600} size="lg" c={headingColor}>
                Weather Volatility
              </Text>
            </Group>
            <Text size="md" c={bodyColor}>
              Mountain weather changes instantly. Fog, snow, and severe wind can set in even during
              summer months above the treeline.
            </Text>
          </Card>
        </SimpleGrid>

        {/* Accordion Rules Section */}
        <Accordion variant="separated" defaultValue="roam" styles={{ item: { border: 'none' } }}>
          <Accordion.Item value="roam" style={accordionItemStyle}>
            <Accordion.Control
              icon={<Compass size={24} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />}
            >
              <Text fw={600} size="lg" c={headingColor}>
                The Right to Roam (Allemannsretten)
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" c={bodyColor} style={{ lineHeight: 1.6 }}>
                Enshrined in the Outdoor Recreation Act of 1957, everyone can walk, ski, and cycle
                on uncultivated land. You are permitted to forage for wild berries, mushrooms, and
                flowers (except protected species). Always close farm gates behind you and respect
                grazing livestock.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="camp" style={accordionItemStyle}>
            <Accordion.Control
              icon={
                <Backpack size={24} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />
              }
            >
              <Text fw={600} size="lg" c={headingColor}>
                Wild Camping Rules & Distance Limits
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" c={bodyColor} style={{ lineHeight: 1.6 }}>
                You may pitch a tent for up to two nights in the same spot on uncultivated land
                without landowner permission. Tents must be placed at least{' '}
                <strong style={{ color: headingColor }}>150 metres</strong> away from the nearest
                inhabited house or mountain cabin. In vulnerable areas or national parks, look for
                designated campsites to protect sensitive alpine flora.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="fire" style={accordionItemStyle}>
            <Accordion.Control
              icon={<Flame size={24} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />}
            >
              <Text fw={600} size="lg" c={headingColor}>
                Campfires & Outdoor Cooking Regulations
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" c={bodyColor} style={{ lineHeight: 1.6 }}>
                Open fires are prohibited from{' '}
                <strong style={{ color: headingColor }}>April 15 to September 15</strong> near
                forests and woodlands. Gas and liquid-fueled camping stoves are generally allowed
                unless conditions are exceptionally dry. If a fire is legally permitted, use
                existing fire rings on mineral ground (rock/sand), never on moss or peat.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="waste" style={accordionItemStyle}>
            <Accordion.Control
              icon={
                <Droplets size={24} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />
              }
            >
              <Text fw={600} size="lg" c={headingColor}>
                Water Safety & Leave No Trace Waste
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" c={bodyColor} style={{ lineHeight: 1.6 }}>
                While Norwegian mountain water looks pristine, always check app advisories or
                boil/filter water downstream from grazing animals. Pack out all trash, fruit peels,
                and wet wipes. Human waste should be buried 15–20 cm deep at least 60 metres away
                from lakes, streams, and trails.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="emergency" style={accordionItemStyle}>
            <Accordion.Control
              icon={
                <PhoneCall size={24} color={isDark ? '#70c77a' : '#2d7a2f'} aria-hidden="true" />
              }
            >
              <Text fw={600} size="lg" c={headingColor}>
                Emergency Contacts & Mountain Rescue
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <List size="md" spacing="xs" c={bodyColor}>
                <List.Item>
                  <strong style={{ color: headingColor }}>112</strong> — Police & Main Rescue
                  Coordination Centre (JRCC)
                </List.Item>
                <List.Item>
                  <strong style={{ color: headingColor }}>113</strong> — Medical Emergency
                  (Ambulance / Air Ambulance)
                </List.Item>
                <List.Item>
                  <strong style={{ color: headingColor }}>110</strong> — Fire & Rescue
                </List.Item>
                <List.Item>
                  <strong style={{ color: headingColor }}>116 117</strong> — Non-emergency medical
                  consultation (Legevakt)
                </List.Item>
              </List>
              <Text size="md" mt="sm" c={bodyColor} style={{ lineHeight: 1.6 }}>
                Cell coverage can be sparse in deep valleys. Note your precise coordinates using
                Kartverket grids before calling.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* Interactive Checklist Card */}
        <Card
          withBorder
          padding="lg"
          component="section"
          aria-labelledby="checklist-heading"
          style={checklistCardStyle}
        >
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <div>
                <Group gap="xs" mb={4}>
                  <CheckCircle2 size={22} color="#2d7a4f" aria-hidden="true" />
                  <Title
                    order={2}
                    fz={{ base: '1.4rem', sm: '1.8rem' }}
                    id="checklist-heading"
                    c={headingColor}
                  >
                    Pre-Hike Safety Checklist
                  </Title>
                </Group>
                <Text size="lg" c={bodyColor}>
                  Your progress is saved automatically in your browser storage.
                </Text>
              </div>
              <Badge variant="light" color="forest" size="lg">
                {checked.length} / {CHECKLIST.length} ready ({progressPercentage}%)
              </Badge>
            </Group>

            <Progress
              value={progressPercentage}
              color="teal"
              size="sm"
              radius="xl"
              aria-label={`Checklist progress: ${progressPercentage}%`}
            />

            <Stack gap="md" mt="xs" role="group" aria-label="Pre-hike safety checklist items">
              {CHECKLIST.map((item) => {
                const isChecked = checked.includes(item.id);
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: isChecked
                        ? isDark
                          ? 'rgba(45, 122, 79, 0.2)'
                          : 'rgba(45, 122, 79, 0.08)'
                        : cardBackground,
                      border: `1px solid ${isChecked ? 'rgba(45, 122, 79, 0.4)' : borderColor}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Checkbox
                      label={
                        <Text
                          size="lg"
                          fw={isChecked ? 600 : 400}
                          c={isChecked ? headingColor : headingColor}
                          style={{
                            textDecoration: isChecked ? 'line-through' : 'none',
                            opacity: isChecked ? 0.8 : 1,
                          }}
                        >
                          {item.label}
                        </Text>
                      }
                      checked={isChecked}
                      onChange={() => toggle(item.id)}
                      color="#2d7a4f"
                      size="md"
                      aria-label={item.label}
                    />
                  </div>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
