# Database Setup Guide for Rater Guide AI

This guide will help you set up the complete database backend for your Rater Guide AI application.

## 🏗️ Database Architecture Overview

The database is designed to support a comprehensive rating and quality control platform with the following core entities:

### **Core Tables:**
- **Organizations** - Multi-tenant support
- **Users** - Raters, QC reviewers, admins, managers
- **Projects** - Main containers for rating workflows
- **Tasks** - Individual content items to be rated
- **Ratings** - Actual rating submissions
- **QC Reviews** - Quality control assessments
- **Workflows** - Rating process definitions
- **Guidelines** - Rules and standards
- **Knowledge Base** - Documents and training materials
- **Performance Tracking** - Rater metrics and analytics

## 📋 Setup Steps

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key
3. Update your `.env` file with these credentials

### 2. **Run Database Schema**
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/schema.sql`
4. Execute the script to create all tables, indexes, and triggers

### 3. **Load Sample Data (Optional)**
1. In the SQL Editor, copy and paste the contents of `database/sample_data.sql`
2. Execute the script to populate with sample data for testing

### 4. **Configure Row Level Security**
The schema includes basic RLS policies, but you should customize them based on your security requirements:

```sql
-- Example: Update policies for your specific needs
CREATE POLICY "Users can view own organization data" ON organizations
    FOR ALL USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Add more specific policies as needed
```

### 5. **Set Up Vector Extensions (For AI Features)**
If you plan to use AI-powered document search:

```sql
-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create index for document chunks
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);
```

## 🔧 Database Functions (Optional)

Create these functions in Supabase for advanced analytics:

```sql
-- Function to get project statistics
CREATE OR REPLACE FUNCTION get_project_stats(project_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_tasks', COUNT(*),
        'completed_tasks', COUNT(*) FILTER (WHERE status = 'completed'),
        'pending_tasks', COUNT(*) FILTER (WHERE status = 'pending'),
        'flagged_tasks', COUNT(*) FILTER (WHERE status = 'flagged'),
        'avg_accuracy', AVG(rp.accuracy_score),
        'total_raters', COUNT(DISTINCT pm.user_id) FILTER (WHERE pm.role = 'rater')
    ) INTO result
    FROM tasks t
    LEFT JOIN project_members pm ON t.project_id = pm.project_id
    LEFT JOIN rater_performance rp ON pm.user_id = rp.user_id AND t.project_id = rp.project_id
    WHERE t.project_id = $1;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get QC dashboard data
CREATE OR REPLACE FUNCTION get_qc_dashboard_data()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'pending_reviews', COUNT(*) FILTER (WHERE status = 'pending'),
        'in_review', COUNT(*) FILTER (WHERE status = 'in_review'),
        'high_priority', COUNT(*) FILTER (WHERE priority = 'high'),
        'avg_risk_score', AVG(risk_score)
    ) INTO result
    FROM qc_reviews;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Data Relationships

### **Key Relationships:**
1. **Organizations** → **Users** → **Projects** (Multi-tenant hierarchy)
2. **Projects** → **Tasks** → **Ratings** → **QC Reviews** (Main workflow)
3. **Users** → **Rater Performance** (Analytics tracking)
4. **Knowledge Base** → **Document Chunks** (AI retrieval)
5. **Chat Messages** (AI assistant conversations)

### **Data Flow:**
```
Task Creation → Assignment → Rating → AI Analysis → QC Review → Feedback
```

## 🔍 Testing Your Setup

### 1. **Test Connection**
Use the SupabaseTest component in your app to verify the connection.

### 2. **Test Basic Operations**
```typescript
import { SupabaseService } from './services/supabaseService'

// Test getting projects
const projects = await SupabaseService.getProjects()

// Test getting users
const users = await SupabaseService.getUsers()

// Test creating a task
const newTask = await SupabaseService.createTask({
  project_id: 'your-project-id',
  content: 'Test content for rating',
  content_type: 'text',
  priority: 'medium',
  status: 'pending'
})
```

### 3. **Verify Sample Data**
Check that sample data was loaded correctly:
- 2 Organizations
- 7 Users (mix of roles)
- 3 Projects
- 3 Tasks
- 2 Ratings
- 1 QC Review
- 2 Knowledge Base Documents

## 🚀 Production Considerations

### **Security:**
1. **Enable RLS** on all tables
2. **Customize policies** for your specific needs
3. **Use service role key** for server-side operations
4. **Implement proper authentication** with Supabase Auth

### **Performance:**
1. **Monitor query performance** using Supabase dashboard
2. **Add indexes** for frequently queried columns
3. **Use connection pooling** for high-traffic applications
4. **Consider read replicas** for analytics queries

### **Backup:**
1. **Enable automatic backups** in Supabase
2. **Export schema** regularly
3. **Test restore procedures**

## 🔧 Customization

### **Adding New Fields:**
```sql
-- Example: Add new field to tasks table
ALTER TABLE tasks ADD COLUMN custom_field VARCHAR(255);

-- Update the TypeScript interface in supabaseService.ts
```

### **Adding New Tables:**
```sql
-- Example: Add notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📚 Next Steps

1. **Integrate with your app** using the SupabaseService
2. **Set up authentication** with Supabase Auth
3. **Implement real-time features** with Supabase subscriptions
4. **Add AI features** using the knowledge base and embeddings
5. **Set up monitoring** and analytics

## 🆘 Troubleshooting

### **Common Issues:**

1. **Connection Errors:**
   - Verify your `.env` file has correct credentials
   - Check that your Supabase project is active
   - Ensure RLS policies allow your operations

2. **Permission Errors:**
   - Review and update RLS policies
   - Check user roles and permissions
   - Verify organization membership

3. **Performance Issues:**
   - Add appropriate indexes
   - Optimize queries with proper joins
   - Consider pagination for large datasets

### **Getting Help:**
- Check Supabase documentation
- Review the sample data structure
- Test with the provided sample data first
- Use the Supabase dashboard to inspect data

Your database is now ready to power your Rater Guide AI application! 🎉
