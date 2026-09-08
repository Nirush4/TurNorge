import { useState } from 'react';
import { AppShell, Burger, Group, NavLink, Stack, Container, Box } from '@mantine/core';
import { Compass, Home, Shield, Sparkles, BookmarkCheck } from 'lucide-react';
import { NavLink as RouterNavLink, Outlet } from 'react-router-dom';
import { AccessibilityWrapper } from '@/components/AccessibilityWrapper';
import { AppFooter } from '@/components/AppFooter';
import { BrandLogo } from '@/components/BrandLogo';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle';
import { useAppState } from '@/context/AppStateContext';

const BASE_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/planner', label: 'Trip Planner', icon: Sparkles, end: false },
  { to: '/explore', label: 'Explore Trails', icon: Compass, end: false },
  { to: '/toolkit', label: 'Allemannsretten Guide', icon: Shield, end: false },
] as const;

export function AppLayout() {
  const [mobileOpened, setMobileOpened] = useState(false);
  const { savedRoutes } = useAppState();

  const hasFavorites = Array.isArray(savedRoutes) && savedRoutes.length > 0;

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
        padding="md"
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

              <ColorSchemeToggle />
            </Group>
          </Container>
        </AppShell.Header>

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
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main id="main-content" tabIndex={-1}>
          <Container
            size="lg"
            p={0}
            style={{
              minHeight: 'calc(100vh - 200px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowX: 'hidden',
            }}
          >
            <div>
              <Outlet />
            </div>
            <Box
              component="footer"
              style={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                borderTop: '1px solid var(--mantine-color-default-border)',
                overflowX: 'hidden',
              }}
            >
              <Container size="lg" px="md">
                <AppFooter />
              </Container>
            </Box>
          </Container>
        </AppShell.Main>
      </AppShell>
    </AccessibilityWrapper>
  );
}
