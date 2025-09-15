-- Rater Guide AI Database Schema
-- This schema supports the complete Rater Guide AI platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- CORE TABLES
-- =============================================

-- Organizations/Companies
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Raters, QC Reviewers, Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'qc_reviewer', 'rater', 'manager')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'flagged')),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE
);

-- Projects (Main containers for rating workflows)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('rater', 'qc', 'hybrid')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    settings JSONB DEFAULT '{}',
    guidelines_version VARCHAR(50),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Members (Users assigned to projects)
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('rater', 'qc_reviewer', 'manager', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Workflows (Rating process definitions)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('rating', 'qc', 'approval', 'escalation')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    configuration JSONB NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Steps (Individual steps in a workflow)
CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('rating', 'review', 'approval', 'escalation', 'notification')),
    order_index INTEGER NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}',
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks (Individual content items to be rated)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
    external_id VARCHAR(255), -- External system task ID
    title VARCHAR(500),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'video', 'audio', 'document')),
    metadata JSONB DEFAULT '{}',
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'flagged', 'escalated')),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_at TIMESTAMP WITH TIME ZONE
);

-- Guidelines (Rules and standards for rating)
CREATE TABLE guidelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'safety', 'quality', 'classification', 'specific')),
    category VARCHAR(100),
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings (Actual rating submissions)
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    rater_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workflow_step_id UUID REFERENCES workflow_steps(id) ON DELETE SET NULL,
    rating_data JSONB NOT NULL, -- Flexible rating structure
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    time_spent_seconds INTEGER,
    comments TEXT,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QC Reviews (Quality control assessments)
CREATE TABLE qc_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating_id UUID REFERENCES ratings(id) ON DELETE CASCADE,
    qc_reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_score DECIMAL(3,2) CHECK (risk_score >= 0 AND risk_score <= 1),
    disagreement_score DECIMAL(4,2),
    flag_reason TEXT,
    qc_rating_data JSONB, -- QC's alternative rating
    evidence TEXT[],
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'escalated')),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Documents
CREATE TABLE knowledge_base_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    file_url TEXT,
    content TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'indexed', 'error')),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    chunks_count INTEGER DEFAULT 0,
    embeddings_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Chunks (For AI retrieval)
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES knowledge_base_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- For AI similarity search
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UI Components (Custom interface elements)
CREATE TABLE ui_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('card', 'rating-stars', 'confidence-slider', 'checklist', 'ai-suggestion', 'button', 'input')),
    configuration JSONB NOT NULL DEFAULT '{}',
    position JSONB, -- {x, y} coordinates
    size JSONB, -- {width, height}
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UI Templates (Predefined component layouts)
CREATE TABLE ui_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('rater', 'qc', 'hybrid')),
    components JSONB NOT NULL DEFAULT '[]',
    is_preset BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback (Communication between QC and raters)
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating_id UUID REFERENCES ratings(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('guideline_clarification', 'accuracy_improvement', 'speed_concern', 'pattern_issue', 'general')),
    message TEXT NOT NULL,
    action_required VARCHAR(50) CHECK (action_required IN ('feedback_only', 'retrain', 'temporary_review', 'escalate')),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'acknowledged', 'resolved')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rater Performance Metrics
CREATE TABLE rater_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    accuracy_score DECIMAL(5,2),
    avg_time_per_task INTEGER, -- in seconds
    ai_acceptance_rate DECIMAL(5,2),
    flags_count INTEGER DEFAULT 0,
    feedback_count INTEGER DEFAULT 0,
    risk_score DECIMAL(3,2) CHECK (risk_score >= 0 AND risk_score <= 1),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id, date)
);

-- AI Analysis Results
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    rating_id UUID REFERENCES ratings(id) ON DELETE SET NULL,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('content_analysis', 'rating_suggestion', 'quality_check', 'pattern_analysis')),
    suggestion TEXT,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    reasoning TEXT,
    sources TEXT[],
    category VARCHAR(100),
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    action VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages (AI Assistant conversations)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    session_id UUID NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('user', 'ai', 'system')),
    message TEXT NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    sources TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);

-- Projects indexes
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);

-- Tasks indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Ratings indexes
CREATE INDEX idx_ratings_task_id ON ratings(task_id);
CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
CREATE INDEX idx_ratings_created_at ON ratings(created_at);

-- QC Reviews indexes
CREATE INDEX idx_qc_reviews_rating_id ON qc_reviews(rating_id);
CREATE INDEX idx_qc_reviews_qc_reviewer_id ON qc_reviews(qc_reviewer_id);
CREATE INDEX idx_qc_reviews_status ON qc_reviews(status);
CREATE INDEX idx_qc_reviews_priority ON qc_reviews(priority);

-- Knowledge Base indexes
CREATE INDEX idx_kb_docs_organization_id ON knowledge_base_documents(organization_id);
CREATE INDEX idx_kb_docs_status ON knowledge_base_documents(status);
CREATE INDEX idx_kb_docs_tags ON knowledge_base_documents USING GIN(tags);

-- Document Chunks indexes
CREATE INDEX idx_doc_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_doc_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- Performance indexes
CREATE INDEX idx_rater_performance_user_id ON rater_performance(user_id);
CREATE INDEX idx_rater_performance_project_id ON rater_performance(project_id);
CREATE INDEX idx_rater_performance_date ON rater_performance(date);

-- Chat Messages indexes
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guidelines_updated_at BEFORE UPDATE ON guidelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qc_reviews_updated_at BEFORE UPDATE ON qc_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kb_docs_updated_at BEFORE UPDATE ON knowledge_base_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ui_components_updated_at BEFORE UPDATE ON ui_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ui_templates_updated_at BEFORE UPDATE ON ui_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE qc_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE rater_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SAMPLE DATA POLICIES (Customize as needed)
-- =============================================

-- Example: Users can only see their own organization's data
CREATE POLICY "Users can view own organization data" ON organizations
    FOR ALL USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own organization users" ON users
    FOR ALL USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Example: Project members can view project data
CREATE POLICY "Project members can view projects" ON projects
    FOR ALL USING (
        id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Example: Raters can view their assigned tasks
CREATE POLICY "Users can view assigned tasks" ON tasks
    FOR ALL USING (assigned_to = auth.uid());

-- Example: Users can view their own ratings
CREATE POLICY "Users can view own ratings" ON ratings
    FOR ALL USING (rater_id = auth.uid());

-- Note: You'll need to customize these policies based on your specific security requirements
-- and implement proper authentication with Supabase Auth.
