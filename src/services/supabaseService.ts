import { supabase } from '../lib/supabase'

// Types for our database entities
export interface Organization {
  id: string
  name: string
  domain?: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  organization_id: string
  email: string
  name: string
  role: 'admin' | 'qc_reviewer' | 'rater' | 'manager'
  status: 'active' | 'inactive' | 'suspended' | 'flagged'
  avatar_url?: string
  preferences: Record<string, any>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  last_active_at?: string
}

export interface Project {
  id: string
  organization_id: string
  name: string
  description?: string
  type: 'rater' | 'qc' | 'hybrid'
  status: 'draft' | 'active' | 'paused' | 'archived'
  settings: Record<string, any>
  guidelines_version?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  workflow_id?: string
  external_id?: string
  title?: string
  content: string
  content_type: 'text' | 'image' | 'video' | 'audio' | 'document'
  metadata: Record<string, any>
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'flagged' | 'escalated'
  assigned_to?: string
  created_at: string
  updated_at: string
  due_at?: string
}

export interface Rating {
  id: string
  task_id: string
  rater_id: string
  workflow_step_id?: string
  rating_data: Record<string, any>
  confidence_score?: number
  time_spent_seconds?: number
  comments?: string
  metadata: Record<string, any>
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface QCReview {
  id: string
  rating_id: string
  qc_reviewer_id: string
  risk_score?: number
  disagreement_score?: number
  flag_reason?: string
  qc_rating_data?: Record<string, any>
  evidence?: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_review' | 'resolved' | 'escalated'
  resolution_notes?: string
  created_at: string
  updated_at: string
}

export interface KnowledgeBaseDocument {
  id: string
  organization_id: string
  name: string
  file_type: string
  file_size?: number
  file_url?: string
  content?: string
  version: string
  status: 'processing' | 'indexed' | 'error'
  tags?: string[]
  metadata: Record<string, any>
  chunks_count: number
  embeddings_count: number
  bookmarks_count: number
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface RaterPerformance {
  id: string
  user_id: string
  project_id: string
  date: string
  total_tasks: number
  completed_tasks: number
  accuracy_score?: number
  avg_time_per_task?: number
  ai_acceptance_rate?: number
  flags_count: number
  feedback_count: number
  risk_score?: number
  metadata: Record<string, any>
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  project_id?: string
  session_id: string
  message_type: 'user' | 'ai' | 'system'
  message: string
  confidence?: number
  sources?: string[]
  metadata: Record<string, any>
  created_at: string
}

// Comprehensive Supabase Service
export class SupabaseService {
  // =============================================
  // CONNECTION & UTILITY METHODS
  // =============================================

  static async testConnection() {
    try {
      const { data, error } = await supabase.from('organizations').select('id').limit(1)
      if (error) throw error
      return { success: true, message: 'Connection successful' }
    } catch (error) {
      return { success: false, message: `Connection failed: ${error}` }
    }
  }

  // =============================================
  // ORGANIZATION METHODS
  // =============================================

  static async getOrganizations() {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Organization[]
  }

  static async createOrganization(organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organization)
      .select()
      .single()
    
    if (error) throw error
    return data as Organization
  }

  // =============================================
  // USER METHODS
  // =============================================

  static async getUsers(organizationId?: string) {
    let query = supabase.from('users').select('*')
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as User[]
  }

  static async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as User
  }

  static async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  }

  static async getRaters(organizationId?: string) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'rater')
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as User[]
  }

  // =============================================
  // PROJECT METHODS
  // =============================================

  static async getProjects(organizationId?: string) {
    let query = supabase
      .from('projects')
      .select(`
        *,
        organization:organizations(name),
        created_by_user:users!created_by(name, email)
      `)
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as any[]
  }

  static async getProjectById(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        organization:organizations(name),
        created_by_user:users!created_by(name, email),
        project_members(
          role,
          user:users(id, name, email, role)
        )
      `)
      .eq('id', projectId)
      .single()
    
    if (error) throw error
    return data
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data as Project
  }

  static async updateProject(projectId: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data as Project
  }

  // =============================================
  // TASK METHODS
  // =============================================

  static async getTasks(projectId?: string, assignedTo?: string) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name),
        assigned_user:users!assigned_to(name, email),
        ratings(rating_data, confidence_score, status)
      `)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as any[]
  }

  static async getTaskById(taskId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name, type),
        assigned_user:users!assigned_to(name, email),
        ratings(
          *,
          rater:users!rater_id(name, email),
          qc_reviews(*)
        )
      `)
      .eq('id', taskId)
      .single()
    
    if (error) throw error
    return data
  }

  static async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data as Task
  }

  static async updateTask(taskId: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()
    
    if (error) throw error
    return data as Task
  }

  static async assignTask(taskId: string, userId: string) {
    return this.updateTask(taskId, { 
      assigned_to: userId, 
      status: 'assigned' 
    })
  }

  // =============================================
  // RATING METHODS
  // =============================================

  static async getRatings(taskId?: string, raterId?: string) {
    let query = supabase
      .from('ratings')
      .select(`
        *,
        task:tasks(title, content, project:projects(name)),
        rater:users!rater_id(name, email),
        qc_reviews(*)
      `)
    
    if (taskId) {
      query = query.eq('task_id', taskId)
    }
    
    if (raterId) {
      query = query.eq('rater_id', raterId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as any[]
  }

  static async createRating(rating: Omit<Rating, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('ratings')
      .insert(rating)
      .select()
      .single()
    
    if (error) throw error
    return data as Rating
  }

  static async updateRating(ratingId: string, updates: Partial<Rating>) {
    const { data, error } = await supabase
      .from('ratings')
      .update(updates)
      .eq('id', ratingId)
      .select()
      .single()
    
    if (error) throw error
    return data as Rating
  }

  // =============================================
  // QC REVIEW METHODS
  // =============================================

  static async getQCReviews(status?: string, priority?: string) {
    let query = supabase
      .from('qc_reviews')
      .select(`
        *,
        rating:ratings(
          *,
          task:tasks(title, content, project:projects(name)),
          rater:users!rater_id(name, email)
        ),
        qc_reviewer:users!qc_reviewer_id(name, email)
      `)
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as any[]
  }

  static async createQCReview(qcReview: Omit<QCReview, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('qc_reviews')
      .insert(qcReview)
      .select()
      .single()
    
    if (error) throw error
    return data as QCReview
  }

  static async updateQCReview(qcReviewId: string, updates: Partial<QCReview>) {
    const { data, error } = await supabase
      .from('qc_reviews')
      .update(updates)
      .eq('id', qcReviewId)
      .select()
      .single()
    
    if (error) throw error
    return data as QCReview
  }

  // =============================================
  // KNOWLEDGE BASE METHODS
  // =============================================

  static async getKnowledgeBaseDocuments(organizationId?: string) {
    let query = supabase
      .from('knowledge_base_documents')
      .select(`
        *,
        uploaded_by_user:users!uploaded_by(name, email)
      `)
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as any[]
  }

  static async createKnowledgeBaseDocument(doc: Omit<KnowledgeBaseDocument, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('knowledge_base_documents')
      .insert(doc)
      .select()
      .single()
    
    if (error) throw error
    return data as KnowledgeBaseDocument
  }

  // =============================================
  // PERFORMANCE METHODS
  // =============================================

  static async getRaterPerformance(userId?: string, projectId?: string, dateRange?: { start: string, end: string }) {
    let query = supabase
      .from('rater_performance')
      .select(`
        *,
        user:users!user_id(name, email),
        project:projects!project_id(name)
      `)
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    if (dateRange) {
      query = query
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
    }
    
    const { data, error } = await query.order('date', { ascending: false })
    
    if (error) throw error
    return data as any[]
  }

  static async updateRaterPerformance(performance: Omit<RaterPerformance, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('rater_performance')
      .upsert(performance, { onConflict: 'user_id,project_id,date' })
      .select()
      .single()
    
    if (error) throw error
    return data as RaterPerformance
  }

  // =============================================
  // CHAT METHODS
  // =============================================

  static async getChatMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as ChatMessage[]
  }

  static async createChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data as ChatMessage
  }

  // =============================================
  // ANALYTICS & DASHBOARD METHODS
  // =============================================

  static async getProjectStats(projectId: string) {
    const { data, error } = await supabase
      .rpc('get_project_stats', { project_id: projectId })
    
    if (error) throw error
    return data
  }

  static async getRaterStats(userId: string, projectId?: string) {
    const { data, error } = await supabase
      .rpc('get_rater_stats', { 
        user_id: userId,
        project_id: projectId 
      })
    
    if (error) throw error
    return data
  }

  static async getQCDashboardData() {
    const { data, error } = await supabase
      .rpc('get_qc_dashboard_data')
    
    if (error) throw error
    return data
  }

  // =============================================
  // SEARCH METHODS
  // =============================================

  static async searchKnowledgeBase(query: string, organizationId?: string) {
    let supabaseQuery = supabase
      .from('knowledge_base_documents')
      .select('*')
      .textSearch('content', query)
    
    if (organizationId) {
      supabaseQuery = supabaseQuery.eq('organization_id', organizationId)
    }
    
    const { data, error } = await supabaseQuery
    
    if (error) throw error
    return data
  }

  static async searchTasks(query: string, projectId?: string) {
    let supabaseQuery = supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    
    if (projectId) {
      supabaseQuery = supabaseQuery.eq('project_id', projectId)
    }
    
    const { data, error } = await supabaseQuery
    
    if (error) throw error
    return data
  }
}
