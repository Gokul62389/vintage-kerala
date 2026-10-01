import { Environment } from '../types/experience';

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'tea-shop',
    name: 'Roadside Tea Stall (കൈരളി ടീ സ്റ്റാൾ)',
    malayalamName: 'കൈരളി ടീ സ്റ്റാൾ',
    description: 'An afternoon at a village tea shop with boiling samovars, steaming metre tea, newspaper readers, and vintage Atlas bicycles.',
    malayalamDescription: 'തിളയ്ക്കുന്ന സമോവറും, മീറ്റർ ചായയും, വർത്തമാനങ്ങളും.',
    image: '/assets/environments/tea-shop.jpg',
    video: '/assets/environments/tea-shop.mp4',
    thumbnail: '/assets/environments/tea-shop.jpg',
    ambientAudio: '/assets/audio/foley/tea-shop.mp3',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'tea-shop',
    camera: {
      desktop: 'static',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#C8382D',
      overlay: 'rgba(200, 56, 45, 0.1)'
    },
    tags: ['afternoon', 'tea', 'village', 'nostalgic', 'conversation']
  },
  {
    id: 'rainy-home',
    name: 'Monsoon Courtyard (നാലുകെട്ട്)',
    malayalamName: 'മഴക്കാല ഓർമ്മകൾ — നാലുകെട്ട്',
    description: 'Rain cascading off weathered terracotta tiles into the sunken courtyard, teakwood pillars, and steaming black tea.',
    malayalamDescription: 'നടുമുറ്റത്ത് പെയ്യുന്ന ഇടവപ്പാതി മഴയും, കുളിർക്കാറ്റും.',
    image: '/assets/environments/rainy.jpg',
    video: '/assets/environments/rainy.mp4',
    thumbnail: '/assets/environments/rainy.jpg',
    ambientAudio: '/assets/audio/foley/rainy.mp3',
    defaultAmbientVolume: 0.40,
    soundscapeType: 'rain',
    camera: {
      desktop: 'static',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#6B7250',
      overlay: 'rgba(42, 60, 48, 0.1)'
    },
    tags: ['monsoon', 'rain', 'melancholic', 'peaceful', 'solitude']
  },
  {
    id: 'ksrtc-window',
    name: 'KSRTC Window Seat (ആനവണ്ടി യാത്ര)',
    malayalamName: 'ആനവണ്ടി — ജനൽക്കാഴ്ച',
    description: 'Looking out the open shutter window of the iconic red & yellow KSRTC bus winding past backwaters and coconut groves.',
    malayalamDescription: 'കുളിർക്കാറ്റേറ്റ് വളവുകൾ തിരിയുന്ന ആനവണ്ടിയിലെ ജനൽക്കാഴ്ച.',
    image: '/assets/environments/bus.jpg',
    video: '/assets/environments/bus.mp4',
    thumbnail: '/assets/environments/bus.jpg',
    ambientAudio: '/assets/audio/foley/bus.mp3',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'bus',
    camera: {
      desktop: 'static',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#C8382D',
      overlay: 'rgba(200, 56, 45, 0.1)'
    },
    tags: ['travel', 'journey', 'nostalgic', 'breeze', 'ksrtc']
  },
  {
    id: 'village-food-shop',
    name: 'Rustic Village Eatery (നാടൻ ഭക്ഷണശാല)',
    malayalamName: 'നാടൻ ഭക്ഷണശാല',
    description: 'Authentic Kerala laterite country eatery with banana leaves, simmering clay pots on wood fires, and coconut palm shade.',
    malayalamDescription: 'വാഴയിലയിലെ നാടൻ വിഭവങ്ങളും, മൺചട്ടിയിലെ രുചിക്കൂട്ടും.',
    image: '/assets/environments/village-eatery.jpg',
    video: '/assets/environments/village-eatery.mp4',
    thumbnail: '/assets/environments/village-eatery.jpg',
    ambientAudio: '/assets/audio/foley/village-eatery.mp3',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'village-food',
    camera: {
      desktop: 'static',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#C8382D',
      overlay: 'rgba(200, 56, 45, 0.1)'
    },
    tags: ['food', 'countryside', 'spices', 'rustic', 'evening']
  },
  {
    id: 'kerala-ferry',
    name: 'Country Boat Ferry (കടത്തുവഞ്ചി)',
    malayalamName: 'കടത്തുവഞ്ചി — കായൽയാത്ര',
    description: 'A traditional dark teakwood ferry boat gliding across tranquil emerald backwaters beside a sun-drenched ghat.',
    malayalamDescription: 'കൈതപ്പുഴയും കായലോളങ്ങളും തഴുകി നീങ്ങുന്ന നാട്ടു വഞ്ചിയാത്ര.',
    image: '/assets/environments/ferry.jpg',
    video: '/assets/environments/ferry.mp4',
    thumbnail: '/assets/environments/ferry.jpg',
    ambientAudio: '/assets/audio/foley/ferry.mp3',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'ferry',
    camera: {
      desktop: 'static',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#2B5E75',
      overlay: 'rgba(43, 94, 117, 0.1)'
    },
    tags: ['backwaters', 'peaceful', 'water', 'slow-living', 'birds']
  },
  {
    id: 'village-bus-stop',
    name: 'Village Bus Shelter (ബസ്സ് കാത്തിരിപ്പുകേന്ദ്രം)',
    malayalamName: 'ഇടവഴി ബസ്സ് സ്റ്റോപ്പ്',
    description: 'A classic village bus waiting shed with retro Malayalam cinema posters as the red & yellow KSRTC bus arrives in golden dust.',
    malayalamDescription: 'പഴയ സിനിമ പോസ്റ്ററുകളും ആനവണ്ടിയുടെ വരവും.',
    image: '/assets/environments/bus-stop.jpg',
    video: '/assets/environments/bus-stop.mp4',
    thumbnail: '/assets/environments/bus-stop.jpg',
    ambientAudio: '/assets/audio/foley/bus-stop.mp3',
    defaultAmbientVolume: 0.30,
    soundscapeType: 'crowded-transit',
    camera: {
      desktop: 'static',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#C8382D',
      overlay: 'rgba(200, 56, 45, 0.1)'
    },
    tags: ['commute', 'vintage-cinema', 'village', 'evening']
  }
];
