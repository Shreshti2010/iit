# Cloudflare Pages Deployment Troubleshooting

## ❌ Deployment Not Working? Follow This Guide

### Step 1: Check Cloudflare Pages Build Settings

Go to **Cloudflare Dashboard** → **Pages** → **Settings** → **Build & Deployment**

Verify these exact settings:

```
Framework preset: None (custom)
Build command: npm run build
Build output directory: build
Root directory: /
Environment variables: None required
```

---

### Step 2: Fix Common Issues

#### Issue 1️⃣: Wrong Build Output Directory
❌ **Don't use:** `dist`, `public`, `out`  
✅ **Use:** `build`

#### Issue 2️⃣: Node Version Mismatch
Add `.nvmrc` file in the root to specify Node version:

```
18.17.1
```

Also set in Cloudflare:
- **Build environment preset:** Node 18

#### Issue 3️⃣: Missing Environment Variable
Go to **Environment Variables** in Cloudflare Pages settings and add:

```
Name: NODE_ENV
Value: production
Scope: All environments
```

---

### Step 3: Advanced Configuration for Cloudflare Pages

Create a file named `build.sh` in root:

```bash
#!/bin/bash
set -e

echo "🔨 Building React app..."
npm install
npm run build

echo "✅ Build complete!"
ls -la build/
```

Then in Cloudflare Pages settings, set:
- **Build command:** `bash build.sh`

---

### Step 4: Verify _redirects File

The `build/_redirects` file must exist and contain:

```
/*  /index.html  200
```

If missing, create it:

```bash
mkdir -p build
echo "/*  /index.html  200" > build/_redirects
```

---

### Step 5: Check Build Locally First

Run this to verify your build works:

```bash
npm run build
npm install -g serve
serve -s build
```

Visit `http://localhost:3000` - if it works locally, Cloudflare will work too.

---

### Step 6: Clear Cache and Redeploy

1. Go to **Cloudflare Pages** project settings
2. Click **Deployments**
3. Click the three dots on the latest deployment
4. Select **View details**
5. Check the **Build logs** for error messages

If you see build errors, check:
- ESLint warnings (can cause build failure)
- Missing dependencies
- Node version incompatibility

---

### Step 7: Remove Unused Variable Warning

In `src/App.js`, remove the unused `toggleLesson` variable:

```javascript
// Remove this line:
const [expandedLessons, setExpandedLessons] = useState({});

// Keep only:
const [expandedLessons, setExpandedLessons] = useState({});
```

---

### Step 8: Final Quick Fix

1. **Disconnect and reconnect GitHub**
   - Pages → Settings → Git configuration
   - Click "Disconnect repository"
   - Reconnect `Shreshti2010/iit`

2. **Manual Trigger Deploy**
   - Push a new commit to `main`:
   ```bash
   git add .
   git commit -m "Trigger Cloudflare deploy" --allow-empty
   git push origin main
   ```

3. **Check Deployment Logs**
   - Go back to Cloudflare Pages
   - Click **Deployments**
   - Click the latest one and check **Build logs**

---

## ✅ If Still Not Working

Check the **Build logs** in Cloudflare for specific errors. Common ones:

| Error | Solution |
|-------|----------|
| `npm: command not found` | Set Node version in Cloudflare |
| `ENOENT: no such file or directory, scandir 'build'` | Ensure build output is `build` folder |
| `Module not found` | Run `npm install` locally, check package.json |
| `out of memory` | Increase build timeout in Cloudflare |

---

## 🆘 Still Stuck?

Copy the **Build log output** from Cloudflare Pages and share it - we can debug the exact error!
