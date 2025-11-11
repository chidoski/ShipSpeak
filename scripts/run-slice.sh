#!/bin/bash

# ShipSpeak Slice Runner Script
# Usage: ./scripts/run-slice.sh <phase> <slice-number>
# Example: ./scripts/run-slice.sh 1 1  (runs phase1-slice1-1)

PHASE=$1
SLICE=$2

if [ -z "$PHASE" ] || [ -z "$SLICE" ]; then
    echo "Usage: $0 <phase> <slice-number>"
    echo "Example: $0 1 1  (runs phase1-slice1-1-foundation-prompt.md)"
    exit 1
fi

# Find the slice prompt file
PROMPT_FILE=$(find docs/skills/implementation-prompts/ -name "phase${PHASE}-slice${PHASE}-${SLICE}-*-prompt.md" | head -1)

if [ -z "$PROMPT_FILE" ]; then
    echo "❌ No slice prompt found for Phase $PHASE, Slice $SLICE"
    echo "Available prompts:"
    ls docs/skills/implementation-prompts/phase${PHASE}-slice*.md 2>/dev/null || echo "No prompts found for Phase $PHASE"
    exit 1
fi

echo "🚀 Found slice prompt: $PROMPT_FILE"
echo "📋 Slice content:"
echo "=================="
cat "$PROMPT_FILE"
echo "=================="
echo ""
echo "💡 Copy the above content and paste it into Claude Code to execute this slice."
echo "✅ Or simply ask Claude: 'Please read and implement $(basename $PROMPT_FILE)'"