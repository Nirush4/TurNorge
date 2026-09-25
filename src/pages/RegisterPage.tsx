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
  Avatar,
  Group,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { UserPlus, AlertCircle, CheckCircle2, Link2, AtSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Register(): JSX.Element {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
      setError(
        signUpError.includes('duplicate key') || signUpError.includes('unique')
          ? 'That username is already taken.'
          : signUpError,
      );
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  return (
    <Container size="xs" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Title order={1} fz="2rem" ta="center" mb="xs" c={isDark ? '#eef4f1' : 'dark.7'}>
        Create Account
      </Title>
      <Text c="dimmed" ta="center" mb="lg">
        Save routes, plan trips, and build your hiking profile.
      </Text>

      <Card
        padding="xl"
        radius="md"
        style={{
          backgroundColor: isDark ? '#182c23' : '#f4f8f5',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {success ? (
          <Alert color="forest" icon={<CheckCircle2 size={16} />} variant="light">
            Account created! Check your email to confirm, then log in.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {error && (
                <Alert color="red" icon={<AlertCircle size={16} />} variant="light">
                  {error}
                </Alert>
              )}

              {/* Optional avatar preview from URL */}
              <Box style={{ alignSelf: 'center', textAlign: 'center' }}>
                <Avatar src={avatarUrl || null} size={96} radius={96}>
                  {!avatarUrl &&
                    (username?.[0]?.toUpperCase() ?? <Link2 size={24} color="#82aca0" />)}
                </Avatar>
              </Box>

              <TextInput
                label="Username"
                placeholder="e.g. trollstigen_trekker"
                leftSection={<AtSign size={14} />}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />

              <TextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />

              <TextInput
                label="Avatar URL"
                placeholder="https://example.com/your-photo.jpg"
                leftSection={<Link2 size={14} />}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.currentTarget.value)}
                description="Optional — paste a link to an image. You can change this anytime from your profile."
              />

              <PasswordInput
                label="Password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                required
              />

              <Button
                type="submit"
                color="forest"
                fullWidth
                loading={loading}
                leftSection={<UserPlus size={16} />}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        )}
      </Card>

      <Group justify="center" mt="md">
        <Text size="sm" c="dimmed">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" c="forest.5">
            Log in
          </Anchor>
        </Text>
      </Group>
    </Container>
  );
}
