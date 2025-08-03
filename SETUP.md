# PlantCare Pro - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

#### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Example:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Database Setup
✅ **Tables are already created by Supabase!**

Now you need to run the additional migration to add security and sample data:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250102000001_add_missing_components.sql`
4. Run the migration

This will add:
- Row Level Security (RLS) policies
- Performance indexes
- User profile creation trigger
- Sample data for categories and products

### 3. Start Development Server
```bash
npm run dev
```

## 📋 Database Schema

The application includes the following tables (already created by Supabase):

### Core Tables
- **profiles** - User profiles (extends auth.users)
- **plants** - User's plants
- **care_schedules** - Plant care schedules
- **care_logs** - Care activity logs

### Content Tables
- **video_categories** - Video categories
- **videos** - Learning videos
- **product_categories** - Product categories
- **products** - Marketplace products

### Communication Tables
- **experts** - Plant care experts
- **chat_conversations** - Expert chat conversations
- **chat_messages** - Chat messages
- **bot_automations** - WhatsApp bot automations
- **bot_conversations** - Bot conversations
- **bot_messages** - Bot messages

### E-commerce Tables
- **orders** - User orders
- **order_items** - Order line items

## 🔐 Authentication Features

- ✅ Email/password authentication
- ✅ Automatic profile creation on signup
- ✅ Row Level Security (RLS) policies
- ✅ Password reset functionality
- ✅ Session management

## 🛡️ Security Features

- Row Level Security enabled on all user tables
- Users can only access their own data
- Automatic profile creation with trigger
- Secure password handling

## 📱 Features

- **Dashboard** - Plant overview and health monitoring
- **Plant Calendar** - Care schedule management
- **Learning Videos** - Educational content
- **Marketplace** - Plant care products
- **Expert Chat** - Connect with plant experts
- **WhatsApp Bot** - Automated plant care assistance

## 🎨 UI/UX

- Modern, responsive design with Tailwind CSS
- Mobile-first approach
- Beautiful plant-themed color scheme
- Intuitive navigation with sidebar

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 🔧 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check environment variables are set correctly
   - Ensure Supabase project is active
   - Verify RLS policies are applied (run the migration)

2. **Database connection errors**
   - Check Supabase URL and key
   - Ensure the additional migration has been run
   - Verify table permissions

3. **Build errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript errors with `npm run lint`

4. **RLS Policy Errors**
   - Make sure you've run the `20250102000001_add_missing_components.sql` migration
   - Check that all tables have RLS enabled
   - Verify policies are correctly applied

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check the application logs in browser console 