import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Button,
  Card,
  Image,
  Box,
  Stack,
  Divider,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { HIKING_ARTICLES } from '@/data/hikingArticles';

interface ArticleMetaItemProps {
  icon: ReactNode;
  label: string;
}

function ArticleMetaItem({ icon, label }: ArticleMetaItemProps) {
  return (
    <Group gap={4} c="dimmed" fz={{ base: 'sm', md: 'md' }} align="center">
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span>{label}</span>
    </Group>
  );
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const article = id ? HIKING_ARTICLES[id] : null;

  const headingColor = isDark ? '#f1f5f2' : '#183024';
  const bodyColor = isDark ? '#d5e0d9' : '#43544b';
  const cardBackground = isDark ? '#14251d' : '#f4f8f5';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const cardStyle: CSSProperties = {
    backgroundColor: cardBackground,
    borderTop: '4px solid #28726B',
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
  };

  if (!article) {
    return (
      <Container size="md" py="xl" component="main" style={{ textAlign: 'center' }}>
        <Title order={2} c={headingColor} mb="md">
          Destination Guide Not Found
        </Title>
        <Text c={bodyColor} mb="lg">
          The hiking guide you are looking for does not exist or has been removed.
        </Text>
        <Button component={Link} to="/" color="teal" aria-label="Return to home page">
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Stack component="article" gap="lg" aria-labelledby="article-title">
        <Button
          component={Link}
          to="/"
          p={{ base: 'xs', sm: 'sm' }}
          variant="outline"
          color="teal"
          fz={{ base: 'xs', sm: 'sm' }}
          leftSection={<ArrowLeft size={16} aria-hidden="true" />}
          w="fit-content"
          aria-label="Back to home page"
        >
          Back to Home
        </Button>

        <Stack gap="xs">
          <Group gap="sm" role="list" aria-label="Article metadata" wrap="wrap">
            <Badge variant="light" color="teal" size="lg" radius="sm" role="listitem">
              {article.category}
            </Badge>
            <div role="listitem">
              <ArticleMetaItem icon={<MapPin size={14} />} label={article.region} />
            </div>
            <div role="listitem">
              <ArticleMetaItem icon={<Calendar size={14} />} label={article.date} />
            </div>
          </Group>

          <Title
            id="article-title"
            order={1}
            c={headingColor}
            fz={{ base: '1.6rem', sm: '2.5rem' }}
            lh={1.2}
          >
            {article.title}
          </Title>
        </Stack>

        <Box
          w="100%"
          style={{
            overflow: 'hidden',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
          }}
        >
          <Image
            src={article.image}
            alt={`Scenic photograph for ${article.title}`}
            h="auto"
            w="100%"
            fit="cover"
          />
        </Box>

        <Card
          p={{ base: 'md', sm: 'xl' }}
          radius="md"
          withBorder={false}
          style={cardStyle}
          component="section"
          aria-label="Article content"
        >
          <Stack gap="md">
            {article.content.map((paragraph, index) => (
              <Text key={index} size="lg" c={bodyColor} lh={1.7} style={{ whiteSpace: 'pre-line' }}>
                {paragraph}
              </Text>
            ))}
          </Stack>
        </Card>

        <Divider my="md" />

        <Group
          justify="space-between"
          align="center"
          wrap="wrap"
          gap="md"
          component="section"
          aria-label="Next steps"
        >
          <Text size="lg" c="dimmed">
            Ready to explore this destination? Check out our interactive route planner.
          </Text>
          <Button
            component={Link}
            to="/planner"
            color="teal"
            aria-label="Start planning your route"
          >
            Start Planning
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
