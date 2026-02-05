import { useState, useEffect, FormEvent } from 'react'
import { Search, FileText, Loader2, Calendar, User, FolderOpen, X, Download, Filter } from 'lucide-react'
import { searchApi } from '../services/api'
import type { SearchResult, PracticeArea, Document } from '../types'
import clsx from 'clsx'

const CONTENT_TYPE_LABELS: Record<string, string> = {
  research_report: 'Research Report',
  article: 'Article',
  market_data: 'Market Data',
  video_transcript: 'Video Transcript',
  podcast_transcript: 'Podcast Transcript',
  whitepaper: 'Whitepaper',
  case_study: 'Case Study',
}

// Document Preview Panel
function DocumentPreview({ 
  doc, 
  onClose 
}: { 
  doc: Document | SearchResult
  onClose: () => void 
}) {
  const isSearchResult = 'similarity' in doc
  
  return (
    <div className="w-[480px] border-l border-futurum-border bg-futurum-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-futurum-border">
        <div className="flex items-center space-x-2 min-w-0">
          <FileText size={16} className="text-futurum-primary flex-shrink-0" />
          <span className="text-sm font-medium text-futurum-text truncate">
            {'title' in doc ? doc.title : 'Document'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-futurum-bg rounded transition-colors">
            <Download size={16} className="text-futurum-textMuted" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-futurum-bg rounded transition-colors"
          >
            <X size={16} className="text-futurum-textMuted" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="inline-flex items-center px-2.5 py-1 bg-futurum-primaryLight text-futurum-primary text-xs font-medium rounded-full mb-4">
          {isSearchResult ? doc.practice_area : 'Document'}
        </div>
        
        <h1 className="text-xl font-semibold text-futurum-text mb-2">
          {'title' in doc ? doc.title : 'Untitled'}
        </h1>
        
        <div className="flex items-center space-x-3 text-sm text-futurum-textMuted mb-6">
          <span>{CONTENT_TYPE_LABELS[doc.content_type] || doc.content_type}</span>
          {isSearchResult && (
            <>
              <span>•</span>
              <span className="text-futurum-primary font-medium">{Math.round(doc.similarity * 100)}% match</span>
            </>
          )}
        </div>
        
        <div className="p-4 bg-futurum-bg rounded-lg border border-futurum-border">
          <p className="text-sm text-futurum-text leading-relaxed">
            {isSearchResult ? doc.content_preview : (doc as Document).description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([])
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDocs, setIsLoadingDocs] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'browse'>('search')
  const [selectedItem, setSelectedItem] = useState<SearchResult | Document | null>(null)
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const pas = await searchApi.getPracticeAreas()
        setPracticeAreas(pas)
        
        setIsLoadingDocs(true)
        const docsResponse = await searchApi.listDocuments(1, 20)
        setDocuments(docsResponse.documents)
        setIsLoadingDocs(false)
      } catch (error) {
        console.error('Failed to load initial data:', error)
        setIsLoadingDocs(false)
      }
    }
    
    loadInitialData()
  }, [])
  
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    setSelectedItem(null)
    
    try {
      const response = await searchApi.search(
        query,
        selectedPracticeArea ? [selectedPracticeArea] : undefined,
        20
      )
      setResults(response.results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }
  
  const handlePracticeAreaChange = async (paId: number | null) => {
    setSelectedPracticeArea(paId)
    
    setIsLoadingDocs(true)
    try {
      const docsResponse = await searchApi.listDocuments(1, 20, paId || undefined)
      setDocuments(docsResponse.documents)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setIsLoadingDocs(false)
    }
  }
  
  return (
    <div className="h-full flex bg-futurum-bg">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-futurum-white border-b border-futurum-border px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-futurum-text">Research Library</h1>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-futurum-textMuted hover:bg-futurum-bg rounded-lg transition-colors">
                <Filter size={14} />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-4">
            <button
              onClick={() => { setActiveTab('search'); setSelectedItem(null) }}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'search'
                  ? "bg-futurum-primary text-white"
                  : "text-futurum-textMuted hover:bg-futurum-bg"
              )}
            >
              Semantic Search
            </button>
            <button
              onClick={() => { setActiveTab('browse'); setSelectedItem(null) }}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'browse'
                  ? "bg-futurum-primary text-white"
                  : "text-futurum-textMuted hover:bg-futurum-bg"
              )}
            >
              Browse All
            </button>
          </div>
          
          {/* Search form */}
          {activeTab === 'search' && (
            <form onSubmit={handleSearch} className="flex space-x-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-futurum-textDim" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search vendor analysis, AI strategy, market predictions..."
                  className="w-full pl-9 pr-4 py-2.5 bg-futurum-white border border-futurum-border rounded-lg text-futurum-text placeholder-futurum-textDim focus:outline-none focus:ring-2 focus:ring-futurum-primary/30 focus:border-futurum-primary transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="px-5 py-2.5 bg-futurum-primary hover:bg-futurum-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              >
                {isSearching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                <span>Search</span>
              </button>
            </form>
          )}
          
          {/* Practice Area Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handlePracticeAreaChange(null)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                selectedPracticeArea === null
                  ? "bg-futurum-primary text-white"
                  : "bg-futurum-bg text-futurum-textMuted hover:bg-futurum-bgAlt"
              )}
            >
              All Areas
            </button>
            {practiceAreas.map((pa) => (
              <button
                key={pa.id}
                onClick={() => handlePracticeAreaChange(pa.id)}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                  selectedPracticeArea === pa.id
                    ? "bg-futurum-primary text-white"
                    : "bg-futurum-bg text-futurum-textMuted hover:bg-futurum-bgAlt"
                )}
              >
                {pa.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'search' ? (
            <>
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-futurum-primary" />
                </div>
              ) : !hasSearched ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-futurum-white border border-futurum-border rounded-2xl flex items-center justify-center mb-4 shadow-card">
                    <Search size={28} className="text-futurum-textDim" />
                  </div>
                  <p className="text-futurum-textMuted text-sm">
                    Search Futurum's research library for real-time market intelligence
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-futurum-white border border-futurum-border rounded-2xl flex items-center justify-center mb-4 shadow-card">
                    <FileText size={28} className="text-futurum-textDim" />
                  </div>
                  <p className="text-futurum-textMuted text-sm">
                    No results found for "{query}"
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-futurum-textMuted mb-4">
                    {results.length} results for "{query}"
                  </p>
                  {results.map((result, idx) => (
                    <div
                      key={`${result.document_id}-${idx}`}
                      onClick={() => setSelectedItem(result)}
                      className={clsx(
                        "flex items-center justify-between p-4 bg-futurum-white border rounded-lg cursor-pointer transition-all",
                        selectedItem === result
                          ? "border-futurum-primary shadow-cardHover"
                          : "border-futurum-border hover:border-futurum-borderDark hover:shadow-card"
                      )}
                    >
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="w-10 h-10 bg-futurum-bg border border-futurum-border rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-futurum-textMuted" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-futurum-text truncate">
                            {result.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-futurum-primary font-medium">{result.practice_area}</span>
                            <span className="text-xs text-futurum-textDim">•</span>
                            <span className="text-xs text-futurum-textDim">{CONTENT_TYPE_LABELS[result.content_type] || result.content_type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-1 text-xs font-medium bg-futurum-primaryLight text-futurum-primary rounded-full">
                          {Math.round(result.similarity * 100)}%
                        </span>
                        <button className="px-3 py-1.5 text-sm bg-futurum-primary hover:bg-futurum-primaryHover text-white rounded-md transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-futurum-primary" />
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-futurum-white border border-futurum-border rounded-2xl flex items-center justify-center mb-4 shadow-card">
                    <FolderOpen size={28} className="text-futurum-textDim" />
                  </div>
                  <p className="text-futurum-textMuted text-sm">
                    No documents available
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedItem(doc)}
                      className={clsx(
                        "p-4 bg-futurum-white border rounded-lg cursor-pointer transition-all",
                        selectedItem === doc
                          ? "border-futurum-primary shadow-cardHover"
                          : "border-futurum-border hover:border-futurum-borderDark hover:shadow-card"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-futurum-primaryLight rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-futurum-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-futurum-text truncate mb-1">
                            {doc.title}
                          </p>
                          <p className="text-xs text-futurum-textDim">
                            {CONTENT_TYPE_LABELS[doc.content_type] || doc.content_type}
                          </p>
                        </div>
                      </div>
                      
                      {doc.description && (
                        <p className="text-xs text-futurum-textMuted mt-3 line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-futurum-border">
                        <div className="flex items-center space-x-2 text-xs text-futurum-textDim">
                          {doc.author && (
                            <span className="flex items-center">
                              <User size={12} className="mr-1" />
                              {doc.author}
                            </span>
                          )}
                        </div>
                        {doc.published_at && (
                          <span className="text-xs text-futurum-textDim flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(doc.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Document Preview */}
      {selectedItem && (
        <DocumentPreview 
          doc={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  )
}
