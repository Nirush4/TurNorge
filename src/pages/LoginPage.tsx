import { useState, type JSX, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Alert,
  useMantineColorScheme,
  Box,
  Group,
  Divider,
} from '@mantine/core';
import { LogIn, AlertCircle, Mountain } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/context/AuthContext';
import { useAppState } from '@/context/AppStateContext';
import { HikingLoader } from '@/components/HikingLoader';

export function Login(): JSX.Element {
  const { signIn } = useAuth();
  const { setSavedRoutes } = useAppState();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#f1f5f2' : '#112219';
  const textColor = isDark ? '#cbd5ce' : '#4a5d53';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error);
      notifications.show({
        message: `Login failed: ${error}`,
        styles: {
          root: { backgroundColor: '#E03131' },
          description: { color: '#FFFFFF' },
          closeButton: { color: '#FFFFFF' },
        },
      });
      return;
    }

    try {
      const storedRoutes = localStorage.getItem('nordictrail-saved-routes');
      if (storedRoutes) {
        const parsedRoutes = JSON.parse(storedRoutes);
        if (Array.isArray(parsedRoutes)) {
          setSavedRoutes(parsedRoutes);
        }
      }
    } catch (err) {
      console.error('Failed to load saved routes from storage:', err);
    }

    notifications.show({
      message: 'Successfully logged in! Trail map loaded.',
      styles: {
        root: { backgroundColor: '#28726B' },
        description: { color: '#FFFFFF' },
        closeButton: { color: '#FFFFFF' },
      },
    });

    navigate('/profile');
  };

  return (
    <Container size={500} py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Group justify="center" mb="md">
        <Box
          p="md"
          style={{
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(40, 114, 107, 0.25)' : 'rgba(40, 114, 107, 0.12)',
            color: '#28726B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mountain size={30} aria-hidden="true" />
        </Box>
      </Group>

      <Title
        order={1}
        fz={{ base: '1.75rem', sm: '2.1rem' }}
        ta="center"
        fw={700}
        mb={8}
        c={headingColor}
        style={{ letterSpacing: '-0.02em' }}
      >
        Trailhead Login
      </Title>
      <Text c={textColor} ta="center" mb="xl" size="md" lh={1.5} maw={420} mx="auto">
        Sign in to track your hikes, sync routes, and access offline maps.
      </Text>

      <Card
        p={{ base: 'lg', sm: 'xl' }}
        radius="lg"
        withBorder={false}
        style={{
          backgroundColor: isDark ? '#112219' : '#ffffff',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)'}`,
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)'}`,
          borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)'}`,
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)'}`,
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(17,34,25,0.06)',
        }}
      >
        {loading ? (
          <HikingLoader text="Lacing up your boots and fetching trails..." />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              {error && (
                <Alert
                  color="red"
                  icon={<AlertCircle size={16} aria-hidden="true" />}
                  variant="light"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email Address"
                type="email"
                placeholder="hiker@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                aria-required="true"
                styles={{
                  label: {
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: headingColor,
                  },
                  input: { fontSize: '15px', minHeight: '44px' },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your secure password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                aria-required="true"
                styles={{
                  label: {
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: headingColor,
                  },
                  input: { fontSize: '15px', minHeight: '44px' },
                }}
              />

              <Button
                type="submit"
                color="teal"
                fullWidth
                size="md"
                mt="xs"
                leftSection={<LogIn size={18} aria-hidden="true" />}
                style={{ fontWeight: 600, minHeight: '44px' }}
              >
                Start Journey
              </Button>
            </Stack>
          </form>
        )}
      </Card>

      <Divider
        my="xl"
        label="New to the trails?"
        labelPosition="center"
        styles={{
          label: { fontSize: '0.9rem', fontWeight: 500, color: textColor },
        }}
      />

      <Text ta="center" size="sm" c={textColor}>
        Don&apos;t have an account?{' '}
        <Anchor
          component={Link}
          to="/register"
          fw={600}
          c="teal.6"
          style={{ textDecoration: 'underline' }}
        >
          Create account
        </Anchor>
      </Text>
    </Container>
  );
}
