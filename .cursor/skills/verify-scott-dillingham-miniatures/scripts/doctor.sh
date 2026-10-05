#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)}"
RUN_ID="${RUN_ID:-}"
if [[ -z "$RUN_ID" ]]; then
  echo "doctor.sh: set RUN_ID to the launch id" >&2
  exit 2
fi

PORT=4318
HOST="127.0.0.1"
VERIFY_PID="${VERIFY_PID:-/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.pid}"
VERIFY_BASE="${VERIFY_BASE:-http://${HOST}:${PORT}}"

fail() { echo "doctor.sh: FAIL — $*" >&2; exit 1; }

[[ -f "$VERIFY_PID" ]] || fail "PID file missing: $VERIFY_PID"
parent="$(tr -d '[:space:]' <"$VERIFY_PID")"
[[ -n "$parent" ]] || fail "PID file empty: $VERIFY_PID"
kill -0 "$parent" 2>/dev/null || fail "launch PID $parent is not running"

find_listener() {
  local pid=""
  if command -v lsof >/dev/null 2>&1; then
    pid="$(lsof -nP -iTCP:${PORT} -sTCP:LISTEN -F p 2>/dev/null | awk '/^p/{print substr($0,2); exit}')" || true
  fi
  if [[ -z "${pid:-}" ]] && command -v ss >/dev/null 2>&1; then
    pid="$(ss -lntp "sport = :${PORT}" 2>/dev/null | sed -n 's/.*pid=\([0-9][0-9]*\).*/\1/p' | head -1)" || true
  fi
  printf '%s' "${pid:-}"
}

listener="$(find_listener)"
[[ -n "$listener" ]] || fail "nothing listening on ${HOST}:${PORT}"

collect_tree() {
  local root="$1"
  local pids="$root"
  local kids
  kids="$(pgrep -P "$root" 2>/dev/null || true)"
  local k
  for k in $kids; do
    pids="$pids $k $(collect_tree "$k")"
  done
  echo "$pids"
}

tree="$(collect_tree "$parent")"
owned=0
for p in $tree; do
  if [[ "$p" == "$listener" ]]; then
    owned=1
    break
  fi
done
[[ "$owned" == "1" ]] || fail "PID $listener owns :${PORT} but is not in launch tree $parent ($tree)"

home_body="$(mktemp)"
gallery_body="$(mktemp)"
trap 'rm -f "$home_body" "$gallery_body"' EXIT

home_code="$(curl -sS -o "$home_body" -w '%{http_code}' --max-time 10 "${VERIFY_BASE}/")"
[[ "$home_code" == "200" ]] || fail "GET / returned $home_code"
grep -q 'Extraordinary Craft' "$home_body" || fail "GET / missing hero copy 'Extraordinary Craft'"
grep -q 'data-speakable="title"' "$home_body" || fail "GET / missing data-speakable=title"
grep -qE "See what('s|&#39;s|&apos;s) available" "$home_body" || fail "GET / missing See what's available"

gallery_code="$(curl -sS -o "$gallery_body" -w '%{http_code}' --max-time 10 "${VERIFY_BASE}/gallery/")"
[[ "$gallery_code" == "200" ]] || fail "GET /gallery/ returned $gallery_code"
grep -q 'The Collection' "$gallery_body" || fail "GET /gallery/ missing 'The Collection'"
grep -q 'Simon Willard Tall Case Clock Style' "$gallery_body" || fail "GET /gallery/ missing tall-case-clock title"
grep -q 'id="tall-case-clock"' "$gallery_body" || fail "GET /gallery/ missing id=tall-case-clock"

echo "doctor.sh: PASS base=$VERIFY_BASE launch_pid=$parent listen_pid=$listener home=200 gallery=200"
