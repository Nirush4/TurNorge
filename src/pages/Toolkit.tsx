import {
  Accordion,
  Badge,
  Card,
  Checkbox,
  Container,
  Group,
  List,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const CHECKLIST = [
  { id: 'map', label: 'Paper Kartverket map plus offline track' },
  { id: 'weather', label: 'Checked MET Norway and mountain forecast, not only this app' },
  { id: 'distance', label: 'Camp site planned 150 m from inhabited houses' },
  { id: 'fire', label: 'Stove ready; fire rules checked (bålforbud 15 Apr–15 Sep)' },
  { id: 'waste', label: 'Pack-out bag for rubbish and toilet paper' },
  { id: 'sos', label: '112 / 113 stored, and someone has your itinerary' },
] as const;

export function ToolkitPage() {
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
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Allemannsretten & safety</Title>
          <Text mt="xs">
            Norway’s Right to Roam (allemannsretten) lets people walk, ski, and camp on uncultivated
            land. It is paired with a duty of care: do not damage, disturb, or leave waste.
          </Text>
        </div>

        <Accordion variant="separated" defaultValue="roam">
          <Accordion.Item value="roam">
            <Accordion.Control>Right to Roam</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                On utmark (uncultivated land) you may walk, cycle on suitable tracks, ski, and pick
                berries and mushrooms. Stay off newly planted forest, fenced pasture in season, and
                private yards. In innmark (cultivated land) access is much more limited, especially
                in the growing season.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="camp">
            <Accordion.Control>Camping distances</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                Pitch tents at least 150 metres from inhabited houses or cabins. One or two nights
                is the ethic in popular areas unless local rules say otherwise. National parks and
                nature reserves can add extra restrictions — read the signs.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="fire">
            <Accordion.Control>Bålforbud (campfire ban)</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                Open fires in or near forest and open landscape are generally prohibited from 15
                April to 15 September. Municipalities can extend bans in dry weather. Use a stove on
                mineral ground, never leave a fire, and never burn plastic.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="waste">
            <Accordion.Control>Waste and water</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                Pack out all rubbish, including fruit peels and toilet paper in high-use zones. Do
                not wash dishes with soap in streams. Human waste should be buried well away from
                water, or packed out where soil is thin.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="emergency">
            <Accordion.Control>Emergency numbers</Accordion.Control>
            <Accordion.Panel>
              <List size="sm">
                <List.Item>112 — police and rescue coordination</List.Item>
                <List.Item>113 — medical emergency</List.Item>
                <List.Item>110 — fire</List.Item>
                <List.Item>116 117 — non-emergency medical help (legevakt)</List.Item>
              </List>
              <Text size="sm" mt="sm">
                In the mountains, also note your last known Kartverket grid and whether you have
                phone coverage. A personal locator beacon is wise above the treeline.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Card withBorder padding="lg">
          <Group justify="space-between">
            <Title order={2}>Safety checklist</Title>
            <Badge color="frost">
              {checked.length}/{CHECKLIST.length} ready
            </Badge>
          </Group>
          <Text size="sm" mt="xs" mb="md">
            Stored only in this browser.
          </Text>
          <Stack>
            {CHECKLIST.map((item) => (
              <Checkbox
                key={item.id}
                label={item.label}
                checked={checked.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
            ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
