import type { JSX } from 'react';
import { Box, Container, Stack } from '@mantine/core';
import { HikingArticlesSection } from '@/components/home/HikingArticlesSection';
import { HeroSection } from '@/components/home/HeroSection';
import { useAppState } from '@/context/AppStateContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColors } from '@/hooks/useThemeColors';

import { FeaturesSection } from '@/components/home/FeaturesSection';
import { FeaturedRegionsSection } from '@/components/home/FeaturedRegionsSection';
import { LogisticsSection } from '@/components/home/LogisticsSection';
import { SafetyCodeSection } from '@/components/home/SafetyCodeSection';
import { FavoritesStatusCard } from '@/components/home/FavoritesStatusCard';

export function HomePage(): JSX.Element {
  const { savedRoutes } = useAppState();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

  const pageBg = isDark ? '#07120d' : '#f4f7f5';
  const sectionBg = isDark ? 'rgba(11, 28, 20, 0.5)' : 'rgba(255, 255, 255, 0.7)';
  const activeCount = user ? favorites.length : savedRoutes.length;

  const cardStyle = {
    backgroundColor: cardBackground,
    borderTop: '4px solid #28726B',
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
  };

  const simpleCardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
  };

  const sectionBoxStyle = {
    backgroundColor: sectionBg,
    borderRadius: '24px',
    border: `1px solid ${borderColor}`,
  };

  return (
    <Box
      component="main"
      style={{
        width: '100%',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        backgroundColor: pageBg,
      }}
    >
      <HeroSection />

      <Container size="lg" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <Stack gap={100} pb={100}>
          <FeaturesSection
            headingColor={headingColor}
            bodyColor={bodyColor}
            cardStyle={cardStyle}
          />

          <FeaturedRegionsSection headingColor={headingColor} bodyColor={bodyColor} />

          <LogisticsSection
            headingColor={headingColor}
            bodyColor={bodyColor}
            cardStyle={cardStyle}
            sectionBoxStyle={sectionBoxStyle}
          />

          <Box component="section">
            <HikingArticlesSection
              headingColor={headingColor}
              bodyColor={bodyColor}
              cardBackground={cardBackground}
              borderColor={borderColor}
            />
          </Box>

          <SafetyCodeSection
            headingColor={headingColor}
            bodyColor={bodyColor}
            simpleCardStyle={simpleCardStyle}
            sectionBoxStyle={sectionBoxStyle}
          />

          <FavoritesStatusCard
            user={user}
            activeCount={activeCount}
            headingColor={headingColor}
            bodyColor={bodyColor}
            cardStyle={cardStyle}
          />
        </Stack>
      </Container>
    </Box>
  );
}
