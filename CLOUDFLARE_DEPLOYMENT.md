# Cloudflare Pages Deployment Guide

## Quick Start

### Option 1: Connect GitHub Repository (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages**
3. Click **Create a project**
4. Select **Connect to Git**
5. Authorize and select the repository `Shreshti2010/iit`
6. Configure build settings:
   - **Project name**: `iit`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: `/`

7. Click **Save and Deploy**

Your app will be live at: `https://iit.<random>.pages.dev`

### Option 2: Manual Deployment with Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the build folder
wrangler pages deploy build/
```

## What's Included

- ✅ Production build optimized for performance
- ✅ Code splitting enabled
- ✅ CSS minified
- ✅ SPA routing configured (_redirects file)
- ✅ Proper homepage path configuration

## Build Specifications

- **Build Command**: `npm run build`
- **Build Output**: `./build`
- **Node Version**: 18.x or higher
- **Build Timeout**: 30 minutes

## Troubleshooting

If you get 404 errors on navigation:
- The `_redirects` file is already configured to route all requests to index.html

If the app doesn't load correctly:
- Check that the `homepage` field in `package.json` matches your Cloudflare domain

## Custom Domain (Optional)

After deployment:
1. Go to **Pages project settings**
2. Navigate to **Custom domains**
3. Follow the steps to connect your custom domain
