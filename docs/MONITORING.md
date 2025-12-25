# Site Monitoring & Maintenance

## Analytics Dashboard

**Platform:** Plausible Analytics
**URL:** https://plausible.io/mattboraske.com

### Key Metrics to Monitor

**Traffic:**
- Unique visitors (daily, weekly, monthly)
- Pageviews
- Bounce rate
- Session duration

**Popular Pages:**
- Which sections get most traffic?
- Are visitors viewing projects?
- Do they read publications?

**Traffic Sources:**
- Direct (URL typed in browser)
- Search (Google, Bing)
- Social (LinkedIn, Twitter)
- Referrals (other sites linking to you)

**Custom Events (if configured):**
- Resume downloads
- Project link clicks
- Contact form submissions
- External link clicks (GitHub, HuggingFace)

### Weekly Review

Check analytics every Monday:
- Total visitors last week
- Most viewed sections
- Traffic sources that are working
- Any unusual spikes or drops

Use insights to:
- Identify which projects resonate with visitors
- Understand which social platforms drive traffic
- Spot broken links (high bounce on specific pages)

## Content Update Schedule

### Weekly Tasks

**Check for updates:**
- [ ] Any new Medium articles published? (auto-fetches, but verify)
- [ ] Contact form submissions to respond to
- [ ] Comments on LinkedIn/Medium to engage with

### Monthly Tasks

**Content review:**
- [ ] Review analytics for underperforming sections
- [ ] Update spotlight description if role changed
- [ ] Add new projects (if completed)
- [ ] Update skills if learned new technologies

**Technical checks:**
- [ ] Test contact form submission
- [ ] Verify all external links work
- [ ] Check mobile version on actual device
- [ ] Review page load speed (should be < 2s)

### Quarterly Tasks

**Dependency updates:**
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Test build
npm run build

# Test locally
npm run preview
```

**Content refresh:**
- [ ] Add new publications (if any)
- [ ] Replace placeholder projects with real repos
- [ ] Update experience if changed jobs
- [ ] Refresh project descriptions with new metrics

**SEO check:**
- [ ] Google Search Console: Review crawl errors
- [ ] Submit updated sitemap if major changes
- [ ] Check keyword rankings (your name, key skills)

### Annual Tasks

**Major updates:**
- [ ] Update resume PDF
- [ ] Refresh OG image if branding changes
- [ ] Major dependency upgrades (Astro, Tailwind)
- [ ] Performance audit with Lighthouse
- [ ] Accessibility audit
- [ ] Full content review and refresh

**Analytics review:**
- Annual traffic trends
- Most successful content
- Traffic source breakdown
- Goal achievement (job offers, collaborations)

## Link Maintenance

### Check These Links Monthly

**Internal:**
- Navigation links (Home, Research, Projects, etc.)
- Anchor links (#research, #projects, etc.)
- Resume download link

**External:**
- GitHub profile/repositories
- LinkedIn profile
- Medium profile
- Research paper PDFs
- HuggingFace collections
- Live project demos

**Tool:** Use linkinator or similar

```bash
# Install linkinator
npm install -g linkinator

# Check for broken links
linkinator http://localhost:4321 --recurse
```

## Performance Monitoring

### Target Metrics (Lighthouse)

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: 100

### Run Monthly

```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse → Generate Report
```

### Common Issues

**Low performance:**
- Large images not optimized
- Too many third-party scripts
- Blocking resources

**Low accessibility:**
- Missing alt text on images
- Poor color contrast
- Keyboard navigation issues

## Error Tracking

### Where to Look

**Build errors:**
- AWS Amplify Console → Build History

**Runtime errors:**
- Browser console (open site, F12)
- Check for JavaScript errors

**RSS feed errors:**
- Check Writing section for fallback message
- Test Medium feed: https://medium.com/feed/@mattboraske

### Common Issues

**Medium articles not loading:**
- RSS2JSON API might be down
- Rate limiting (too many requests)
- Medium username changed

**Images not showing:**
- File path incorrect
- File not committed to git
- CDN cache not invalidated

**Contact form not working:**
- Formspree quota exceeded
- Form ID incorrect
- CORS issues

## Backup Strategy

### What's Already Backed Up

- **Code:** GitHub repository
- **Content:** Markdown files in repository
- **Deployments:** AWS Amplify keeps build history

### Additional Backups (Recommended)

**Resume:** Keep master copy in cloud storage (Google Drive, Dropbox)

**Images:** Backup `src/resources/` folder

**Analytics:** Export Plausible data quarterly

## Incident Response

### Site Down

1. Check AWS Amplify status page
2. Check latest build in Amplify Console
3. If build failed, check error logs
4. If build succeeded but site down, check domain DNS
5. Rollback to previous version if needed

### Unexpected Traffic Spike

1. Check analytics for traffic source
2. If legitimate (viral post, job posting), celebrate!
3. If suspicious (bot traffic), review in Plausible
4. Check AWS billing (unlikely to be significant cost)

### Security Issue

1. Immediately rotate any exposed credentials
2. Check for unusual commits in GitHub
3. Review AWS Amplify build logs
4. Contact AWS Support if compromise suspected

## Maintenance Checklist Template

Copy to use for monthly reviews:

```markdown
# Maintenance Check - [Month Year]

## Analytics Review
- [ ] Total visitors: _____
- [ ] Top page: _____
- [ ] Top referrer: _____
- [ ] Resume downloads: _____

## Content Updates
- [ ] New projects added: _____
- [ ] Publications updated: _____
- [ ] Spotlight refreshed: Yes/No
- [ ] Skills updated: Yes/No

## Technical Checks
- [ ] Contact form tested: Working/Issues
- [ ] All links checked: OK/Broken
- [ ] Mobile tested: OK/Issues
- [ ] Build status: Passing/Failing

## Action Items
- [ ] ___________________________
- [ ] ___________________________
- [ ] ___________________________

## Notes
___________________________________
___________________________________
```

## Automation Opportunities

### Consider Adding

**GitHub Actions:**
- Run link checker on PRs
- Lighthouse CI on deployments
- Automated dependency updates (Dependabot)

**Monitoring Services:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry for JS errors)

**Content Automation:**
- Auto-update Medium articles daily (if feed is critical)
- Scheduled screenshots for project placeholders

## Support & Resources

**Documentation:**
- This guide (you're reading it!)
- `docs/CONTENT_GUIDE.md` - Content updates
- `docs/ADDING_PROJECTS.md` - Project management
- `README.md` - Setup and overview

**External Resources:**
- AWS Amplify Docs: https://docs.aws.amazon.com/amplify/
- Astro Docs: https://docs.astro.build/
- Plausible Docs: https://plausible.io/docs

**Community:**
- Astro Discord: https://astro.build/chat
- GitHub Issues: For code-related questions
