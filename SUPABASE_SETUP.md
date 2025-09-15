# Supabase Setup Guide

This guide will help you connect your Rater Guide AI app to a Supabase remote instance.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your app in the browser
3. You should see a "Supabase Connection Test" card on the homepage
4. Click "Test Connection" to verify everything is working

## Step 4: Set Up Your Database Schema

Once connected, you can start creating tables in your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Create tables as needed for your application

### Example Table Structure

For a rater guide application, you might want tables like:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guidelines table
CREATE TABLE guidelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  guideline_id UUID REFERENCES guidelines(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 5: Enable Row Level Security (RLS)

For production apps, enable RLS on your tables:

```sql
-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on your needs)
CREATE POLICY "Users can view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Users can delete projects" ON projects FOR DELETE USING (true);
```

## Step 6: Using Supabase in Your Components

The app includes a `SupabaseService` class with common database operations:

```typescript
import { SupabaseService } from '../services/supabaseService'

// Get all projects
const projects = await SupabaseService.getAllRecords('projects')

// Insert a new project
const newProject = await SupabaseService.insertRecord('projects', {
  name: 'My Project',
  description: 'Project description'
})

// Update a project
const updatedProject = await SupabaseService.updateRecord('projects', projectId, {
  name: 'Updated Project Name'
})

// Delete a project
await SupabaseService.deleteRecord('projects', projectId)
```

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure your anon key has the correct permissions

### Database Errors
- Make sure your tables exist in Supabase
- Check RLS policies if you're getting permission errors
- Verify your table names match what you're using in code

### Environment Variables Not Loading
- Restart your development server after updating `.env`
- Make sure your environment variables start with `VITE_`
- Check that the `.env` file is in your project root

## Next Steps

1. Create your database schema
2. Set up authentication if needed
3. Implement your app's specific features
4. Deploy to production

For more information, visit the [Supabase documentation](https://supabase.com/docs).
