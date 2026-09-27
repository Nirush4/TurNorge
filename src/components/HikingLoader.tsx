import { Box, Text, Stack, useMantineColorScheme } from '@mantine/core';

interface HikingLoaderProps {
  text?: string;
}

export function HikingLoader({
  text = 'Lacing up your boots and fetching trails...',
}: HikingLoaderProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const hikerColor = isDark ? '#4db6ac' : '#28726B';
  const mountainOpacity = isDark ? '0.25' : '0.15';

  return (
    <Stack align="center" justify="center" gap="md" py="xl">
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80px',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div className="hiker-container" style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke={hikerColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Mountain Terrain baseline */}
            <path d="M2 22l6-11 4 6 5-9 7 14H2z" opacity={mountainOpacity} fill={hikerColor} />

            {/* Head */}
            <circle cx="12" cy="5" r="1.5" fill={hikerColor} stroke="none" />

            {/* Torso */}
            <path d="M12 6v7" />

            {/* Swinging Arms */}
            <g className="arm">
              <path d="M12 8l3 3" />
            </g>

            {/* Walking Legs */}
            <g className="leg-left">
              <path d="M12 13l-3 7" />
            </g>
            <g className="leg-right">
              <path d="M12 13l3 7" />
            </g>
          </svg>
        </div>
      </Box>
      <Text size="md" c="dimmed" ta="center" fw={500}>
        {text}
      </Text>
    </Stack>
  );
}
