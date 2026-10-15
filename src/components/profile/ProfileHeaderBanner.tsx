import { AVATAR_SIZE, COVER_HEIGHT } from '@/types/profileTypes';
import { Avatar, Box, Button, FileButton } from '@mantine/core';
import { Camera } from 'lucide-react';

interface ProfileHeaderBannerProps {
  coverUrl?: string | null;
  avatarUrl?: string | null;
  username?: string | null;
  email?: string | null;
  uploadingCover: boolean;
  uploadingAvatar: boolean;
  isDark: boolean;
  cardBackground: string;
  onCoverChange: (file: File | null) => Promise<void>;
  onAvatarChange: (file: File | null) => Promise<void>;
}

export function ProfileHeaderBanner({
  coverUrl,
  avatarUrl,
  username,
  email,
  uploadingCover,
  uploadingAvatar,
  isDark,
  cardBackground,
  onCoverChange,
  onAvatarChange,
}: ProfileHeaderBannerProps) {
  return (
    <>
      <Box
        pos="relative"
        h={COVER_HEIGHT}
        style={{
          backgroundColor: isDark ? '#182c23' : '#e4ece6',
          backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
        }}
        role="region"
        aria-label="Profile cover banner"
      >
        <FileButton onChange={onCoverChange} accept="image/png,image/jpeg,image/webp">
          {(props) => (
            <Button
              {...props}
              size="xs"
              variant="white"
              color="dark"
              radius="xl"
              loading={uploadingCover}
              leftSection={<Camera size={14} aria-hidden="true" />}
              pos="absolute"
              top={12}
              right={12}
              style={{ minHeight: '36px' }}
            >
              Change Cover
            </Button>
          )}
        </FileButton>

        <Box pos="absolute" bottom={-AVATAR_SIZE / 2} left={24}>
          <Box pos="relative">
            <Avatar
              src={avatarUrl}
              size={AVATAR_SIZE}
              bg="white"
              radius={AVATAR_SIZE}
              alt={username ? `${username}'s profile avatar` : 'User profile avatar'}
              style={{ border: `3px solid ${cardBackground}` }}
            >
              {!avatarUrl && (username?.[0] ?? email?.[0])}
            </Avatar>
          </Box>

          <FileButton onChange={onAvatarChange} accept="image/png,image/jpeg,image/webp">
            {(props) => (
              <Button
                {...props}
                size="xs"
                variant="filled"
                color="teal"
                radius="xl"
                loading={uploadingAvatar}
                p={6}
                pos="absolute"
                bottom={0}
                right={0}
                aria-label="Upload new profile picture"
                style={{ width: 32, height: 32, zIndex: 10, minHeight: '32px' }}
              >
                <Camera size={14} aria-hidden="true" />
              </Button>
            )}
          </FileButton>
        </Box>
      </Box>

      <Box h={AVATAR_SIZE / 2 + 16} />
    </>
  );
}
