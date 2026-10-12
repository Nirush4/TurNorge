import { Badge, Box, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { CheckCircle2 } from 'lucide-react';
import { SAFETY_TIPS } from './homeData';

interface SafetyCodeSectionProps {
  headingColor: string;
  bodyColor: string;
  simpleCardStyle: React.CSSProperties;
  sectionBoxStyle: React.CSSProperties;
}

export function SafetyCodeSection({
  headingColor,
  bodyColor,
  simpleCardStyle,
  sectionBoxStyle,
}: SafetyCodeSectionProps) {
  return (
    <Box component="section" aria-labelledby="safety-heading" style={sectionBoxStyle} p="lg">
      <Stack gap="xl">
        <Box ta="center" maw={700} mx="auto">
          <Badge variant="light" color="teal" size="md" radius="sm" mb="sm">
            Mountain Code
          </Badge>
          <Title
            id="safety-heading"
            order={2}
            size="h1"
            c={headingColor}
            fz={{ base: '1.6rem', sm: '2.5rem' }}
            style={{ letterSpacing: '-0.02em' }}
          >
            Mountain Safety Code for Safe Trips
          </Title>
          <Text size="md" c={bodyColor} mt={12}>
            Norway's historic code of conduct for safe mountain touring, adapted for modern
            explorers.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mt="md">
          {SAFETY_TIPS.map((tip, idx) => (
            <Card key={tip.title} p="lg" radius="lg" withBorder={false} style={simpleCardStyle}>
              <Group gap="sm" mb="lg">
                <ThemeIcon size={40} radius="md" variant="light" color="teal">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </ThemeIcon>
                <Text fw={700} size="md" c={headingColor}>
                  Rule 0{idx + 1}
                </Text>
              </Group>
              <Title
                order={3}
                size="h3"
                c={headingColor}
                mb={10}
                fz={{ base: '1.2rem', sm: '1.5rem' }}
                fw={700}
              >
                {tip.title}
              </Title>
              <Text size="md" c={bodyColor} lh={1.7}>
                {tip.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
