# Quick Setup Guide for Survey Chatbot Widget

## Step 1: Environment Setup

Create `.env.local` file in the root directory:

```env
POSTGRES_URL=your_postgres_connection_string_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Step 2: Generate Database Schema

Run this command to generate the migration files:

```bash
npx drizzle-kit generate --config=drizzle.config.simple.ts
```

## Step 3: Run Database Migration

```bash
npx tsx lib/db/migrate.simple.ts
```

## Step 4: Start Development Server

```bash
pnpm dev
```

## Step 5: Test the Widget

1. **Direct access**: Open `http://localhost:3000/widget`
2. **Embed test**: Open `public/embed-example.html` in your browser

## Step 6: Embed in Your Site

Add this code to any webpage:

```html
<!-- Fixed position chatbot in bottom-right corner -->
<div style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); overflow: hidden; z-index: 1000;">
  <iframe 
    src="http://localhost:3000/widget"
    style="width: 100%; height: 100%; border: none;"
    title="Survey Chatbot"
  ></iframe>
</div>
```

## Troubleshooting

### Database Connection Issues
- Verify your `POSTGRES_URL` is correct
- Ensure your database is accessible
- Check if migrations ran successfully

### Widget Not Loading
- Check browser console for errors
- Verify the dev server is running on port 3000
- Check if iframe is allowed (CORS settings)

### API Errors
- Verify `OPENAI_API_KEY` is set correctly
- Check API rate limits
- Review server logs for detailed errors

## Next Steps

1. Customize the survey questions in `app/api/widget/chat/route.ts`
2. Modify styling in widget components
3. Add survey response tracking logic
4. Deploy to production

## Production Deployment

Before deploying:

1. Update iframe src to your production URL
2. Add rate limiting
3. Set up monitoring
4. Configure CORS if needed
5. Add analytics tracking

## Database Tables Created

- **Chat**: Stores chat sessions with anonymous sessionId
- **Message**: Stores all chat messages
- **SurveyResponse**: Ready for survey answer tracking (not yet implemented)

## Files You Can Safely Delete

If you want to clean up the original template files:

```bash
# Auth-related files (not needed for widget)
app/(auth)/
middleware.ts (original)

# Complex features (not needed for widget)
artifacts/
components/artifact*.tsx
components/document*.tsx
components/sidebar*.tsx
components/auth-form.tsx
components/sign-out-form.tsx

# Original schema (keep if you want to preserve original app)
lib/db/schema.ts (original)
lib/db/queries.ts (original)
```

**Note**: Only delete these if you're sure you won't need the original template features!
