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
  Box,
  Group,
  Divider,
} from '@mantine/core';
import { LogIn, AlertCircle, Mountain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppState } from '@/context/AppStateContext';
import { HikingLoader } from '@/components/HikingLoader';
import { useThemeColors } from '@/hooks/useThemeColors';
import { showAppNotification } from '@/utils/notifications';

export function Login(): JSX.Element {
  const { signIn } = useAuth();
  const { setSavedRoutes } = useAppState();
  const navigate = useNavigate();

  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    setLoading(false);

    if (authError) {
      setError(authError);
      showAppNotification({
        message: `Login failed: ${authError}`,
        isError: true,
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

    showAppNotification({
      message: 'Successfully logged in! Trail map loaded.',
      isError: false,
    });

    navigate('/profile');
  };

  const cardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
  };

  return (
    <Container size={500} py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <header>
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
          fz={{ base: '1.5rem', sm: '2.1rem' }}
          ta="center"
          fw={700}
          mb={8}
          c={headingColor}
          id="login-header-title"
          style={{ letterSpacing: '-0.02em' }}
        >
          Trailhead Login
        </Title>
        <Text c={bodyColor} ta="center" mb="xl" size="lg" lh={1.5} maw={420} mx="auto">
          Sign in to track your hikes, sync routes, and access offline maps.
        </Text>
      </header>

      <Card
        p={{ base: 'lg', sm: 'xl' }}
        withBorder
        style={cardStyle}
        component="section"
        aria-labelledby="login-header-title"
      >
        {loading ? (
          <div role="status" aria-live="polite" aria-label="Loading authentication process">
            <HikingLoader text="Lacing up your boots and fetching trails..." />
          </div>
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
                  id="login-error-message"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email Address"
                id="email-input"
                type="email"
                placeholder="hiker@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error-message' : undefined}
                styles={{
                  label: {
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: headingColor,
                  },
                  input: { fontSize: '16px', minHeight: '44px' },
                }}
              />

              <PasswordInput
                label="Password"
                id="password-input"
                placeholder="Your secure password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error-message' : undefined}
                styles={{
                  label: {
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: headingColor,
                  },
                  input: { fontSize: '16px', minHeight: '44px' },
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
          label: { fontSize: '0.9rem', fontWeight: 500, color: bodyColor },
        }}
      />

      <Text ta="center" size="sm" c={bodyColor}>
        Don&apos;t have an account?{' '}
        <Anchor
          component={Link}
          to="/register"
          fw={600}
          c="teal.6"
          fz="md"
          style={{ textDecoration: 'underline' }}
        >
          Create account
        </Anchor>
      </Text>
    </Container>
  );
}
