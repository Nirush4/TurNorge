import { useState, useEffect, type JSX } from 'react';
import { Container, Stack } from '@mantine/core';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useFavorites } from '@/hooks/useFavorites';
import { HikingLoader } from '@/components/HikingLoader';
import { useThemeColors } from '@/hooks/useThemeColors';
import { showAppNotification } from '@/utils/notifications';

import { ProfileHeaderBanner } from '@/components/profile/ProfileHeaderBanner';
import { ProfileUserInfo } from '@/components/profile/ProfileUserInfo';
import { FavoritesListSection } from '@/components/profile/FavoritesListSection';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

export function Profile(): JSX.Element {
  const { user, profile, refreshProfile } = useAuth();
  const { favorites, loading: favoritesLoading, removeFavorite } = useFavorites();

  const { isDark, headingColor, bodyColor, cardBackground, borderColor } = useThemeColors();

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
      <Container
        mih="100dvh"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div role="status" aria-live="polite">
          <HikingLoader text="Loading your profile..." />
        </div>
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
      showAppNotification({ message: `Upload failed: ${uploadError.message}`, isError: true });
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
    const { error: removeError } = await removeFavorite(id);
    if (removeError) {
      showAppNotification({ message: `Could not remove: ${removeError}`, isError: true });
    } else {
      showAppNotification({
        message: `${name} removed from favorites.`,
        isError: false,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username,
        bio: bio || null,
        location: location || null,
      })
      .eq('id', user.id);

    setSaving(false);

    if (updateError) {
      setError(
        updateError.message.includes('duplicate key') || updateError.message.includes('unique')
          ? 'That username is already taken.'
          : updateError.message,
      );
      return;
    }

    await refreshProfile();
    showAppNotification({
      message: 'Profile updated: Your changes were saved.',
      isError: false,
    });
    setEditOpen(false);
  };

  const cardStyle = {
    backgroundColor: cardBackground,
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(17,34,25,0.03)',
  };

  return (
    <Container size="lg" py="md" px="0" pb={70} component="main" mih="100dvh">
      <ProfileHeaderBanner
        coverUrl={profile.cover_url}
        avatarUrl={profile.avatar_url}
        username={profile.username}
        email={user.email}
        uploadingCover={uploadingCover}
        uploadingAvatar={uploadingAvatar}
        isDark={isDark}
        cardBackground={cardBackground}
        onCoverChange={handleCoverChange}
        onAvatarChange={handleAvatarChange}
      />

      <Stack gap="lg" px="md">
        <ProfileUserInfo
          username={profile.username}
          email={user.email}
          location={profile.location}
          bio={profile.bio}
          headingColor={headingColor}
          bodyColor={bodyColor}
          onEditOpen={() => setEditOpen(true)}
        />

        <FavoritesListSection
          favorites={favorites}
          favoritesLoading={favoritesLoading}
          isDark={isDark}
          headingColor={headingColor}
          bodyColor={bodyColor}
          borderColor={borderColor}
          cardStyle={cardStyle}
          onRemoveFavorite={handleRemoveFavorite}
        />
      </Stack>

      <EditProfileModal
        editOpen={editOpen}
        username={username}
        bio={bio}
        location={location}
        userEmail={user.email ?? ''}
        saving={saving}
        error={error}
        headingColor={headingColor}
        bodyColor={bodyColor}
        setUsername={setUsername}
        setBio={setBio}
        setLocation={setLocation}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </Container>
  );
}
