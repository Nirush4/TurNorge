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
  Avatar,
} from '@mantine/core';
import { UserPlus, AlertCircle, Mountain, Link2, AtSign } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/context/AuthContext';
import { HikingLoader } from '@/components/HikingLoader';

export function Register(): JSX.Element {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#f1f5f2' : '#112219';
  const textColor = isDark ? '#cbd5ce' : '#4a5d53';

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
        fz={{ base: '1.5rem', sm: '2.1rem' }}
        ta="center"
        fw={700}
        mb={8}
        c={headingColor}
        style={{ letterSpacing: '-0.02em' }}
      >
        Join TurNorge
      </Title>
      <Text c={textColor} ta="center" mb="xl" size="md" lh={1.5} maw={420} mx="auto">
        Create an account to save custom routes, sync your hiking preferences, and explore safely.
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
        }}
      >
        {loading ? (
          <HikingLoader text="Registering your account..." />
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
                  style={{ border: '2px solid white' }}
                >
                  {!avatarUrl &&
                    (username?.[0]?.toUpperCase() ?? <Link2 size={24} color="#82aca0" />)}
                </Avatar>
              </Box>

              <TextInput
                label="Username"
                placeholder="trollstigen_trekker"
                leftSection={<AtSign size={16} />}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
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

              <TextInput
                label="Avatar URL"
                placeholder="https://example.com/your-photo.jpg"
                leftSection={<Link2 size={16} />}
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
                  description: { fontSize: '0.85rem', color: textColor },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="At least 6 characters"
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

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
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
          label: { fontSize: '0.9rem', fontWeight: 500, color: textColor },
        }}
      />

      <Text ta="center" size="sm" c={textColor}>
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
