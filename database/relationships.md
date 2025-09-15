# Database Relationships Diagram

## Core Entity Relationships

```
Organizations (1) ──→ (N) Users
Organizations (1) ──→ (N) Projects
Organizations (1) ──→ (N) Knowledge Base Documents

Projects (1) ──→ (N) Project Members
Projects (1) ──→ (N) Workflows
Projects (1) ──→ (N) Tasks
Projects (1) ──→ (N) Guidelines
Projects (1) ──→ (N) UI Components
Projects (1) ──→ (N) UI Templates

Users (1) ──→ (N) Project Members
Users (1) ──→ (N) Tasks (assigned_to)
Users (1) ──→ (N) Ratings
Users (1) ──→ (N) QC Reviews
Users (1) ──→ (N) Feedback (from_user_id)
Users (1) ──→ (N) Feedback (to_user_id)
Users (1) ──→ (N) Rater Performance
Users (1) ──→ (N) Chat Messages

Workflows (1) ──→ (N) Workflow Steps
Workflows (1) ──→ (N) Tasks

Tasks (1) ──→ (N) Ratings
Tasks (1) ──→ (N) AI Analysis

Ratings (1) ──→ (N) QC Reviews
Ratings (1) ──→ (N) Feedback
Ratings (1) ──→ (N) AI Analysis

Knowledge Base Documents (1) ──→ (N) Document Chunks

QC Reviews (1) ──→ (N) Feedback
```

## Key Relationships Explained

### 1. **Organizations → Users → Projects**
- Organizations contain multiple users
- Users can be members of multiple projects
- Projects belong to one organization

### 2. **Projects → Workflows → Tasks → Ratings**
- Projects define workflows for rating processes
- Workflows contain multiple steps
- Tasks are assigned to users and follow workflows
- Ratings are submitted for tasks

### 3. **Quality Control Flow**
- Ratings can trigger QC Reviews
- QC Reviews can generate Feedback
- Feedback is sent between users

### 4. **Knowledge Base Integration**
- Documents are chunked for AI retrieval
- Chunks have embeddings for similarity search
- Used by AI analysis and chat features

### 5. **Performance Tracking**
- Rater Performance tracks daily metrics
- AI Analysis provides suggestions and insights
- Chat Messages store AI assistant conversations

## Data Flow Patterns

### Rating Workflow:
1. **Task Creation** → Project → Workflow → Assigned to User
2. **Rating Submission** → User submits rating for task
3. **AI Analysis** → System analyzes rating and content
4. **QC Review** → If flagged, QC reviewer assesses
5. **Feedback** → If needed, feedback sent to rater

### Knowledge Base Usage:
1. **Document Upload** → Knowledge Base Document
2. **Chunking** → Document Chunks with embeddings
3. **AI Retrieval** → Used in AI Analysis and Chat
4. **Guideline Reference** → Referenced in ratings and QC

### Performance Monitoring:
1. **Daily Metrics** → Rater Performance table
2. **Risk Assessment** → Based on accuracy, speed, flags
3. **Trend Analysis** → Historical performance data
4. **Intervention** → Feedback and training based on patterns
