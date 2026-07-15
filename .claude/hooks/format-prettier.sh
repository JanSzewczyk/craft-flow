#!/bin/bash
FILE="$CLAUDE_FILE_PATH"

[[ "$FILE" =~ (node_modules|\.next|\.claude|dist|out) ]] && exit 0

npx --yes prettier --write --log-level=error "$FILE" 2>/dev/null

exit 0
