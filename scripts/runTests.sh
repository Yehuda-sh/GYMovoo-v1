#!/bin/bash

# Quick test script to run the navigation flow tester
echo "🔧 Running Navigation Flow Tests..."
echo "=================================="

# Run the navigation flow tester
node scripts/testNavigationFlow.js

echo ""
echo "📋 Next steps:"
echo "1. Test manually in the app (see scripts/manualTestGuide.md)"
echo "2. Check that 'התחל אימון מהיר' goes directly to QuickWorkout"
echo "3. Check that day buttons (יום 1, יום 2, etc.) work correctly"
echo ""
echo "🚀 Happy testing!"
