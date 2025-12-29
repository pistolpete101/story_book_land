# Database Setup Guide

## Current Implementation

Currently, stories are stored in **localStorage** (browser storage). This works for testing but has limitations:
- Data is lost if user clears browser data
- Not synced across devices
- Limited storage space

## Recommended: Supabase (Free Tier)

Supabase offers a free PostgreSQL database with:
- ✅ **500 MB database storage** (free tier)
- ✅ **2 GB bandwidth** per month
- ✅ **50,000 monthly active users**
- ✅ Real-time updates
- ✅ Row Level Security (RLS) for user data isolation

### Quick Setup

1. **Sign up at [supabase.com](https://supabase.com)** (free)

2. **Create a new project**:
   - Choose a name: "Story Book Land"
   - Set a database password (save it!)
   - Choose a region close to you

3. **Get your API keys**:
   - Go to Project Settings → API
   - Copy:
     - `Project URL` (e.g., `https://xxxxx.supabase.co`)
     - `anon public` key

4. **Add to `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. **Create the stories table**:
   - Go to SQL Editor in Supabase
   - Run this SQL:

   ```sql
   -- Create stories table
   CREATE TABLE stories (
     id TEXT PRIMARY KEY,
     user_id TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     genre TEXT,
     cover_image TEXT,
     pages JSONB,
     characters JSONB,
     settings JSONB,
     status TEXT NOT NULL,
     author TEXT NOT NULL,
     shared_with JSONB,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     published_at TIMESTAMPTZ
   );

   -- Create index for faster queries
   CREATE INDEX idx_stories_user_id ON stories(user_id);
   CREATE INDEX idx_stories_status ON stories(status);

   -- Enable Row Level Security
   ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

   -- Policy: Users can only see their own stories
   CREATE POLICY "Users can view own stories"
     ON stories FOR SELECT
     USING (auth.uid()::text = user_id);

   -- Policy: Users can insert their own stories
   CREATE POLICY "Users can insert own stories"
     ON stories FOR INSERT
     WITH CHECK (auth.uid()::text = user_id);

   -- Policy: Users can update their own stories
   CREATE POLICY "Users can update own stories"
     ON stories FOR UPDATE
     USING (auth.uid()::text = user_id);

   -- Policy: Users can delete their own stories
   CREATE POLICY "Users can delete own stories"
     ON stories FOR DELETE
     USING (auth.uid()::text = user_id);
   ```

6. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```

7. **Update `lib/db.ts`**:
   - Uncomment the Supabase code
   - Update `getUserStoriesDB` and `saveStoryDB` to use Supabase

## Alternative: Vercel Postgres

If you're deploying to Vercel, you can use Vercel Postgres (free tier):
- Integrated with Vercel
- Easy setup
- Free tier available

## Alternative: Firebase Firestore

Firebase offers:
- Free tier: 1 GB storage, 50K reads/day
- Real-time updates
- Easy integration

## Migration from localStorage

When you're ready to migrate:
1. Set up your chosen database
2. Update `lib/db.ts` to use the database
3. Create a migration script to move existing localStorage data
4. Update components to use the new database functions

## Current Status

✅ **Working**: localStorage storage (per user)
✅ **Ready**: Database integration code structure
⏳ **Next**: Choose and set up your database

