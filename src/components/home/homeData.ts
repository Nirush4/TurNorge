import { Database, Landmark, ShieldCheck } from 'lucide-react';

export const FEATURES = [
  {
    icon: Database,
    title: 'Open public data',
    body: 'Trip advice is structured around MET.no locationforecast fields and Kartverket place metadata so plans stay grounded in Norwegian open data.',
    badge: 'Core Protocol',
  },
  {
    icon: Landmark,
    title: 'Allemannsretten, taught well',
    body: 'The Right to Roam is a civic duty as much as a freedom. Learn campfire rules, distance-to-houses, and how to leave no trace.',
    badge: 'Civic Standard',
  },
  {
    icon: ShieldCheck,
    title: 'Account synced favorites',
    body: 'Log in to save your favorite routes and access them securely across any device, keeping your hiking plans backed up.',
    badge: 'Cloud Synced',
  },
] as const;

export const POPULAR_REGIONS = [
  {
    title: 'Jotunheimen National Park',
    subtitle: 'Home to Galdhøpiggen & Besseggen ridge trails',
    image:
      'https://jotunheimen.com/media/rygha0hw/i-veodalen.jpg?rmode=max&width=1920&height=1920&upscale=false&v=1dacfa2a4980a10',
    tag: 'Alpine Ridges',
    elevation: '2,469m peak',
    routesCount: '42 trails',
  },
  {
    title: 'Lofoten Islands',
    subtitle: 'Dramatic peaks rising straight from the Arctic sea',
    image: 'https://images.pexels.com/photos/33782734/pexels-photo-33782734.jpeg',
    tag: 'Coastal Peaks',
    elevation: 'Sea to Summit',
    routesCount: '28 trails',
  },
  {
    title: 'Hardangervidda',
    subtitle: 'Europe’s largest mountain plateau wilderness',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tag: 'Vast Plateaus',
    elevation: 'High Plateau',
    routesCount: '35 trails',
  },
] as const;

export const SAFETY_TIPS = [
  {
    title: 'Plan according to ability',
    description:
      'Know your route, check physical fitness requirements, and always consult local weather updates before departure.',
  },
  {
    title: 'Respect the weather',
    description:
      'Mountain weather changes rapidly in Norway. Always carry wind/waterproof layers, maps, and a compass.',
  },
  {
    title: 'Turn back in time',
    description:
      'There is no shame in turning back if conditions deteriorate or fatigue sets in. Safety always comes before summiting.',
  },
] as const;
