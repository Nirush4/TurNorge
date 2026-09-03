import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { Moon, Sun } from 'lucide-react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const nextScheme = computed === 'light' ? 'dark' : 'light';

  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label={`Switch to ${nextScheme} color scheme`}
      onClick={() => setColorScheme(nextScheme)}
    >
      {computed === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
    </ActionIcon>
  );
}
