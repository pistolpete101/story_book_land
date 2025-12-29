# Deployment Guide for Story Book Land

## Quick Start - Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (free tier works great)

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including:
   - `tailwindcss-animate` for shadcn/ui animations
   - `class-variance-authority` for component variants
   - `@radix-ui/react-slot` for shadcn/ui components

2. **Build Locally (Optional - to test)**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **That's it!** Your app will be live in ~2 minutes

## Tablet/iPad Optimizations Included

✅ **Touch-Friendly Targets**: All interactive elements are minimum 44px (Apple's recommended size)

✅ **Responsive Breakpoints**: 
   - `tablet`: 768px (iPad portrait)
   - `tablet-lg`: 1024px (iPad landscape)
   - `desktop`: 1280px

✅ **Safe Area Support**: Handles notched devices properly

✅ **Font Size Optimization**: Prevents iOS zoom on input focus (16px minimum)

✅ **Touch Manipulation**: Optimized touch interactions with proper CSS

## shadcn/ui Setup

The project is configured with shadcn/ui. To add more components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
```

Components will be added to `components/ui/` directory.

## Configuration Files

- `components.json`: shadcn/ui configuration
- `vercel.json`: Vercel deployment settings
- `tailwind.config.js`: Tailwind with shadcn/ui theme
- `app/globals.css`: Global styles with CSS variables

## Environment Variables (if needed)

If you need environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add your variables
3. Redeploy

## Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. SSL is automatically configured

## Troubleshooting

**Build fails?**
- Make sure all dependencies are installed: `npm install`
- Check that `tailwindcss-animate` is in package.json

**Styles not working?**
- Verify `tailwind.config.js` includes all content paths
- Check that `app/globals.css` has the CSS variables

**Touch targets too small on tablet?**
- All buttons should have `min-h-[44px]` class
- Use `touch-manipulation` CSS property (already included)

## Next Steps

After deployment:
1. Test on an actual iPad/tablet device
2. Add more shadcn/ui components as needed
3. Customize colors in `tailwind.config.js`
4. Add analytics if needed (Vercel Analytics available)

