# Test Mode Guide

## Enable Test Mode

To test the app without authentication, add this to your `.env.local` file:

```env
NEXT_PUBLIC_TEST_MODE=true
```

Then restart your dev server:

```bash
npm run dev
```

## What Test Mode Does

- ✅ **Bypasses authentication** - No need to sign up/login
- ✅ **Creates a test user** automatically
- ✅ **Allows full app testing** - All features work normally
- ✅ **Stories are saved** - Uses localStorage with test user ID

## Disable Test Mode

To use real authentication, either:
1. Remove `NEXT_PUBLIC_TEST_MODE=true` from `.env.local`, or
2. Set it to `false`: `NEXT_PUBLIC_TEST_MODE=false`

Then restart your dev server.

## Features Available in Test Mode

- ✅ Create stories
- ✅ View your library (user-specific)
- ✅ Share stories with parents
- ✅ Complete onboarding
- ✅ All dashboard features

## User-Specific Stories

Each user's stories are stored separately using their user ID:
- Test user: `stories_test-user-123`
- Real users: `stories_[clerk-user-id]`

This ensures users only see their own stories!

## Parent Invitation

1. Go to "My Library"
2. Click the share button (📤) on any story
3. Add parent name and email
4. Send invitation

Parents will be able to read the shared stories (feature ready for backend integration).

