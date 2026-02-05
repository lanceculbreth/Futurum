import { useState, useEffect, FormEvent } from 'react'
import { 
  Users, FileText, BarChart3, Plus, Trash2, 
  Loader2, Check, Upload, Tag, Calendar, TrendingUp
} from 'lucide-react'
import { adminApi } from '../services/api'
import type { User, Document, PracticeArea, AdminStats, ContentType } from '../types'
import clsx from 'clsx'

const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'article', label: 'Article' },
  { value: 'research_report', label: 'Research Report' },
  { value: 'market_data', label: 'Market Data' },
  { value: 'video_transcript', label: 'Video Transcript' },
  { value: 'podcast_transcript', label: 'Podcast Transcript' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'case_study', label: 'Case Study' },
]

function StatsCard({ title, value, icon: Icon, trend }: { title: string; value: number | string; icon: React.ElementType; trend?: string }) {
  return (
    <div className="bg-futurum-white border border-futurum-border rounded-xl p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-futurum-textMuted mb-1">{title}</p>
          <p className="text-2xl font-semibold text-futurum-text">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 bg-futurum-primaryLight rounded-lg flex items-center justify-center">
          <Icon size={20} className="text-futurum-primary" />
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'documents'>('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)
  const [showPAModal, setShowPAModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    company_name: '',
    is_admin: false,
    practice_area_ids: [] as number[],
  })
  
  const [docForm, setDocForm] = useState({
    title: '',
    content: '',
    practice_area_id: 0,
    content_type: 'article' as ContentType,
    description: '',
    author: '',
    source_url: '',
  })
  
  useEffect(() => {
    loadData()
  }, [activeTab])
  
  const loadData = async () => {
    setIsLoading(true)
    try {
      const pas = await adminApi.listPracticeAreas()
      setPracticeAreas(pas)
      
      if (activeTab === 'overview' || !stats) {
        const statsData = await adminApi.getStats()
        setStats(statsData)
      }
      
      if (activeTab === 'users') {
        const usersData = await adminApi.listUsers()
        setUsers(usersData)
      }
      
      if (activeTab === 'documents') {
        const docsData = await adminApi.listDocuments()
        setDocuments(docsData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await adminApi.createUser(userForm)
      setShowUserModal(false)
      setUserForm({ email: '', password: '', company_name: '', is_admin: false, practice_area_ids: [] })
      loadData()
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return
    try {
      await adminApi.deleteUser(userId)
      loadData()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
  
  const handleToggleAdmin = async (user: User) => {
    try {
      await adminApi.updateUser(user.id, { is_admin: !user.is_admin })
      loadData()
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }
  
  const handleUpdatePracticeAreas = async (userId: string, paIds: number[]) => {
    try {
      await adminApi.updateUserPracticeAreas(userId, paIds)
      loadData()
      setShowPAModal(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Failed to update practice areas:', error)
    }
  }
  
  const handleCreateDocument = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await adminApi.uploadTextDocument(docForm)
      setShowDocModal(false)
      setDocForm({ title: '', content: '', practice_area_id: 0, content_type: 'article', description: '', author: '', source_url: '' })
      loadData()
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }
  
  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Delete this document?')) return
    try {
      await adminApi.deleteDocument(docId)
      loadData()
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-futurum-bg">
      {/* Header */}
      <div className="bg-futurum-white border-b border-futurum-border px-6 py-4">
        <h1 className="text-lg font-semibold text-futurum-text mb-4">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'documents', label: 'Documents', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={clsx(
                "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === tab.id
                  ? "bg-futurum-primary text-white"
                  : "text-futurum-textMuted hover:bg-futurum-bg"
              )}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-futurum-primary" />
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <StatsCard title="Total Users" value={stats.users} icon={Users} trend="+12% this month" />
                  <StatsCard title="Documents" value={stats.documents} icon={FileText} trend="+8 this week" />
                  <StatsCard title="Embeddings" value={stats.vectors.toLocaleString()} icon={BarChart3} />
                  <StatsCard title="Practice Areas" value={practiceAreas.length} icon={Tag} />
                </div>
                
                <div className="bg-futurum-white border border-futurum-border rounded-xl p-6 shadow-card">
                  <h2 className="text-base font-semibold text-futurum-text mb-4">Practice Areas</h2>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {practiceAreas.map((pa) => (
                      <div 
                        key={pa.id}
                        className="p-4 bg-futurum-bg border border-futurum-border rounded-lg"
                      >
                        <h3 className="text-sm font-medium text-futurum-text">{pa.name}</h3>
                        <p className="text-xs text-futurum-textMuted mt-1 line-clamp-2">{pa.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Users */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-futurum-textMuted">{users.length} users</p>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-futurum-primary hover:bg-futurum-primaryHover text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add User</span>
                  </button>
                </div>
                
                <div className="bg-futurum-white border border-futurum-border rounded-xl shadow-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-futurum-bg border-b border-futurum-border">
                      <tr>
                        <th className="text-left text-xs font-medium text-futurum-textDim uppercase px-4 py-3">Email</th>
                        <th className="text-left text-xs font-medium text-futurum-textDim uppercase px-4 py-3">Company</th>
                        <th className="text-left text-xs font-medium text-futurum-textDim uppercase px-4 py-3">Practice Areas</th>
                        <th className="text-left text-xs font-medium text-futurum-textDim uppercase px-4 py-3">Status</th>
                        <th className="text-right text-xs font-medium text-futurum-textDim uppercase px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-futurum-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-futurum-bg/50">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-futurum-text">{user.email}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-futurum-textMuted">{user.company_name || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-wrap gap-1">
                                {user.practice_areas.slice(0, 2).map((pa) => (
                                  <span key={pa.id} className="text-xs bg-futurum-primaryLight text-futurum-primary px-2 py-0.5 rounded-full">
                                    {pa.name}
                                  </span>
                                ))}
                                {user.practice_areas.length > 2 && (
                                  <span className="text-xs text-futurum-textDim">+{user.practice_areas.length - 2}</span>
                                )}
                              </div>
                              <button
                                onClick={() => { setEditingUser(user); setShowPAModal(true) }}
                                className="p-1 text-futurum-textDim hover:text-futurum-primary rounded transition-colors"
                              >
                                <Tag size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleAdmin(user)}
                              className={clsx(
                                "px-2.5 py-1 text-xs font-medium rounded-full",
                                user.is_admin 
                                  ? "bg-futurum-successBg text-green-700" 
                                  : "bg-futurum-bg text-futurum-textMuted"
                              )}
                            >
                              {user.is_admin ? 'Admin' : 'Customer'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1.5 text-futurum-textDim hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-futurum-textMuted">{documents.length} documents</p>
                  <button
                    onClick={() => setShowDocModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-futurum-primary hover:bg-futurum-primaryHover text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Upload size={16} />
                    <span>Upload Content</span>
                  </button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-futurum-white border border-futurum-border rounded-xl p-4 shadow-card hover:shadow-cardHover transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 min-w-0">
                          <div className="w-10 h-10 bg-futurum-primaryLight rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-futurum-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-futurum-text truncate">{doc.title}</p>
                            <p className="text-xs text-futurum-textDim mt-0.5">
                              {doc.content_type.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 text-futurum-textDim hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-futurum-border text-xs text-futurum-textDim">
                        <span>{doc.author || 'Unknown author'}</span>
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-futurum-white rounded-xl border border-futurum-border shadow-lg p-6 w-full max-w-md m-4">
            <h2 className="text-lg font-semibold text-futurum-text mb-4">Create User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-1">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-1">Company</label>
                <input
                  type="text"
                  value={userForm.company_name}
                  onChange={(e) => setUserForm({ ...userForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userForm.is_admin}
                  onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.checked })}
                  className="rounded border-futurum-border text-futurum-primary focus:ring-futurum-primary"
                />
                <span className="text-sm text-futurum-textMuted">Admin user</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-2">Practice Areas</label>
                <div className="flex flex-wrap gap-2">
                  {practiceAreas.map((pa) => (
                    <button
                      key={pa.id}
                      type="button"
                      onClick={() => {
                        const ids = userForm.practice_area_ids.includes(pa.id)
                          ? userForm.practice_area_ids.filter(id => id !== pa.id)
                          : [...userForm.practice_area_ids, pa.id]
                        setUserForm({ ...userForm, practice_area_ids: ids })
                      }}
                      className={clsx(
                        "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                        userForm.practice_area_ids.includes(pa.id)
                          ? "bg-futurum-primary text-white"
                          : "bg-futurum-bg text-futurum-textMuted hover:bg-futurum-bgAlt"
                      )}
                    >
                      {pa.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-sm text-futurum-textMuted hover:text-futurum-text">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm bg-futurum-primary hover:bg-futurum-primaryHover text-white rounded-lg">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showPAModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-futurum-white rounded-xl border border-futurum-border shadow-lg p-6 w-full max-w-md m-4">
            <h2 className="text-lg font-semibold text-futurum-text mb-1">Assign Practice Areas</h2>
            <p className="text-sm text-futurum-textMuted mb-4">{editingUser.email}</p>
            <div className="space-y-2 mb-6">
              {practiceAreas.map((pa) => {
                const isSelected = editingUser.practice_areas.some(p => p.id === pa.id)
                return (
                  <button
                    key={pa.id}
                    onClick={() => {
                      const currentIds = editingUser.practice_areas.map(p => p.id)
                      const newIds = isSelected ? currentIds.filter(id => id !== pa.id) : [...currentIds, pa.id]
                      setEditingUser({ ...editingUser, practice_areas: practiceAreas.filter(p => newIds.includes(p.id)) })
                    }}
                    className={clsx(
                      "w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center justify-between border",
                      isSelected 
                        ? "bg-futurum-primaryLight border-futurum-primary text-futurum-text" 
                        : "bg-futurum-white border-futurum-border text-futurum-textMuted hover:border-futurum-borderDark"
                    )}
                  >
                    <span>{pa.name}</span>
                    {isSelected && <Check size={16} className="text-futurum-primary" />}
                  </button>
                )
              })}
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setShowPAModal(false); setEditingUser(null) }} className="px-4 py-2 text-sm text-futurum-textMuted">
                Cancel
              </button>
              <button onClick={() => handleUpdatePracticeAreas(editingUser.id, editingUser.practice_areas.map(p => p.id))} className="px-4 py-2 text-sm bg-futurum-primary text-white rounded-lg">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto py-8">
          <div className="bg-futurum-white rounded-xl border border-futurum-border shadow-lg p-6 w-full max-w-xl m-4">
            <h2 className="text-lg font-semibold text-futurum-text mb-4">Upload Content</h2>
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-1">Title</label>
                <input
                  type="text"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-futurum-text mb-1">Practice Area</label>
                  <select
                    value={docForm.practice_area_id}
                    onChange={(e) => setDocForm({ ...docForm, practice_area_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                    required
                  >
                    <option value={0}>Select...</option>
                    {practiceAreas.map((pa) => (
                      <option key={pa.id} value={pa.id}>{pa.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-futurum-text mb-1">Content Type</label>
                  <select
                    value={docForm.content_type}
                    onChange={(e) => setDocForm({ ...docForm, content_type: e.target.value as ContentType })}
                    className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                  >
                    {CONTENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-1">Author</label>
                <input
                  type="text"
                  value={docForm.author}
                  onChange={(e) => setDocForm({ ...docForm, author: e.target.value })}
                  className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-futurum-text mb-1">Content</label>
                <textarea
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-futurum-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary resize-none"
                  placeholder="Paste analyst research, market analysis, vendor evaluations..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 text-sm text-futurum-textMuted">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm bg-futurum-primary hover:bg-futurum-primaryHover text-white rounded-lg">
                  Upload Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
