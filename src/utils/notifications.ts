import { notifications } from '@mantine/notifications';

interface ShowNotificationOptions {
  message: string;
  isError?: boolean;
}

export function showAppNotification({ message, isError = false }: ShowNotificationOptions) {
  notifications.show({
    message,
    styles: {
      root: { backgroundColor: isError ? '#E03131' : '#28726B' },
      description: { color: '#FFFFFF' },
      closeButton: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  });
}
