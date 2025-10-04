#!/bin/bash

# Feature Branch Creator for ShipSpeak Development
# Usage: ./scripts/create-feature.sh "feature-name"

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a feature name"
    echo "Usage: ./scripts/create-feature.sh \"feature-name\""
    echo "Example: ./scripts/create-feature.sh \"file-upload-system\""
    exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME="feature/${FEATURE_NAME}"

echo "🚀 Creating feature branch: $BRANCH_NAME"
echo "======================================"

# Change to portfolio root
cd "/Volumes/Extreme Pro/Programming/Python/Portfolio-Projects"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're not on main branch (currently on: $CURRENT_BRANCH)"
    echo "Switching to main branch first..."
    git checkout main
fi

# Create and switch to feature branch
git checkout -b "$BRANCH_NAME"

echo "✅ Created and switched to branch: $BRANCH_NAME"
echo ""
echo "🎯 Next steps:"
echo "   1. Develop your feature in this directory"
echo "   2. Commit changes: git add . && git commit -m \"your message\""
echo "   3. Tell Claude: 'Please sync my feature branch'"
echo "   4. When done: 'Please merge my feature branch to main'"
echo ""
echo "📁 Current directory: $(pwd)"
echo "🌿 Current branch: $(git branch --show-current)"
