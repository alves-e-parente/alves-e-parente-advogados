#!/usr/bin/env bash
# Instala a skill opusplan-workflow e o hook SessionStart em ~/.claude (global).
# Requer: jq. Faz backup do settings.json e MESCLA (não sobrescreve).
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.claude"
mkdir -p "$DEST/skills"
cp -R "$REPO/.claude/skills/opusplan-workflow" "$DEST/skills/"
S="$DEST/settings.json"
[ -f "$S" ] || echo '{}' > "$S"
cp "$S" "$S.bak.$(date +%s)"
HOOK="$(jq '.hooks.SessionStart' "$REPO/.claude/settings.json")"
jq --argjson h "$HOOK" '
  .model = "opusplan"
  | .hooks.SessionStart = ((.hooks.SessionStart // []) + $h | unique)
' "$S" > "$S.tmp" && mv "$S.tmp" "$S"
jq -e . "$S" >/dev/null && echo "OK: skill e hook instalados em $DEST"
