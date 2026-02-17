#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LEAN_TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/construction-lean-dev.XXXXXX")"
LEAN_CARGO_TARGET_DIR="$LEAN_TMP_DIR/cargo-target"
LEAN_VITE_CACHE_DIR="$LEAN_TMP_DIR/vite-cache"
LEAN_TAURI_CONFIG="$LEAN_TMP_DIR/tauri.lean.conf.json"

mkdir -p "$LEAN_CARGO_TARGET_DIR" "$LEAN_VITE_CACHE_DIR"

cleanup() {
  # Remove any heavyweight build artifacts that may have been created locally.
  "$ROOT_DIR/scripts/cleanup-heavy.sh" >/dev/null 2>&1 || true

  # Clean temporary lean caches.
  rm -rf "$LEAN_TMP_DIR"
}

trap cleanup EXIT INT TERM

if lsof -nP -iTCP:1420 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 1420 is already in use. Stop that process before running lean dev."
  exit 1
fi

cat >"$LEAN_TAURI_CONFIG" <<EOF
{
  "build": {
    "beforeDevCommand": "pnpm dev -- --host 127.0.0.1 --port 1420 --strictPort --cacheDir $LEAN_VITE_CACHE_DIR"
  }
}
EOF

echo "Lean dev temporary cache root: $LEAN_TMP_DIR"
echo "Starting app in lean mode..."

CARGO_TARGET_DIR="$LEAN_CARGO_TARGET_DIR" pnpm tauri dev -c "$LEAN_TAURI_CONFIG"
