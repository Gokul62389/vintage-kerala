# Vintage Kerala (വിന്റേജ് കേരളം) — An Immersive Malayalam Music Experience

An interactive digital memory space where you can step into nostalgic Kerala environments, listen to evergreen Malayalam music, and immerse yourself in ambient soundscapes, hand-painted artwork, and Flow-generated cinematic motion.

---

## 🌴 Included Environments

1. **Old Roadside Tea Shop (പഴയ നാട്ടുചായക്കട)**: Steaming brass samovars, clinking tea glasses, and roadside banter.
2. **Traditional Home — Monsoon Reverie (മഴക്കാല ഓർമ്മകൾ — നാലുകെട്ട്)**: Courtyard rain eaves runoff, wet earth smell, and hot black tea. *(Includes Flow-generated video motion)*
3. **Vintage KSRTC — Window Seat (ആനവണ്ടി — ജനൽക്കാഴ്ച)**: Breeze rushing through the iconic red/yellow passenger window. *(Includes Flow-generated video motion)*
4. **Crowded Transit Moments (യാത്രാ മുഹൂർത്തങ്ങൾ — ഇടവഴി ബസ്സ്)**: Evening commute with worn leather seats and printed paper tickets.
5. **Village Restaurant & Toddy Shop (നാടൻ ഭക്ഷണശാല)**: Sizzling clay pot fish curries, plantain leaves, and evening cricket sounds.
6. **Country Boat & Backwater Ferry (കടത്തുവഞ്ചി — കായൽയാത്ര)**: Backwater waves lapping against the cedar boat prow under bending palms.

---

## 🎵 How to Add Your Own Malayalam Songs

1. Place your audio files (`.mp3`, `.wav`, `.m4a`) in:
   ```
   public/assets/audio/songs/
   ```
   For example: `public/assets/audio/songs/azhake.mp3`

2. Open [`src/data/songs.ts`](file:///Users/gokul/.gemini/antigravity/scratch/vintage-kerala/src/data/songs.ts) and customize or add song entries:
   ```typescript
   {
     id: 'song-01',
     title: 'Azhake Nin Mizhineer',
     malayalamTitle: 'അഴകേ നിൻ മിഴിനീർ',
     artist: 'K.J. Yesudas',
     movie: 'Amaram (1991)',
     year: 1991,
     audio: '/assets/audio/songs/azhake.mp3',
     tags: ['monsoon', 'nostalgic'],
     recommendedEnvironments: ['rainy-home', 'tea-shop']
   }
   ```
   *Note: If a song file is not yet placed, the built-in procedural synthesizer plays a warm acoustic raga sample so playback is immediately audible and testable.*

---

## 🌿 How to Add Custom Ambient Sound Loops

You can also drop pre-recorded ambient sound loops in:
```
public/assets/audio/ambience/
```
and link them to any scene in [`src/data/environments.ts`](file:///Users/gokul/.gemini/antigravity/scratch/vintage-kerala/src/data/environments.ts). By default, the system synthesizes procedural spatial Kerala soundscapes using the Web Audio API with zero external dependencies.

---

## ⌨️ Keyboard Shortcuts

- **Space**: Toggle Play / Pause
- **E**: Open Environment Selector
- **L**: Open Malayalam Song Library
- **M**: Toggle Mute / Unmute
- **Esc**: Close any open drawer or modal
- **Arrow Keys**: Navigate environments in selector
