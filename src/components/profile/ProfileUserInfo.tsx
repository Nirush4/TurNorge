import { Button, Group, Text, Title } from '@mantine/core';
import { Mail, MapPin, Pencil } from 'lucide-react';

interface ProfileUserInfoProps {
  username?: string | null;
  email?: string | null;
  location?: string | null;
  bio?: string | null;
  headingColor: string;
  bodyColor: string;
  onEditOpen: () => void;
}

export function ProfileUserInfo({
  username,
  email,
  location,
  bio,
  headingColor,
  bodyColor,
  onEditOpen,
}: ProfileUserInfoProps) {
  return (
    <Group
      justify="space-between"
      align="flex-start"
      component="section"
      aria-labelledby="profile-user-info"
    >
      <div>
        <Title order={2} c={headingColor} id="profile-user-info">
          {username || 'Unnamed Hiker'}
        </Title>
        <Group gap={6} mt={4}>
          <Mail size={14} color="#82aca0" aria-hidden="true" />
          <Text size="md" c={bodyColor}>
            {email}
          </Text>
        </Group>
        {location && (
          <Group gap={6} mt={2}>
            <MapPin size={14} color="#82aca0" aria-hidden="true" />
            <Text size="md" c={bodyColor}>
              {location}
            </Text>
          </Group>
        )}
        {bio && (
          <Text size="md" mt="xs" c={bodyColor} style={{ lineHeight: 1.5 }}>
            {bio}
          </Text>
        )}
      </div>

      <Button
        variant="outline"
        color="teal"
        size="sm"
        leftSection={<Pencil size={14} aria-hidden="true" />}
        onClick={onEditOpen}
        style={{ minHeight: '40px' }}
      >
        Edit Profile
      </Button>
    </Group>
  );
}
