import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import clsx from 'clsx'

type TabType = 'overview' | 'briefings' | 'content' | 'intelligence' | 'research' | 'events' | 'documents' | 'export'

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'briefings', label: 'Briefings' },
  { id: 'content', label: 'Content' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'research', label: 'Research' },
  { id: 'events', label: 'Events' },
  { id: 'documents', label: 'Documents' },
  { id: 'export', label: 'Export Data' },
]

const tabDescriptions: Record<TabType, { title: string; description: string; question: string }> = {
  overview: {
    title: 'Account Overview',
    description: 'View your account summary, activity, and key metrics',
    question: 'Show me an overview of my account including recent activity, usage metrics, and account status.'
  },
  briefings: {
    title: 'Briefings',
    description: 'Access scheduled and past analyst briefings',
    question: 'Show me upcoming briefings and my briefing history.'
  },
  content: {
    title: 'Content',
    description: 'Browse your saved and recommended content',
    question: 'Show me my saved content and personalized recommendations.'
  },
  intelligence: {
    title: 'Intelligence',
    description: 'Access intelligence reports and market insights',
    question: 'What intelligence reports are available for my account?'
  },
  research: {
    title: 'Research',
    description: 'Explore research publications and studies',
    question: 'Show me the latest research publications relevant to my interests.'
  },
  events: {
    title: 'Events',
    description: 'View upcoming events and webinars',
    question: 'What upcoming events and webinars are available?'
  },
  documents: {
    title: 'Documents',
    description: 'Manage your documents and downloads',
    question: 'Show me my document library and recent downloads.'
  },
  export: {
    title: 'Export Data',
    description: 'Export your account data and reports',
    question: 'What data can I export from my account?'
  },
}

export default function AccountPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const { sendMessage, currentConversation } = useChatStore()

  const handleTabClick = async (tab: TabType) => {
    setActiveTab(tab)
    
    await sendMessage(tabDescriptions[tab].question)
    if (currentConversation) {
      navigate(`/chat/${currentConversation.id}`)
    }
  }

  const currentTab = tabDescriptions[activeTab]

  return (
    <div className="h-full flex bg-futurum-bg dark:bg-dark-bg">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Navigation Header */}
        <div className="sticky top-0 z-40 pt-5 pb-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/home')}
              className="w-10 h-10 flex items-center justify-center bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full shadow-sm hover:bg-futurum-bg dark:hover:bg-dark-bg transition-colors flex-shrink-0"
            >
              <ChevronLeft size={20} className="text-futurum-text dark:text-dark-text" />
            </button>
            
            {/* Pill Menu - Scrollable */}
            <div className="flex-1 bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full px-2 py-2 shadow-sm overflow-x-auto">
              <div className="flex items-center space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                      activeTab === tab.id
                        ? "bg-[#357CA3] text-white"
                        : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bg"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-futurum-text dark:text-dark-text mb-2">
              {currentTab.title}
            </h2>
            <p className="text-futurum-textMuted dark:text-dark-textMuted mb-6">
              {currentTab.description}
            </p>
            <button
              onClick={() => handleTabClick(activeTab)}
              className="px-6 py-3 bg-[#357CA3] hover:bg-[#2d6a8a] text-white font-medium rounded-lg transition-colors"
            >
              Explore {currentTab.title} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
