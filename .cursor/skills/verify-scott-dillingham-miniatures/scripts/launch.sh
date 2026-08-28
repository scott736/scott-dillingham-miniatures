#!/usr/bin/env bash
# Start astro dev on 127.0.0.1:4318 and write the verification PID file.
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
# New process group so cleanup can kill only this tree (never by process name).
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

echo "launch.sh: ready ${VERIFY_BASE}/ pid=$(cat "$VERIFY_PID") log=$VERIFY_LOG"
