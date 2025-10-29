# 🔄 Switching to Widget Mode

This guide helps you switch from the original template to the simplified widget version.

## Quick Switch

### Option 1: Use Widget Alongside Original (Recommended)

Keep both versions running side-by-side:

**Original App**: `http://localhost:3000/` (with auth)  
**Widget**: `http://localhost:3000/widget` (no auth)

No changes needed! Just:
```bash
pnpm widget:setup  # Setup widget database
pnpm dev           # Run both
```

### Option 2: Widget Only

If you only want the widget:

1. **Use widget config**:
   ```bash
   # Rename configs
   mv next.config.ts next.config.original.ts
   mv next.config.simple.ts next.config.ts
   
   mv drizzle.config.ts drizzle.config.original.ts
   mv drizzle.config.simple.ts drizzle.config.ts
   ```

2. **Setup database**:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

3. **Update imports** (if needed):
   - Change imports from `schema.ts` to `schema.simple.ts`
   - Change imports from `queries.ts` to `queries.simple.ts`

4. **Run**:
   ```bash
   pnpm dev
   ```

## File Organization

### Keep Both Versions

```
lib/db/
  schema.ts              # Original schema (with auth)
  schema.simple.ts       # Widget schema (no auth)
  queries.ts             # Original queries
  queries.simple.ts      # Widget queries
  migrate.ts             # Original migration
  migrate.simple.ts      # Widget migration

next.config.ts           # Original config
next.config.simple.ts    # Widget config

drizzle.config.ts        # Original drizzle config
drizzle.config.simple.ts # Widget drizzle config
```

### Widget Only

```
lib/db/
  schema.ts              # Widget schema (renamed from simple)
  queries.ts             # Widget queries (renamed from simple)
  migrate.ts             # Widget migration (renamed from simple)

next.config.ts           # Widget config (renamed from simple)
drizzle.config.ts        # Widget drizzle config (renamed from simple)
```

## Database Setup

### Separate Databases (Recommended)

Use different databases for original and widget:

```env
# .env.local
POSTGRES_URL=postgresql://user:pass@host:5432/original_db
POSTGRES_URL_WIDGET=postgresql://user:pass@host:5432/widget_db
```

Then update `drizzle.config.simple.ts`:
```typescript
dbCredentials: {
  url: process.env.POSTGRES_URL_WIDGET!,
}
```

### Same Database

Both can share one database (tables won't conflict):

```env
# .env.local
POSTGRES_URL=postgresql://user:pass@host:5432/shared_db
```

Original tables:
- User
- Chat (with userId)
- Message
- Vote
- Document
- Suggestion
- Stream

Widget tables:
- Chat (with sessionId) - Different structure!
- Message - Different structure!
- SurveyResponse

**Note**: Chat and Message tables have different schemas, so you'll need to use different table names or separate databases.

## Recommended Approach

### For Development

**Use both side-by-side** with separate databases:

```env
# .env.local
POSTGRES_URL=postgresql://user:pass@host:5432/dev_original
POSTGRES_URL_WIDGET=postgresql://user:pass@host:5432/dev_widget
```

Routes:
- `/` - Original app (with auth)
- `/widget` - Widget (no auth)

### For Production

**Deploy separately**:

1. **Original App**: `app.example.com`
   - Full features
   - Authentication
   - User management

2. **Widget**: `widget.example.com`
   - Embeddable
   - No auth
   - Survey focused

## Migration Script

If you want to migrate from original to widget:

```typescript
// scripts/migrate-to-widget.ts
import { db as originalDb } from "@/lib/db/queries";
import { db as widgetDb } from "@/lib/db/queries.simple";

async function migrateToWidget() {
  // Get all chats from original
  const chats = await originalDb.select().from(chat);
  
  // Convert to widget format
  for (const originalChat of chats) {
    await widgetDb.insert(chat).values({
      id: originalChat.id,
      sessionId: originalChat.userId, // Use userId as sessionId
      title: originalChat.title,
      createdAt: originalChat.createdAt,
    });
  }
  
  // Migrate messages similarly...
}
```

## Package.json Scripts

Add these for easy switching:

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "dev:widget": "next dev --turbo -p 3001",
    
    "db:generate": "drizzle-kit generate",
    "db:migrate": "npx tsx lib/db/migrate.ts",
    
    "widget:generate": "drizzle-kit generate --config=drizzle.config.simple.ts",
    "widget:migrate": "npx tsx lib/db/migrate.simple.ts",
    "widget:setup": "pnpm widget:generate && pnpm widget:migrate",
    
    "build": "tsx lib/db/migrate && next build",
    "build:widget": "tsx lib/db/migrate.simple && next build"
  }
}
```

## Environment Variables

### Both Versions

```env
# .env.local

# Original app
POSTGRES_URL=postgresql://user:pass@host:5432/original
AUTH_SECRET=your-secret-here
OPENAI_API_KEY=sk-...

# Widget (if using separate DB)
POSTGRES_URL_WIDGET=postgresql://user:pass@host:5432/widget
```

### Widget Only

```env
# .env.local
POSTGRES_URL=postgresql://user:pass@host:5432/widget
OPENAI_API_KEY=sk-...
```

## Deployment

### Deploy Both

**Vercel** (2 projects):
1. Original: `vercel --prod`
2. Widget: `vercel --prod` (separate project)

### Deploy Widget Only

**Vercel** (1 project):
```bash
# Use widget configs
mv next.config.simple.ts next.config.ts
vercel --prod
```

## Cleanup (Widget Only)

If you only want the widget, you can remove:

```bash
# Remove original app files
rm -rf app/(auth)
rm -rf app/(chat)
rm middleware.ts

# Remove complex components
rm components/artifact*.tsx
rm components/document*.tsx
rm components/sidebar*.tsx
rm components/auth-form.tsx
rm components/model-selector.tsx

# Remove original DB files (keep .simple versions)
rm lib/db/schema.ts
rm lib/db/queries.ts
rm lib/db/migrate.ts

# Then rename .simple files
mv lib/db/schema.simple.ts lib/db/schema.ts
mv lib/db/queries.simple.ts lib/db/queries.ts
mv lib/db/migrate.simple.ts lib/db/migrate.ts
```

**Warning**: Only do this if you're sure you won't need the original features!

## Testing

### Test Both Versions

```bash
# Terminal 1: Original app
pnpm dev

# Terminal 2: Widget on different port
pnpm dev:widget

# Test
# Original: http://localhost:3000
# Widget: http://localhost:3001/widget
```

### Test Widget Only

```bash
pnpm dev
# Visit: http://localhost:3000/widget
```

## Troubleshooting

### "Table already exists"

**Problem**: Trying to create tables that already exist

**Solution**: Use separate databases or different table names

### "Cannot find module"

**Problem**: Import paths wrong after renaming

**Solution**: Update all imports to match new file names

### "Auth required"

**Problem**: Middleware blocking widget

**Solution**: Ensure middleware doesn't apply to `/widget` route

## Recommendations

1. **Development**: Keep both versions, separate databases
2. **Production**: Deploy as separate apps
3. **Testing**: Test widget embedding on actual site
4. **Maintenance**: Keep original as reference

## Questions?

- **Setup**: See [SETUP_WIDGET.md](SETUP_WIDGET.md)
- **Configuration**: See [WIDGET_CONFIG.md](WIDGET_CONFIG.md)
- **Issues**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Recommended**: Keep both versions and use `/widget` route for the simplified chatbot!
