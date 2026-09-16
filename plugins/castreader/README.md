# CastReader for Codex

Build a working speech feature, or turn text into a playable MP3/WAV with a cost receipt and resumable jobs.

## Install

In Codex CLI:

```sh
codex plugin marketplace add vinxu/castreader-codex
codex plugin add castreader@castreader
```

Start a new Codex task after installation. In the published version, invoke `$build-voice-app` or `$generate-audio`, or select CastReader in the plugin picker. [OpenAI Plugins Directory](https://chatgpt.com/plugins/plugins_6aaaa52666208191b7e575b264f338a9) version 0.1.2 is published. This working tree also contains an unreleased, experimental `$read-answer` workflow. The Git release and directory release can update at different times; check the version in each installer.

Example requests:

- “Add text-to-speech to this app and run it locally.”
- “Turn this paragraph into an MP3. Show me the cost.”
- “Resume the CastReader job in this output folder.”
- “Read your previous answer aloud.” / “朗读刚才的回答。”

The experimental read-answer workflow requires TTS plus synchronized highlighting in the original Codex desktop answer. No verified desktop DOM adapter is bundled yet, so it stops before billable generation. A standalone audio file, browser page or copied-text reader does not satisfy this workflow. Use generate-audio for an explicit audio-file request. The experiment is not a released guided-reading feature.

## Requirements and cost

Node.js 22+; a verified and activated [CastReader Voice API](https://voice.castreader.com/request-access) account for live generation. Store `CASTREADER_API_KEY` in the backend environment. Never paste keys into chat. The API currently costs $8 per million normalized Unicode code points, before available trial credit. Always use the live estimate. App Pro and API credit are separate.

The plugin code is free under MIT. Voice service, catalog recordings, models and generated audio are governed by their own applicable terms; this code license does not grant voice rights.

## Direct use

Write `input.json`:

```json
{"text":"Hello from CastReader.","language":"en","output_format":"mp3"}
```

```sh
node scripts/voice.mjs plan --input input.json --output ./output/hello --max-usd 0.01
node scripts/voice.mjs run --output ./output/hello
node scripts/voice.mjs resume --output ./output/hello
```

Planning does not synthesize. A plan pins the regional endpoint, voice, body, idempotency key and budget. Before first submission the estimate is refreshed. The estimate is not a reserved price quote. A successful run saves `audio.mp3` (or WAV), `receipt.json` and private `state.json`. Repeating the command reuses verified bytes without an API call. A lost response uses the same request identity; missing bytes are redownloaded from the original job. Terminal failures never create automatic replacement generations.

Polling returns `pending` after a bounded wait. Run `resume` on the same folder. Do not delete state or change input to recover. After a killed process, inspect the PID in `.lock` and remove only that lock once the earlier process is confirmed stopped. Never remove an active process's lock. Save audio before the current 24-hour service retention ends.

## Runnable application

```sh
node scripts/create-app.mjs /absolute/path/to/new-app
cd /absolute/path/to/new-app
npm install
npm start
```

The local audio-card app lets you edit text, choose language/voice, estimate cost, generate, play, download and resume batches. Its SDK installs from the official versioned HTTPS tarball. Set the key before starting; it never goes to the browser. Read the generated README for the loopback security boundary and persistent data path. Adapt its handlers to your framework and existing user authorization before deploying a public service.

## Capability boundaries

- Ten configured text languages; explicit language selection, no automatic translation.
- MP3/WAV; up to 500 normalized characters per queued job. Longer inputs need explicit application-side chunks and a total budget.
- No streaming or realtime calls in the current API preview.
- Optional English timestamps may be unavailable. Synthesis still has normal charges.
- This release uses skills and local scripts. Hosted MCP, OAuth linking and consumer reading-library actions are subsequent capabilities, not included tools.

## Verification and support

Run `npm test` for recovery, budget, input, routing and file-response checks. These tests use mocked HTTP; see the release notes for separate live acceptance results.

[Documentation](https://voice.castreader.com/integrations/codex) · [API facts](https://voice.castreader.com/integration-manifest.json) · [Data handling](https://voice.castreader.com/data) · [Privacy](https://castreader.com/privacy-policy) · [Terms](https://castreader.com/terms-of-service) · [Support](mailto:support@castreader.ai)
