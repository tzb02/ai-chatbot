# 🤖 Survey Chatbot Widget

A simplified, embeddable AI chatbot widget built with Next.js 15, designed for surveys and simple conversations. No authentication required, just database storage and AI-powered responses.

## ✨ Features

- ✅ **No Authentication** - Anonymous session tracking
- ✅ **Easy Embedding** - Simple iframe integration
- ✅ **Database Storage** - PostgreSQL for chat history
- ✅ **AI Powered** - OpenAI GPT models
- ✅ **Responsive Design** - Works on all devices
- ✅ **Survey Ready** - Built for questionnaires
- ✅ **Lightweight** - 60% smaller than original template
- ✅ **Fast Setup** - Running in 5 minutes

## 📚 Documentation

Start here based on what you need:

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes ⚡
- **[SETUP_WIDGET.md](SETUP_WIDGET.md)** - Detailed setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture overview

### Configuration & Customization
- **[WIDGET_CONFIG.md](WIDGET_CONFIG.md)** - Customize appearance and behavior
- **[examples/survey-example.ts](examples/survey-example.ts)** - Survey implementation guide

### Deployment & Maintenance
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

### Reference
- **[CHANGES.md](CHANGES.md)** - What changed from original template
- **[WIDGET_README.md](WIDGET_README.md)** - Complete feature documentation

## 🚀 Quick Start

### 1. Install
```bash
pnpm install
```

### 2. Configure
Create `.env.local`:
```env
POSTGRES_URL=postgresql://user:password@host:5432/database
OPENAI_API_KEY=sk-your-key-here
```

### 3. Setup Database
```bash
pnpm widget:setup
```

### 4. Run
```bash
pnpm dev
```

### 5. Test
Open http://localhost:3000/widget

## 📦 What's Included

### Core Files
```
app/
  widget/
    page.tsx              # Widget entry point
    layout.tsx            # Minimal layout
  api/widget/chat/
    route.ts              # Chat API endpoint

components/
  simple-chat-widget.tsx  # Main widget component
  simple-messages.tsx     # Message display
  simple-input.tsx        # Input field
  markdown.tsx            # Markdown renderer

lib/db/
  schema.simple.ts        # Database schema
  queries.simple.ts       # Database queries
  migrate.simple.ts       # Migration script
```

### Documentation
```
README_WIDGET.md          # This file (overview)
QUICK_START.md            # 5-minute setup guide
SETUP_WIDGET.md           # Detailed setup
WIDGET_CONFIG.md          # Configuration options
WIDGET_README.md          # Complete documentation
ARCHITECTURE.md           # System architecture
DEPLOYMENT_CHECKLIST.md   # Deployment guide
TROUBLESHOOTING.md        # Common issues
CHANGES.md                # What changed
```

### Examples
```
examples/
  survey-example.ts       # Survey implementation
public/
  embed-example.html      # Embedding demo
```

## 🎯 Use Cases

Perfect for:
- Customer satisfaction surveys
- Feedback collection
- Lead generation forms
- Anonymous support chat
- Product questionnaires
- Market research
- Event registration
- Simple Q&A bots

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS
- **AI**: Vercel AI SDK + OpenAI
- **Database**: PostgreSQL + Drizzle ORM
- **Deployment**: Vercel (recommended)

## 📊 Comparison

| Feature | Original Template | This Widget |
|---------|------------------|-------------|
| Authentication | ✅ NextAuth | ❌ None |
| User Management | ✅ Full | ❌ Anonymous |
| File Upload | ✅ Blob Storage | ❌ None |
| Chat History UI | ✅ Sidebar | ❌ None |
| Artifacts | ✅ Documents/Code | ❌ None |
| Bundle Size | ~2MB | ~800KB |
| Setup Time | 30+ min | 5 min |
| Complexity | High | Low |

## 🌐 Embedding

Add to any webpage:

```html
<iframe 
  src="http://localhost:3000/widget"
  width="400"
  height="600"
  style="border: none; border-radius: 12px;"
  title="Survey Chatbot"
></iframe>
```

See `public/embed-example.html` for complete example.

## 🎨 Customization

### Change AI Model
```typescript
// app/api/widget/chat/route.ts
model: myProvider.languageModel("gpt-4o-mini")
```

### Customize Survey Questions
```typescript
// app/api/widget/chat/route.ts
const SURVEY_SYSTEM_PROMPT = `Your custom survey instructions...`;
```

### Style the Widget
```typescript
// components/simple-chat-widget.tsx
<h2 className="text-lg font-semibold">Your Title</h2>
```

See [WIDGET_CONFIG.md](WIDGET_CONFIG.md) for all options.

## 📈 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Other Platforms
```bash
pnpm build
pnpm start
```

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete guide.

## 🗄️ Database Schema

### Chat
- Stores chat sessions with anonymous sessionId
- No user association required

### Message
- Stores all chat messages
- Links to chat via chatId

### SurveyResponse
- Ready for survey answer tracking
- Not yet implemented (see examples)

## 🔒 Security

- ✅ HTTPS/TLS encryption
- ✅ Input validation (Zod)
- ✅ SQL injection protection (Drizzle)
- ✅ XSS protection
- ⚠️ No authentication (by design)
- ⚠️ Consider rate limiting for production

## 📝 Environment Variables

### Required
```env
POSTGRES_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### Optional
```env
UPSTASH_REDIS_REST_URL=...    # For rate limiting
UPSTASH_REDIS_REST_TOKEN=...  # For rate limiting
SENTRY_DSN=...                # For error tracking
NEXT_PUBLIC_GA_ID=...         # For analytics
```

## 🐛 Troubleshooting

Common issues:

- **Widget not loading?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Database errors?** Verify connection string
- **API errors?** Check OpenAI API key
- **Embedding issues?** Review iframe security headers

## 📖 Learning Path

1. **Start**: [QUICK_START.md](QUICK_START.md) - Get it running
2. **Understand**: [ARCHITECTURE.md](ARCHITECTURE.md) - How it works
3. **Customize**: [WIDGET_CONFIG.md](WIDGET_CONFIG.md) - Make it yours
4. **Implement**: [examples/survey-example.ts](examples/survey-example.ts) - Add surveys
5. **Deploy**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Go live

## 🎓 Examples

### Basic Survey
```typescript
const SURVEY_PROMPT = `Ask these questions one at a time:
1. How satisfied are you? (1-10)
2. What did you like?
3. What can we improve?`;
```

### Multi-language
```typescript
const PROMPTS = {
  en: "You are a survey assistant...",
  es: "Eres un asistente de encuestas...",
};
```

See [examples/survey-example.ts](examples/survey-example.ts) for complete examples.

## 🤝 Contributing

This is a simplified version of the Next.js AI Chatbot template. For the original template, see: https://github.com/vercel/ai-chatbot

## 📄 License

Same as original template (check LICENSE file)

## 🆘 Support

- **Documentation**: Read all `.md` files
- **Examples**: Check `examples/` folder
- **Issues**: Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Original Template**: Refer to Vercel AI Chatbot docs

## 🗺️ Roadmap

Future enhancements:

- [ ] Survey response analytics dashboard
- [ ] Multi-language support
- [ ] Voice input
- [ ] File upload
- [ ] Advanced rate limiting
- [ ] Session cleanup automation
- [ ] Export survey results
- [ ] Custom branding options
- [ ] A/B testing support
- [ ] WebSocket support

## 🎉 Credits

Built on top of:
- [Next.js AI Chatbot](https://github.com/vercel/ai-chatbot) by Vercel
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Ready to start?** → [QUICK_START.md](QUICK_START.md)

**Need help?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Want to customize?** → [WIDGET_CONFIG.md](WIDGET_CONFIG.md)
