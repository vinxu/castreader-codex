#!/bin/zsh
# Local test fixture only. No API requests, synthesis, Codex access or installation.
set -eu
lab_source="${0:A:h}"
lab_repo="${lab_source:h:h}"
lab_run="$lab_repo/.local/desktop-dom-lab"
lab_runtime="$lab_run/electron-dist/Electron.app/Contents/MacOS/Electron"
if [[ ! -x "$lab_runtime" || ! -f "$lab_run/app/fixture.js" ]]; then
  print -u2 'Local experiment runtime or verified audio is missing. Follow README.md to prepare the lab.'
  exit 1
fi
exec "$lab_runtime" "$lab_source/main.cjs" "$lab_run"
