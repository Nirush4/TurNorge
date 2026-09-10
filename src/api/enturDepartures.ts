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
    throw new Error('Failed to fetch departure board from Entur network');
  }

  const json = await response.json();
  return json.data.stopPlace;
}

export async function fetchNearestStationDepartures(lat: number, lon: number, placeName?: string) {
  const forcedStationMap: Record<string, string> = {
    nordmarka: 'NSR:StopPlace:59872', // Sognsvann T-bane station fallback
  };

  let stopPlaceId = placeName ? forcedStationMap[placeName.toLowerCase()] : undefined;

  if (!stopPlaceId) {
    const query = `
      {
        nearest(
          latitude: ${lat},
          longitude: ${lon},
          maximumDistance: 50000
        ) {
          edges {
            node {
              place {
                ... on StopPlace {
                  id
                  name
                }
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

    if (!response.ok) throw new Error('Entur API error');

    const json = await response.json();
    const edges = json?.data?.nearest?.edges ?? [];
    const validEdge = edges.find((edge: any) => edge?.node?.place?.id);
    stopPlaceId = validEdge?.node?.place?.id;
  }

  if (!stopPlaceId) return null;

  return fetchStationDepartures(stopPlaceId);
}
