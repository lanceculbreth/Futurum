import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FileText, X, ChevronDown, ChevronLeft,
  Loader2, BarChart3, Users, FileBarChart,
  Download, ExternalLink, Newspaper
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useChatStore } from '../stores/chatStore'
import { useAuthStore } from '../stores/authStore'
import { newsApi, type NewsItem } from '../services/api'
import clsx from 'clsx'
import type { SourceCitation } from '../types'

// News Preview Panel Component
function NewsPreview({ 
  news, 
  onClose 
}: { 
  news: NewsItem
  onClose: () => void 
}) {
  return (
    <div className="w-[480px] border-l border-futurum-border bg-futurum-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-futurum-border">
        <div className="flex items-center space-x-2 min-w-0">
          <Newspaper size={16} className="text-futurum-primary flex-shrink-0" />
          <span className="text-sm font-medium text-futurum-text truncate">IBM News</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-futurum-bg rounded transition-colors">
            <ExternalLink size={16} className="text-futurum-textMuted" />
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
        {/* Source Badge */}
        <div className="inline-flex items-center px-2.5 py-1 bg-futurum-primaryLight text-futurum-primary text-xs font-medium rounded-full mb-4">
          {news.source}
        </div>
        
        <h1 className="text-xl font-semibold text-futurum-text mb-2">
          {news.title}
        </h1>
        
        <div className="flex items-center space-x-3 text-sm text-futurum-textMuted mb-6">
          <span>{new Date(news.date).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        
        {/* Summary */}
        <div className="p-4 bg-futurum-bg rounded-lg border border-futurum-border mb-6">
          <p className="text-sm text-futurum-text leading-relaxed">
            {news.summary}
          </p>
        </div>
        
        {/* Placeholder for full article content */}
        <div className="prose max-w-none">
          <h3 className="text-sm font-semibold text-futurum-text mb-3">Key Insights</h3>
          <ul className="text-sm text-futurum-textMuted space-y-2">
            <li>Strategic implications for enterprise AI adoption</li>
            <li>Competitive positioning in the market</li>
            <li>Analyst recommendations and outlook</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Document Preview Panel Component
function DocumentPreview({ 
  source, 
  onClose 
}: { 
  source: SourceCitation
  onClose: () => void 
}) {
  return (
    <div className="w-[480px] border-l border-futurum-border bg-futurum-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-futurum-border">
        <div className="flex items-center space-x-2 min-w-0">
          <FileText size={16} className="text-futurum-primary flex-shrink-0" />
          <span className="text-sm font-medium text-futurum-text truncate">{source.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-futurum-bg rounded transition-colors">
            <Download size={16} className="text-futurum-textMuted" />
          </button>
          <button className="p-1.5 hover:bg-futurum-bg rounded transition-colors">
            <ExternalLink size={16} className="text-futurum-textMuted" />
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
        {/* Practice Area Badge */}
        <div className="inline-flex items-center px-2.5 py-1 bg-futurum-primaryLight text-futurum-primary text-xs font-medium rounded-full mb-4">
          {source.practice_area}
        </div>
        
        <h1 className="text-xl font-semibold text-futurum-text mb-2">
          {source.title}
        </h1>
        
        <div className="flex items-center space-x-3 text-sm text-futurum-textMuted mb-6">
          <span>{source.content_type.replace(/_/g, ' ')}</span>
          <span>•</span>
          <span className="text-futurum-primary font-medium">{Math.round(source.similarity * 100)}% match</span>
        </div>
        
        {/* Content Preview */}
        <div className="p-4 bg-futurum-bg rounded-lg border border-futurum-border">
          <p className="text-sm text-futurum-text leading-relaxed">
            {source.content_preview}
          </p>
        </div>
      </div>
    </div>
  )
}

// Source Card Component
function SourceCard({ 
  source, 
  onClick 
}: { 
  source: SourceCitation
  onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className="group flex items-center justify-between p-3 bg-futurum-white border border-futurum-border hover:border-futurum-primary/30 hover:shadow-card rounded-lg cursor-pointer transition-all"
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-10 h-10 bg-futurum-bg border border-futurum-border rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-futurum-textMuted" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-futurum-text truncate">{source.title}</p>
          <p className="text-xs text-futurum-textDim">
            {source.practice_area} · {source.content_type.replace(/_/g, ' ')}
          </p>
        </div>
      </div>
      <button className="px-3 py-1.5 text-sm bg-futurum-primary hover:bg-futurum-primaryHover text-white rounded-md transition-colors">
        Go to Page
      </button>
    </div>
  )
}

// AI Devices Navigation Data (Option A - Simple Dropdowns)
const aiDevicesNav = {
  marketData: {
    label: 'Market Data',
    icon: BarChart3,
    items: ['Executive Summary', 'Market Forecast', 'Market Share', 'Methodology']
  },
  decisionMaker: {
    label: 'Decision Maker Insights',
    icon: Users,
    items: ['Executive Summary', 'Strategic Posture & Planning', 'Challenges & Constraints', 'Device Trends', 'Purchasing Criteria', 'Device Ecosystem & Outlook', 'Demographics', 'Methodology']
  },
  reports: {
    label: 'Reports',
    icon: FileBarChart,
    items: ['Featured Report']
  }
}

// AI Devices Mega Menu Data (Option B - Mega Menu with Sub-pages)
const megaMenuNav = {
  marketData: {
    label: 'Market Data',
    icon: BarChart3,
    sections: [
      { name: 'Executive Summary', subItems: [] },
      { 
        name: 'Market Forecast', 
        subItems: ['Scenario', 'Product', 'End User', 'Pricing', 'TOPS', 'Vertical', 'Regional'] 
      },
      { 
        name: 'Market Share', 
        subItems: ['Prediction', 'Actuals'] 
      },
      { name: 'Methodology', subItems: [] },
    ]
  },
  decisionMaker: {
    label: 'Decision Maker Insights',
    icon: Users,
    sections: [
      { name: 'Executive Summary', subItems: [] },
      { 
        name: 'Strategic Posture & Planning', 
        subItems: ['AI PC Planning', 'PC Refresh'] 
      },
      { 
        name: 'Challenges & Constraints', 
        subItems: ['Pain Points', 'Tariff Impact'] 
      },
      { 
        name: 'Device Trends', 
        subItems: ['Vendors', 'Hardware Preferences', 'Features'] 
      },
      { 
        name: 'Purchasing Criteria', 
        subItems: ['Refresh Posture', 'Purchasing Preferences'] 
      },
      { 
        name: 'Device Ecosystem & Outlook', 
        subItems: ['Device Management', 'Chromebooks', 'Spending Change', 'AI-Enabled Smartphone', 'Collaboration Posture'] 
      },
      { 
        name: 'Demographics', 
        subItems: ['Vertical Market', 'Organization Revenue', 'Role', 'Geography'] 
      },
      { name: 'Methodology', subItems: [] },
    ]
  },
  reports: {
    label: 'Reports',
    icon: FileBarChart,
    sections: [
      { name: 'Featured Report', subItems: [] },
    ]
  }
}

// Navigation Dropdown Component (Option A)
function NavDropdown({ 
  label, 
  icon: Icon, 
  items, 
  isOpen, 
  onToggle,
  onItemClick 
}: { 
  label: string
  icon: React.ElementType
  items: string[]
  isOpen: boolean
  onToggle: () => void
  onItemClick: (item: string) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={clsx(
          "flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all",
          isOpen 
            ? "bg-[#357CA3] text-white" 
            : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bgAlt"
        )}
      >
        <Icon size={16} />
        <span>{label}</span>
        <ChevronDown size={14} className={clsx("transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-2">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onItemClick(item)}
                className="w-full text-left px-4 py-2.5 text-sm text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bgAlt hover:text-futurum-text dark:hover:text-dark-text transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Mega Menu Dropdown Component (Option B)
function MegaMenuDropdown({ 
  label, 
  icon: Icon, 
  sections, 
  isOpen, 
  onToggle,
  onItemClick 
}: { 
  label: string
  icon: React.ElementType
  sections: { name: string; subItems: string[] }[]
  isOpen: boolean
  onToggle: () => void
  onItemClick: (item: string, subItem?: string) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={clsx(
          "flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all",
          isOpen 
            ? "bg-[#357CA3] text-white" 
            : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bgAlt"
        )}
      >
        <Icon size={16} />
        <span>{label}</span>
        <ChevronDown size={14} className={clsx("transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-theme(spacing.60)-theme(spacing.32))] max-w-3xl bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-5">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {sections.map((section, idx) => (
                <div key={idx} className={section.subItems.length > 0 ? "space-y-2" : ""}>
                  <button
                    onClick={() => onItemClick(section.name)}
                    className="text-left text-sm font-semibold text-futurum-text dark:text-dark-text hover:text-[#357CA3] transition-colors py-1"
                  >
                    {section.name}
                  </button>
                  {section.subItems.length > 0 && (
                    <div className="space-y-1">
                      {section.subItems.map((subItem, subIdx) => (
                        <button
                          key={subIdx}
                          onClick={() => onItemClick(section.name, subItem)}
                          className="block text-left text-xs text-futurum-textMuted dark:text-dark-textMuted hover:text-[#357CA3] transition-colors py-0.5"
                        >
                          {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { } = useAuthStore()
  
  const {
    currentConversation,
    messages,
    sources,
    isSending,
    loadConversations,
    loadConversation,
    sendMessage,
    createNewConversation,
  } = useChatStore()
  
  const [input, setInput] = useState('')
  const [selectedSource, setSelectedSource] = useState<SourceCitation | null>(null)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [, setNews] = useState<NewsItem[]>([])
  const [, setNewsLoading] = useState(true)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [openNav, setOpenNav] = useState<string | null>(null)
  const [navStyle, setNavStyle] = useState<'A' | 'B'>('A') // A/B Testing: A = Simple Dropdowns, B = Mega Menu
  
  useEffect(() => {
    loadConversations()
  }, [loadConversations])
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await newsApi.getIBMNews(5)
        setNews(newsData)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])
  
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
      setSelectedSource(null)
    } else {
      createNewConversation()
    }
  }, [conversationId, loadConversation, createNewConversation])
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])
  
  const isHome = !conversationId && messages.length === 0
  
  return (
    <div className="h-full flex bg-futurum-bg dark:bg-dark-bg">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Navigation Header - Always visible */}
        <div className="sticky top-0 z-40 pt-5 pb-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/home')}
              className="w-10 h-10 flex items-center justify-center bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full shadow-sm hover:bg-futurum-bg dark:hover:bg-dark-bg transition-colors flex-shrink-0"
            >
              <ChevronLeft size={20} className="text-futurum-text dark:text-dark-text" />
            </button>
            
            {/* Pill Menu */}
            <div className="flex-1 bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full px-2 py-2 shadow-sm">
              {/* Navigation - Option A (Simple Dropdowns) */}
              {navStyle === 'A' && (
                <div className="flex items-center justify-center space-x-1">
                  <NavDropdown
                    label={aiDevicesNav.marketData.label}
                    icon={aiDevicesNav.marketData.icon}
                    items={aiDevicesNav.marketData.items}
                    isOpen={openNav === 'marketData'}
                    onToggle={() => setOpenNav(openNav === 'marketData' ? null : 'marketData')}
                    onItemClick={(item) => {
                      setInput(`Tell me about ${item} for AI Devices`)
                      setOpenNav(null)
                    }}
                  />
                  <NavDropdown
                    label={aiDevicesNav.decisionMaker.label}
                    icon={aiDevicesNav.decisionMaker.icon}
                    items={aiDevicesNav.decisionMaker.items}
                    isOpen={openNav === 'decisionMaker'}
                    onToggle={() => setOpenNav(openNav === 'decisionMaker' ? null : 'decisionMaker')}
                    onItemClick={(item) => {
                      setInput(`Tell me about ${item} for AI Devices`)
                      setOpenNav(null)
                    }}
                  />
                  <NavDropdown
                    label={aiDevicesNav.reports.label}
                    icon={aiDevicesNav.reports.icon}
                    items={aiDevicesNav.reports.items}
                    isOpen={openNav === 'reports'}
                    onToggle={() => setOpenNav(openNav === 'reports' ? null : 'reports')}
                    onItemClick={(item) => {
                      setInput(`Show me the ${item} for AI Devices`)
                      setOpenNav(null)
                    }}
                  />
                </div>
              )}
              
              {/* Navigation - Option B (Mega Menu) */}
              {navStyle === 'B' && (
                <div className="flex items-center justify-center space-x-1">
                  <MegaMenuDropdown
                    label={megaMenuNav.marketData.label}
                    icon={megaMenuNav.marketData.icon}
                    sections={megaMenuNav.marketData.sections}
                    isOpen={openNav === 'marketData'}
                    onToggle={() => setOpenNav(openNav === 'marketData' ? null : 'marketData')}
                    onItemClick={(item, subItem) => {
                      const query = subItem 
                        ? `Tell me about ${item} - ${subItem} for AI Devices`
                        : `Tell me about ${item} for AI Devices`
                      setInput(query)
                      setOpenNav(null)
                    }}
                  />
                  <MegaMenuDropdown
                    label={megaMenuNav.decisionMaker.label}
                    icon={megaMenuNav.decisionMaker.icon}
                    sections={megaMenuNav.decisionMaker.sections}
                    isOpen={openNav === 'decisionMaker'}
                    onToggle={() => setOpenNav(openNav === 'decisionMaker' ? null : 'decisionMaker')}
                    onItemClick={(item, subItem) => {
                      const query = subItem 
                        ? `Tell me about ${item} - ${subItem} for AI Devices`
                        : `Tell me about ${item} for AI Devices`
                      setInput(query)
                      setOpenNav(null)
                    }}
                  />
                  <MegaMenuDropdown
                    label={megaMenuNav.reports.label}
                    icon={megaMenuNav.reports.icon}
                    sections={megaMenuNav.reports.sections}
                    isOpen={openNav === 'reports'}
                    onToggle={() => setOpenNav(openNav === 'reports' ? null : 'reports')}
                    onItemClick={(item, subItem) => {
                      const query = subItem 
                        ? `Show me the ${item} - ${subItem} for AI Devices`
                        : `Show me the ${item} for AI Devices`
                      setInput(query)
                      setOpenNav(null)
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* A/B Toggle */}
            <div className="flex items-center bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full p-1 shadow-sm flex-shrink-0">
              <button
                onClick={() => setNavStyle('A')}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                  navStyle === 'A'
                    ? "bg-[#357CA3] text-white"
                    : "text-futurum-textMuted hover:text-futurum-text"
                )}
              >
                A
              </button>
              <button
                onClick={() => setNavStyle('B')}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                  navStyle === 'B'
                    ? "bg-[#357CA3] text-white"
                    : "text-futurum-textMuted hover:text-futurum-text"
                )}
              >
                B
              </button>
            </div>
          </div>
        </div>
        
        {/* Click outside to close nav */}
        {openNav && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setOpenNav(null)}
          />
        )}
        
        {isHome ? (
          // Home View
          <>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-end px-4 pb-[50px]">
            {/* Trending Questions */}
            <div className="w-full max-w-3xl mt-[40px]">
              <h3 className="text-sm font-semibold text-[#313436] dark:text-dark-text mb-2.5">Trending Questions</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  "What is the total addressable market for [AI Platforms / Cybersecurity / Data Management / Enterprise Apps] through 2030, and which segments are growing fastest?",
                  "Who are the top 10 vendors in [specific category] by market share, and which vendors are growing fastest?",
                  "What are CEOs' biggest concerns about AI implementation, and what drives their investment decisions?",
                  "What are the top factors driving technology purchasing decisions for CIOs in [industry], and what are their biggest challenges?",
                  "Which industries and company sizes are adopting [AI / Cloud / DevOps / Cybersecurity] fastest, and what use cases are they prioritizing?",
                  "What emerging technologies are CIOs and CEOs investing in for 2026-2027, and which trends are overhyped vs. underrated?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={async () => {
                      setInput(question)
                      await sendMessage(question)
                      if (currentConversation) {
                        navigate(`/chat/${currentConversation.id}`)
                      }
                    }}
                    className="text-left p-3 text-xs text-futurum-textMuted dark:text-dark-textMuted bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-lg hover:border-futurum-primary/30 dark:hover:border-dark-primary/30 hover:text-futurum-text dark:hover:text-dark-text hover:shadow-card transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Key Insights Header */}
            <div className="w-full max-w-3xl mt-[40px] mb-2.5">
              <h3 className="text-sm font-semibold text-[#313436] dark:text-dark-text">Key Market Insights</h3>
            </div>
            
            {/* Key Insights Grid - Single Row */}
            <div className="w-full max-w-3xl grid grid-cols-4 gap-2.5">
              {/* Insight 1 */}
              <div className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-futurum-primary/30 dark:hover:border-dark-primary/30 hover:shadow-card transition-all">
                <h4 className="text-xs font-semibold text-[#313436] dark:text-dark-text mb-3">AI Market Growth</h4>
                <div className="text-2xl font-bold text-[#313436] dark:text-dark-text mb-1">$72.4B</div>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted mb-2">2026 Market Size</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">+63%</span>
                  <span className="text-xs text-futurum-textDim dark:text-dark-textDim">YoY Growth</span>
                </div>
              </div>
              
              {/* Insight 2 */}
              <div className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-futurum-primary/30 dark:hover:border-dark-primary/30 hover:shadow-card transition-all">
                <h4 className="text-xs font-semibold text-[#313436] dark:text-dark-text mb-3">CEO AI Sentiment</h4>
                <div className="text-2xl font-bold text-[#313436] dark:text-dark-text mb-1">63%</div>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted mb-2">See Transformative Potential</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">&lt;2%</span>
                  <span className="text-xs text-futurum-textDim dark:text-dark-textDim">Dismiss as Hype</span>
                </div>
              </div>
              
              {/* Insight 3 */}
              <div className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-futurum-primary/30 dark:hover:border-dark-primary/30 hover:shadow-card transition-all">
                <h4 className="text-xs font-semibold text-[#313436] dark:text-dark-text mb-3">Security Budgets</h4>
                <div className="text-2xl font-bold text-[#313436] dark:text-dark-text mb-1">75%</div>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted mb-2">Increasing Spend</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">+20%</span>
                  <span className="text-xs text-futurum-textDim dark:text-dark-textDim">Significant Growth</span>
                </div>
              </div>
              
              {/* Insight 4 */}
              <div className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-futurum-primary/30 dark:hover:border-dark-primary/30 hover:shadow-card transition-all">
                <h4 className="text-xs font-semibold text-[#313436] dark:text-dark-text mb-3">Chip Supply</h4>
                <div className="text-2xl font-bold text-[#313436] dark:text-dark-text mb-1">50%</div>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted mb-2">2025 YoY Growth</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-futurum-textMuted dark:text-dark-textMuted">~20%</span>
                  <span className="text-xs text-futurum-textDim dark:text-dark-textDim">CAGR to 2029</span>
                </div>
              </div>
            </div>
            
            {/* Quick Select Header */}
            <div className="w-full max-w-3xl mt-[40px] mb-2.5">
              <h3 className="text-sm font-semibold text-[#313436] dark:text-dark-text">Quick Select</h3>
            </div>
            
            {/* Quick Select Buttons */}
            <div className="w-full max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Executive Summary', question: 'Give me an Executive Summary for AI Devices including key market trends, growth drivers, and strategic recommendations.' },
                  { label: 'Market Forecast', question: 'Show me the Market Forecast for AI Devices through 2030 including revenue projections and growth rates.' },
                  { label: 'Market Share', question: 'What is the current Market Share breakdown for AI Devices? Show me the top vendors and their competitive positioning.' },
                  { label: 'Device Trends', question: 'What are the key Device Trends in the AI Devices market? Show me emerging technologies and adoption patterns.' },
                  { label: 'Demographics', question: 'Show me the Demographics data for AI Devices buyers including industry segments, company sizes, and regional distribution.' },
                  { label: 'Featured Reports', question: 'Show me the Featured Reports available for AI Devices including the latest research publications and analyst insights.' },
                  { label: 'Purchase Criteria', question: 'What are the key Purchase Criteria for AI Devices? Show me the top factors driving buying decisions and vendor selection.' },
                  { label: 'Methodology', question: 'Explain the Methodology used for AI Devices research including data sources, survey methodology, and analytical approach.' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={async () => {
                      await sendMessage(item.question)
                      if (currentConversation) {
                        navigate(`/chat/${currentConversation.id}`)
                      }
                    }}
                    className="px-4 py-2 bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-lg text-sm font-medium text-futurum-textMuted dark:text-dark-textMuted hover:border-[#357CA3] hover:text-[#357CA3] transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            </div>
          </>
        ) : (
          // Conversation View
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-6 px-4">
                {messages.map((message, idx) => (
                  <div key={message.id} className="mb-6 message-fade-in">
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-futurum-primary text-white px-4 py-3 rounded-2xl rounded-br-md">
                          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-futurum-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">F</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="prose max-w-none">
                              <ReactMarkdown
                                components={{
                                  img: ({ src, alt }) => (
                                    <img 
                                      src={src} 
                                      alt={alt || ''} 
                                      onClick={() => src && setEnlargedImage(src)}
                                      className="rounded-lg border border-futurum-border shadow-card my-4 max-w-full cursor-pointer hover:shadow-cardHover hover:border-futurum-primary/30 transition-all"
                                    />
                                  ),
                                  table: ({ children }) => (
                                    <div className="overflow-x-auto my-4">
                                      <table className="min-w-full text-sm border border-futurum-border rounded-lg overflow-hidden">
                                        {children}
                                      </table>
                                    </div>
                                  ),
                                  th: ({ children }) => (
                                    <th className="bg-futurum-bg px-3 py-2 text-left font-semibold text-futurum-text border-b border-futurum-border">
                                      {children}
                                    </th>
                                  ),
                                  td: ({ children }) => (
                                    <td className="px-3 py-2 text-futurum-textMuted border-b border-futurum-border">
                                      {children}
                                    </td>
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                        
                        {idx === messages.length - 1 && sources.length > 0 && (
                          <>
                            <div className="space-y-2 ml-11">
                              <p className="text-xs font-medium text-futurum-textDim uppercase tracking-wide">Sources</p>
                              {sources.slice(0, 3).map((source, sidx) => (
                                <SourceCard 
                                  key={sidx} 
                                  source={source} 
                                  onClick={() => setSelectedSource(source)}
                                />
                              ))}
                            </div>
                            
                            {/* Downloadable Reports */}
                            <div className="space-y-2 ml-11 mt-4">
                              <p className="text-xs font-medium text-futurum-textDim uppercase tracking-wide">Takeaway Reports</p>
                              <div className="flex flex-col gap-2">
                                <a 
                                  href="#" 
                                  className="flex items-center justify-between p-3 bg-futurum-white border border-futurum-border hover:border-futurum-primary/30 hover:shadow-card rounded-lg cursor-pointer transition-all group"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Download size={18} className="text-red-500" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-futurum-text">TAM Analysis Executive Summary</p>
                                      <p className="text-xs text-futurum-textDim">PDF · 2.4 MB · Updated Feb 2026</p>
                                    </div>
                                  </div>
                                  <button className="px-3 py-1.5 text-sm bg-futurum-bg hover:bg-futurum-border text-futurum-text border border-futurum-border rounded-md transition-colors flex items-center space-x-1">
                                    <Download size={14} />
                                    <span>Download</span>
                                  </button>
                                </a>
                                <a 
                                  href="#" 
                                  className="flex items-center justify-between p-3 bg-futurum-white border border-futurum-border hover:border-futurum-primary/30 hover:shadow-card rounded-lg cursor-pointer transition-all group"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Download size={18} className="text-green-500" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-futurum-text">Market Forecast Data Pack</p>
                                      <p className="text-xs text-futurum-textDim">XLSX · 1.8 MB · Updated Feb 2026</p>
                                    </div>
                                  </div>
                                  <button className="px-3 py-1.5 text-sm bg-futurum-bg hover:bg-futurum-border text-futurum-text border border-futurum-border rounded-md transition-colors flex items-center space-x-1">
                                    <Download size={14} />
                                    <span>Download</span>
                                  </button>
                                </a>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex items-center space-x-3 ml-11">
                    <Loader2 size={16} className="animate-spin text-futurum-primary" />
                    <span className="text-sm text-futurum-textMuted">Analyzing research...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* News Preview Panel */}
      {selectedNews && (
        <NewsPreview 
          news={selectedNews} 
          onClose={() => setSelectedNews(null)} 
        />
      )}
      
      {/* Document Preview Panel */}
      {selectedSource && !selectedNews && (
        <DocumentPreview 
          source={selectedSource} 
          onClose={() => setSelectedSource(null)} 
        />
      )}
      
      {/* Image Lightbox Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-futurum-primary transition-colors"
            >
              <X size={24} />
            </button>
            <img 
              src={enlargedImage} 
              alt="Enlarged chart" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
