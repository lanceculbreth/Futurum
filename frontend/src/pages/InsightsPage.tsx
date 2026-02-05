import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import clsx from 'clsx'

type TabType = 'insights' | 'content' | 'competitors'

export default function InsightsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('insights')
  const { sendMessage, currentConversation } = useChatStore()

  const handleTabClick = async (tab: TabType) => {
    setActiveTab(tab)
    
    // Send a relevant question based on the tab
    const questions: Record<TabType, string> = {
      insights: "Show me the latest insights and key findings across all practice areas.",
      content: "What content is available? Show me reports, articles, and research publications.",
      competitors: "Give me a competitive analysis. Who are the key competitors and how do they compare?"
    }
    
    await sendMessage(questions[tab])
    if (currentConversation) {
      navigate(`/chat/${currentConversation.id}`)
    }
  }

  return (
    <div className="h-full flex bg-futurum-bg dark:bg-dark-bg">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Navigation Header */}
        <div className="sticky top-0 z-40 pt-5 pb-4 px-4">
          <div className="max-w-3xl mx-auto flex items-center space-x-3">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/home')}
              className="w-10 h-10 flex items-center justify-center bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full shadow-sm hover:bg-futurum-bg dark:hover:bg-dark-bg transition-colors flex-shrink-0"
            >
              <ChevronLeft size={20} className="text-futurum-text dark:text-dark-text" />
            </button>
            
            {/* Pill Menu */}
            <div className="flex-1 bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-full px-2 py-2 shadow-sm">
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => handleTabClick('insights')}
                  className={clsx(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    activeTab === 'insights'
                      ? "bg-[#357CA3] text-white"
                      : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bg"
                  )}
                >
                  Insights
                </button>
                <button
                  onClick={() => handleTabClick('content')}
                  className={clsx(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    activeTab === 'content'
                      ? "bg-[#357CA3] text-white"
                      : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bg"
                  )}
                >
                  Content
                </button>
                <button
                  onClick={() => handleTabClick('competitors')}
                  className={clsx(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    activeTab === 'competitors'
                      ? "bg-[#357CA3] text-white"
                      : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-bg dark:hover:bg-dark-bg"
                  )}
                >
                  Competitors
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-futurum-text dark:text-dark-text mb-2">
              {activeTab === 'insights' && 'Insights'}
              {activeTab === 'content' && 'Content'}
              {activeTab === 'competitors' && 'Competitors'}
            </h2>
            <p className="text-futurum-textMuted dark:text-dark-textMuted mb-6">
              {activeTab === 'insights' && 'Explore the latest insights and key findings'}
              {activeTab === 'content' && 'Browse reports, articles, and research'}
              {activeTab === 'competitors' && 'Analyze competitive landscape and positioning'}
            </p>
            <button
              onClick={() => handleTabClick(activeTab)}
              className="px-6 py-3 bg-[#357CA3] hover:bg-[#2d6a8a] text-white font-medium rounded-lg transition-colors"
            >
              Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
