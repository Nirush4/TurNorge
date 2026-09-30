import { useMantineColorScheme } from '@mantine/core';

export function useThemeColors() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    headingColor: isDark ? '#ffffff' : '#112219',
    bodyColor: isDark ? '#cbd5ce' : '#4a5d53',
    cardBackground: isDark ? '#0d1c14' : '#ffffff',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)',
  };
}
