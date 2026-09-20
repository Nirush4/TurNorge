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
    readTime: '12 min read',
    date: 'June 12, 2026',
    image:
      'https://images.unsplash.com/photo-1663428520845-056989f8a664?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    summary:
      'Explore iconic ridge walks like Reinebringen and Svolværgeita, where dramatic granite peaks drop straight into turquoise fjords.',
    content: [
      'The Lofoten archipelago is world-renowned for its dramatic landscape of sheer granite and gneiss peaks rising straight out of the cold Arctic ocean. Shaped by massive glacial scraping during the last ice age, hiking here offers a unique blend of coastal marine scenery, rich Viking history, and raw alpine exposure that attracts trekkers and mountaineers from all over the world.',
      'One of the most famous and rewarding climbs in the islands is Reinebringen. Though relatively short in distance, its famous stone staircases—built expertly by Sherpas from Nepal to combat severe erosion—climb steeply over 1,560 stone steps. Reaching the summit rewards you with a breathtaking, vertiginous panoramic view of the Reinefjorden, twisting straits, and colorful red rorbuer (fishermen cabins) dotting the coastline far below.',
      'Beyond Reinebringen, trails like Ryten provide incredible midnight sun views over the pristine white sands and emerald waters of Haukland Beach, while more technical scrambles like Svolværgeita challenge climbers with vertical drops and legendary pinnacle leaps between rock formations high above the town of Svolvær.',
      'When tackling coastal ridges in Lofoten, always check local weather updates via MET.no and pay careful attention to wind speeds. Because the islands sit entirely exposed to the open Norwegian Sea, weather can shift from calm sunshine to heavy gales in minutes, and exposed ridges become hazardous during sudden Arctic squalls.',
      'Essential gear for Lofoten includes sturdy waterproof hiking boots with excellent ankle support, windproof hardshell jackets and trousers, trekking poles for steep stone descents, and a reliable headlamp if you are hiking under the late-night glow of the summer midnight sun or early autumn twilight.',
      'Local Wildlife & Flora: Keep your eyes open for white-tailed sea eagles (havørn) soaring along the cliff faces with wingspan spans exceeding two meters. The lower slopes are blanketed in resilient arctic-alpine vegetation, including dwarf birch, cloudberries (multer), and vibrant alpine wildflowers that burst into color during the short summer window.',
    ],
  },
  'jotunheimen-besseggen': {
    id: 'jotunheimen-besseggen',
    title: 'Jotunheimen: Crossing the Legendary Besseggen Ridge',
    region: 'Innlandet, Norway',
    category: 'High Mountain',
    readTime: '14 min read',
    date: 'July 04, 2026',
    image:
      'https://jotunheimen.com/media/tvzcm3xz/img.jpg?rmode=max&width=1920&height=1920&upscale=false&v=1dabae4529d47c0',
    summary:
      'Hike between the deep green waters of Gjende and the dark blue depths of Bessvatnet on Norway’s most famous mountain trail.',
    content: [
      'Jotunheimen, translating directly to "Home of the Giants," hosts Norway’s highest peaks, including Galdhøpiggen (2,469m) and Glittertind. At the heart of this majestic national park lies Besseggen, a legendary ridge hike walked by tens of thousands of outdoor enthusiasts every single summer, cementing its status as a national institution.',
      'The signature feature of this iconic trek is the striking, surreal color contrast between the emerald-green Lake Gjende—sitting several hundred meters higher due to glacial flour suspension from melting ice sheets—and the dark blue waters of Lake Bessvatnet right beside it, separated only by a narrow, knife-edge rock formation.',
      'Most hikers take the historical Gjende passenger boat from Gjendesheim up to Memurubu early in the morning, and then hike back across the ridge toward Gjendesheim. Alternatively, seasoned hikers choose the reverse route for a steeper uphill scramble over the rocks.',
      'Proper footwear with firm ankle support, windproof wool layers, and good stamina are absolutely required. While the scramble across the rocky ridge is thrilling and demands using your hands for balance, it does not require technical climbing ropes or specialized gear under normal summer weather conditions.',
      'Always keep a close eye on changing cloud formations around the higher peaks. If fog or rain sets in, visibility along the narrow ridge drops significantly, making concentration and slow, steady footing paramount for a safe and memorable descent.',
      'Historical Significance: The area has deep roots in Norwegian folklore and literature. The famous author Aasmund Olavsson Vinje wrote extensively about Jotunheimen, and his cabin near Lake Gjende remains a symbolic landmark for traditional mountain culture and poetry in Norway.',
    ],
  },
  'trolltunga-hardangervidda': {
    id: 'trolltunga-hardangervidda',
    title: 'Trolltunga: The Ultimate Fjord Cliff Adventure',
    region: 'Vestland, Norway',
    category: 'Expedition',
    readTime: '16 min read',
    date: 'August 19, 2026',
    image:
      'https://images.unsplash.com/photo-1502021680532-838cfc650323?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    summary:
      'A challenging 28km round-trip trek to the world-famous rock tongue hovering 700 meters above Lake Ringedalsvatnet.',
    content: [
      'Trolltunga ("Troll\'s Tongue") is one of Norway\'s most iconic natural rock formations, jutting horizontally out into empty alpine air nearly 700 meters above Lake Ringedalsvatnet in Skjeggedal, near the fjord town of Odda.',
      'The hike is a demanding, full-day expedition totaling roughly 28 kilometers round-trip with a cumulative elevation gain of around 800 meters. Because of the sheer length, varied terrain, and changing high-plateau weather, it requires an early morning departure (typically starting by 7:00 AM) and thorough physical preparation.',
      'The trail takes you across diverse landscapes, starting with steep forested switchbacks from the upper parking lot, transitioning into open mountain terrain known as Tyssedalsfjella, and finally opening up onto the expansive, windswept rock plateaus on the northern fringes of the Hardangervidda mountain system.',
      'During peak summer months, professional mountain rescue personnel and experienced trail guides are stationed along key checkpoints to offer safety advice and monitor hiker progress. Visitors should carry high-energy snacks, at least 1.5 to 2 liters of water, emergency bivouac gear, and full changes of warm clothing.',
      'Before setting off, always check the specific MET.no forecast for Skjeggedal and the high plateau. If high winds, heavy driving rain, or low-visibility fog are predicted, postpone your trek—the open plateau offers zero natural shelter against severe weather elements.',
      'Photography & Etiquette: Queuing for a photograph on the tip of Trolltunga is common during peak hours. Be patient, respect fellow hikers waiting for their turn, and maintain safe distances from the unprotected cliff edges when winds are gusting across the gorge.',
    ],
  },
};
