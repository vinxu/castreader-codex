# Desktop DOM synchronization experiment — 2026-09-16

## Outcome

4/4 pure mapping tests and 14/14 Electron playback/rendering checks passed. This establishes synchronized painting on the original DOM in a separate desktop test host. **Codex's own main window was not accessed or tested. No Codex host adapter has been implemented.**

Runtime: Electron 44.4.1 / Chromium 152.0.7977.78, macOS arm64. Sandbox and context isolation enabled; Node integration disabled. The downloaded runtime matched the SHA-256 published by the official Electron GitHub release: `9ff18dff15a0661d7b6c0bb5965f450006c7bd15db0a3b2184a6f7bf13410a7e`.

## Real audio fixture

- Existing CastReader generation from 2026-09-15, reused locally; not newly synthesized for this experiment.
- Text: “Hello. CastReader turns your ideas into playable audio.”
- WAV: 4.968 seconds, PCM signed 16-bit, 24 kHz, mono; verified with ffprobe.
- API alignment: 8 real word entries, seconds, revision `qwen-pcm-measured-groups-v3`.
- Audio hash: `c7dce49daa896591367d4d3d2a1c0db8b86f848a3117651dce082b353b52dd1c`, matched against the original receipt.
- New synthesis cost: $0. The fixture's original charge was $0.000440.
- An attempted new generation plan encountered HTTP 500 at `/models`, before synthesis. No new job was submitted. This API issue has not been diagnosed by the experiment.

## Desktop checks

1. Decoded audio duration matches API alignment duration.
2. Seeking to all 8 words paints the correct visible original DOM Range.
3. Silent gaps remove the current-word highlight.
4. A word crossing inline markup is highlighted while the original HTML remains unchanged.
5. Pause freezes both audio time and the active highlight.
6. Actual 2× media playback advances at the expected rate and selects the matching word.
7. Backward seek recomputes the highlight immediately.
8. Real scrolling and CSS zoom retain the same text-node anchor and visible range.
9. Re-rendering the answer pauses audio and clears stale ranges.
10. Removing the answer pauses audio and clears stale ranges.
11. Stop/end clears highlighting.
12. Disposing the reader also pauses real media playback.
13. A zero-start boundary fixture stays unhighlighted after stop and its asynchronous seek events.
14. An injected media error disposes the reader, pauses audio and removes highlighting.

The first run failed two timing assertions because it measured media startup and completion using fixed short sleeps. The harness was corrected to wait for actual media-clock advancement and the ended state, with bounded timeouts. Both subsequent desktop runs passed all 11 checks. This was a test-harness correction, not proof of perfect subjective speech alignment.

The subsequent lifecycle iteration first reproduced failures in all three added checks (12–14), then corrected the engine. Disposal now owns pausing playback; stop suppresses asynchronous repaint until explicit play; a media error invalidates the active reader. All 14 checks then passed. Checks 13–14 deliberately inject boundary/fault conditions; they are not additional real TTS alignment fixtures. The failing report is retained privately as `regression-before-fix.json`.

The existing plugin's 12 recovery/budget tests and starter app's 18 tests also passed. These are mocked/offline regression checks, not live synthesis or Codex desktop acceptance. Plugin and skill validators passed. No new audio was generated or charged, and no new marketplace version was submitted.

## Artifacts

Private local run directory: `../../.local/desktop-dom-lab/` (relative to this experiment directory's repository root: `.local/desktop-dom-lab/`).

- `browser-results.json`: structured results, environment, verified fixture hash, and `codexHostIntegrationTested: false`.
- `screenshot.png`: verified final desktop rendering, paused on “ideas”.
- `app/`: runnable renderer, verified audio copy, and timing data; no account key.
- `launch.command` reopens the verified local experiment for manual playback; see [人工测试说明](TESTING.zh-CN.md).

Source and reproducible commands are in README.md. Runtime downloads and private test credentials are excluded from version control. No experiment files were included in or submitted as a public plugin release.

## Remaining tests before the requested feature can ship

- A supported, permitted adapter inside Codex's actual main answer renderer.
- Fresh account/session permission and membership wiring.
- Real Chinese word alignment; this fixture is English only.
- Long answers, virtualized content, more complex Markdown, multi-segment timing and task switching.
- Human listening review of perceived word/audio correspondence. Automated tests verify audio-clock behavior and visual range selection, not pronunciation or perceptual timing accuracy.

The experiment is an engineering test bench, not a replacement reader offered as the requested product.
