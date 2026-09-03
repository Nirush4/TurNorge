import { createTheme, type MantineColorsTuple } from '@mantine/core';

const pine: MantineColorsTuple = [
  '#eef6f1',
  '#d3eadc',
  '#a8d4c0',
  '#7cbea1',
  '#57ab89',
  '#3d8f6e',
  '#2d6a4f',
  '#1b4332',
  '#143328',
  '#081c15',
];

const moss: MantineColorsTuple = [
  '#fbf6ef',
  '#f3e7d4',
  '#e8d0b0',
  '#dcb88a',
  '#d4a373',
  '#c48b52',
  '#a8723d',
  '#875b32',
  '#6b4828',
  '#4a311b',
];

const frost: MantineColorsTuple = [
  '#eaf6fc',
  '#d2ebf8',
  '#a8d7f0',
  '#7ac0e6',
  '#4ea8de',
  '#2f90cb',
  '#2174a8',
  '#1a5c86',
  '#154a6b',
  '#0e334b',
];

const charcoal: MantineColorsTuple = [
  '#e8eeeb',
  '#c5d0cb',
  '#9aada6',
  '#6f887f',
  '#4a635b',
  '#2f463f',
  '#1b2622',
  '#12201c',
  '#0c1814',
  '#081c15',
];

export const theme = createTheme({
  primaryColor: 'pine',
  primaryShade: { light: 7, dark: 5 },
  colors: {
    pine,
    moss,
    frost,
    dark: charcoal,
  },
  fontFamily: '"IBM Plex Sans", system-ui, -apple-system, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  headings: {
    fontFamily: '"Source Serif 4", "Iowan Old Style", Georgia, serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2' },
      h2: { fontSize: '1.85rem', lineHeight: '1.25' },
      h3: { fontSize: '1.4rem', lineHeight: '1.3' },
    },
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  focusRing: 'auto',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Anchor: {
      defaultProps: {
        underline: 'hover',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
  other: {
    brandDeep: '#1b4332',
    brandPine: '#2d6a4f',
    surfaceDark: '#081c15',
    surfaceSlate: '#1b2622',
    accentMoss: '#d4a373',
    accentFrost: '#4ea8de',
  },
});
