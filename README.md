# CastReader for Codex

Read formatted answers with synchronized highlighting, build runnable speech features, and generate playable audio. Version 0.1.4 makes the English membership reader easy to try in a new task. The OpenAI directory and this Git marketplace can publish at different times; check the version before installing.

```sh
codex plugin marketplace add vinxu/castreader-codex
codex plugin add castreader@castreader
```

Start a new Codex task, then use `$build-voice-app` or `$generate-audio`.

[Plugin documentation](plugins/castreader/README.md) · [Website](https://voice.castreader.com/integrations/codex) · [Review test cases](plugins/castreader/submission/test-cases.json)

Developer audio generation uses your own CastReader Voice API key and trial/wallet. App Pro is separate. This repository is a public Git marketplace; OpenAI Plugins Directory review and publication are separate.

For direct script use, change into `plugins/castreader` first.

## Starter packaging note

The bundled application comes from the official flashcard starter. Its upstream README also describes separate `starter.zip`/`results.zip` downloads. This plugin includes source and offline tests, but not the 20 prerecorded result files or the upstream ZIP checksum files. Those remain available from the linked official tutorial. The plugin release archives have their own `SHA256SUMS`.

The preview `$read-answer` uses the existing CastReader consumer login and Pro membership, not the developer API wallet. Full Markdown opens automatically in the right-side reading page. See the plugin documentation for limitations and test status.
