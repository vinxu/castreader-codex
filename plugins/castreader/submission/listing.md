# Initial public-directory submission

- Type: Skills only
- Version: 0.1.2
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
3. Resume my interrupted CastReader audio job.

## Release notes

Initial directory submission, version 0.1.2, with two skills, a dependency-free audio CLI, a runnable audio-card app, input validation, budget checks, region pinning, persisted idempotency, bounded polling, file integrity and receipt handling. Includes the current China API ingress and recovery for saved legacy China jobs from 0.1.1. Version 0.1.2 aligns listing metadata with the verified company and documents the current route. Test cases are in test-cases.json. No hosted MCP server is declared in this submission. Public Git marketplace installation and OpenAI directory publication have separate statuses.

## Review account and availability

Mocked recovery cases run without credentials. Real generation cases require a dedicated activated review account and restricted API key, supplied through the portal's private reviewer channel; never place credentials in this bundle. Country availability must match supported publisher/service territories selected by the account owner. Verified identity, portal access, private review credentials and actual review approval are release gates; this file does not assert they are complete.
