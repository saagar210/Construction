#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

"$ROOT_DIR/scripts/cleanup-heavy.sh"

# Full local reproducible cleanup (dependencies + heavy build outputs).
rm -rf node_modules
echo "Removed local reproducible caches, including node_modules."
