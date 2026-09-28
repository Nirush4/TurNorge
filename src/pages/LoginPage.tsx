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
import { HikingLoader } from '@/components/HikingLoader';

export function Login(): JSX.Element {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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
    <Container size={540} py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      {/* Brand Header Icon */}
      <Group justify="center" mb="md">
        <Box
          p="sm"
          style={{
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(40, 114, 107, 0.2)' : 'rgba(40, 114, 107, 0.1)',
            color: '#28726B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mountain size={32} aria-hidden="true" />
        </Box>
      </Group>

      <Title
        order={1}
        fz={{ base: '1.5rem', sm: '2rem' }}
        ta="center"
        fw={700}
        mb={6}
        c={isDark ? '#eef4f1' : 'dark.7'}
      >
        Trailhead Login
      </Title>
      <Text c="dimmed" ta="center" mb="xl" size="lg">
        Sign in to track your hikes, sync routes, and access offline maps.
      </Text>

      <Card
        p={{ base: 'md', sm: 'lg' }}
        radius="lg"
        shadow="md"
        style={{
          backgroundColor: isDark ? '#14231c' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
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
                  label: { fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' },
                  input: { fontSize: '15px' },
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
                  label: { fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' },
                  input: { fontSize: '15px' },
                }}
              />

              <Button
                type="submit"
                color="teal"
                fullWidth
                size="md"
                mt="sm"
                leftSection={<LogIn size={18} aria-hidden="true" />}
                style={{ fontWeight: 600 }}
              >
                Start Journey
              </Button>
            </Stack>
          </form>
        )}
      </Card>

      <Divider
        my="lg"
        label="New to the trails?"
        labelPosition="center"
        styles={{
          label: { fontSize: '0.95rem', fontWeight: 500 },
        }}
      />

      <Text ta="center" size="md" c="dimmed">
        Don&apos;t have an account?{' '}
        <Anchor component={Link} to="/register" fw={600} fz={{ base: 'md', md: 'lg' }} c="teal.6">
          Create account
        </Anchor>
      </Text>
    </Container>
  );
}
