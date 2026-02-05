import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { authApi } from '../services/api'

// Demo mode flag - set to true for UI preview without backend
const DEMO_MODE = true

// Demo user for preview
const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'john@futurum.com',
  company_name: 'IBM',
  is_admin: true,
  is_active: true,
  practice_areas: [
    { id: 1, name: 'AI Platforms', slug: 'ai-platforms', description: 'Artificial Intelligence and Machine Learning platforms' },
    { id: 2, name: 'Cybersecurity & Resilience', slug: 'cybersecurity', description: 'Security solutions and cyber resilience' },
  ],
  created_at: new Date().toISOString(),
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, companyName?: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        // Demo mode - skip API call
        if (DEMO_MODE) {
          await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
          set({ 
            user: { ...DEMO_USER, email }, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return
        }
        
        try {
          const response = await authApi.login(email, password)
          
          // Store tokens
          localStorage.setItem('access_token', response.tokens.access_token)
          localStorage.setItem('refresh_token', response.tokens.refresh_token)
          
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },
      
      register: async (email: string, password: string, companyName?: string) => {
        set({ isLoading: true, error: null })
        
        // Demo mode - skip API call
        if (DEMO_MODE) {
          await new Promise(resolve => setTimeout(resolve, 500))
          set({ 
            user: { ...DEMO_USER, email, company_name: companyName || 'Demo Company' }, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return
        }
        
        try {
          const response = await authApi.register(email, password, companyName)
          
          // Store tokens
          localStorage.setItem('access_token', response.tokens.access_token)
          localStorage.setItem('refresh_token', response.tokens.refresh_token)
          
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Registration failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
      },
      
      refreshUser: async () => {
        // Demo mode - keep user authenticated
        if (DEMO_MODE) {
          return
        }
        
        try {
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
