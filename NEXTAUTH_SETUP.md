# NextAuth.js Setup Guide

## What is NextAuth.js?

NextAuth.js (now called Auth.js) is a complete authentication solution for Next.js applications. It's:
- ✅ **Free and open-source**
- ✅ **Works perfectly with Vercel**
- ✅ **Email/password authentication**
- ✅ **Secure session management**
- ✅ **Easy to integrate**

## Quick Setup

### Step 1: Add Environment Variables

Create a `.env.local` file in your project root:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string

# Test Mode (optional - for development without authentication)
NEXT_PUBLIC_TEST_MODE=false
```

### Step 2: Generate a Secret Key

Generate a random secret for `NEXTAUTH_SECRET`:

**Option 1: Using OpenSSL**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/32

### Step 3: Update Your `.env.local`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=paste-your-generated-secret-here
NEXT_PUBLIC_TEST_MODE=false
```

### Step 4: Deploy to Vercel

When deploying to Vercel, add these environment variables in your Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET` = your generated secret
   - `NEXT_PUBLIC_TEST_MODE` = `false` (or remove it)

## Current Implementation

The app currently uses **Credentials Provider** which accepts any email/password combination. This is fine for testing, but you'll want to:

### TODO: Add Database Authentication

1. **Install a database** (e.g., PostgreSQL, MongoDB, or Prisma)
2. **Update the authorize function** in `app/api/auth/[...nextauth]/route.ts` to:
   - Check if user exists in database
   - Verify password hash
   - Create new users on sign-up

### Example with Prisma (Future Enhancement)

```typescript
// app/api/auth/[...nextauth]/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
  
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
```

## Test Mode

To test the app without authentication, set:

```env
NEXT_PUBLIC_TEST_MODE=true
```

This will:
- Skip authentication checks
- Create a mock test user
- Allow full access to all features

## Sign In / Sign Up

- **Sign In**: `/sign-in`
- **Sign Up**: `/sign-up`

Both pages are now custom-built (not using Clerk components) and work with NextAuth.js.

## Security Notes

1. **Never commit `.env.local`** to git (it's already in `.gitignore`)
2. **Use strong secrets** for production
3. **Enable HTTPS** in production (Vercel does this automatically)
4. **Add rate limiting** for login attempts (future enhancement)
5. **Implement password hashing** when adding database authentication

## Troubleshooting

### "Invalid credentials" error
- Make sure `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your current URL
- Clear browser cookies and try again

### Session not persisting
- Verify `NEXTAUTH_SECRET` is set correctly
- Check that cookies are enabled in your browser
- Ensure you're using HTTPS in production

### Redirect loops
- Check middleware configuration
- Verify public routes are correctly defined
- Check that `NEXTAUTH_URL` matches your deployment URL

## Next Steps

1. ✅ NextAuth.js is installed and configured
2. ✅ Sign-in and sign-up pages are created
3. ✅ Middleware protects routes
4. ⏳ Add database for user storage (recommended)
5. ⏳ Add password hashing (required for production)
6. ⏳ Add email verification (optional)
7. ⏳ Add password reset functionality (optional)

