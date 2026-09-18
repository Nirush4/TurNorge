export interface HikingArticle {
  id: string;
  title: string;
  region: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  summary: string;
  content: string[];
}

export const HIKING_ARTICLES: Record<string, HikingArticle> = {
  'lofoten-ridge-hikes': {
    id: 'lofoten-ridge-hikes',
    title: 'Lofoten Islands: Jagged Peaks Above the Arctic Sea',
    region: 'Nordland, Norway',
    category: 'Coastal Alpine',
    readTime: '5 min read',
    date: 'June 12, 2026',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Explore iconic ridge walks like Reinebringen and Svolværgeita, where dramatic granite peaks drop straight into turquoise fjords.',
    content: [
      'The Lofoten archipelago is world-renowned for its dramatic landscape of sheer granite peaks rising straight out of the cold Arctic ocean. Hiking here offers a unique blend of coastal scenery and alpine exposure.',
      'One of the most famous climbs is Reinebringen. Though short, its stone staircases built by Sherpas climb steeply over 400 meters to offer a breathtaking panoramic view of the Reinefjorden and surrounding fishing hamlets.',
      'When tackling coastal ridges in Lofoten, always check local weather updates via MET.no and pay careful attention to wind speeds, as exposed ridges can become hazardous during sudden Arctic squalls.',
    ],
  },
  'jotunheimen-besseggen': {
    id: 'jotunheimen-besseggen',
    title: 'Jotunheimen: Crossing the Legendary Besseggen Ridge',
    region: 'Innlandet, Norway',
    category: 'High Mountain',
    readTime: '7 min read',
    date: 'July 04, 2026',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Hike between the deep green waters of Gjende and the dark blue depths of Bessvatnet on Norway’s most famous mountain trail.',
    content: [
      'Jotunheimen, meaning "Home of the Giants," hosts Norway’s highest peaks. At the heart of this national park lies Besseggen, a legendary ridge hike walked by tens of thousands of outdoor enthusiasts every summer.',
      'The signature feature of the trek is the striking color contrast between the emerald-green Lake Gjende, sitting several hundred meters higher than the deep blue Lake Bessvatnet right beside it.',
      'Most hikers take the historical Gjende boat to Memurubu and hike back across the ridge toward Gjendesheim. Proper footwear, windproof layers, and stamina are required as the scramble across the rocky ridge demands full concentration.',
    ],
  },
  'trolltunga-hardangervidda': {
    id: 'trolltunga-hardangervidda',
    title: 'Trolltunga: The Ultimate Fjord Cliff Adventure',
    region: 'Vestland, Norway',
    category: 'Expedition',
    readTime: '8 min read',
    date: 'August 19, 2026',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    summary:
      'A challenging 28km round-trip trek to the world-famous rock tongue hovering 700 meters above Lake Ringedalsvatnet.',
    content: [
      'Trolltunga ("Troll\'s Tongue") is one of Norway\'s most iconic natural rock formations, jutting horizontally out into the empty air nearly 700 meters above Lake Ringedalsvatnet in Skjeggedal.',
      'The hike is a demanding full-day expedition totaling roughly 28 kilometers with an elevation gain of around 800 meters. Because of the length and changing mountain weather, it requires an early morning start and a robust packing list.',
      'During peak summer months, professional mountain guides offer advice at trailheads, and checking safety forecasts is mandatory before committing to the full trek across the high plateau.',
    ],
  },
};
