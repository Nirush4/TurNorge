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
  Stack,
  Divider,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeft, Clock, Calendar, MapPin } from 'lucide-react';
import { HIKING_ARTICLES } from '@/data/hikingArticles';

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const article = id ? HIKING_ARTICLES[id] : null;

  const headingColor = isDark ? '#f1f5f2' : '#183024';
  const bodyColor = isDark ? '#d5e0d9' : '#43544b';
  const cardBackground = isDark ? '#14251d' : '#f4f8f5';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  if (!article) {
    return (
      <Container size="md" py="xl" style={{ textAlign: 'center' }}>
        <Title order={2} c={headingColor} mb="md">
          Destination Guide Not Found
        </Title>
        <Text c={bodyColor} mb="lg">
          The hiking guide you are looking for does not exist or has been removed.
        </Text>
        <Button component={Link} to="/" color="teal">
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl" px={0} component="main">
      <Stack gap="lg">
        <Button
          component={Link}
          to="/"
          variant="subtle"
          color="teal"
          leftSection={<ArrowLeft size={16} />}
          w="fit-content"
          p={0}
        >
          Back to Home
        </Button>

        <Stack gap="xs">
          <Group gap="sm" wrap="wrap">
            <Badge variant="light" color="teal" size="lg" radius="sm">
              {article.category}
            </Badge>
            <Group gap={4} c="dimmed" fz="sm" align="center">
              <MapPin size={14} />
              <span>{article.region}</span>
            </Group>
            <Group gap={4} c="dimmed" fz="sm" align="center">
              <Calendar size={14} />
              <span>{article.date}</span>
            </Group>
            <Group gap={4} c="dimmed" fz="sm" align="center">
              <Clock size={14} />
              <span>{article.readTime}</span>
            </Group>
          </Group>

          <Title order={1} c={headingColor} fz={{ base: '2rem', sm: '2.5rem' }} lh={1.2}>
            {article.title}
          </Title>
        </Stack>

        <Card padding={0} radius="md" withBorder style={{ overflow: 'hidden', borderColor }}>
          <Image src={article.image} alt={article.title} height={360} fit="cover" />
        </Card>

        <Card
          p={{ base: 'md', sm: 'xl' }}
          radius="md"
          withBorder
          style={{ backgroundColor: cardBackground, borderColor }}
        >
          <Stack gap="md">
            {article.content.map((paragraph, index) => (
              <Text key={index} size="md" c={bodyColor} lh={1.7} style={{ whiteSpace: 'pre-line' }}>
                {paragraph}
              </Text>
            ))}
          </Stack>
        </Card>

        <Divider my="md" />

        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <Text size="sm" c="dimmed">
            Ready to explore this destination? Check out our interactive route planner.
          </Text>
          <Button component={Link} to="/planner" color="teal">
            Start Planning
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
