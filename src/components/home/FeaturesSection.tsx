import { Badge, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title, Box } from '@mantine/core';
import { FEATURES } from './homeData';

interface FeaturesSectionProps {
  headingColor: string;
  bodyColor: string;
  cardStyle: React.CSSProperties;
}

export function FeaturesSection({ headingColor, bodyColor, cardStyle }: FeaturesSectionProps) {
  return (
    <Box component="section" aria-labelledby="features-heading">
      <Stack align="center" ta="center" mb={50} maw={700} mx="auto">
        <Badge variant="light" color="teal" size="md" radius="sm">
          Platform Standards
        </Badge>
        <Title
          id="features-heading"
          order={2}
          size="h1"
          c={headingColor}
          fz={{ base: '1.6rem', sm: '2.5rem' }}
          style={{ letterSpacing: '-0.02em' }}
        >
          Why use TurNorge?
        </Title>
        <Text size="md" c={bodyColor}>
          Built for outdoor enthusiasts who value open standards, safety, and local privacy.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            p="lg"
            radius="lg"
            withBorder={false}
            component="article"
            style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <ThemeIcon size={50} radius="md" variant="light" color="teal" aria-hidden="true">
                  <feature.icon size={24} />
                </ThemeIcon>
                <Badge variant="outline" color="teal" size="sm">
                  {feature.badge}
                </Badge>
              </Group>

              <Title
                order={3}
                size="h3"
                c={headingColor}
                fz={{ base: '1.2rem', sm: '1.5rem' }}
                fw={700}
              >
                {feature.title}
              </Title>

              <Text size="md" c={bodyColor} lh={1.7}>
                {feature.body}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
