# 🚀 Quick Reference Card

## Essential Commands

```bash
# Setup
pnpm install                    # Install dependencies
pnpm widget:setup               # Setup widget database

# Development
pnpm dev                        # Start dev server
pnpm build                      # Build for production
pnpm start                      # Start production server

# Database
pnpm widget:generate            # Generate migrations
pnpm widget:migrate             # Run migrations
```

## Essential URLs

```
http://localhost:3000/widget              # Widget page
http://localhost:3000/api/widget/chat     # API endpoint
```

## Essential Files to Edit

```typescript
// Survey questions
app/api/widget/chat/route.ts
const SURVEY_SYSTEM_PROMPT = `Your questions here...`;

// Widget appearance
components/simple-chat-widget.tsx
<h2>Your Title</h2>

// AI model
app/api/widget/chat/route.ts
model: myProvider.languageModel("gpt-4o-mini")
```

## Environment Variables

```env
# Required
POSTGRES_URL=postgresql://user:password@host:5432/database
OPENAI_API_KEY=sk-your-key-here

# Optional
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## Embed Code

```html
<iframe 
  src="http://localhost:3000/widget"
  width="400"
  height="600"
  style="border: none; border-radius: 12px;"
  title="Survey Chatbot"
></iframe>
```

## Documentation Quick Links

- **Start**: [START_HERE.md](START_HERE.md)
- **Setup**: [QUICK_START.md](QUICK_START.md)
- **Config**: [WIDGET_CONFIG.md](WIDGET_CONFIG.md)
- **Deploy**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Issues**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Common Issues

| Problem | Solution |
|---------|----------|
| Database error | Check `POSTGRES_URL` |
| API error | Check `OPENAI_API_KEY` |
| Widget not loading | Check browser console |
| Build fails | Run `pnpm install` |

## File Structure

```
app/widget/              → Widget pages
app/api/widget/chat/     → API endpoint
components/simple-*.tsx  → Widget components
lib/db/*.simple.ts       → Database files
```

## Next Steps

1. ✅ Run `pnpm widget:setup`
2. ✅ Run `pnpm dev`
3. ✅ Visit `/widget`
4. ✅ Customize in [WIDGET_CONFIG.md](WIDGET_CONFIG.md)
5. ✅ Deploy with [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

**Need more details?** → [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
