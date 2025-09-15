-- Sample Data for Rater Guide AI Database
-- This file contains sample data to populate the database for testing

-- =============================================
-- SAMPLE ORGANIZATIONS
-- =============================================

INSERT INTO organizations (id, name, domain, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'TechCorp AI', 'techcorp.ai', '{"timezone": "UTC", "features": ["ai_analysis", "qc_reviews", "knowledge_base"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'ContentMod Inc', 'contentmod.com', '{"timezone": "EST", "features": ["rating_platform", "workflow_builder"]}');

-- =============================================
-- SAMPLE USERS
-- =============================================

INSERT INTO users (id, organization_id, email, name, role, status, preferences, metadata) VALUES
-- TechCorp AI Users
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin@techcorp.ai', 'Sarah Admin', 'admin', 'active', '{"theme": "dark", "notifications": true}', '{"department": "Engineering", "level": "Senior"}'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'alex.chen@techcorp.ai', 'Alex Chen', 'rater', 'active', '{"theme": "light", "notifications": true}', '{"department": "Content", "level": "Mid", "specialization": "Product Reviews"}'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'maria.rodriguez@techcorp.ai', 'Maria Rodriguez', 'rater', 'active', '{"theme": "light", "notifications": false}', '{"department": "Content", "level": "Senior", "specialization": "Legal Documents"}'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'james.wilson@techcorp.ai', 'James Wilson', 'rater', 'flagged', '{"theme": "dark", "notifications": true}', '{"department": "Content", "level": "Junior", "specialization": "Content Moderation"}'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'sarah.kim@techcorp.ai', 'Sarah Kim', 'rater', 'active', '{"theme": "light", "notifications": true}', '{"department": "Content", "level": "Senior", "specialization": "Medical Imaging"}'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'qc.sarah@techcorp.ai', 'QC Sarah Johnson', 'qc_reviewer', 'active', '{"theme": "dark", "notifications": true}', '{"department": "Quality", "level": "Senior", "specialization": "Content Review"}'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'manager.mike@techcorp.ai', 'Mike Manager', 'manager', 'active', '{"theme": "light", "notifications": true}', '{"department": "Operations", "level": "Senior"}');

-- =============================================
-- SAMPLE PROJECTS
-- =============================================

INSERT INTO projects (id, organization_id, name, description, type, status, settings, guidelines_version, created_by) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rater PQ Grid Project', 'Content quality rating with grid-based evaluation system for raters', 'rater', 'active', '{"rating_scale": "1-5", "confidence_required": true, "ai_assistance": true}', 'v2.1', '650e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'QC Internal Flags Project', 'Internal quality control and flagging system for review processes', 'qc', 'active', '{"auto_flagging": true, "risk_threshold": 0.7, "escalation_enabled": true}', 'v3.0', '650e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Content Moderation Hub', 'Comprehensive content moderation with AI assistance', 'hybrid', 'active', '{"multi_language": true, "real_time_analysis": true}', 'v1.5', '650e8400-e29b-41d4-a716-446655440001');

-- =============================================
-- SAMPLE PROJECT MEMBERS
-- =============================================

INSERT INTO project_members (project_id, user_id, role) VALUES
-- Rater PQ Grid Project
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'rater'),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 'rater'),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005', 'rater'),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440006', 'qc_reviewer'),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440007', 'manager'),

-- QC Internal Flags Project
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440006', 'qc_reviewer'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440007', 'manager'),

-- Content Moderation Hub
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 'rater'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006', 'qc_reviewer'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007', 'manager');

-- =============================================
-- SAMPLE WORKFLOWS
-- =============================================

INSERT INTO workflows (id, project_id, name, description, type, status, configuration, created_by) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Standard Rating Workflow', 'Basic rating workflow for content quality assessment', 'rating', 'active', '{"steps": ["content_review", "rating_submission", "ai_analysis", "qc_review"], "auto_assign": true}', '650e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'QC Review Workflow', 'Quality control review process for flagged ratings', 'qc', 'active', '{"steps": ["flag_analysis", "qc_review", "feedback_generation"], "priority_based": true}', '650e8400-e29b-41d4-a716-446655440001');

-- =============================================
-- SAMPLE WORKFLOW STEPS
-- =============================================

INSERT INTO workflow_steps (workflow_id, name, type, order_index, configuration) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Content Review', 'rating', 1, '{"time_limit": 300, "guidelines_required": true}'),
('850e8400-e29b-41d4-a716-446655440001', 'Rating Submission', 'rating', 2, '{"confidence_required": true, "comments_optional": true}'),
('850e8400-e29b-41d4-a716-446655440001', 'AI Analysis', 'review', 3, '{"auto_trigger": true, "confidence_threshold": 0.8}'),
('850e8400-e29b-41d4-a716-446655440001', 'QC Review', 'review', 4, '{"conditional": true, "trigger_conditions": ["low_confidence", "ai_disagreement"]}'),

('850e8400-e29b-41d4-a716-446655440002', 'Flag Analysis', 'review', 1, '{"risk_assessment": true, "evidence_collection": true}'),
('850e8400-e29b-41d4-a716-446655440002', 'QC Review', 'review', 2, '{"detailed_analysis": true, "comparison_required": true}'),
('850e8400-e29b-41d4-a716-446655440002', 'Feedback Generation', 'notification', 3, '{"auto_generate": true, "template_based": true}');

-- =============================================
-- SAMPLE TASKS
-- =============================================

INSERT INTO tasks (id, project_id, workflow_id, external_id, title, content, content_type, metadata, priority, status, assigned_to, due_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'TSK_4567', 'Content Quality Assessment - Product Review', 'This product exceeded my expectations! The build quality is excellent and it arrived quickly. The packaging was professional and everything was well-protected. I''ve been using it for two weeks now and it performs exactly as advertised. Highly recommend to anyone looking for a reliable solution.', 'text', '{"source": "E-commerce Platform", "category": "Electronics Review", "language": "English", "submittedAt": "2024-01-15 14:30:22"}', 'medium', 'completed', '650e8400-e29b-41d4-a716-446655440002', NOW() + INTERVAL '1 day'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'TSK_4892', 'Product Review Rating Task', 'This is a terrible product. It broke after just one week of use. The customer service was unhelpful and refused to provide a refund. I would not recommend this to anyone.', 'text', '{"source": "E-commerce Platform", "category": "Electronics Review", "language": "English", "submittedAt": "2024-01-15 13:45:00"}', 'high', 'flagged', '650e8400-e29b-41d4-a716-446655440003', NOW() + INTERVAL '2 hours'),
('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', 'TSK_5123', 'Content Moderation Task', 'This is a social media post that needs moderation review for safety and appropriateness.', 'text', '{"source": "Social Media", "category": "User Generated Content", "language": "English", "submittedAt": "2024-01-15 12:10:00"}', 'high', 'pending', '650e8400-e29b-41d4-a716-446655440004', NOW() + INTERVAL '30 minutes');

-- =============================================
-- SAMPLE GUIDELINES
-- =============================================

INSERT INTO guidelines (id, project_id, name, version, content, type, category, tags, is_active, created_by) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Product Review Guidelines', 'v2.1', 'When rating product reviews, consider the following factors: 1. Relevance - Does the review address the actual product? 2. Specificity - Are there concrete details about features/performance? 3. Balance - Does it mention both pros and cons appropriately? 4. Authenticity - Does the language seem natural and genuine?', 'general', 'Product Reviews', ARRAY['product', 'review', 'authenticity'], true, '650e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'QC Flagging Rules', 'v3.0', 'Flag ratings when: 1. Significant discrepancy between rater and AI assessment (>2 points difference) 2. Rater confidence below 0.6 3. Completion time significantly below average 4. Pattern of inconsistent ratings detected', 'quality', 'QC Review', ARRAY['qc', 'flagging', 'quality'], true, '650e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Content Safety Guidelines', 'v1.5', 'Content should be flagged as unsafe if it contains: 1. Hate speech or discriminatory language 2. Violence or graphic content 3. Spam or misleading information 4. Personal information or doxxing', 'safety', 'Content Moderation', ARRAY['safety', 'moderation', 'content'], true, '650e8400-e29b-41d4-a716-446655440001');

-- =============================================
-- SAMPLE RATINGS
-- =============================================

INSERT INTO ratings (id, task_id, rater_id, rating_data, confidence_score, time_spent_seconds, comments, status) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '{"overall_quality": "excellent", "authenticity": "high", "helpfulness": 9, "specificity": "high", "balance": "good"}', 0.92, 180, 'Review provides specific details about build quality and packaging. Language is natural and balanced.', 'submitted'),
('b50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', '{"overall_quality": "excellent", "authenticity": "high", "helpfulness": 8, "specificity": "medium", "balance": "poor"}', 0.72, 240, 'Review is authentic but lacks specific details about the product failure.', 'submitted');

-- =============================================
-- SAMPLE QC REVIEWS
-- =============================================

INSERT INTO qc_reviews (id, rating_id, qc_reviewer_id, risk_score, disagreement_score, flag_reason, qc_rating_data, evidence, priority, status) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440006', 0.78, 2.4, 'Low accuracy on category classification - rater rated excellent for clearly negative review', '{"overall_quality": "poor", "authenticity": "medium", "helpfulness": 4, "specificity": "low", "balance": "poor"}', ARRAY['Guideline section 3.2.1', 'Similar case TSK_4321'], 'high', 'pending');

-- =============================================
-- SAMPLE KNOWLEDGE BASE DOCUMENTS
-- =============================================

INSERT INTO knowledge_base_documents (id, organization_id, name, file_type, file_size, content, version, status, tags, chunks_count, embeddings_count, bookmarks_count, uploaded_by) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Safety Policy Guidelines v2.1', 'PDF', 2516582, 'Comprehensive safety guidelines for content moderation including hate speech detection, violence assessment, and spam identification protocols.', '2.1', 'indexed', ARRAY['safety', 'moderation', 'policy'], 156, 156, 23, '650e8400-e29b-41d4-a716-446655440001'),
('d50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Content Classification Framework', 'HTML', 911360, 'Framework for classifying different types of content including text, images, and multimedia with specific criteria for each category.', '1.0', 'indexed', ARRAY['classification', 'framework'], 89, 89, 12, '650e8400-e29b-41d4-a716-446655440001');

-- =============================================
-- SAMPLE RATER PERFORMANCE
-- =============================================

INSERT INTO rater_performance (user_id, project_id, date, total_tasks, completed_tasks, accuracy_score, avg_time_per_task, ai_acceptance_rate, flags_count, feedback_count, risk_score) VALUES
('650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 50, 47, 89.2, 138, 67, 3, 2, 0.78),
('650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 50, 31, 96.8, 108, 89, 0, 1, 0.23),
('650e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, 20, 8, 91.5, 246, 34, 2, 4, 0.58),
('650e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 50, 27, 97.2, 114, 92, 0, 0, 0.15);

-- =============================================
-- SAMPLE AI ANALYSIS
-- =============================================

INSERT INTO ai_analysis (id, task_id, rating_id, analysis_type, suggestion, confidence, reasoning, sources, category, severity, action) VALUES
('e50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440002', 'rating_suggestion', 'High-priority review flagged by AI analysis', 0.94, 'Significant discrepancy detected between rater assessment and content analysis. Rater''s recent performance decline indicates need for intervention.', ARRAY['QC Flagging Rules v3.0', 'Rater Performance Data', 'Content Analysis Algorithm'], 'performance', 'high', 'provide feedback');

-- =============================================
-- SAMPLE CHAT MESSAGES
-- =============================================

INSERT INTO chat_messages (user_id, project_id, session_id, message_type, message, confidence, sources) VALUES
('650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'f50e8400-e29b-41d4-a716-446655440001', 'user', 'What should I focus on when rating this product review?', NULL, NULL),
('650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'f50e8400-e29b-41d4-a716-446655440001', 'ai', 'For product reviews, focus on these key areas:\n\n1. **Relevance** - Does the review address the actual product?\n2. **Specificity** - Are there concrete details about features/performance?\n3. **Balance** - Does it mention both pros and cons appropriately?\n4. **Authenticity** - Does the language seem natural and genuine?\n\nFor this review, I notice it''s positive and mentions specific aspects like ''build quality'' and ''packaging'' - good signs of authenticity.', 0.92, ARRAY['Product Review Guidelines v2.1', 'Authenticity Checklist']);

-- =============================================
-- SAMPLE UI COMPONENTS
-- =============================================

INSERT INTO ui_components (id, project_id, name, type, configuration, position, size, is_active, created_by) VALUES
('g50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Rating Card', 'card', '{"title": "Rate Content", "description": "Provide your rating below"}', '{"x": 50, "y": 50}', '{"width": 300, "height": 200}', true, '650e8400-e29b-41d4-a716-446655440001'),
('g50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Rating Stars', 'rating-stars', '{"maxRating": 5, "currentRating": 0}', '{"x": 80, "y": 120}', '{"width": 150, "height": 30}', true, '650e8400-e29b-41d4-a716-446655440001'),
('g50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 'Confidence Slider', 'confidence-slider', '{"min": 0, "max": 100, "value": 50, "label": "Confidence"}', '{"x": 80, "y": 170}', '{"width": 200, "height": 60}', true, '650e8400-e29b-41d4-a716-446655440001');

-- =============================================
-- SAMPLE UI TEMPLATES
-- =============================================

INSERT INTO ui_templates (id, project_id, name, description, template_type, components, is_preset, created_by) VALUES
('h50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Basic Rating Interface', 'Simple rating interface with stars and confidence slider', 'rater', '[{"type": "card", "name": "Rating Card", "props": {"title": "Rate Content", "description": "Provide your rating below"}, "position": {"x": 50, "y": 50}, "size": {"width": 300, "height": 200}}, {"type": "rating-stars", "name": "Rating Stars", "props": {"maxRating": 5, "currentRating": 0}, "position": {"x": 80, "y": 120}, "size": {"width": 150, "height": 30}}, {"type": "confidence-slider", "name": "Confidence Slider", "props": {"min": 0, "max": 100, "value": 50, "label": "Confidence"}, "position": {"x": 80, "y": 170}, "size": {"width": 200, "height": 60}}]', true, '650e8400-e29b-41d4-a716-446655440001');
