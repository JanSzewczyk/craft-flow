#!/bin/bash
FILE="$CLAUDE_FILE_PATH"

[[ "$FILE" =~ (node_modules|\.next|\.claude|dist|out) ]] && exit 0
[[ "$FILE" =~ \.(ts|tsx|js|jsx|mjs|cjs)$ ]] || exit 0

npx --yes eslint --fix --quiet "$FILE" 2>/dev/null

exit 0
