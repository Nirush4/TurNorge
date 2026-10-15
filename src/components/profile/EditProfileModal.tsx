import { Button, Group, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { MapPin, Save, User as UserIcon } from 'lucide-react';

interface EditProfileModalProps {
  editOpen: boolean;
  username: string;
  bio: string;
  location: string;
  userEmail: string;
  saving: boolean;
  error: string | null;
  headingColor: string;
  bodyColor: string;
  setUsername: (val: string) => void;
  setBio: (val: string) => void;
  setLocation: (val: string) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export function EditProfileModal({
  editOpen,
  username,
  bio,
  location,
  userEmail,
  saving,
  error,
  headingColor,
  bodyColor,
  setUsername,
  setBio,
  setLocation,
  onClose,
  onSave,
}: EditProfileModalProps) {
  return (
    <Modal opened={editOpen} onClose={onClose} title="Edit Profile" centered radius="md">
      <Stack
        gap="md"
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        {error && (
          <Text size="sm" c="red" role="alert" aria-live="assertive">
            {error}
          </Text>
        )}

        <TextInput
          label="Username"
          placeholder="Your username"
          leftSection={<UserIcon size={14} aria-hidden="true" />}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          required
          aria-required="true"
          styles={{
            label: {
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '6px',
              color: headingColor,
            },
            input: { fontSize: '15px', minHeight: '44px' },
          }}
        />

        <TextInput
          label="Email"
          value={userEmail}
          disabled
          description="Email cannot be changed here."
          styles={{
            label: {
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '6px',
              color: headingColor,
            },
            input: { fontSize: '15px', minHeight: '44px', opacity: 0.8 },
            description: { fontSize: '0.85rem', color: bodyColor },
          }}
        />

        <TextInput
          label="Location"
          placeholder="e.g. Oslo, Norway"
          leftSection={<MapPin size={14} aria-hidden="true" />}
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
          styles={{
            label: {
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '6px',
              color: headingColor,
            },
            input: { fontSize: '15px', minHeight: '44px' },
          }}
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
          styles={{
            label: {
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '6px',
              color: headingColor,
            },
            input: { fontSize: '15px' },
            description: { fontSize: '0.85rem', color: bodyColor },
          }}
        />

        <Group justify="flex-end" mt="sm">
          <Button variant="subtle" color="gray" onClick={onClose} style={{ minHeight: '40px' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="teal"
            leftSection={<Save size={16} aria-hidden="true" />}
            loading={saving}
            style={{ minHeight: '40px', fontWeight: 600 }}
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
