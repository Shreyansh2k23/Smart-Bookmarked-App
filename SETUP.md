# BookMark - Smart Bookmark Manager - Setup Guide

This is a complete bookmark management application built with Next.js 16, React 19, Tailwind CSS, and Supabase for authentication and data storage.

## Features

- **User Authentication**: Google OAuth and email/password authentication with Supabase
- **Bookmark Management**: Create, read, and delete bookmarks
- **Rich Metadata**: Save URLs with titles, descriptions, tags, and categories
- **Search & Filter**: Powerful search by title/URL/description and filter by category or tags
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful interface with smooth interactions

## Prerequisites

Before you start, ensure you have:
- Node.js 18+ installed
- A Supabase account (https://supabase.com)
- A Google OAuth application (for Google login)

## Setup Instructions

### 1. Supabase Configuration

#### Create a Supabase Project
1. Go to https://supabase.com and sign in or create an account
2. Create a new project
3. Copy your project URL and anon key from the settings

#### Create the Database Tables

In the Supabase SQL editor, run the following queries:

```sql
-- Create users table (managed by Supabase Auth)
-- This is automatically created by Supabase Auth

-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Create index for faster queries
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
```

#### Setup Google OAuth (Optional)

1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
6. Copy the Client ID and Secret
7. In Supabase, go to Authentication > Providers > Google
8. Paste the Client ID and Secret
9. Enable the provider

### 2. Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace:
- `your_supabase_url`: Your Supabase project URL
- `your_supabase_anon_key`: Your Supabase anon key (public key)

### 3. Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /auth/callback      - OAuth callback handler
  /dashboard          - Bookmarks management page
  /login              - Login/Sign up page
  /                   - Landing page
  layout.tsx          - Root layout with header
  globals.css         - Global styles and design tokens

/components
  /ui                 - Reusable UI components
  header.tsx          - Navigation header
  bookmark-card.tsx   - Bookmark display card
  bookmark-form.tsx   - Form to add/edit bookmarks

/lib
  types.ts            - TypeScript types
  supabase-client.ts  - Browser Supabase client
  supabase-server.ts  - Server Supabase client
  utils.ts            - Utility functions

/middleware.ts        - Route protection middleware
```

## Authentication Flow

1. **Landing Page**: Unauthenticated users see the home page with features overview
2. **Login Page**: Users can sign up with email/password or use Google OAuth
3. **Auth Callback**: After OAuth login, users are redirected to `/auth/callback` which exchanges the code for a session
4. **Dashboard**: Authenticated users can access `/dashboard` to manage bookmarks
5. **Protected Routes**: Middleware ensures only authenticated users can access protected routes

## API Routes

### Authentication
- `POST /auth/callback` - OAuth callback handler that exchanges code for session

### Bookmarks (All require authentication)
The app uses Supabase client directly from the browser with RLS policies ensuring security.

## Design System

The app uses a custom design system with:
- **Primary Color**: Blue (#0099FF)
- **Neutral Colors**: Light gray backgrounds with dark gray text
- **Spacing**: Tailwind's default spacing scale
- **Border Radius**: 0.75rem (12px)
- **Typography**: Geist font family from Next.js

## Security Features

- **Row Level Security (RLS)**: All bookmarks are protected with RLS policies
- **OAuth Integration**: Secure Google authentication via Supabase
- **Protected Routes**: Middleware enforces authentication on protected routes
- **Secure Cookies**: Session tokens stored in HTTP-only cookies
- **CSRF Protection**: Built-in protection from Supabase

## Performance Optimizations

- Server-side rendering for optimal SEO
- Client-side state management with React hooks
- Optimized database queries with indexes
- Responsive images and lazy loading
- CSS optimization with Tailwind

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Add environment variables in Vercel project settings
5. Deploy!

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- Hercel
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` file exists in the project root
- Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly

### OAuth redirects not working
- Check that your redirect URIs are correctly configured in Google Console
- Ensure Supabase Google provider is enabled
- Clear browser cookies and try again

### Bookmarks not loading
- Check that RLS policies are correctly created
- Verify the user is authenticated
- Check browser console for error messages
- Ensure the bookmarks table was created with the correct schema

### Login not working with email/password
- Verify email confirmation is disabled (or check your email)
- Check Supabase project settings
- Try using Google OAuth instead

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Code Quality
```bash
pnpm lint
```

## Future Enhancements

- Import/export bookmarks
- Bookmark collections
- Sharing bookmarks with other users
- Browser extension for quick saving
- Mobile app with React Native
- Analytics and statistics
- Advanced full-text search
- Custom folders and organization

## Support

For issues and questions:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review Next.js documentation: https://nextjs.org/docs
3. Open an issue on GitHub (if applicable)

## License

MIT License - feel free to use this project for personal or commercial purposes.
