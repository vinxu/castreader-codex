# Desktop DOM synchronization experiment

This is a separate Electron test host, **not an integration with Codex**. It does not connect to, inspect, patch, or launch Codex. Its purpose is to establish that real CastReader audio can drive highlights in an existing HTML answer while preserving its markup.

The same renderer has now also passed 14/14 checks in **Codex's in-app browser panel**. This is a CastReader-owned page, with its own answer copy; the original chat answer is not accessed. See [the side-panel report](IN-APP-RESULTS.md).

## Run

Requires Node.js, Electron, and a retained CastReader generation folder containing `audio.wav`, `receipt.json`, and `timestamps.json`. The sample answer is deliberately fixed to the retained fixture: `Hello. CastReader turns your ideas into playable audio.`

```sh
node --test experiments/desktop-dom-sync/sync.test.mjs
node experiments/desktop-dom-sync/prepare.mjs /absolute/audio-run /absolute/lab-run
electron experiments/desktop-dom-sync/main.cjs /absolute/lab-run --test
# Keep the tested desktop window open for manual playback:
electron experiments/desktop-dom-sync/main.cjs /absolute/lab-run --test --keep-open
# Interactive run (play, pause, seek, rate and stop controls):
electron experiments/desktop-dom-sync/main.cjs /absolute/lab-run
```

`prepare.mjs` verifies the audio's receipt hash and requires exactly one aligned segment. It copies audio and alignment into the private run directory, without copying account keys or job state. It does not generate or charge for audio. Multi-segment offsets must come from the actual audio layout; this bench does not guess them.

The automated run saves `browser-results.json` and `screenshot.png`. Test playback is real media playback through Chromium, with sandbox and context isolation enabled. The audio's audible pronunciation and perceptual timestamp accuracy still need listening review; the automated checks verify clock-driven rendering and media behavior.

## Codex browser-panel experiment

After preparing the same verified fixture, start its local read-only server:

```sh
node --test experiments/desktop-dom-sync/server.test.mjs
node experiments/desktop-dom-sync/server.mjs /absolute/lab-run/app
```

Open the printed loopback URL in Codex's browser panel. Click **运行同步测试** for the 14 UI checks, or **播放指读** for manual playback. The server implements byte-range requests so audio seeking works. Its terminal must remain running while using the page; it performs no synthesis or API calls.

## Mechanism

- `sync.mjs` maps real alignment words to text-node ranges, including ranges crossing inline tags.
- CSS Custom Highlight paints those ranges without replacing the source HTML.
- `audio.currentTime` is the sole playback clock. Animation frames refresh the painted word; they do not estimate speech timing.
- Silence clears highlighting. Pause keeps the same position. Seeking recomputes the active word. Rate changes require no rescaling of timestamps.
- Text mismatch, DOM replacement, or answer removal stops playback and clears stale ranges.
- Disposing the reader or a media error also stops audio. Stop stays clear through asynchronous seek events until the next explicit play.
- Results on this isolated English fixture do not establish Chinese timing quality, long-document virtualization support, or access to Codex's original answer DOM.

## Integration gate

To use this core in Codex, a supported and permitted host adapter must supply the real original answer element and the playback media element in the same renderer. A Codex skill, shell command, or MCP iframe does not grant that access. The current package has no verified adapter. Do not claim these lab tests establish desktop plugin support or publish the experiment as that feature.
