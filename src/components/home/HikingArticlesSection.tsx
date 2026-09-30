import { Card, SimpleGrid, Title, Text, Badge, Group, Button, Box, Image } from '@mantine/core';
import { Compass, ArrowRight, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { HIKING_ARTICLES } from '@/data/hikingArticles';

interface HikingArticlesSectionProps {
  headingColor: string;
  bodyColor: string;
  cardBackground: string;
  borderColor: string;
}

export function HikingArticlesSection({
  headingColor,
  bodyColor,
  cardBackground,
  borderColor,
}: HikingArticlesSectionProps) {
  const articlesList = Object.values(HIKING_ARTICLES);

  const cardStyle: CSSProperties = {
    backgroundColor: cardBackground,
    borderTop: '4px solid #28726B',
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  };

  return (
    <Box component="section" aria-labelledby="famous-destinations-heading">
      <Box mb="md">
        <Group gap="xs" mb={4} align="center">
          <Box
            component={Compass}
            size={22}
            color="var(--mantine-color-teal-6)"
            aria-hidden="true"
          />
          <Title
            id="famous-destinations-heading"
            order={2}
            size="h2"
            fz={{ base: '1.6rem', sm: '2.5rem' }}
            c={headingColor}
          >
            Famous Norwegian Destinations
          </Title>
        </Group>
        <Text size="md" pb="md" c={bodyColor}>
          Discover iconic mountain ranges, coastal ridges, and legendary trails across Norway.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {articlesList.map((article) => (
          <Card
            key={article.id}
            padding="lg"
            radius="md"
            withBorder={false}
            component="article"
            aria-labelledby={`destination-title-${article.id}`}
            style={cardStyle}
          >
            <div>
              <Card.Section mb="sm">
                <Image
                  src={article.image}
                  height={190}
                  alt={`Scenic view of ${article.title}`}
                  fit="cover"
                />
              </Card.Section>

              <Group justify="space-between" mb="xs" wrap="nowrap">
                <Badge size="md" variant="light" color="teal" radius="sm">
                  {article.category}
                </Badge>
                <Group gap={4} align="center">
                  <MapPin size={13} color="var(--mantine-color-dimmed)" aria-hidden="true" />
                  <Text size="sm" c="dimmed" fw={500}>
                    {article.region}
                  </Text>
                </Group>
              </Group>

              <Title
                id={`destination-title-${article.id}`}
                order={3}
                size="h4"
                c={headingColor}
                mb={8}
                lh={1.3}
              >
                {article.title}
              </Title>

              <Text size="md" c={bodyColor} lh={1.6} mb="md">
                {article.summary}
              </Text>
            </div>

            <Button
              component={Link}
              to={`/articles/${article.id}`}
              variant="outline"
              color="teal"
              size="sm"
              p={0}
              px="sm"
              rightSection={<ArrowRight size={14} aria-hidden="true" />}
              style={{ width: 'fit-content' }}
              aria-label={`Read complete guide and details for ${article.title}`}
            >
              Explore Destination
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
