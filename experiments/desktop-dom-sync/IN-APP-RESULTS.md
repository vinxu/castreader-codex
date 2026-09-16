# Codex side-panel experiment — 2026-09-17

## Verified outcome

The existing real-audio test page was opened in **Codex In-app Browser**, through the supported browser tool, at a loopback-only URL. Clicking its visible `运行同步测试` button completed **14/14 checks**. A browser screenshot visually confirmed the word `ideas` highlighted at media time 3.550 seconds. The tab was retained for user testing.

This verifies the requested alternative surface: a CastReader-owned reading page inside Codex's browser panel. It does not grant access to or modify the original chat answer. The report's `codexHostIntegrationTested: false` remains the status of that original-answer integration.

Browser-reported environment: Chrome 152.0.0.0, macOS. Fixture: previously generated English WAV, 4.968 seconds, 8 API-aligned words, SHA-256 `c7dce49daa896591367d4d3d2a1c0db8b86f848a3117651dce082b353b52dd1c`. New synthesis charge: $0.

The 14 checks are listed in RESULTS.md. Two are explicitly boundary/fault injection checks; the rest use the retained real media. Automated checks establish clock-driven range selection and playback behavior, not subjective voice or alignment quality.

## Browser-specific correction

The first local server returned the WAV without usable byte-range handling. Media metadata loaded, but Chromium reported a seekable range of `[0,0]`; selecting `ideas` returned to zero. A read-only, loopback-only server now implements HTTP byte ranges, with a fixed file allowlist and exact Host validation. Its integration test covers full/partial/suffix/HEAD reads, invalid ranges, unknown files, disallowed methods and foreign Host headers. That test passed before the browser was reloaded and all 14 UI checks passed.

The UI also gained a visible test button, inspectable report, and wrapping controls for narrow panels. The experiment page and local audio contain no API credential or account session.

## Still required for a released reading workflow

- Transfer the user's selected visible answer into the CastReader page through an explicit local workflow; the page must not scrape unrelated chat content.
- Generate and bind that answer's real audio/alignment, with the original job's budget, receipts and recovery.
- Validate Chinese and mixed-language alignment, Markdown/long answers, scroll following and multiple audio segments.
- Connect the correct CastReader account and Pro entitlement if using the consumer service. Developer API credit remains separate.
- Exercise the installed plugin end-to-end and obtain user listening feedback before release.

No marketplace update was submitted for this experiment. The public 0.1.2 plugin still contains the previously released voice-app/audio workflows.
