# Unreleased submission draft — desktop guided reading blocked

Published directory version remains 0.1.2. Do not submit this draft as a completed TTS + original-answer highlighting feature: no verified desktop DOM adapter exists in this package.

- Type: Skills only
- Version: 0.1.3
- Name: CastReader
- Category: Developer Tools
- Short description: Build voice apps and audio
- Publisher: CAST AI PTE. LTD.; select this verified business identity in the portal. CastReader is the plugin's product name.
- Website: https://voice.castreader.com/integrations/codex
- Support: https://voice.castreader.com/integrations/codex#support
- Privacy: https://castreader.com/privacy-policy
- Terms: https://castreader.com/terms-of-service
- Logo: assets/logo.png

## Long description

Ask Codex to add speech to your app or produce an MP3/WAV from text. CastReader includes a runnable local application, backend credential handling, current capability checks, live usage estimates, persistent audio jobs and recovery. Get playable files with an actual charge receipt. Retrying an interrupted request reuses its saved identity; an existing valid file is reused locally.

Live generation requires your activated CastReader Voice API account and server-side API key. API trial and wallet credit are separate from CastReader App Pro. Current queued jobs support up to 500 normalized characters each; longer content needs explicit chunks. Streaming and realtime are not supported in this release.

## Starter prompts

1. Add a working text-to-speech feature to my app.
2. Generate an MP3 from this text and show the cost.
3. Check whether CastReader can read this desktop answer with synchronized original-text highlighting.

## Release notes

The 0.1.3 working tree contains an experimental read-answer capability check. It stops before paid synthesis when a verified desktop DOM adapter is unavailable. This does not implement original-answer highlighting and is not ready for submission as guided reading. The published 0.1.2 implementation retains the dependency-free audio CLI, runnable app, budget checks, persisted jobs and recovery. No hosted MCP server is declared. Public Git marketplace installation and OpenAI directory publication have separate statuses.

## Review account and availability

Mocked recovery cases run without credentials. Real generation cases require a dedicated activated review account and restricted API key, supplied through the portal's private reviewer channel; never place credentials in this bundle. Country availability must match supported publisher/service territories selected by the account owner. Verified identity, portal access, private review credentials and actual review approval are release gates; this file does not assert they are complete.

## Read-answer update

The intended result is manual TTS + synchronized highlighting on the original Codex desktop answer. Verify a supported host DOM adapter and real alignment before synthesis. Do not substitute a web page, separate reader, audio-only result, or invented timings. The adapter remains an unresolved integration dependency. No automatic playback hook, hosted MCP or OAuth is added.
