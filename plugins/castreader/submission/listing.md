# Version 0.1.3 — formatted answer reading

Update to the published 0.1.2 developer release. Adds an English formatted-answer reader in the right-side page. The user has confirmed production Pro recognition, speech and synchronized highlights. Continuous playback is verified separately under delayed status/reporting responses. Directory approval is a separate status recorded after submission.

- Type: Skills only
- Version: 0.1.3
- Name: CastReader
- Category: Developer Tools
- Short description: Read answers and build voice apps
- Publisher: CAST AI PTE. LTD.; select this verified business identity in the portal. CastReader is the plugin's product name.
- Website: https://voice.castreader.com/integrations/codex
- Support: https://voice.castreader.com/integrations/codex#support
- Privacy: https://castreader.com/privacy-policy
- Terms: https://castreader.com/terms-of-service
- Logo: assets/logo.png

## Long description

Read English Codex answers aloud in the right-side CastReader page, keeping headings, lists, tables, links and code visible while spoken words are highlighted. Sign in to your existing CastReader account for twenty free AI reading minutes per day or unlimited ordinary reading with Pro. Audio is prepared ahead for continuous reading; pause, resume and move between paragraphs. This workflow uses consumer membership and does not require a developer API key or Voice API credit.

Ask Codex to add speech to your app or produce an MP3/WAV from text. CastReader includes a runnable local application, backend credential handling, current capability checks, live usage estimates, persistent audio jobs and recovery. Get playable files with an actual charge receipt. Retrying an interrupted request reuses its saved identity; an existing valid file is reused locally.

Live generation requires your activated CastReader Voice API account and server-side API key. API trial and wallet credit are separate from CastReader App Pro. Current queued jobs support up to 500 normalized characters each; longer content needs explicit chunks. Streaming and realtime are not supported in this release.

## Starter prompts

1. Add a working text-to-speech feature to my app.
2. Generate an MP3 from this text and show the cost.
3. Read my previous English answer in the right-side page, preserving formatting and highlighting spoken words.

## Release notes

Version 0.1.3 automatically transfers complete Markdown to the CastReader membership reader. It retains headings, lists, tables, links and code, with real word-level highlighting driven by audio playback. Consumer login, the existing twenty free AI voice minutes per day and existing Pro entitlement govern reading; developer API credit is not used. English alignment is the initial supported language. Subsequent chunks are preloaded and media-validated; bounded background membership verification and ordered actual-playback reporting remove per-paragraph network waits while preserving quota and failure gates. The previous developer app/audio workflows remain available. No hosted MCP or original-chat DOM adapter is declared.

## Review account and availability

Mocked recovery cases run without credentials. Real generation cases require a dedicated activated review account and restricted API key, supplied through the portal's private reviewer channel; never place credentials in this bundle. Country availability must match supported publisher/service territories selected by the account owner. Verified identity, portal access, private review credentials and actual review approval are release gates; this file does not assert they are complete.

## Read-answer review

Verify login-first access, Free quota exhaustion, existing Pro access, subscription return only after authenticated entitlement verification, preserved Markdown, real synchronized highlighting, pause/seek/rate behavior, and reuse of cached audio. Isolated fixtures must not be reported as real payment or production speech acceptance. The answer reader meters actual playback, including cached replay, and derives its account identity server-side. Existing extension device counters are not migrated.
