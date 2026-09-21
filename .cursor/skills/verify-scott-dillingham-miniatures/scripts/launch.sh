#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)}"
RUN_ID="${RUN_ID:-}"
if [[ -z "$RUN_ID" ]]; then
  echo "launch.sh: set RUN_ID so the PID file is unique" >&2
  exit 2
fi

PORT=4318
HOST="127.0.0.1"
VERIFY_PID="${VERIFY_PID:-/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.pid}"
VERIFY_LOG="${VERIFY_LOG:-/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.log}"
VERIFY_BASE="${VERIFY_BASE:-http://${HOST}:${PORT}}"
SKILL_DIR="$REPO/.cursor/skills/verify-scott-dillingham-miniatures"

node_ok() {
  local ver="$1" major rest minor
  major="${ver%%.*}"
  rest="${ver#*.}"
  minor="${rest%%.*}"
  [ -n "${major:-}" ] && [ "$major" -gt 22 ] 2>/dev/null && return 0
  [ -n "${major:-}" ] && [ "$major" -eq 22 ] && [ -n "${minor:-}" ] && [ "$minor" -ge 12 ] 2>/dev/null
}

pick_node() {
  if [[ -n "${VERIFY_NODE:-}" ]]; then
    if [[ -x "$VERIFY_NODE" ]]; then
      echo "$VERIFY_NODE"
      return 0
    fi
    echo "launch.sh: VERIFY_NODE is not executable: $VERIFY_NODE" >&2
    exit 2
  fi
  local candidate ver
  for candidate in "$(command -v node || true)" "${HOME}/.local/node22/bin/node" "${HOME}/.local/node-v22.20.0/bin/node"; do
    [[ -n "$candidate" && -x "$candidate" ]] || continue
    ver="$("$candidate" -p "process.versions.node" 2>/dev/null || true)"
    if node_ok "$ver"; then
      echo "$candidate"
      return 0
    fi
  done
  echo "launch.sh: Node.js >= 22.12.0 is required (Astro 7). PATH node is too old or missing." >&2
  echo "launch.sh: found $(command -v node || echo none) $(node -v 2>/dev/null || true)" >&2
  echo "launch.sh: set VERIFY_NODE to a Node 22.12+ binary, or put one on PATH." >&2
  exit 2
}

NODE="$(pick_node)"
export PATH="$(cd "$(dirname "$NODE")" && pwd):$PATH"
hash -r 2>/dev/null || true

if [[ ! -d "$REPO" ]]; then
  echo "launch.sh: repo missing: $REPO" >&2
  exit 2
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "launch.sh: BLOCKED — ${HOST}:${PORT} is already listening. Do not kill the occupant." >&2
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >&2 || true
  exit 3
fi

if [[ ! -d "$REPO/node_modules" ]]; then
  echo "launch.sh: node_modules missing; run npm install in $REPO" >&2
  exit 2
fi

mkdir -p "$SKILL_DIR/evidence"
: >"$VERIFY_LOG"

cd "$REPO"
set -m
npm run dev -- --host "$HOST" --port "$PORT" >>"$VERIFY_LOG" 2>&1 &
LAUNCH_PID=$!
echo "$LAUNCH_PID" >"$VERIFY_PID"

ready=0
for _ in $(seq 1 90); do
  if ! kill -0 "$LAUNCH_PID" 2>/dev/null; then
    echo "launch.sh: npm/astro exited before ready. Last log:" >&2
    tail -n 40 "$VERIFY_LOG" >&2 || true
    rm -f "$VERIFY_PID"
    exit 1
  fi
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 2 "$VERIFY_BASE/" || true)"
  if [[ "$code" == "200" ]]; then
    ready=1
    break
  fi
  sleep 1
done

if [[ "$ready" != "1" ]]; then
  echo "launch.sh: timed out waiting for ${VERIFY_BASE}/" >&2
  tail -n 40 "$VERIFY_LOG" >&2 || true
  if kill -0 "$LAUNCH_PID" 2>/dev/null; then
    kill -- "-$LAUNCH_PID" 2>/dev/null || kill "$LAUNCH_PID" 2>/dev/null || true
  fi
  rm -f "$VERIFY_PID"
  exit 1
fi

echo "launch.sh: ready ${VERIFY_BASE}/ pid=$(cat "$VERIFY_PID") node=$NODE log=$VERIFY_LOG"
