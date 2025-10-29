# Survey Chatbot Widget

A simplified, embeddable AI chatbot widget for conducting surveys and conversations. This version removes authentication and blob storage, keeping only the essential database connection for storing chat messages.

## Features

- ✅ No authentication required
- ✅ Anonymous session tracking
- ✅ Database-only storage (PostgreSQL)
- ✅ Easy iframe embedding
- ✅ Responsive design
- ✅ Ready for survey questions

## Setup

### 1. Environment Variables

Create a `.env.local` file with your database connection:

```env
POSTGRES_URL=your_postgres_connection_string
OPENAI_API_KEY=your_openai_api_key
```

### 2. Database Migration

Run the migration to create the simplified tables:

```bash
pnpm db:generate
pnpm db:migrate
```

The simplified schema includes:
- `Chat` - Stores chat sessions with sessionId (no user association)
- `Message` - Stores chat messages
- `SurveyResponse` - Ready for future survey question tracking

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

## Usage

### Direct Access

Visit `http://localhost:3000/widget` to see the chatbot widget.

### Embed in Your Website

Add this iframe to any webpage:

```html
<iframe 
  src="http://localhost:3000/widget"
  width="400"
  height="600"
  style="border: none; border-radius: 12px;"
  title="Survey Chatbot"
></iframe>
```

### Example Embed

See `public/embed-example.html` for a complete example with styling.

## File Structure

### New/Modified Files

```
app/
  widget/
    page.tsx              # Widget page component
    layout.tsx            # Minimal layout without auth
  api/
    widget/
      chat/
        route.ts          # Simplified chat API (no auth)

components/
  simple-chat-widget.tsx  # Main widget component
  simple-messages.tsx     # Message display
  simple-input.tsx        # Input component
  markdown.tsx            # Markdown renderer

lib/
  db/
    schema.simple.ts      # Simplified database schema
    queries.simple.ts     # Database queries without auth

next.config.simple.ts     # Config allowing iframe embedding
```

## Customization

### Survey Questions

To customize for survey questions, modify the system prompt in:
`app/api/widget/chat/route.ts`

```typescript
const SURVEY_SYSTEM_PROMPT = `Your custom survey instructions here...`;
```

### Styling

The widget uses Tailwind CSS. Customize colors and styling in:
- `app/widget/layout.tsx` - Theme settings
- `components/simple-chat-widget.tsx` - Widget structure
- `components/simple-messages.tsx` - Message styling

### Model Selection

Change the AI model in `app/api/widget/chat/route.ts`:

```typescript
model: myProvider.languageModel("gpt-4o-mini"), // Change model here
```

## Database Schema

### Chat Table
- `id` - UUID primary key
- `createdAt` - Timestamp
- `title` - Chat title
- `sessionId` - Anonymous session identifier

### Message Table
- `id` - UUID primary key
- `chatId` - Foreign key to Chat
- `role` - "user" or "assistant"
- `parts` - JSON array of message parts
- `createdAt` - Timestamp

### SurveyResponse Table (Future Use)
- `id` - UUID primary key
- `chatId` - Foreign key to Chat
- `questionId` - Survey question identifier
- `answer` - User's answer
- `createdAt` - Timestamp

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure your platform supports:
- Next.js 15+
- PostgreSQL database
- Node.js 18+

## Security Notes

- No authentication means anyone can use the widget
- Consider rate limiting for production
- Add CORS restrictions if needed
- Monitor database usage

## Next Steps

1. Add survey question flow logic
2. Implement survey response tracking
3. Add analytics dashboard
4. Create admin panel for viewing responses
5. Add rate limiting
6. Implement session expiration

## Differences from Original Template

**Removed:**
- NextAuth authentication
- User management
- Blob storage
- Document/artifact features
- Vote system
- Middleware auth checks
- Complex chat history
- Model selection UI

**Kept:**
- Core chat functionality
- Database storage
- AI streaming responses
- Message history
- Responsive UI

## Support

For issues or questions, refer to the original template documentation or create an issue in your repository.
