export function formatDepartureCountdown(departureTime: string): {
  timeStr: string;
  countdownStr: string;
  isUrgent: boolean;
} {
  const departureDate = new Date(departureTime);
  const timeStr = departureDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const diffMs = departureDate.getTime() - Date.now();
  const totalMins = Math.round(diffMs / 60000);

  let countdownStr = 'Expected now';
  let isUrgent = false;

  if (totalMins > 0) {
    if (totalMins < 60) {
      isUrgent = true;
    }
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');

    countdownStr = `Departure in ${formattedHours}h. ${formattedMins}mins`;
  } else if (totalMins < 0) {
    const pastMins = Math.abs(totalMins);
    const hours = Math.floor(pastMins / 60);
    const mins = pastMins % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');

    if (hours > 0) {
      countdownStr = `Departed ${formattedHours}h. ${formattedMins}mins ago`;
    } else {
      countdownStr = `Departed ${formattedMins}mins ago`;
    }
  }

  return { timeStr, countdownStr, isUrgent };
}
