import { useState, useEffect, type JSX } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Stack,
  TextInput,
  Textarea,
  Avatar,
  FileButton,
  Box,
  Modal,
  Card,
  Badge,
  Loader,
  Center,
  ThemeIcon,
  SimpleGrid,
  Menu,
  useMantineColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  Camera,
  Save,
  LogOut,
  Mail,
  User as UserIcon,
  MapPin,
  Pencil,
  BookmarkCheck,
  Trash2,
  Compass,
  Mountain,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { supabase } from '@/lib/supabaseClient';
import { useFavorites } from '@/hooks/useFavorites';

const COVER_HEIGHT = 220;
const AVATAR_SIZE = 120;

interface FavoriteRoute {
  id: string;
  location_name: string;
  mode?: string | null;
  notes?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  trip_duration_days?: number | null;
  elevation_m?: number | null;
  added_at?: string | null;
}

export function Profile(): JSX.Element {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { favorites, loading: favoritesLoading, removeFavorite } = useFavorites();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const headingColor = isDark ? '#f1f5f2' : '#112219';
  const bodyColor = isDark ? '#cbd5ce' : '#4a5d53';
  const cardBackground = isDark ? '#112219' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,34,25,0.08)';

  const [editOpen, setEditOpen] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
      setLocation(profile.location ?? '');
    }
  }, [profile, editOpen]);

  if (!user || !profile) {
    return (
      <Container size="sm" py="xl" component="main" mih="100dvh">
        <Text c="dimmed">Loading profile...</Text>
      </Container>
    );
  }

  const uploadImage = async (file: File, bucket: 'avatars' | 'covers') => {
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${bucket === 'avatars' ? 'avatar' : 'cover'}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      notifications.show({ color: 'red', title: 'Upload failed', message: uploadError.message });
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return;
    setUploadingAvatar(true);

    const url = await uploadImage(file, 'avatars');
    if (url) {
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      await refreshProfile();
    }
    setUploadingAvatar(false);
  };

  const handleCoverChange = async (file: File | null) => {
    if (!file) return;
    setUploadingCover(true);

    const url = await uploadImage(file, 'covers');
    if (url) {
      await supabase.from('profiles').update({ cover_url: url }).eq('id', user.id);
      await refreshProfile();
    }
    setUploadingCover(false);
  };

  const handleRemoveFavorite = async (id: string, name: string) => {
    const { error } = await removeFavorite(id);
    if (error) {
      notifications.show({ color: 'red', title: 'Could not remove', message: error });
    } else {
      notifications.show({
        styles: {
          root: { backgroundColor: '#28726B' },
          description: { color: '#FFFFFF' },
          closeButton: { color: '#FFFFFF' },
        },
        message: `${name} removed from favorites.`,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        bio: bio || null,
        location: location || null,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setError(
        error.message.includes('duplicate key') || error.message.includes('unique')
          ? 'That username is already taken.'
          : error.message,
      );
      return;
    }

    await refreshProfile();
    notifications.show({
      color: 'forest',
      title: 'Profile updated',
      message: 'Your changes were saved.',
    });
    setEditOpen(false);
  };

  return (
    <Container size="lg" py="md" px="0" pb={70} component="main" mih="100dvh">
      <Box
        pos="relative"
        h={COVER_HEIGHT}
        style={{
          backgroundColor: isDark ? '#182c23' : '#e4ece6',
          backgroundImage: profile.cover_url ? `url(${profile.cover_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
        }}
      >
        <FileButton onChange={handleCoverChange} accept="image/png,image/jpeg,image/webp">
          {(props) => (
            <Button
              {...props}
              size="xs"
              variant="white"
              color="dark"
              radius="xl"
              loading={uploadingCover}
              leftSection={<Camera size={14} />}
              pos="absolute"
              top={12}
              right={12}
            >
              Change Cover
            </Button>
          )}
        </FileButton>

        {/* Avatar overlapping bottom of cover with Dropdown Menu */}
        <Box pos="absolute" bottom={-AVATAR_SIZE / 2} left={24}>
          <Menu shadow="md" width={200} position="bottom-start" withArrow>
            <Menu.Target>
              <Box pos="relative" style={{ cursor: 'pointer' }}>
                <Avatar
                  src={profile.avatar_url}
                  size={AVATAR_SIZE}
                  radius={AVATAR_SIZE}
                  style={{ border: `4px solid ${isDark ? '#0f1a15' : '#ffffff'}` }}
                >
                  {!profile.avatar_url && (profile.username?.[0] ?? user.email?.[0])}
                </Avatar>
              </Box>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<Pencil size={14} />} onClick={() => setEditOpen(true)}>
                Edit Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<LogOut size={14} />} onClick={() => signOut()}>
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Separate Avatar Camera Button for quick uploads */}
          <FileButton onChange={handleAvatarChange} accept="image/png,image/jpeg,image/webp">
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
                style={{ width: 32, height: 32, zIndex: 10 }}
              >
                <Camera size={14} />
              </Button>
            )}
          </FileButton>
        </Box>
      </Box>

      {/* Spacer for the overlapping avatar */}
      <Box h={AVATAR_SIZE / 2 + 16} />

      <Stack gap="lg" px="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} c={headingColor}>
              {profile.username || 'Unnamed Hiker'}
            </Title>
            <Group gap={6} mt={4}>
              <Mail size={14} color="#82aca0" />
              <Text size="sm" c={bodyColor}>
                {user.email}
              </Text>
            </Group>
            {profile.location && (
              <Group gap={6} mt={2}>
                <MapPin size={14} color="#82aca0" />
                <Text size="sm" c={bodyColor}>
                  {profile.location}
                </Text>
              </Group>
            )}
            {profile.bio && (
              <Text size="sm" mt="xs" c={bodyColor} style={{ lineHeight: 1.5 }}>
                {profile.bio}
              </Text>
            )}
          </div>

          <Button
            variant="outline"
            color="teal"
            size="xs"
            leftSection={<Pencil size={14} />}
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </Button>
        </Group>

        {/* Saved favorites section */}
        <div>
          <Group justify="space-between" mb="sm">
            <Title order={4} c={headingColor}>
              Saved Favorites
            </Title>
            {favorites.length > 0 && (
              <Badge
                variant="light"
                color="teal"
                size="sm"
                leftSection={<BookmarkCheck size={12} />}
              >
                {favorites.length}
              </Badge>
            )}
          </Group>

          {favoritesLoading ? (
            <Center py="md">
              <Loader color="teal" size="sm" />
            </Center>
          ) : favorites.length === 0 ? (
            <Text size="sm" c={bodyColor}>
              No saved routes yet. Explore trails to add some favorites!
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {favorites.map((fav: FavoriteRoute) => (
                <Card
                  key={fav.id}
                  padding="xl"
                  radius="lg"
                  withBorder
                  component="article"
                  style={{
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark
                      ? '0 10px 30px rgba(0,0,0,0.3)'
                      : '0 10px 30px rgba(17,34,25,0.03)',
                  }}
                >
                  <div>
                    {/* Card Top Row */}
                    <Group justify="space-between" align="flex-start" mb="md">
                      <div>
                        {fav.mode && (
                          <Badge
                            size="sm"
                            variant="light"
                            color="teal"
                            radius="sm"
                            mb={8}
                            style={{ textTransform: 'uppercase' }}
                          >
                            {fav.mode}
                          </Badge>
                        )}
                        <Title
                          order={3}
                          size="h3"
                          c={headingColor}
                          fw={700}
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          {fav.location_name}
                        </Title>
                      </div>
                      <Button
                        variant="outline"
                        color="red"
                        size="xs"
                        radius="md"
                        leftSection={<Trash2 size={14} />}
                        onClick={() => handleRemoveFavorite(fav.id, fav.location_name)}
                        style={{ fontWeight: 600 }}
                      >
                        Remove
                      </Button>
                    </Group>

                    {fav.notes && (
                      <Box
                        mb="lg"
                        p="md"
                        style={{
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(17,34,25,0.02)',
                          borderRadius: '8px',
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        <Text size="sm" c={bodyColor} style={{ lineHeight: 1.6 }}>
                          {fav.notes}
                        </Text>
                      </Box>
                    )}
                  </div>

                  {/* Metrics Footer Grid */}
                  <SimpleGrid
                    cols={{ base: 2, sm: 4 }}
                    spacing="sm"
                    pt="md"
                    style={{ borderTop: `1px solid ${borderColor}` }}
                  >
                    {fav.location_lat != null && fav.location_lng != null && (
                      <Group gap={6} wrap="nowrap">
                        <ThemeIcon size={28} radius="sm" variant="light" color="teal">
                          <MapPin size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                            Coords
                          </Text>
                          <Text size="xs" c={headingColor} fw={600}>
                            {fav.location_lat.toFixed(1)}°, {fav.location_lng.toFixed(1)}°
                          </Text>
                        </div>
                      </Group>
                    )}

                    {fav.trip_duration_days && (
                      <Group gap={6} wrap="nowrap">
                        <ThemeIcon size={28} radius="sm" variant="light" color="teal">
                          <Compass size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                            Duration
                          </Text>
                          <Text size="xs" c={headingColor} fw={600}>
                            {fav.trip_duration_days} Day{fav.trip_duration_days === 1 ? '' : 's'}
                          </Text>
                        </div>
                      </Group>
                    )}

                    {fav.elevation_m && (
                      <Group gap={6} wrap="nowrap">
                        <ThemeIcon size={28} radius="sm" variant="light" color="teal">
                          <Mountain size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                            Elevation
                          </Text>
                          <Text size="xs" c={headingColor} fw={600}>
                            {fav.elevation_m}m
                          </Text>
                        </div>
                      </Group>
                    )}

                    <Group gap={6} wrap="nowrap">
                      <ThemeIcon size={28} radius="sm" variant="light" color="teal">
                        <Calendar size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                          Saved
                        </Text>
                        <Text size="xs" c={headingColor} fw={600}>
                          {fav.added_at ? new Date(fav.added_at).toLocaleDateString() : 'Recent'}
                        </Text>
                      </div>
                    </Group>
                  </SimpleGrid>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </div>
      </Stack>

      {/* Edit Profile modal */}
      <Modal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
        centered
        radius="md"
      >
        <Stack gap="md">
          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}

          <TextInput
            label="Username"
            placeholder="Your username"
            leftSection={<UserIcon size={14} />}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />

          <TextInput
            label="Email"
            value={user.email ?? ''}
            disabled
            description="Email cannot be changed here."
          />

          <TextInput
            label="Location"
            placeholder="e.g. Oslo, Norway"
            leftSection={<MapPin size={14} />}
            value={location}
            onChange={(e) => setLocation(e.currentTarget.value)}
          />

          <Textarea
            label="Bio"
            placeholder="Tell other hikers a bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.currentTarget.value)}
            minRows={3}
            maxLength={300}
            description={`${bio.length}/300`}
            autosize
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" color="gray" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              color="teal"
              leftSection={<Save size={16} />}
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
