import {
  Container,
  Title,
  Text,
  Stack,
  List,
  Paper,
  Divider,
  useMantineColorScheme,
} from '@mantine/core';
import { ShieldAlert, UserCheck, Lock, Compass, HelpCircle } from 'lucide-react';

export function TermsPage() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Container size="lg" py={{ base: 'xl', sm: 70 }} component="main" mih="100dvh">
      <Stack gap="xl">
        {/* Header Section */}
        <header>
          <Title
            order={1}
            fz={{ base: '1.7rem', sm: '2.5rem' }}
            mb="xs"
            c={isDark ? 'gray.1' : 'dark.9'}
            style={{ letterSpacing: '-0.02em' }}
          >
            Terms and Conditions
          </Title>
          <Text c="dimmed" size="md">
            Last updated: September 28, 2026
          </Text>
        </header>

        <Divider color={isDark ? 'dark.4' : 'gray.3'} />

        {/* Introduction */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          bg={isDark ? 'dark.7' : 'gray.0'}
          style={{
            borderColor: isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-3)',
          }}
        >
          <Text size="md" lh={1.6} c={isDark ? 'gray.2' : 'dark.8'}>
            Welcome to <strong>TurNorge</strong>. By accessing or using our platform, digital
            mapping tools, and outdoor services, you agree to be bound by these Terms and
            Conditions. Please review them carefully before registering an account or planning your
            excursions.
          </Text>
        </Paper>

        {/* Section 1: User Accounts & Registration */}
        <section aria-labelledby="section-accounts">
          <Stack gap="sm">
            <Title
              order={2}
              id="section-accounts"
              size="h3"
              fw={600}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              c={isDark ? 'gray.2' : 'dark.8'}
            >
              <UserCheck size={20} aria-hidden="true" strokeWidth={1.8} /> 1. User Accounts &
              Registration
            </Title>
            <Text size="md" lh={1.6} c={isDark ? 'gray.3' : 'dark.7'}>
              To utilize features such as saving favorite hiking trails and synchronizing your
              personal profile data across devices, you must create a secure account via Supabase
              authentication. You agree to:
            </Text>
            <List size="md" spacing="xs" withPadding c={isDark ? 'gray.3' : 'dark.7'}>
              <List.Item>Provide accurate and current information during registration.</List.Item>
              <List.Item>Protect the confidentiality of your login credentials.</List.Item>
              <List.Item>
                Assume full responsibility for all activities conducted under your user profile.
              </List.Item>
            </List>
          </Stack>
        </section>

        {/* Section 2: Outdoor Safety & Allemannsretten Disclaimer */}
        <section aria-labelledby="section-safety">
          <Stack gap="sm">
            <Title
              order={2}
              id="section-safety"
              size="h3"
              fw={600}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              c={isDark ? 'gray.2' : 'dark.8'}
            >
              <ShieldAlert size={20} aria-hidden="true" strokeWidth={1.8} /> 2. Outdoor Safety &
              Allemannsretten Guide
            </Title>
            <Text size="md" lh={1.6} c={isDark ? 'gray.3' : 'dark.7'}>
              TrailApp integrates mapping references (Kartverket), meteorological feeds (MET.no),
              and guidelines concerning the Norwegian Right to Roam (*Allemannsretten*). Please
              note:
            </Text>
            <List size="md" spacing="xs" withPadding c={isDark ? 'gray.3' : 'dark.7'}>
              <List.Item>
                Mountain weather conditions shift rapidly; digital telemetry and forecasts are
                advisory.
              </List.Item>
              <List.Item>
                Users retain sole responsibility for personal navigation, physical preparedness, and
                safety.
              </List.Item>
              <List.Item>
                Always obey local regulations, seasonal wildlife protections, and private property
                guidelines.
              </List.Item>
            </List>
          </Stack>
        </section>

        {/* Section 3: Data Privacy & Cloud Sync */}
        <section aria-labelledby="section-privacy">
          <Stack gap="sm">
            <Title
              order={2}
              id="section-privacy"
              size="h3"
              fw={600}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              c={isDark ? 'gray.2' : 'dark.8'}
            >
              <Lock size={20} aria-hidden="true" strokeWidth={1.8} /> 3. Data Storage & Cloud
              Synchronization
            </Title>
            <Text size="md" lh={1.6} c={isDark ? 'gray.3' : 'dark.7'}>
              We utilize secure PostgreSQL databases and cloud storage buckets via Supabase to
              safeguard your user profile, custom avatar assets, and favorite trail routes. You
              retain full ownership of all data and media uploaded to your account.
            </Text>
          </Stack>
        </section>

        {/* Section 4: Acceptable Use */}
        <section aria-labelledby="section-use">
          <Stack gap="sm">
            <Title
              order={2}
              id="section-use"
              size="h3"
              fw={600}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              c={isDark ? 'gray.2' : 'dark.8'}
            >
              <Compass size={20} aria-hidden="true" strokeWidth={1.8} /> 4. Acceptable Use Policy
            </Title>
            <Text size="md" lh={1.6} c={isDark ? 'gray.3' : 'dark.7'}>
              Users agree not to exploit or misuse the platform infrastructure. Prohibited actions
              include attempting to bypass route protections, interfering with cloud sync protocols,
              uploading harmful media through storage buckets, or scraping proprietary trail
              telemetry data.
            </Text>
          </Stack>
        </section>

        {/* Section 5: Contact */}
        <section aria-labelledby="section-contact">
          <Stack gap="sm">
            <Title
              order={2}
              id="section-contact"
              size="h3"
              fw={600}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              c={isDark ? 'gray.2' : 'dark.8'}
            >
              <HelpCircle size={20} aria-hidden="true" strokeWidth={1.8} /> 5. Questions & Support
            </Title>
            <Text size="md" lh={1.6} c={isDark ? 'gray.3' : 'dark.7'}>
              For inquiries regarding these Terms and Conditions or technical assistance with your
              account, please connect with our development team via the project repository or
              support channels.
            </Text>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
