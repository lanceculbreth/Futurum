import axios, { AxiosError, AxiosInstance } from 'axios'
import type { 
  AuthResponse, 
  User, 
  Conversation, 
  ChatResponse,
  SearchResponse,
  Document,
  PracticeArea,
  AdminStats,
  ContentType
} from '../types'

const API_BASE_URL = '/api/v1'

// Demo mode flag
const DEMO_MODE = true

// Demo data
const DEMO_PRACTICE_AREAS: PracticeArea[] = [
  { id: 1, name: 'AI Platforms', slug: 'ai-platforms', description: 'Artificial Intelligence and Machine Learning platforms' },
  { id: 2, name: 'Cybersecurity & Resilience', slug: 'cybersecurity', description: 'Security solutions and cyber resilience' },
  { id: 3, name: 'Data Intelligence, Analytics, & Infrastructure', slug: 'data-intelligence', description: 'Data platforms and analytics' },
  { id: 4, name: 'Digital Leadership & CIO', slug: 'digital-leadership', description: 'CIO strategy and digital leadership' },
  { id: 5, name: 'Ecosystems, Channels, & Marketplaces', slug: 'ecosystems', description: 'Partner ecosystems and cloud marketplaces' },
  { id: 6, name: 'Enterprise Software & Digital Workflows', slug: 'enterprise-software', description: 'Enterprise software solutions' },
  { id: 7, name: 'Intelligent Devices', slug: 'intelligent-devices', description: 'Smart devices and edge computing' },
  { id: 8, name: 'Semiconductors, Supply Chain, & Emerging Tech', slug: 'semiconductors', description: 'Chips and emerging technologies' },
  { id: 9, name: 'Software Lifecycle Engineering', slug: 'software-lifecycle', description: 'DevOps and software development' },
]

const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    email: 'nick.patience@ibm.com',
    company_name: 'IBM',
    is_admin: false,
    is_active: true,
    practice_areas: [DEMO_PRACTICE_AREAS[0], DEMO_PRACTICE_AREAS[1]],
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'user-2',
    email: 'sarah.chen@microsoft.com',
    company_name: 'Microsoft',
    is_admin: false,
    is_active: true,
    practice_areas: [DEMO_PRACTICE_AREAS[0], DEMO_PRACTICE_AREAS[5]],
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'user-3',
    email: 'admin@futurumgroup.com',
    company_name: 'Futurum Group',
    is_admin: true,
    is_active: true,
    practice_areas: DEMO_PRACTICE_AREAS,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
]

const DEMO_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Enterprise AI Platform Market Analysis 2026',
    content_type: 'research_report',
    description: 'Comprehensive analysis of the enterprise AI platform market, including vendor rankings and 6-12 month predictions.',
    author: 'Daniel Newman',
    practice_area_id: 1,
    file_name: null,
    file_size_bytes: null,
    source_url: null,
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    chunk_count: 12,
  },
  {
    id: 'doc-2',
    title: 'Agentic AI: From Hype to Implementation',
    content_type: 'whitepaper',
    description: 'A practical guide to implementing autonomous AI agents in enterprise environments.',
    author: 'Patrick Moorhead',
    practice_area_id: 1,
    file_name: null,
    file_size_bytes: null,
    source_url: null,
    published_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    chunk_count: 8,
  },
  {
    id: 'doc-3',
    title: 'Cybersecurity Landscape Q1 2026',
    content_type: 'market_data',
    description: 'Quarterly overview of the cybersecurity market including threat landscape and vendor performance.',
    author: 'Ron Westfall',
    practice_area_id: 2,
    file_name: null,
    file_size_bytes: null,
    source_url: null,
    published_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    chunk_count: 15,
  },
  {
    id: 'doc-4',
    title: 'Cloud GTM Strategy Playbook',
    content_type: 'whitepaper',
    description: 'Best practices for selling through AWS, Azure, and Google Cloud marketplaces.',
    author: 'Shelly Kramer',
    practice_area_id: 5,
    file_name: null,
    file_size_bytes: null,
    source_url: null,
    published_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    chunk_count: 10,
  },
]

const DEMO_STATS: AdminStats = {
  users: 47,
  documents: 523,
  vectors: 12847,
}

// Demo IBM News
export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  date: string
  url: string
}

const DEMO_IBM_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'IBM Announces Major watsonx AI Platform Updates',
    summary: 'IBM unveils significant enhancements to its watsonx enterprise AI platform, including new foundation models and improved governance capabilities.',
    source: 'Futurum Research',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    url: '#',
  },
  {
    id: 'news-2',
    title: 'IBM Cloud Expands Hybrid AI Infrastructure',
    summary: 'New IBM Cloud offerings enable enterprises to deploy AI workloads seamlessly across on-premises and cloud environments.',
    source: 'Futurum Research',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    url: '#',
  },
  {
    id: 'news-3',
    title: 'IBM Partners with SAP on Generative AI Integration',
    summary: 'Strategic partnership brings IBM watsonx capabilities directly into SAP enterprise workflows for enhanced automation.',
    source: 'Futurum Research',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    url: '#',
  },
  {
    id: 'news-4',
    title: 'IBM Consulting Launches AI Center of Excellence',
    summary: 'New CoE aims to accelerate enterprise AI adoption with dedicated teams and proven implementation methodologies.',
    source: 'Futurum Research',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    url: '#',
  },
  {
    id: 'news-5',
    title: 'IBM Research Advances Quantum-AI Integration',
    summary: 'Breakthrough research demonstrates potential for quantum computing to enhance machine learning model training.',
    source: 'Futurum Research',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    url: '#',
  },
]

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          
          const { access_token, refresh_token } = response.data
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        } catch {
          // Refresh failed, clear tokens
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: async (email: string, password: string, companyName?: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { 
      email, 
      password,
      company_name: companyName,
    })
    return response.data
  },
  
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },
}

// Chat API
export const chatApi = {
  sendMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    const response = await api.post('/chat/message', {
      message,
      conversation_id: conversationId,
    })
    return response.data
  },
  
  listConversations: async (limit = 20): Promise<{ conversations: Conversation[] }> => {
    const response = await api.get('/chat/conversations', { params: { limit } })
    return response.data
  },
  
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await api.get(`/chat/conversations/${conversationId}`)
    return response.data
  },
  
  createConversation: async (title?: string): Promise<Conversation> => {
    const response = await api.post('/chat/conversations', { title })
    return response.data
  },
  
  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/chat/conversations/${conversationId}`)
  },
}

// Search API
export const searchApi = {
  search: async (
    query: string, 
    practiceAreaIds?: number[],
    limit = 10
  ): Promise<SearchResponse> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 300))
      return {
        results: DEMO_DOCUMENTS.slice(0, limit).map((doc, idx) => ({
          document_id: doc.id,
          title: doc.title,
          content_preview: doc.description || '',
          practice_area: DEMO_PRACTICE_AREAS.find(p => p.id === doc.practice_area_id)?.name || 'Unknown',
          content_type: doc.content_type,
          similarity: 0.95 - (idx * 0.05),
          published_at: doc.published_at,
        })),
        query,
        total_results: DEMO_DOCUMENTS.length,
      }
    }
    const response = await api.post('/search/', {
      query,
      practice_area_ids: practiceAreaIds,
      limit,
    })
    return response.data
  },
  
  listDocuments: async (
    page = 1, 
    pageSize = 20,
    practiceAreaId?: number
  ): Promise<{ documents: Document[], total: number, page: number, page_size: number }> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      const filtered = practiceAreaId 
        ? DEMO_DOCUMENTS.filter(d => d.practice_area_id === practiceAreaId)
        : DEMO_DOCUMENTS
      return {
        documents: filtered,
        total: filtered.length,
        page,
        page_size: pageSize,
      }
    }
    const response = await api.get('/search/documents', {
      params: { page, page_size: pageSize, practice_area_id: practiceAreaId },
    })
    return response.data
  },
  
  getPracticeAreas: async (): Promise<PracticeArea[]> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 100))
      return DEMO_PRACTICE_AREAS
    }
    const response = await api.get('/search/practice-areas')
    return response.data
  },
}

// Admin API
export const adminApi = {
  listUsers: async (skip = 0, limit = 50): Promise<User[]> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      return DEMO_USERS
    }
    const response = await api.get('/admin/users', { params: { skip, limit } })
    return response.data
  },
  
  createUser: async (data: {
    email: string
    password: string
    company_name?: string
    is_admin?: boolean
    practice_area_ids?: number[]
  }): Promise<User> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 300))
      return {
        id: `user-${Date.now()}`,
        email: data.email,
        company_name: data.company_name || '',
        is_admin: data.is_admin || false,
        is_active: true,
        practice_areas: data.practice_area_ids?.map(id => DEMO_PRACTICE_AREAS.find(p => p.id === id)!).filter(Boolean) || [],
        created_at: new Date().toISOString(),
      }
    }
    const response = await api.post('/admin/users', data)
    return response.data
  },
  
  updateUser: async (userId: string, data: {
    company_name?: string
    is_admin?: boolean
    is_active?: boolean
  }): Promise<User> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      const user = DEMO_USERS.find(u => u.id === userId)
      return { ...user!, ...data }
    }
    const response = await api.patch(`/admin/users/${userId}`, data)
    return response.data
  },
  
  updateUserPracticeAreas: async (userId: string, practiceAreaIds: number[]): Promise<User> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      const user = DEMO_USERS.find(u => u.id === userId)
      return { 
        ...user!, 
        practice_areas: practiceAreaIds.map(id => DEMO_PRACTICE_AREAS.find(p => p.id === id)!).filter(Boolean)
      }
    }
    const response = await api.put(`/admin/users/${userId}/practice-areas`, {
      practice_area_ids: practiceAreaIds,
    })
    return response.data
  },
  
  deleteUser: async (userId: string): Promise<void> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      return
    }
    await api.delete(`/admin/users/${userId}`)
  },
  
  listPracticeAreas: async (): Promise<PracticeArea[]> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 100))
      return DEMO_PRACTICE_AREAS
    }
    const response = await api.get('/admin/practice-areas')
    return response.data
  },
  
  listDocuments: async (skip = 0, limit = 50, practiceAreaId?: number): Promise<Document[]> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      const filtered = practiceAreaId 
        ? DEMO_DOCUMENTS.filter(d => d.practice_area_id === practiceAreaId)
        : DEMO_DOCUMENTS
      return filtered
    }
    const response = await api.get('/admin/documents', {
      params: { skip, limit, practice_area_id: practiceAreaId },
    })
    return response.data
  },
  
  uploadTextDocument: async (data: {
    title: string
    content: string
    practice_area_id: number
    content_type?: string
    description?: string
    author?: string
    source_url?: string
  }): Promise<Document> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 500))
      return {
        id: `doc-${Date.now()}`,
        title: data.title,
        content_type: (data.content_type || 'article') as ContentType,
        description: data.description || null,
        author: data.author || null,
        practice_area_id: data.practice_area_id,
        file_name: null,
        file_size_bytes: null,
        source_url: data.source_url || null,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        chunk_count: 1,
      }
    }
    const response = await api.post('/admin/documents/text', data)
    return response.data
  },
  
  uploadFileDocument: async (formData: FormData): Promise<Document> => {
    const response = await api.post('/admin/documents/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  
  deleteDocument: async (documentId: string): Promise<void> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      return
    }
    await api.delete(`/admin/documents/${documentId}`)
  },
  
  getStats: async (): Promise<AdminStats> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      return DEMO_STATS
    }
    const response = await api.get('/admin/stats')
    return response.data
  },
}

// News API
export const newsApi = {
  getIBMNews: async (limit = 5): Promise<NewsItem[]> => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 200))
      return DEMO_IBM_NEWS.slice(0, limit)
    }
    const response = await api.get('/news/ibm', { params: { limit } })
    return response.data
  },
}

export default api
