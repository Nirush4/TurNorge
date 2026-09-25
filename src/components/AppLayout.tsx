import { useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Stack,
  Container,
  Box,
  Avatar,
  Button,
  Divider,
  Text,
  Menu,
} from '@mantine/core';
import {
  Compass,
  Home,
  Shield,
  Sparkles,
  BookmarkCheck,
  LogIn,
  UserPlus,
  User,
  Pencil,
  LogOut,
} from 'lucide-react';
import { NavLink as RouterNavLink, Outlet, useNavigate } from 'react-router-dom';
import { AccessibilityWrapper } from '@/components/AccessibilityWrapper';
import { AppFooter } from '@/components/AppFooter';
import { BrandLogo } from '@/components/BrandLogo';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

const BASE_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/planner', label: 'Trip Planner', icon: Sparkles, end: false },
  { to: '/explore', label: 'Explore Trails', icon: Compass, end: false },
  { to: '/toolkit', label: 'Allemannsretten Guide', icon: Shield, end: false },
] as const;

export function AppLayout() {
  const [mobileOpened, setMobileOpened] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const hasFavorites = favorites.length > 0;

  const navItems = [
    ...BASE_NAV_ITEMS,
    ...(hasFavorites
      ? [{ to: '/favorites', label: 'Favorites', icon: BookmarkCheck, end: false }]
      : []),
  ];

  return (
    <AccessibilityWrapper>
      <AppShell
        header={{ height: { base: 62, sm: 72 } }}
        navbar={{
          width: 280,
          breakpoint: 'md',
          collapsed: { desktop: true, mobile: !mobileOpened },
        }}
        padding={0}
      >
        <AppShell.Header>
          <Container size="lg" h="100%" px={{ base: 'md', lg: '0' }}>
            <Group h="100%" justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <Burger
                  opened={mobileOpened}
                  onClick={() => setMobileOpened((open) => !open)}
                  hiddenFrom="md"
                  size="sm"
                  aria-label="Toggle navigation"
                />
                <BrandLogo />
              </Group>

              <Group
                gap="xs"
                visibleFrom="md"
                component="nav"
                aria-label="Primary"
                wrap="nowrap"
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    component={RouterNavLink}
                    to={item.to}
                    end={item.end}
                    label={item.label}
                    leftSection={<item.icon size={16} aria-hidden="true" />}
                    style={{ borderRadius: 8, width: 'auto', flexShrink: 0 }}
                  />
                ))}
              </Group>

              <Group gap="sm" wrap="nowrap">
                {user ? (
                  <Menu shadow="md" width={200} position="bottom-end" withArrow>
                    <Menu.Target>
                      <Avatar
                        src={profile?.avatar_url}
                        radius="xl"
                        size={36}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        aria-label="Open user menu"
                      >
                        {!profile?.avatar_url && (profile?.username?.[0] ?? user.email?.[0])}
                      </Avatar>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Account</Menu.Label>
                      <Menu.Item
                        leftSection={<Pencil size={14} />}
                        onClick={() => navigate('/profile')}
                      >
                        View Profile
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<LogOut size={14} />}
                        onClick={() => signOut()}
                      >
                        Log Out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Group gap={6} wrap="nowrap">
                    <Button
                      component={RouterNavLink}
                      to="/login"
                      variant="subtle"
                      color="teal"
                      size="sm"
                      leftSection={<LogIn size={14} />}
                      visibleFrom="xs"
                    >
                      Log In
                    </Button>
                    <Button
                      component={RouterNavLink}
                      to="/register"
                      variant="filled"
                      color="teal"
                      size="sm"
                      leftSection={<UserPlus size={14} />}
                      visibleFrom="xs"
                    >
                      Sign Up
                    </Button>
                  </Group>
                )}

                <ColorSchemeToggle />
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        {/* Mobile Navigation Drawer */}
        <AppShell.Navbar p="sm">
          <Stack gap="xs" component="nav" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                component={RouterNavLink}
                to={item.to}
                end={item.end}
                label={item.label}
                leftSection={<item.icon size={16} aria-hidden="true" />}
                onClick={() => setMobileOpened(false)}
              />
            ))}

            <Divider my="xs" />

            {user ? (
              <Stack gap={4}>
                <NavLink
                  component={RouterNavLink}
                  to="/profile"
                  label={profile?.username || 'My Profile'}
                  leftSection={
                    <Avatar src={profile?.avatar_url} radius="xl" size={20}>
                      {!profile?.avatar_url && <User size={12} />}
                    </Avatar>
                  }
                  onClick={() => setMobileOpened(false)}
                />
                <NavLink
                  label="Log Out"
                  color="red"
                  leftSection={<LogOut size={16} aria-hidden="true" />}
                  onClick={() => {
                    setMobileOpened(false);
                    signOut();
                  }}
                />
              </Stack>
            ) : (
              <Stack gap={6}>
                <Text size="xs" c="dimmed" px="xs">
                  Sign in to save routes across devices
                </Text>
                <NavLink
                  component={RouterNavLink}
                  to="/login"
                  label="Log In"
                  leftSection={<LogIn size={16} aria-hidden="true" />}
                  onClick={() => setMobileOpened(false)}
                />
                <NavLink
                  component={RouterNavLink}
                  to="/register"
                  label="Sign Up"
                  leftSection={<UserPlus size={16} aria-hidden="true" />}
                  onClick={() => setMobileOpened(false)}
                />
              </Stack>
            )}
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main id="main-content" tabIndex={-1}>
          <Box
            style={{
              minHeight: 'calc(100vh - 200px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              overflowX: 'hidden',
            }}
          >
            <div>
              <Outlet />
            </div>
            <Box
              component="footer"
              style={{
                width: '100%',
                borderTop: '1px solid var(--mantine-color-default-border)',
                marginTop: 'auto',
              }}
            >
              <Container size="lg" px="md" py="md">
                <AppFooter />
              </Container>
            </Box>
          </Box>
        </AppShell.Main>
      </AppShell>
    </AccessibilityWrapper>
  );
}
