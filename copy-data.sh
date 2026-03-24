#!/bin/bash
# Manual helper - run this before deploying to copy data to public folder
# Usage: ./copy-data.sh

echo "📁 Copying JSON files from /data to /public/data..."
cp data/yts.json public/data/yts.json
cp data/aha-maths.json public/data/aha-maths.json
cp data/aha-physics.json public/data/aha-physics.json
cp data/aha-chemistry.json public/data/aha-chemistry.json
cp data/courseplanner.json public/data/courseplanner.json
echo "✅ Done! Files are now synced for deployment."
