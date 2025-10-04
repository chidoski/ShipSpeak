#!/bin/bash

# Git Status Checker for ShipSpeak Development
# Run this script to check your local changes and see if GitHub sync is needed

echo "🔍 ShipSpeak Development Status Check"
echo "======================================"
echo ""

# Change to the portfolio root directory
cd "/Volumes/Extreme Pro/Programming/Python/Portfolio-Projects"

echo "📁 Current directory: $(pwd)"
echo ""

# Check git status
echo "📊 Git Status:"
git status --porcelain

echo ""
echo "📈 Recent commits:"
git log --oneline -3

echo ""
echo "🌐 Remote status:"
git status -sb

echo ""
echo "💡 Next steps:"
echo "   - If you see changes above, let Claude know you need GitHub sync"
echo "   - If everything looks clean, you're good to continue developing!"
echo ""
echo "🚀 To sync with GitHub, just ask Claude: 'Please sync my changes to GitHub'"
