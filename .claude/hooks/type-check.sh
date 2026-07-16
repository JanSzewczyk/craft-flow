#!/bin/bash
FILE="$CLAUDE_FILE_PATH"

[[ "$FILE" =~ \.(ts|tsx)$ ]] || exit 0
[[ "$FILE" =~ (node_modules|\.next|dist|out|\.claude) ]] && exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0

REL_FILE="${FILE#"$CLAUDE_PROJECT_DIR"/}"

SKIP_ENV_VALIDATION=true npx next typegen > /dev/null 2>&1
OUTPUT=$(SKIP_ENV_VALIDATION=true npx tsc --noEmit --incremental --tsBuildInfoFile .claude/hooks/.type-check-hook.tsbuildinfo 2>&1)

ERRORS=$(echo "$OUTPUT" | grep -F "$REL_FILE(")

if [ -n "$ERRORS" ]; then
  REASON="type-check failed for the edited file ${REL_FILE}:"$'\n'"${ERRORS}"
  printf '%s' "$REASON" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{process.stdout.write(JSON.stringify({decision:'block',reason:d}))});"
fi

exit 0
