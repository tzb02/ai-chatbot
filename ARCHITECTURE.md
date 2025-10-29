# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Website                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │  <iframe src="your-app.com/widget">                │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │                                            │     │    │
│  │  │         Survey Chatbot Widget             │     │    │
│  │  │                                            │     │    │
│  │  │  ┌──────────────────────────────────┐   │     │    │
│  │  │  │  User Input                       │   │     │    │
│  │  │  └──────────────────────────────────┘   │     │    │
│  │  │  ┌──────────────────────────────────┐   │     │    │
│  │  │  │  Chat Messages                    │   │     │    │
│  │  │  └──────────────────────────────────┘   │     │    │
│  │  │                                            │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │  </iframe>                                          │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Request
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /widget (Page)                                      │   │
│  │  - SimpleChatWidget Component                        │   │
│  │  - SimpleMessages Component                          │   │
│  │  - SimpleInput Component                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            │ API Call                        │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/widget/chat (API Route)                       │   │
│  │  - Receive user message                              │   │
│  │  - Save to database                                  │   │
│  │  - Stream AI response                                │   │
│  │  - Save AI response                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │   PostgreSQL     │      │   OpenAI API     │
    │   Database       │      │                  │
    │                  │      │  - GPT-4o-mini   │
    │  - Chat          │      │  - Streaming     │
    │  - Message       │      │                  │
    │  - SurveyResponse│      └──────────────────┘
    └──────────────────┘
```

## Data Flow

### 1. User Sends Message

```
User Types Message
      │
      ▼
SimpleInput Component
      │
      ▼
useChat Hook (AI SDK)
      │
      ▼
POST /api/widget/chat
      │
      ├─► Save user message to DB
      │
      └─► Stream to OpenAI API
```

### 2. AI Response

```
OpenAI API
      │
      ▼
Stream Response (word by word)
      │
      ▼
API Route processes stream
      │
      ▼
Client receives SSE stream
      │
      ▼
SimpleMessages displays response
      │
      ▼
Save AI message to DB
```

## Component Hierarchy

```
app/widget/layout.tsx
└── app/widget/page.tsx
    └── SimpleChatWidget
        ├── Header (inline)
        ├── SimpleMessages
        │   └── Markdown (for AI responses)
        └── SimpleInput
            ├── Textarea
            └── Button
```

## Database Schema

```
┌─────────────────┐
│      Chat       │
├─────────────────┤
│ id (PK)         │
│ sessionId       │◄─── Anonymous session tracking
│ title           │
│ createdAt       │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│    Message      │
├─────────────────┤
│ id (PK)         │
│ chatId (FK)     │
│ role            │◄─── "user" or "assistant"
│ parts           │◄─── JSON: [{ type: "text", text: "..." }]
│ createdAt       │
└─────────────────┘
        │
        │ 1:N (future use)
        ▼
┌─────────────────┐
│ SurveyResponse  │
├─────────────────┤
│ id (PK)         │
│ chatId (FK)     │
│ questionId      │
│ answer          │
│ createdAt       │
└─────────────────┘
```

## API Endpoints

### POST /api/widget/chat

**Request:**
```json
{
  "id": "chat-uuid",
  "message": {
    "id": "message-uuid",
    "role": "user",
    "parts": [
      { "type": "text", "text": "User's message" }
    ]
  },
  "sessionId": "session-uuid"
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"type":"text-delta","textDelta":"Hello"}
data: {"type":"text-delta","textDelta":" there"}
data: {"type":"finish","finishReason":"stop"}
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK
- **State Management**: React hooks + AI SDK

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Database ORM**: Drizzle
- **Database**: PostgreSQL
- **AI Provider**: OpenAI (via AI SDK)

### Deployment
- **Platform**: Vercel (recommended)
- **Database**: Vercel Postgres / Supabase / Neon
- **CDN**: Vercel Edge Network

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. HTTPS/TLS Encryption                │
├─────────────────────────────────────────┤
│  2. Iframe Security Headers             │
│     - X-Frame-Options                   │
│     - Content-Security-Policy           │
├─────────────────────────────────────────┤
│  3. Input Validation                    │
│     - Zod schema validation             │
├─────────────────────────────────────────┤
│  4. Database Security                   │
│     - Parameterized queries (Drizzle)   │
│     - Connection encryption             │
├─────────────────────────────────────────┤
│  5. API Security                        │
│     - Rate limiting (optional)          │
│     - Request validation                │
├─────────────────────────────────────────┤
│  6. Environment Variables               │
│     - Secrets not in code               │
│     - Secure storage                    │
└─────────────────────────────────────────┘
```

## Session Management

```
User visits widget
      │
      ▼
Check for session cookie
      │
      ├─► Cookie exists ──► Use existing sessionId
      │
      └─► No cookie ──► Generate new sessionId
                              │
                              ▼
                        Set cookie (client-side)
                              │
                              ▼
                        Use for all API calls
```

## Scaling Considerations

### Horizontal Scaling
- Next.js app can scale horizontally
- Stateless API routes
- Database connection pooling required

### Database Scaling
- Add indexes on frequently queried fields
- Implement read replicas for high traffic
- Archive old sessions periodically

### Caching Strategy
```
┌─────────────────┐
│  CDN (Static)   │  ◄── HTML, CSS, JS
├─────────────────┤
│  Redis (Future) │  ◄── Session data, rate limits
├─────────────────┤
│  PostgreSQL     │  ◄── Persistent data
└─────────────────┘
```

## Performance Optimization

### Client-Side
- Code splitting (automatic with Next.js)
- Lazy loading components
- Optimized bundle size (~60% smaller than original)

### Server-Side
- Streaming responses (AI SDK)
- Database query optimization
- Connection pooling

### Network
- SSE for real-time updates
- Compression enabled
- CDN for static assets

## Monitoring Points

```
┌─────────────────────────────────────────┐
│  Frontend Monitoring                    │
│  - Page load time                       │
│  - Widget render time                   │
│  - User interactions                    │
├─────────────────────────────────────────┤
│  API Monitoring                         │
│  - Response times                       │
│  - Error rates                          │
│  - Request volume                       │
├─────────────────────────────────────────┤
│  Database Monitoring                    │
│  - Query performance                    │
│  - Connection pool usage                │
│  - Storage usage                        │
├─────────────────────────────────────────┤
│  AI API Monitoring                      │
│  - Token usage                          │
│  - Response times                       │
│  - Error rates                          │
└─────────────────────────────────────────┘
```

## Development Workflow

```
1. Local Development
   ├── pnpm dev
   ├── Test at localhost:3000/widget
   └── Database: Local PostgreSQL or cloud

2. Testing
   ├── Manual testing
   ├── Browser testing
   └── Embedding test (embed-example.html)

3. Staging (Optional)
   ├── Deploy to Vercel preview
   ├── Test with staging database
   └── Verify embedding on test site

4. Production
   ├── Deploy to Vercel production
   ├── Run migrations
   ├── Update iframe src on live site
   └── Monitor performance
```

## Future Architecture Enhancements

### Phase 1: Basic Improvements
- Add Redis for session caching
- Implement rate limiting
- Add request logging

### Phase 2: Advanced Features
- WebSocket support for real-time
- Multi-language support
- Advanced analytics

### Phase 3: Scale
- Microservices architecture
- Separate AI service
- Advanced caching layer

## Comparison: Original vs Simplified

| Feature | Original | Simplified |
|---------|----------|------------|
| Authentication | NextAuth | None |
| User Management | Full | Anonymous sessions |
| Database Tables | 8+ | 3 |
| API Endpoints | 10+ | 1 |
| Components | 40+ | 5 |
| Bundle Size | ~2MB | ~800KB |
| Complexity | High | Low |
| Setup Time | 30+ min | 5 min |

## Questions?

- **Architecture**: See this file
- **Setup**: See QUICK_START.md
- **Configuration**: See WIDGET_CONFIG.md
- **Deployment**: See DEPLOYMENT_CHECKLIST.md
