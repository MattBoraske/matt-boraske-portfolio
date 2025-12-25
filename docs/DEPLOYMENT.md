# Deployment Guide - AWS Amplify

## Overview

This site is deployed using AWS Amplify with automatic deployments triggered on every commit to the `main` branch.

## Current Setup

**Hosting:** AWS Amplify
**Domain:** mattboraske.com (configure in Amplify console)
**Branch:** main
**Build Command:** `npm run build`
**Output Directory:** `dist/`
**Node Version:** 20

## Environment Variables

Configure in AWS Amplify Console → App Settings → Environment Variables

### Required Variables

```
PUBLIC_SITE_URL=https://www.mattboraske.com
```

### Optional Variables

```
PUBLIC_PLAUSIBLE_DOMAIN=mattboraske.com
```

## Deployment Workflow

### Automatic Deployment

1. Make changes locally
2. Commit to main branch:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. AWS Amplify automatically:
   - Detects the commit
   - Runs build process
   - Deploys to production
   - Invalidates CDN cache

### Build Process

AWS Amplify runs these commands:

```bash
npm ci
npm run build
```

Build output goes to `dist/` directory and is served via CloudFront CDN.

## Monitoring Deployments

### Via AWS Amplify Console

1. Log into AWS Console
2. Navigate to AWS Amplify
3. Select your app
4. View build history, logs, and deployment status

### Build Status

Each commit triggers a new build with stages:
- Provision
- Build
- Deploy
- Verify

Check build logs for errors or warnings.

## Custom Domain Setup

### Adding Your Domain

1. AWS Amplify Console → Domain Management
2. Add domain: mattboraske.com
3. AWS provides DNS records to configure
4. Update DNS at your domain registrar
5. Wait for DNS propagation (up to 48 hours)
6. AWS automatically provisions SSL certificate (Let's Encrypt)

### DNS Configuration

**For root domain (mattboraske.com):**
- Type: A
- Points to: Amplify-provided CloudFront distribution

**For www subdomain:**
- Type: CNAME
- Points to: Amplify-provided hostname

### HTTPS

- Automatically enabled via AWS Certificate Manager
- Redirects HTTP → HTTPS automatically
- Certificate auto-renews

## Environment Management

### Adding Environment Variables

1. Amplify Console → App Settings → Environment Variables
2. Click "Manage variables"
3. Add key-value pairs
4. Redeploy for changes to take effect

**Important:** Variables prefixed with `PUBLIC_` are embedded in client-side code.

### Local Development Environment

Create `.env` file (not committed to git):

```bash
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_PLAUSIBLE_DOMAIN=localhost
```

## Rollback Procedure

### Via Console

1. Amplify Console → Build History
2. Find previous successful build
3. Click "Redeploy this version"

### Via Git

```bash
# Find commit hash of working version
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>

# Force push (use with caution)
git push origin main --force
```

## Build Configuration

**File:** `amplify.yml` (if needed for custom build settings)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Currently using default Amplify auto-detection, but add this file if you need custom build steps.

## Performance Optimization

### Amplify Features Enabled

- CloudFront CDN (global edge locations)
- Automatic image optimization
- Brotli compression
- HTTP/2 support
- Asset caching

### Cache Headers

Amplify automatically sets cache headers:
- HTML: No cache (always fresh)
- Assets (JS/CSS): 1 year (with content hashing)
- Images: 1 year

## Troubleshooting

### Build Fails

**Check Node version:**
- Amplify uses Node 20 (verify in build settings)

**Check build logs:**
1. Amplify Console → Build History
2. Click failed build
3. Expand "Build" phase
4. Review error messages

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Run `npm run astro check`
- Environment variables not set

### Site Not Updating

**Clear CloudFront cache:**
1. Amplify Console → Build History
2. Latest build → "Redeploy this version"

**Hard refresh browser:**
- Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache

### Images Not Loading

- Ensure images are in `public/` directory
- Check file paths (case-sensitive)
- Verify files are committed to git
- Check build logs for missing file warnings

### Custom Domain Not Working

- Verify DNS records match Amplify requirements
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate status in Amplify Console
- Ensure domain is verified

## Post-Deployment Checklist

After each significant deployment:

- [ ] Visit site and verify all sections load
- [ ] Test navigation links
- [ ] Check mobile responsiveness
- [ ] Verify contact form works
- [ ] Test resume download
- [ ] Check Medium articles load
- [ ] Verify social share preview (LinkedIn, Twitter)
- [ ] Check console for JavaScript errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)

## Analytics Access

**Plausible Analytics:** https://plausible.io/mattboraske.com

Monitor:
- Daily visitors
- Popular pages
- Referral sources
- Geographic distribution

## Regular Maintenance

### Weekly
- Check build status
- Review analytics for traffic patterns

### Monthly
- Update content (projects, blog posts)
- Review contact form submissions
- Check for broken links

### Quarterly
- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Test full build locally

### Annually
- Review and update resume
- Major dependency upgrades
- Performance audit (Lighthouse)
- SEO audit

## Support Resources

**AWS Amplify Documentation:** https://docs.aws.amazon.com/amplify/
**Astro Documentation:** https://docs.astro.build/
**Build Issues:** Check GitHub repository issues
