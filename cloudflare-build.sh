#!/bin/bash
set -e

echo "🔨 Cloudflare Pages Build Started"

echo "📦 Installing dependencies..."
npm install --prefer-offline --no-audit

echo "🏗️  Building React application..."
npm run build

echo "✅ Build successful!"
echo ""
ls -lah build/ | head -5

