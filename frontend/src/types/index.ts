// User types
export interface PracticeArea {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface User {
  id: string
  email: string
  company_name: string | null
  is_admin: boolean
  is_active: boolean
  created_at: string
  practice_areas: PracticeArea[]
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// Chat types
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  citations: string[]
  created_at: string
}

export interface Conversation {
  id: string
  title: string | null
  created_at: string
  updated_at: string
  messages: Message[]
}

export interface SourceCitation {
  document_id: string | null
  title: string
  practice_area: string
  content_type: string
  content_preview: string
  similarity: number
}

export interface ChatResponse {
  response: string
  conversation_id: string
  sources: SourceCitation[]
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

// Document types
export type ContentType = 
  | 'research_report'
  | 'article'
  | 'market_data'
  | 'video_transcript'
  | 'podcast_transcript'
  | 'whitepaper'
  | 'case_study'

export interface Document {
  id: string
  title: string
  description: string | null
  content_type: ContentType
  practice_area_id: number
  file_name: string | null
  file_size_bytes: number | null
  source_url: string | null
  author: string | null
  published_at: string | null
  created_at: string
  chunk_count: number
}

// Search types
export interface SearchResult {
  document_id: string
  title: string
  content_preview: string
  practice_area: string
  content_type: string
  similarity: number
  published_at: string | null
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  total_results: number
}

// Admin stats
export interface AdminStats {
  users: number
  documents: number
  vectors: number
}
