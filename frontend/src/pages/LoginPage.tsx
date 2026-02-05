import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      await login(email, password)
      navigate('/chat')
    } catch {
      // Error is handled by the store
    }
  }
  
  return (
    <div className="min-h-screen flex bg-futurum-bg">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-futurum-primary items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Futurum AI Insights</h1>
          <p className="text-white/80 text-lg mb-8">
            Real-time intelligence. Analyst-grounded. Action-ready.
          </p>
          <div className="space-y-4 text-white/70">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <p>Access real-time market intelligence across AI, cloud, and cybersecurity</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <p>Get predictive vendor analysis with 6-12 month outlooks</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <p>Human + Machine insights validated by expert analysts</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex w-12 h-12 bg-futurum-primary rounded-xl items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-xl font-semibold text-futurum-text">Futurum</h1>
          </div>
          
          <div className="bg-futurum-white rounded-xl border border-futurum-border shadow-card p-8">
            <h2 className="text-2xl font-semibold text-futurum-text mb-2">Welcome back</h2>
            <p className="text-futurum-textMuted mb-6">Sign in to access your insights</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-futurum-warningBg border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-futurum-text mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-futurum-white border border-futurum-border rounded-lg text-futurum-text placeholder-futurum-textDim focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary transition-colors"
                  placeholder="you@company.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-futurum-text mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-futurum-white border border-futurum-border rounded-lg text-futurum-text placeholder-futurum-textDim focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary transition-colors pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-futurum-textDim hover:text-futurum-textMuted transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-futurum-primary hover:bg-futurum-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
            
            <p className="text-center text-sm text-futurum-textMuted mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-futurum-primary hover:text-futurum-primaryHover font-medium transition-colors">
                Request access
              </Link>
            </p>
          </div>
          
          <p className="mt-8 text-center text-xs text-futurum-textDim">
            © 2026 The Futurum Group. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
