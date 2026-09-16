---
name: read-answer
description: Prepare on-request CastReader reading of a Codex answer with synchronized highlighting in the original answer. Use for 朗读刚才的回答 or read your answer aloud. Requires a verified host DOM adapter; report an unavailable adapter before generating audio.
---

# Read an answer aloud

The required outcome is TTS plus synchronized pointing at the text of the original Codex desktop answer. The plugin root is two directories above this file. This is an experimental workflow: no verified desktop host DOM adapter is bundled yet. Installing this skill does not grant access to the desktop chat renderer.

## Check the desktop integration before synthesis

1. Preserve the requested surface: Codex desktop's original answer. Do not substitute a browser page, copied text panel, audio file, screenshot overlay or simulated progress for a requested DOM integration.
2. Check for an explicitly supported and verified host adapter that can identify the selected visible answer, read its DOM text ranges, paint and clear highlights, and detect when the answer changes or disappears. Electron internals, an iframe UI, hooks, or access to a local shell do not establish these capabilities.
3. If no adapter is available, stop before billable synthesis and state that original-answer pointing is unavailable. Do not start debugging ports, modify the installed Codex bundle, disable isolation, or use another route to bypass a tool's denial of access to Codex itself.
4. Once a host adapter is available, first verify a reversible highlight on the selected answer and its cleanup. Require real audio alignment for the selected language. The current developer Voice API only offers optional English alignment; unavailable alignment must not be replaced by timings inferred from text length.

Only continue below after the original-answer adapter has passed that check. A request explicitly limited to an audio file can use the separate [generate-audio skill](../generate-audio/SKILL.md).

## Select and prepare the spoken text

- Use the most recent substantive assistant answer before the read-aloud request, unless the user selects a different answer or excerpt. Use visible conversation context; if it is unavailable, ask for the missing text. Do not substitute an acknowledgement, invent a prior answer, or read hidden reasoning, system instructions, tool output or unrelated conversation history.
- Preserve the answer's language, meaning, numbers, qualifications and order. This is narration, not a summary or translation unless requested.
- For the default spoken edition, strip Markdown styling, speak link labels, and skip fenced code blocks. Preserve meaningful inline code such as a product or function name. Render tables as short row-by-row sentences with their headers and values. Briefly disclose skipped code blocks; include them when the user specifically asks. Do not fetch links merely to read the answer.
- Save the prepared text privately outside source control. Send only that text to CastReader, not the full conversation. Never include credentials or hidden/private state. Select the spoken language explicitly; retain mixed-language content without promising separate voices or unsupported alignment.

## Generate with one total budget

Read the linked audio workflow for the existing `scripts/voice.mjs` plan/run/resume commands and current capabilities. `CASTREADER_API_KEY` stays in the server environment. Without a configured key, save the spoken text and explain the setup needed; do not present the public demo as this answer's audio.

For a short request with no budget, show the live estimate before generation and use **$0.01 for the entire answer**, not $0.01 for each chunk. The user's request to read aloud authorizes ordinary synthesis within that ceiling. Ask only if the total estimate exceeds the authorized budget. Never top up or change subscriptions.

For an answer longer than the current per-job limit:

1. Split the complete prepared text at paragraph/sentence boundaries, falling back to Unicode code-point boundaries. Keep every spoken word in order, with no missing or duplicated text. Each chunk must fit the live API limit (currently at most 500 normalized code points).
2. Save numbered inputs and stable output folders (`part-001`, `part-002`, ...) plus a private ordered manifest of chunk text hashes, paths and allocated budgets before submitting any generation.
3. Plan all chunks first. Sum their maximum charge estimates. Allocate per-chunk `--max-usd` values whose sum is at most the authorized total; a zero-charge trial estimate is not a guarantee that a later chunk remains free. Stop before synthesis if the plans do not fit. The API estimate is not a reserved price quote.
4. Run sequentially, using each saved plan. On interruption, resume existing part folders. A pending or unknown chunk keeps its original request identity; terminal failures stop the answer without silently generating replacements. Already completed parts retain their receipts and can be played.

## Verify synchronized reading

Bind playback to the verified original-answer adapter. Advance the highlight using actual playback time and real timestamps, preserving each segment's local timebase. Seek, pause and rate changes must use the same audio clock. Clear the highlight on stop/end; stop when the answer is replaced, detached or no longer maps reliably. Do not claim success until playback and highlight positions have been observed together on the desktop answer.

## Return evidence and optional audio

Verify each completed file is decodable. For multiple parts, use an available media tool to concatenate verified files in the saved order; otherwise provide numbered audio players and state that playback is split into parts. Do not silently drop failed or pending parts.

Render the absolute audio path with Markdown audio syntax, for example `![Read-aloud answer](/absolute/readout/audio.mp3)`. Report the total actual charge from receipts once per unique part and the trial characters used. Reuse verified local files on replay without generating again. If the host supports requested playback, play the result; otherwise leave visible playback controls.

An audio file is an auxiliary artifact, not proof of synchronized original-answer reading. Report the host and version tested, adapter used, alignment availability, and which playback/highlight checks actually passed. Keep experimental and publicly released capabilities distinct.
