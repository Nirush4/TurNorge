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
  Avatar,
} from '@mantine/core';
import { UserPlus, AlertCircle, Mountain, Link2, AtSign } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/context/AuthContext';
import { HikingLoader } from '@/components/HikingLoader';
import { useThemeColors } from '@/hooks/useThemeColors';

export function Register(): JSX.Element {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password, username.trim(), avatarUrl.trim());
    setLoading(false);

    if (signUpError) {
      const friendlyError =
        signUpError.includes('duplicate key') || signUpError.includes('unique')
          ? 'That username is already taken.'
          : signUpError;

      setError(friendlyError);
      notifications.show({
        message: `Registration failed: ${friendlyError}`,
        styles: {
          root: { backgroundColor: '#E03131' },
          description: { color: '#FFFFFF' },
          closeButton: { color: '#FFFFFF' },
        },
      });
      return;
    }

    notifications.show({
      message: 'Account created! Check your email to confirm, then log in.',
      styles: {
        root: { backgroundColor: '#28726B' },
        description: { color: '#FFFFFF' },
        closeButton: { color: '#FFFFFF' },
      },
    });

    setTimeout(() => navigate('/login'), 2500);
  };

  const cardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
  };

  return (
    <Container size={500} py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <section aria-labelledby="register-header-title">
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
          id="register-header-title"
          style={{ letterSpacing: '-0.02em' }}
        >
          Join TurNorge
        </Title>
        <Text c={bodyColor} ta="center" mb="xl" size="lg" lh={1.5} maw={420} mx="auto">
          Create an account to save custom routes, sync your hiking preferences, and explore safely.
        </Text>
      </section>

      <Card
        p={{ base: 'lg', sm: 'xl' }}
        withBorder
        style={cardStyle}
        component="section"
        aria-label="Registration form card"
      >
        {loading ? (
          <div role="status" aria-live="polite">
            <HikingLoader text="Registering your account..." />
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
                >
                  {error}
                </Alert>
              )}

              <Box style={{ alignSelf: 'center', textAlign: 'center' }}>
                <Avatar
                  src={avatarUrl || null}
                  size={88}
                  radius={88}
                  alt={username ? `${username}'s avatar preview` : 'User avatar placeholder'}
                  style={{ border: `2px solid ${borderColor}` }}
                >
                  {!avatarUrl &&
                    (username?.[0]?.toUpperCase() ?? <Link2 size={24} color="#82aca0" />)}
                </Avatar>
              </Box>

              <TextInput
                label="Username"
                placeholder="trollstigen_trekker"
                leftSection={<AtSign size={16} aria-hidden="true" />}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                aria-required="true"
                aria-invalid={!!error}
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

              <TextInput
                label="Email Address"
                type="email"
                placeholder="hiker@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                aria-required="true"
                aria-invalid={!!error}
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

              <TextInput
                label="Avatar URL"
                placeholder="https://example.com/your-photo.jpg"
                leftSection={<Link2 size={16} aria-hidden="true" />}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.currentTarget.value)}
                description="Optional — paste a link to your profile picture."
                styles={{
                  label: {
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: headingColor,
                  },
                  input: { fontSize: '15px', minHeight: '44px' },
                  description: { fontSize: '0.85rem', color: bodyColor },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                aria-required="true"
                aria-invalid={!!error}
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
                label="Confirm Password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                required
                aria-required="true"
                aria-invalid={!!error}
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
                leftSection={<UserPlus size={18} aria-hidden="true" />}
                style={{ fontWeight: 600, minHeight: '44px' }}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        )}
      </Card>

      <Divider
        my="xl"
        label="Already have an account?"
        labelPosition="center"
        styles={{
          label: { fontSize: '0.9rem', fontWeight: 500, color: bodyColor },
        }}
      />

      <Text ta="center" size="sm" c={bodyColor}>
        Ready to get back on the path?{' '}
        <Anchor
          component={Link}
          to="/login"
          fw={600}
          c="teal.6"
          fz="md"
          style={{ textDecoration: 'underline' }}
        >
          Log in
        </Anchor>
      </Text>
    </Container>
  );
}
