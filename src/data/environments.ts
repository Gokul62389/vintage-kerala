import { Environment } from '../types/experience';

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'tea-shop',
    name: 'Old Roadside Tea Shop',
    malayalamName: 'പഴയ നാട്ടുചായക്കട',
    description: 'An afternoon at a nostalgic roadside tea stall with boiling samovars, steaming metre tea, and warm conversations.',
    malayalamDescription: 'തിളയ്ക്കുന്ന സമോവറും, ചൂടുള്ള മീറ്റർ ചായയും, ശാന്തമായ സായാഹ്ന വർത്തമാനങ്ങളും.',
    image: '/assets/environments/tea-shop.png',
    thumbnail: '/assets/environments/tea-shop.png',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'tea-shop',
    camera: {
      desktop: 'subtle-drift',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#C6A46A',
      overlay: 'rgba(58, 41, 34, 0.4)'
    },
    tags: ['afternoon', 'tea', 'village', 'nostalgic', 'conversation'],
    hotspots: [
      {
        id: 'ts-radio',
        title: 'Vintage Radio',
        malayalamTitle: 'പഴയ റേഡിയോ',
        description: 'A wood-cased Murphy radio softly broadcasting old Malayalam film songs and agricultural news.',
        x: 24,
        y: 46,
        ambientHighlight: 'Tuned into Akashavani Kozhikode frequency.'
      },
      {
        id: 'ts-samovar',
        title: 'Brass Tea Samovar',
        malayalamTitle: 'പിച്ചള സമോവർ',
        description: 'Gleaming brass kettle simmering with fragrant strong tea and cardamom.',
        x: 68,
        y: 54,
        ambientHighlight: 'The gentle hiss of steam and charcoal warmth.'
      },
      {
        id: 'ts-snacks',
        title: 'Glass Jar of Delicacies',
        malayalamTitle: 'പലഹാര കുപ്പി',
        description: 'Crisp parippuvada, suhiyan, and golden pazhampori in aged glass jars.',
        x: 48,
        y: 62,
        ambientHighlight: 'Freshly fried snacks prepared for the 4 o\'clock crowd.'
      }
    ]
  },
  {
    id: 'rainy-home',
    name: 'Traditional Home — Monsoon Reverie',
    malayalamName: 'മഴക്കാല ഓർമ്മകൾ — നാലുകെട്ട്',
    description: 'Rain pouring down the wooden eaves into the courtyard, the smell of wet earth, and a warm glass of black tea.',
    malayalamDescription: 'തട്ടിൻപുറത്ത് പെയ്യുന്ന ഇടവപ്പാതി മഴയും, നനഞ്ഞ മണ്ണിന്റെ സുഗന്ധവും.',
    image: '/assets/environments/rainy.png',
    video: '/assets/environments/rainy.mp4',
    thumbnail: '/assets/environments/rainy.png',
    defaultAmbientVolume: 0.40,
    soundscapeType: 'rain',
    camera: {
      desktop: 'gentle-pan',
      mobile: 'subtle-drift'
    },
    colorTheme: {
      accent: '#6B7250',
      overlay: 'rgba(29, 43, 36, 0.45)'
    },
    tags: ['monsoon', 'rain', 'melancholic', 'peaceful', 'solitude'],
    hotspots: [
      {
        id: 'rh-rain',
        title: 'Eaves Runoff',
        malayalamTitle: 'മഴത്തുള്ളികൾ',
        description: 'Kerala monsoon cascading off terracotta roof tiles into the wet garden courtyard.',
        x: 32,
        y: 35,
        ambientHighlight: 'Rhythmic patter of raindrops on clay tiles.'
      },
      {
        id: 'rh-tea',
        title: 'Steaming Kattan Chaya',
        malayalamTitle: 'ചൂടു കട്ടൻചായ',
        description: 'Black tea brewed with crushed ginger and jaggery, perfect for a cold downpour.',
        x: 62,
        y: 68,
        ambientHighlight: 'A comforting cup sitting by the wooden window sill.'
      },
      {
        id: 'rh-pillar',
        title: 'Teakwood Pillar & Thinnai',
        malayalamTitle: 'ചാരുപടി',
        description: 'Carved wooden verandas where generations have sat watching the monsoon sweep across the yard.',
        x: 82,
        y: 50,
        ambientHighlight: 'Cool polished wood touched by misty breeze.'
      }
    ]
  },
  {
    id: 'ksrtc-window',
    name: 'Vintage KSRTC — Passenger Window',
    malayalamName: 'ആനവണ്ടി — ജനൽക്കാഴ്ച',
    description: 'Looking through the iconic open window of a red and yellow KSRTC bus winding through misty mountain roads.',
    malayalamDescription: 'കുളിർക്കാറ്റേറ്റ് വളവുകൾ തിരിയുന്ന ആനവണ്ടിയിലെ ജനൽക്കാഴ്ച.',
    image: '/assets/environments/bus.png',
    video: '/assets/environments/bus.mp4',
    thumbnail: '/assets/environments/bus.png',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'bus',
    camera: {
      desktop: 'subtle-drift',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#A64A32',
      overlay: 'rgba(166, 74, 50, 0.3)'
    },
    tags: ['travel', 'journey', 'nostalgic', 'breeze', 'ksrtc'],
    hotspots: [
      {
        id: 'kw-latch',
        title: 'Window Latch Bar',
        malayalamTitle: 'ജനൽ കമ്പി',
        description: 'Classic heavy iron bars where you rest your elbows while the humid wind rushes through.',
        x: 42,
        y: 52,
        ambientHighlight: 'Cool metal vibrating with the rhythm of the road.'
      },
      {
        id: 'kw-scenery',
        title: 'Coconut Groves & Canals',
        malayalamTitle: 'തെങ്ങിൻ തോപ്പുകൾ',
        description: 'Lush green paddy fields, water canals, and tiled cottages flying past in a blur.',
        x: 75,
        y: 40,
        ambientHighlight: 'The scenic heart of Kerala country roads.'
      },
      {
        id: 'kw-bell',
        title: 'Conductor Bell Cord',
        malayalamTitle: 'മണികയർ',
        description: 'The thick cord stretching across the bus ceiling used for the double bell signal: "Two whistles to start, one to stop".',
        x: 20,
        y: 22,
        ambientHighlight: 'Ting-ting! The unmistakable heartbeat of Kerala transit.'
      }
    ]
  },
  {
    id: 'ksrtc-crowded',
    name: 'Crowded Transit Moments',
    malayalamName: 'യാത്രാ മുഹൂർത്തങ്ങൾ — ഇടവഴി ബസ്സ്',
    description: 'The bustling interior of evening village public transport, where passengers share newspapers and umbrellas.',
    malayalamDescription: 'കഥകളും സ്വപ്നങ്ങളും പങ്കുവെച്ച് മുന്നോട്ട് പോകുന്ന ഒരു സായാഹ്ന യാത്ര.',
    image: '/assets/environments/train.png',
    thumbnail: '/assets/environments/train.png',
    defaultAmbientVolume: 0.30,
    soundscapeType: 'crowded-transit',
    camera: {
      desktop: 'gentle-pan',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#C6A46A',
      overlay: 'rgba(24, 24, 22, 0.4)'
    },
    tags: ['commute', 'crowd', 'village', 'evening', 'shared-memories'],
    hotspots: [
      {
        id: 'kc-ticket',
        title: 'Printed Cardboard Tickets',
        malayalamTitle: 'ടിക്കറ്റ് റാക്ക്',
        description: 'Vintage punched tickets held together with rubber bands in a leather pouch.',
        x: 35,
        y: 65,
        ambientHighlight: 'Metallic "click-clack" of the mechanical ticket puncher.'
      },
      {
        id: 'kc-seats',
        title: 'Worn Leather Benches',
        malayalamTitle: 'യാത്രാ സീറ്റുകൾ',
        description: 'Deep brown leatherette seats etched with decades of daily travelers.',
        x: 65,
        y: 72,
        ambientHighlight: 'Familiar squeak of springs on country humps.'
      }
    ]
  },
  {
    id: 'village-food-shop',
    name: 'Village Restaurant & Toddy Shop',
    malayalamName: 'നാടൻ ഭക്ഷണശാല',
    description: 'An authentic Kerala country eatery with banana leaves, spicy clay pot curries, and coconut tree shade.',
    malayalamDescription: 'വാഴയിലയിലെ നാടൻ വിഭവങ്ങളും, തേങ്ങ ചിരവിയ നാടൻ രുചിക്കൂട്ടും.',
    image: '/assets/environments/toddy-shop.png',
    thumbnail: '/assets/environments/toddy-shop.png',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'village-food',
    camera: {
      desktop: 'subtle-drift',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#A64A32',
      overlay: 'rgba(58, 41, 34, 0.4)'
    },
    tags: ['food', 'countryside', 'spices', 'rustic', 'evening'],
    hotspots: [
      {
        id: 'vf-pot',
        title: 'Meen Chatti (Clay Pot Curry)',
        malayalamTitle: 'മീൻ ചട്ടി',
        description: 'Spicy Kottayam-style red fish curry simmering in an earthen pot seasoned with Kodampuli.',
        x: 40,
        y: 68,
        ambientHighlight: 'Aroma of bubbling spices and curry leaves fried in coconut oil.'
      },
      {
        id: 'vf-leaf',
        title: 'Banana Leaf Platter',
        malayalamTitle: 'വാഴയില',
        description: 'Fresh green plantain leaf ready to be laden with hot red matta rice and sides.',
        x: 65,
        y: 65,
        ambientHighlight: 'Traditional village dining simplicity.'
      }
    ]
  },
  {
    id: 'kerala-ferry',
    name: 'Country Boat & Backwater Ferry',
    malayalamName: 'കടത്തുവഞ്ചി — കായൽയാത്ര',
    description: 'Gliding along serene palm-fringed backwaters as gentle waves lap against the dark teakwood hull.',
    malayalamDescription: 'കൈതപ്പുഴയും കായലോളങ്ങളും തഴുകി നീങ്ങുന്ന നാട്ടു വഞ്ചിയാത്ര.',
    image: '/assets/environments/ferry.png',
    thumbnail: '/assets/environments/ferry.png',
    defaultAmbientVolume: 0.35,
    soundscapeType: 'ferry',
    camera: {
      desktop: 'subtle-drift',
      mobile: 'static'
    },
    colorTheme: {
      accent: '#6B7250',
      overlay: 'rgba(29, 43, 36, 0.35)'
    },
    tags: ['backwaters', 'peaceful', 'water', 'slow-living', 'birds'],
    hotspots: [
      {
        id: 'kf-waves',
        title: 'Backwater Lapping Water',
        malayalamTitle: 'കായൽ ഓളങ്ങൾ',
        description: 'Soft ripples caressing the aged cedar planks of the country boat.',
        x: 35,
        y: 75,
        ambientHighlight: 'Gentle sloshing waves and occasional leaping pearl spot fish.'
      },
      {
        id: 'kf-trees',
        title: 'Bending Coconut Palms',
        malayalamTitle: 'കായലോര തെങ്ങുകൾ',
        description: 'Iconic Kerala palms leaning lazily over the reflective water mirror.',
        x: 75,
        y: 25,
        ambientHighlight: 'Whispering fronds dancing in the coastal sea breeze.'
      }
    ]
  }
];
