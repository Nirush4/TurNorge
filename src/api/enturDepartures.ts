export async function fetchStationDepartures(stopPlaceId: string) {
  const query = `
    {
      stopPlace(id: "${stopPlaceId}") {
        name
        id
        estimatedCalls(numberOfDepartures: 5) {
          expectedDepartureTime
          aimedDepartureTime
          realtime
          quay {
            publicCode
          }
          serviceJourney {
            line {
              publicCode
              name
              transportMode
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.entur.io/journey-planner/v3/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ET-Client-Name': 'nordictrail-app',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch departure board from Entur/Ruter network');
  }

  const json = await response.json();
  return json.data.stopPlace;
}
