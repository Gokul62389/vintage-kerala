# Custom Songs Directory (`public/assets/songs/`)

You can drop any `.mp3`, `.m4a`, or `.wav` song files directly into this directory!

## How It Works

1. **Automatic Lo-Fi Vintage Processing**:
   Any song played from this directory or registered in `src/data/songs.ts` runs directly through the **Vintage Kerala Web Audio DSP chain**:
   - **Transistor Speaker Emulation**: Highpass filtering at 95 Hz eliminates sterile sub-bass.
   - **Analog Tape Roll-Off**: 3850 Hz lowpass filter tames harsh digital high frequencies.
   - **Tube Warmth / Tape Saturation**: Soft non-linear wave shaping adds gentle analog compression and harmonic richness.
   - **Vinyl Needle Bed**: Low-level organic needle dust crackle is woven beneath the track.

2. **Multi-Layered Kerala Foley Overlap**:
   The tea stall / rain / bus Foley you choose layers seamlessly beneath your song in real time. You can independently balance the song and ambience volume using the mixer or dock controls.

3. **Toggling the Effect**:
   Click the **`📻 Lo-Fi ON`** badge on the bottom player dock at any time to toggle between the vintage Lo-Fi aesthetic and direct playback.
