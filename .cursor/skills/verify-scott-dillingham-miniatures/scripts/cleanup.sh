#!/usr/bin/env bash
set -euo pipefail

RUN_ID="${RUN_ID:-}"
if [[ -z "$RUN_ID" ]]; then
  echo "cleanup.sh: set RUN_ID to the launch id" >&2
  exit 2
fi

VERIFY_PID="${VERIFY_PID:-/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.pid}"
VERIFY_LOG="${VERIFY_LOG:-/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.log}"

if [[ ! -f "$VERIFY_PID" ]]; then
  echo "cleanup.sh: no PID file $VERIFY_PID (nothing to kill)"
  rm -f "$VERIFY_LOG"
  exit 0
fi

parent="$(tr -d '[:space:]' <"$VERIFY_PID")"
if [[ -z "$parent" ]]; then
  echo "cleanup.sh: empty PID file"
  rm -f "$VERIFY_PID" "$VERIFY_LOG"
  exit 0
fi

if kill -0 "$parent" 2>/dev/null; then
  kill -- "-$parent" 2>/dev/null || kill "$parent" 2>/dev/null || true
  for _ in $(seq 1 20); do
    if ! kill -0 "$parent" 2>/dev/null; then
      break
    fi
    sleep 0.2
  done
  if kill -0 "$parent" 2>/dev/null; then
    kill -9 -- "-$parent" 2>/dev/null || kill -9 "$parent" 2>/dev/null || true
  fi
fi

rm -f "$VERIFY_PID" "$VERIFY_LOG"
echo "cleanup.sh: stopped launch pid $parent (evidence directories were not touched)"
