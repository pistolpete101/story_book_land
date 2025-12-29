# Story Book Land 📚

A fun and interactive web application for kids to create, read, and share their own magical stories. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. **Optimized for tablets (iPad) and desktops** with secure email/password authentication.

## ⚠️ Device Requirements

**This app is optimized for tablets and desktops, not mobile phones.**

- ✅ **Tablets (iPad recommended)**: Perfect experience
- ✅ **Desktop/Laptop**: Full-featured experience  
- ⚠️ **Mobile phones**: Not recommended - you'll see a warning message

The app will display a banner on mobile devices recommending tablet or desktop use for the best experience.

## ✨ Features

### 🏁 User Flow
**Sign Up/Login** → **Onboarding** → **Dashboard** → **My Library (Hub)**

From **My Library**, users can choose:
- 📖 **Read Books** → **Reading Experience** → Back to Library
- ✍️ **Story Builder** → **Genre** → **Character** → **Story** → **Enhancements** → **Preview & Publish** → **Preview Pages** → Back to Library

### 🎯 Core Features

- **🔒 Secure Authentication**: Email/password login powered by NextAuth.js (free and open-source)
- **Interactive Onboarding**: Personalized setup with age-appropriate content
- **Story Builder**: Complete story creation flow with genre selection, character creation, and page writing
- **Reading Experience**: Immersive book reading with customizable settings
- **Library Management**: Organize and manage your story collection
- **Achievements System**: Unlock rewards and track progress
- **Settings & Preferences**: Customize your experience

### 🎨 Design Features

- **Tablet-Optimized**: Specifically designed for iPad and tablet devices
- **Touch-Friendly**: Large touch targets (minimum 44px) for easy interaction
- **Responsive Design**: Works seamlessly on tablet and desktop
- **Fun Animations**: Engaging micro-interactions and transitions with Framer Motion
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Modern UI**: Clean, colorful interface designed for kids using shadcn/ui components
- **Safe Area Support**: Proper handling of notched devices and safe areas

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- NextAuth.js (already installed) - see [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd story-book-land
```

2. Install dependencies:
```bash
npm install
```

3. Set up NextAuth.js Authentication:
   - Follow the guide in [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md)
   - Create a `.env.local` file with your NextAuth keys:
     ```env
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-generated-secret-key
     ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🔐 Authentication

This app uses [NextAuth.js](https://next-auth.js.org) for secure authentication:

- **Free Tier**: 10,000 Monthly Active Users (MAU)
- **Features**: Email/password authentication, secure sessions, user management
- **Setup**: See [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md) for detailed instructions

### Quick Setup:
1. NextAuth.js is already installed (no sign-up needed - it's free and open-source)
2. Create an application
3. Copy your API keys to `.env.local`
4. Done! 🎉

## 🏗️ Project Structure

```
story-book-land/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with shadcn/ui variables
│   ├── layout.tsx         # Root layout with NextAuth SessionProvider
│   ├── page.tsx           # Home page (protected)
│   ├── sign-in/           # Sign in page
│   └── sign-up/           # Sign up page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   │   └── button.tsx     # Button component
│   ├── MobileWarning.tsx  # Mobile device warning
│   ├── DeviceRecommendation.tsx  # Tablet/desktop recommendation
│   ├── OnboardingView.tsx
│   ├── DashboardView.tsx
│   ├── MyLibraryView.tsx
│   ├── BookReadingView.tsx
│   ├── AchievementsView.tsx
│   ├── SettingsView.tsx
│   └── StoryBuilder/      # Story builder components
├── lib/                   # Utility functions
│   └── utils.ts           # shadcn/ui utility functions (cn)
├── types/                 # TypeScript type definitions
├── middleware.ts          # NextAuth authentication middleware
├── components.json       # shadcn/ui configuration
├── vercel.json           # Vercel deployment configuration
└── package.json          # Dependencies and scripts
```

## 🎮 Usage

### Creating an Account

1. Visit the app and click "Sign Up"
2. Enter your email and create a password
3. Complete the onboarding process
4. Start creating stories!

### Creating a Story

1. **Onboarding**: Complete the initial setup with your name, age, and favorite genres
2. **Dashboard**: Access the story builder from the main dashboard
3. **Genre Selection**: Choose from 8 different story genres
4. **Character Creation**: Design unique characters with personalities and appearances
5. **Story Writing**: Create pages with text, images, and settings
6. **Enhancements**: Add music, animations, and interactive elements
7. **Preview & Publish**: Review and share your completed story

### Reading Stories

1. **Library**: Browse your collection of stories
2. **Reading Mode**: Enjoy immersive reading with customizable settings
3. **Progress Tracking**: Keep track of your reading progress
4. **Achievements**: Unlock rewards for reading milestones

## 🛠️ Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **NextAuth.js**: Authentication and user management (free and open-source)
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Radix UI**: Accessible component primitives

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#dd54ff to #cc32e6)
- **Secondary**: Blue gradient (#0ea5e9 to #0284c7)
- **Accent**: Orange gradient (#f97316 to #ea580c)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text
- **Body**: Clean, readable text

### Responsive Breakpoints
- **Tablet**: 768px (iPad portrait)
- **Tablet Large**: 1024px (iPad landscape)
- **Desktop**: 1280px

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment. Follow these steps:

1. **Set up NextAuth.js** (see [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md))

2. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXTAUTH_URL`
     - `NEXTAUTH_SECRET`
   - Vercel will automatically detect Next.js and configure the build
   - Click "Deploy"

4. **Verify Environment Variables**:
   - Ensure `NEXTAUTH_URL` matches your Vercel deployment URL
   - Ensure `NEXTAUTH_SECRET` is set (generate a secure random string)
   - Add your Vercel domain (e.g., `https://your-app.vercel.app`)

5. **That's it!** Your app will be live in ~2 minutes

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Real-time collaboration on stories
- [ ] Voice recording for stories
- [ ] AI-powered story suggestions
- [ ] Social features and sharing
- [ ] Offline reading support
- [ ] Multi-language support

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for young storytellers everywhere!
