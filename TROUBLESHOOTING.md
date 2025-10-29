# 🔧 Troubleshooting Guide

Common issues and solutions for the Survey Chatbot Widget.

## Installation Issues

### ❌ "Cannot find module 'postgres'"

**Problem**: Missing dependencies

**Solution**:
```bash
pnpm install
```

### ❌ "POSTGRES_URL is not defined"

**Problem**: Missing environment variable

**Solution**:
1. Create `.env.local` file in root directory
2. Add: `POSTGRES_URL=your_connection_string`
3. Restart dev server

### ❌ "drizzle-kit: command not found"

**Problem**: Drizzle Kit not installed

**Solution**:
```bash
pnpm install drizzle-kit --save-dev
```

## Database Issues

### ❌ "Connection refused" or "ECONNREFUSED"

**Problem**: Cannot connect to database

**Solutions**:
1. Check database is running
2. Verify connection string format:
   ```
   postgresql://user:password@host:5432/database
   ```
3. Check firewall/network settings
4. Verify database credentials

### ❌ "relation does not exist"

**Problem**: Database tables not created

**Solution**:
```bash
# Generate migrations
pnpm widget:generate

# Run migrations
pnpm widget:migrate
```

### ❌ "SSL connection required"

**Problem**: Database requires SSL

**Solution**:
Add `?sslmode=require` to connection string:
```env
POSTGRES_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### ❌ "too many clients"

**Problem**: Database connection limit reached

**Solutions**:
1. Enable connection pooling
2. Reduce max connections in code
3. Upgrade database plan
4. Use connection pooler (PgBouncer)

## Widget Display Issues

### ❌ Widget not loading in iframe

**Problem**: Iframe security restrictions

**Solutions**:
1. Check browser console for errors
2. Verify iframe src URL is correct
3. Check CORS settings
4. Ensure X-Frame-Options allows embedding

### ❌ "Refused to display in a frame"

**Problem**: X-Frame-Options blocking iframe

**Solution**:
Verify `next.config.simple.ts` has correct headers:
```typescript
headers: [
  { key: "X-Frame-Options", value: "ALLOWALL" },
  { key: "Content-Security-Policy", value: "frame-ancestors *" }
]
```

### ❌ Widget appears but is blank

**Problem**: JavaScript error or missing components

**Solutions**:
1. Check browser console for errors
2. Verify all components are imported correctly
3. Check if API endpoint is accessible
4. Clear browser cache

### ❌ Styling looks broken

**Problem**: CSS not loading or conflicts

**Solutions**:
1. Check Tailwind CSS is configured
2. Verify `globals.css` is imported
3. Check for CSS conflicts with parent page
4. Use iframe sandbox if needed

## API Issues

### ❌ "401 Unauthorized"

**Problem**: This shouldn't happen (no auth required)

**Solution**:
Check you're using `/api/widget/chat` not `/api/chat`

### ❌ "500 Internal Server Error"

**Problem**: Server-side error

**Solutions**:
1. Check server logs
2. Verify environment variables
3. Check database connection
4. Verify OpenAI API key

### ❌ "OPENAI_API_KEY is not defined"

**Problem**: Missing API key

**Solution**:
Add to `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
```

### ❌ "Rate limit exceeded"

**Problem**: Too many API requests

**Solutions**:
1. Check OpenAI usage dashboard
2. Implement rate limiting
3. Upgrade OpenAI plan
4. Add request throttling

### ❌ "Model not found"

**Problem**: Invalid model ID

**Solution**:
Check model ID in `app/api/widget/chat/route.ts`:
```typescript
model: myProvider.languageModel("gpt-4o-mini"), // Valid model
```

## Chat Functionality Issues

### ❌ Messages not sending

**Problem**: Various causes

**Solutions**:
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check network tab for failed requests
4. Verify database is writable

### ❌ AI not responding

**Problem**: OpenAI API issue

**Solutions**:
1. Check OpenAI API status
2. Verify API key is valid
3. Check API rate limits
4. Review server logs for errors

### ❌ Messages not saving to database

**Problem**: Database write failure

**Solutions**:
1. Check database connection
2. Verify table schema is correct
3. Check database permissions
4. Review server logs

### ❌ Streaming not working

**Problem**: SSE connection issue

**Solutions**:
1. Check browser supports SSE
2. Verify API returns correct headers
3. Check for proxy/firewall blocking SSE
4. Test with different browser

## Development Issues

### ❌ "Port 3000 already in use"

**Problem**: Port conflict

**Solutions**:
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
pnpm dev -- -p 3001
```

### ❌ Hot reload not working

**Problem**: File changes not detected

**Solutions**:
1. Restart dev server
2. Clear `.next` folder
3. Check file watcher limits (Linux)
4. Disable antivirus temporarily

### ❌ TypeScript errors

**Problem**: Type mismatches

**Solutions**:
1. Run `pnpm install` to update types
2. Check imports are correct
3. Verify TypeScript version
4. Clear TypeScript cache

## Production Issues

### ❌ Build fails

**Problem**: Build-time errors

**Solutions**:
1. Check build logs for specific errors
2. Verify all dependencies installed
3. Check TypeScript errors
4. Ensure environment variables set

### ❌ Widget works locally but not in production

**Problem**: Environment differences

**Solutions**:
1. Check production environment variables
2. Verify database is accessible from production
3. Check production logs
4. Test with production database locally

### ❌ Slow response times

**Problem**: Performance issues

**Solutions**:
1. Add database indexes
2. Enable connection pooling
3. Optimize queries
4. Add caching layer
5. Check OpenAI API latency

### ❌ High database usage

**Problem**: Too many connections or queries

**Solutions**:
1. Implement connection pooling
2. Add query optimization
3. Archive old sessions
4. Add rate limiting

## Embedding Issues

### ❌ Widget not visible on parent site

**Problem**: CSS or positioning issue

**Solutions**:
1. Check iframe has width/height
2. Verify z-index is high enough
3. Check parent page CSS conflicts
4. Use fixed positioning

### ❌ Widget cut off or scrolling issues

**Problem**: Size constraints

**Solutions**:
1. Adjust iframe dimensions
2. Set `overflow: hidden` on iframe
3. Use responsive sizing
4. Test on different screen sizes

### ❌ Communication with parent page

**Problem**: Need to send data to parent

**Solution**:
Use postMessage API:
```typescript
// In widget
window.parent.postMessage({ type: 'survey_complete' }, '*');

// In parent page
window.addEventListener('message', (event) => {
  if (event.data.type === 'survey_complete') {
    // Handle completion
  }
});
```

## Session Issues

### ❌ Session not persisting

**Problem**: Cookie not being set

**Solutions**:
1. Check cookie settings
2. Verify domain/path settings
3. Check SameSite attribute
4. Test in non-incognito mode

### ❌ Multiple sessions created

**Problem**: Session ID not being reused

**Solutions**:
1. Check cookie is being read correctly
2. Verify sessionId is passed to API
3. Check cookie expiration
4. Review session logic

## Common Error Messages

### "Failed to fetch"

**Causes**:
- Network connectivity issue
- CORS problem
- API endpoint down
- Firewall blocking request

**Solutions**:
1. Check network connection
2. Verify API URL is correct
3. Check CORS configuration
4. Test API endpoint directly

### "Unexpected token < in JSON"

**Causes**:
- API returning HTML instead of JSON
- Error page being returned
- Wrong endpoint

**Solutions**:
1. Check API endpoint URL
2. Review server logs
3. Test endpoint with curl/Postman
4. Verify response format

### "Cannot read property 'map' of undefined"

**Causes**:
- Data not loaded yet
- API returned unexpected format
- Missing error handling

**Solutions**:
1. Add null checks
2. Add loading states
3. Verify API response format
4. Add error boundaries

## Debugging Tips

### Enable Verbose Logging

Add to `.env.local`:
```env
DEBUG=true
NODE_ENV=development
```

### Check Browser Console

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for cookies/storage

### Check Server Logs

```bash
# Development
pnpm dev
# Watch for errors in terminal

# Production (Vercel)
# Check Vercel dashboard logs
```

### Test API Directly

```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/widget/chat \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "message": {
      "id": "msg-123",
      "role": "user",
      "parts": [{"type": "text", "text": "Hello"}]
    },
    "sessionId": "session-123"
  }'
```

### Database Debugging

```bash
# Connect to database
psql $POSTGRES_URL

# Check tables
\dt

# Check data
SELECT * FROM "Chat" LIMIT 10;
SELECT * FROM "Message" LIMIT 10;
```

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check browser console
4. Review server logs
5. Try in different browser
6. Test with minimal example

### Information to Provide

When reporting issues, include:
- Error message (full text)
- Browser and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Relevant code snippets
- Console/server logs

### Resources

- **Documentation**: All `.md` files in root
- **Examples**: `examples/` folder
- **Next.js Docs**: https://nextjs.org/docs
- **AI SDK Docs**: https://sdk.vercel.ai/docs
- **Drizzle Docs**: https://orm.drizzle.team/docs

## Still Having Issues?

1. Review all documentation files
2. Check example implementation
3. Compare with working example
4. Create minimal reproduction
5. Check GitHub issues (if applicable)

---

**Last Updated**: [Date]
