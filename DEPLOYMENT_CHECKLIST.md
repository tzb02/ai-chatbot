# 📋 Deployment Checklist

Use this checklist before deploying your survey chatbot widget to production.

## Pre-Deployment

### Database
- [ ] Production PostgreSQL database provisioned
- [ ] Database connection string secured
- [ ] Migrations run successfully
- [ ] Database backups configured
- [ ] Connection pooling enabled (recommended)

### Environment Variables
- [ ] `POSTGRES_URL` set in production
- [ ] `OPENAI_API_KEY` set in production
- [ ] All secrets stored securely (not in code)
- [ ] Environment variables tested

### Code Review
- [ ] System prompt customized for your use case
- [ ] Widget title and branding updated
- [ ] Error messages customized
- [ ] Console.log statements removed/minimized
- [ ] No hardcoded credentials in code

### Testing
- [ ] Widget loads correctly
- [ ] Chat functionality works
- [ ] Messages save to database
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Iframe embedding tested on target site

## Security

### API Security
- [ ] Rate limiting implemented (recommended)
- [ ] Input validation in place
- [ ] SQL injection protection (Drizzle handles this)
- [ ] XSS protection enabled
- [ ] CORS configured if needed

### Data Privacy
- [ ] Privacy policy updated
- [ ] Data retention policy defined
- [ ] GDPR compliance reviewed (if applicable)
- [ ] Session cleanup scheduled
- [ ] PII handling reviewed

### Infrastructure
- [ ] HTTPS enabled
- [ ] Database encrypted at rest
- [ ] Database encrypted in transit
- [ ] Secrets management configured
- [ ] Access logs enabled

## Performance

### Optimization
- [ ] Database indexes added
- [ ] Query performance tested
- [ ] API response times acceptable (<2s)
- [ ] Bundle size optimized
- [ ] Images optimized (if any)

### Monitoring
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Performance monitoring enabled
- [ ] Database monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set

### Scaling
- [ ] Database connection limits reviewed
- [ ] API rate limits set
- [ ] CDN configured (if needed)
- [ ] Auto-scaling enabled (if applicable)

## Deployment Platform

### Vercel (Recommended)
- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] Domain configured
- [ ] Preview deployments tested
- [ ] Production deployment successful

### Other Platforms
- [ ] Node.js 18+ runtime configured
- [ ] Build command: `pnpm build`
- [ ] Start command: `pnpm start`
- [ ] Port configuration correct
- [ ] Health check endpoint configured

## Post-Deployment

### Verification
- [ ] Production URL accessible
- [ ] Widget loads on production
- [ ] Chat functionality works in production
- [ ] Database writes successful
- [ ] Error tracking receiving data
- [ ] SSL certificate valid

### Embedding
- [ ] Update iframe src to production URL
- [ ] Test embedding on target website
- [ ] Verify CORS settings
- [ ] Check iframe security headers
- [ ] Test on different pages

### Documentation
- [ ] Deployment URL documented
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Team trained on monitoring

## Maintenance

### Regular Tasks
- [ ] Database cleanup scheduled (old sessions)
- [ ] Logs reviewed weekly
- [ ] Performance metrics reviewed
- [ ] Error rates monitored
- [ ] User feedback collected

### Updates
- [ ] Dependency update schedule defined
- [ ] Security patch process defined
- [ ] Backup restoration tested
- [ ] Rollback procedure documented
- [ ] Change log maintained

## Optional Enhancements

### Analytics
- [ ] Google Analytics integrated
- [ ] Custom event tracking added
- [ ] Conversion tracking configured
- [ ] Dashboard created

### Features
- [ ] Survey response export implemented
- [ ] Admin dashboard created
- [ ] Multi-language support added
- [ ] Custom branding options added
- [ ] A/B testing configured

### Advanced
- [ ] Redis caching added
- [ ] WebSocket support added
- [ ] Voice input enabled
- [ ] File upload enabled
- [ ] Advanced analytics integrated

## Rollback Plan

In case of issues:

1. **Immediate Actions**
   - [ ] Rollback procedure documented
   - [ ] Previous version tagged in git
   - [ ] Database backup available
   - [ ] Rollback tested in staging

2. **Communication**
   - [ ] Incident response plan defined
   - [ ] Stakeholder contact list ready
   - [ ] Status page configured
   - [ ] User notification process defined

## Sign-Off

- [ ] Technical lead approval
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Team trained

---

## Deployment Commands

### Vercel
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to production
vercel --prod
```

### Manual Deployment
```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Database Migration
```bash
# Run migrations in production
pnpm widget:migrate
```

## Environment Variables Template

```env
# Production .env
POSTGRES_URL=postgresql://...
OPENAI_API_KEY=sk-...

# Optional
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
SENTRY_DSN=...
NEXT_PUBLIC_GA_ID=...
```

## Support Contacts

- **Technical Issues**: [Your contact]
- **Database Issues**: [DBA contact]
- **Security Issues**: [Security team]
- **Business Issues**: [Product owner]

---

**Last Updated**: [Date]  
**Deployed By**: [Name]  
**Deployment Date**: [Date]  
**Version**: [Version number]
