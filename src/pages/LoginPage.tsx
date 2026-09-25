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
} from '@mantine/core';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
    } else {
      navigate('/profile');
    }
  };

  return (
    <Container size="xs" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Title order={1} fz="2rem" ta="center" mb="xs" c={isDark ? '#eef4f1' : 'dark.7'}>
        Welcome Back
      </Title>
      <Text c="dimmed" ta="center" mb="lg">
        Log in to access your saved routes and trip plans.
      </Text>

      <Card
        padding="xl"
        radius="md"
        style={{
          backgroundColor: isDark ? '#182c23' : '#f4f8f5',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert color="red" icon={<AlertCircle size={16} />} variant="light">
                {error}
              </Alert>
            )}

            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Button
              type="submit"
              color="forest"
              fullWidth
              loading={loading}
              leftSection={<LogIn size={16} />}
            >
              Log In
            </Button>
          </Stack>
        </form>
      </Card>

      <Text ta="center" mt="md" size="sm" c="dimmed">
        Don&apos;t have an account?{' '}
        <Anchor component={Link} to="/register" c="forest.5">
          Sign up
        </Anchor>
      </Text>
    </Container>
  );
}
