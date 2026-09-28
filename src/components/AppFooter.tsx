import {
  Anchor,
  Group,
  Text,
  Stack,
  Divider,
  useMantineColorScheme,
  Container,
} from '@mantine/core';
import { Link } from 'react-router-dom';

export function AppFooter() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const textColor = isDark ? 'gray.4' : 'dark.6';
  const emergencyColor = isDark ? 'red.4' : 'red.7';
  const dividerColor = isDark ? 'dark.5' : 'gray.3';

  return (
    <Container size="lg" px={0} py={{ base: 'sm', sm: 20 }} component="footer" role="contentinfo">
      <Stack gap="md" align="center">
        <Group justify="space-between" align="center" w="100%" wrap="wrap" gap="md">
          <Text size="md" c={textColor} style={{ maxWidth: '450px' }}>
            Free public utility. Not an official MET Norway, Kartverket, or DNT service.
          </Text>

          <Group gap="xs" align="center">
            <Text size="md" fw={600} c={emergencyColor}>
              Emergency Hotline:
            </Text>
            <Text size="md" fw={700} c={emergencyColor}>
              112 / 113
            </Text>
          </Group>
        </Group>

        <Divider w="100%" color={dividerColor} my={4} />

        <Group justify="center" gap="sm" wrap="wrap">
          <Anchor component={Link} to="/" size="md" c={textColor} fw={500}>
            Home
          </Anchor>
          <Anchor component={Link} to="/planner" size="md" c={textColor} fw={500}>
            Trip Planner
          </Anchor>
          <Anchor component={Link} to="/explore" size="md" c={textColor} fw={500}>
            Explore Trails
          </Anchor>
          <Anchor component={Link} to="/toolkit" size="md" c={textColor} fw={500}>
            Allemannsretten
          </Anchor>
          <Anchor component={Link} to="/terms" size="md" c={textColor} fw={500}>
            Terms & Conditions
          </Anchor>
          <Anchor
            href="https://www.met.no/"
            target="_blank"
            rel="noreferrer"
            size="md"
            c={textColor}
          >
            Weather: MET.no
          </Anchor>
          <Anchor
            href="https://www.kartverket.no/"
            target="_blank"
            rel="noreferrer"
            size="md"
            c={textColor}
          >
            Maps: Kartverket
          </Anchor>
          <Anchor
            href="https://www.dnt.no/"
            target="_blank"
            rel="noreferrer"
            size="md"
            c={textColor}
          >
            DNT
          </Anchor>
        </Group>
      </Stack>
    </Container>
  );
}
