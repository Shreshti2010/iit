#!/bin/bash
set -e

echo "🔨 Starting Cloudflare Pages Build..."
echo ""

echo "📦 Installing dependencies with npm install (ignoring lock)..."
npm install --no-package-lock --prefer-offline

echo ""
echo "🏗️  Building React app..."
npm run build

echo ""
echo "✅ Build complete!"
echo "📁 Build folder size:"
du -sh build/

exit 0
