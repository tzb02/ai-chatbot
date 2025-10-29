# Widget Configuration Guide

## Customizing the Survey Chatbot

### 1. Change AI Model

Edit `app/api/widget/chat/route.ts`:

```typescript
model: myProvider.languageModel("gpt-4o-mini"), // Options: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
```

### 2. Customize System Prompt

Edit the `SURVEY_SYSTEM_PROMPT` in `app/api/widget/chat/route.ts`:

```typescript
const SURVEY_SYSTEM_PROMPT = `You are a friendly survey assistant conducting a customer satisfaction survey.

Ask the following questions one at a time:
1. How would you rate your overall experience? (1-10)
2. What did you like most about our service?
3. What could we improve?
4. Would you recommend us to others?

Keep responses brief and conversational.`;
```

### 3. Customize Widget Appearance

#### Header Text
Edit `components/simple-chat-widget.tsx`:

```typescript
<h2 className="text-lg font-semibold">Your Custom Title</h2>
<p className="text-sm text-muted-foreground">
  Your custom subtitle
</p>
```

#### Colors
Edit `app/widget/layout.tsx` to change theme:

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="light" // Options: "light", "dark", "system"
  disableTransitionOnChange
>
```

#### Message Bubble Colors
Edit `components/simple-messages.tsx`:

```typescript
// User messages
className="bg-primary text-primary-foreground"

// Assistant messages  
className="bg-muted"
```

### 4. Widget Size

When embedding, adjust dimensions:

```html
<iframe 
  src="http://localhost:3000/widget"
  width="400"    <!-- Change width -->
  height="600"   <!-- Change height -->
  style="border: none; border-radius: 12px;"
></iframe>
```

### 5. Add Survey Response Tracking

To save survey responses, edit `app/api/widget/chat/route.ts`:

```typescript
import { db } from "@/lib/db/queries.simple";
import { surveyResponse } from "@/lib/db/schema.simple";

// After saving messages, extract and save survey responses
const extractedAnswers = extractSurveyAnswers(messages);
for (const answer of extractedAnswers) {
  await db.insert(surveyResponse).values({
    chatId: id,
    questionId: answer.questionId,
    answer: answer.text,
    createdAt: new Date(),
  });
}
```

### 6. Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// In app/api/widget/chat/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }
  
  // ... rest of code
}
```

### 7. Session Expiration

Add session cleanup in `lib/db/queries.simple.ts`:

```typescript
export async function cleanupOldSessions(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  await db.delete(chat).where(lt(chat.createdAt, cutoffDate));
}
```

### 8. Analytics Integration

Add analytics tracking in `components/simple-chat-widget.tsx`:

```typescript
import { useEffect } from "react";

useEffect(() => {
  // Track widget load
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "widget_loaded", {
      widget_id: id,
    });
  }
}, [id]);

// Track message sent
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "message_sent", {
      widget_id: id,
    });
  }
  
  // ... rest of submit logic
};
```

### 9. Multi-language Support

Add language detection and translation:

```typescript
// In app/api/widget/chat/route.ts
const SURVEY_PROMPTS = {
  en: "You are a friendly survey assistant...",
  es: "Eres un asistente de encuestas amigable...",
  fr: "Vous êtes un assistant d'enquête amical...",
};

const userLanguage = detectLanguage(message.parts[0].text);
const systemPrompt = SURVEY_PROMPTS[userLanguage] || SURVEY_PROMPTS.en;
```

### 10. Custom Styling with CSS Variables

Add to `app/widget/layout.tsx`:

```typescript
<style jsx global>{`
  :root {
    --widget-primary: #0070f3;
    --widget-background: #ffffff;
    --widget-text: #000000;
  }
`}</style>
```

## Environment Variables

### Required
```env
POSTGRES_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### Optional
```env
# Rate limiting (if using Upstash)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Analytics
NEXT_PUBLIC_GA_ID=G-...

# Custom API endpoint
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Production Checklist

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Test iframe embedding on target site
- [ ] Configure CORS if needed
- [ ] Add error tracking (Sentry, etc.)
- [ ] Set up database backups
- [ ] Test on mobile devices
- [ ] Add loading states
- [ ] Implement session cleanup cron job

## Advanced Features

### Add File Upload
```typescript
// In components/simple-input.tsx
<input 
  type="file" 
  onChange={handleFileUpload}
  accept="image/*,.pdf"
/>
```

### Add Voice Input
```typescript
// Use Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setInput(transcript);
};
```

### Add Typing Indicators
```typescript
// In components/simple-messages.tsx
{isTyping && (
  <div className="flex space-x-2">
    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:0.2s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:0.4s]" />
  </div>
)}
```

## Support

For more customization options, refer to:
- Next.js documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- AI SDK: https://sdk.vercel.ai/docs
