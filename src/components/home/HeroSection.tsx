import { Box, Container, Grid, Stack, Badge, Title, Text, Group, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import type { ReactNode, CSSProperties } from 'react';
import desktopHeroVideo from '@/assets/hero_video.mp4';
import mobileHeroVideo from '@/assets/hero_video_mobile.mp4';

interface HeroSectionProps {
  pageBg?: string;
}

interface HeroActionButtonProps {
  to: string;
  variant?: 'filled' | 'outline';
  color: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  ariaLabel: string;
  style: CSSProperties;
  children: ReactNode;
}

function HeroActionButton({
  to,
  variant = 'filled',
  color,
  leftSection,
  rightSection,
  ariaLabel,
  style,
  children,
}: HeroActionButtonProps) {
  return (
    <Button
      component={Link}
      to={to}
      size="md"
      variant={variant}
      color={color}
      radius="md"
      leftSection={leftSection}
      rightSection={rightSection}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </Button>
  );
}

export function HeroSection({ pageBg = '#07120d' }: HeroSectionProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const videoSource = isMobile ? mobileHeroVideo : desktopHeroVideo;

  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#07120d',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '4rem',
        overflow: 'hidden',
      }}
    >
      <video
        key={videoSource}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(to bottom, rgba(7,18,13,0.3) 50%, ${pageBg} 95%)`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <Container
        size="lg"
        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 2 }}
      >
        <Box p={{ base: 'md', md: 'xl' }}>
          <Grid gutter={{ base: 'xl', md: '2xl' }} align="center">
            <Grid.Col span={{ base: 12, md: 9 }} p="sm">
              <Stack component="div" gap="xl">
                <Badge
                  variant="light"
                  color="teal"
                  size="lg"
                  radius="sm"
                  w="fit-content"
                  style={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: 'rgba(17, 34, 25, 0.65)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <Box component="span" mr={6} aria-hidden="true">
                    🇳🇴
                  </Box>{' '}
                  TurNorge · Norway hiking guide
                </Badge>

                <Title
                  id="hero-title"
                  order={1}
                  c="#ffffff"
                  fz={{ base: '2rem', sm: '2.8rem', md: '3.4rem' }}
                  lh={1.15}
                  fw={700}
                  style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
                >
                  Explore Norway’s mountains and trails safely.
                </Title>

                <Text
                  size="xl"
                  c="rgba(255,255,255,0.9)"
                  maw={650}
                  lh={1.6}
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                >
                  TurNorge combines open data, weather forecasts, and outdoor guidelines to help you
                  plan routes, packing lists, and responsible camping trips.
                </Text>

                <Group
                  mt="md"
                  gap="md"
                  wrap="wrap"
                  component="nav"
                  aria-label="Hero primary actions"
                >
                  <HeroActionButton
                    to="/planner"
                    color="teal"
                    rightSection={<ArrowRight size={18} aria-hidden="true" />}
                    ariaLabel="Plan your custom trip with TurNorge route planner"
                    style={{
                      fontWeight: 600,
                      boxShadow: '0 8px 25px rgba(0, 150, 130, 0.3)',
                      minHeight: '48px',
                    }}
                  >
                    Plan Your Trip
                  </HeroActionButton>

                  <HeroActionButton
                    to="/explore"
                    variant="outline"
                    color="white"
                    leftSection={<Compass size={18} aria-hidden="true" />}
                    ariaLabel="Explore Norwegian hiking trails, shops, and public transport"
                    style={{
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(12px)',
                      minHeight: '48px',
                    }}
                  >
                    Explore Trails
                  </HeroActionButton>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
