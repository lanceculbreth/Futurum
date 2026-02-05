import { 
  ArrowUp, ArrowRight, Cpu, Layers, Shield, FileText, BarChart3, 
  Radio, Lightbulb, Clock, TrendingUp, Bell, Calendar, Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useChatStore } from '../stores/chatStore'

// Get greeting based on time of day
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// Format current date
function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { sendMessage, currentConversation } = useChatStore()
  const firstName = user?.email?.split('@')[0]?.split('.')[0] || 'there'
  const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  // Handle click to open chat with a specific question
  const handleChatClick = async (question: string) => {
    await sendMessage(question)
    if (currentConversation) {
      navigate(`/chat/${currentConversation.id}`)
    }
  }

  return (
    <div className="h-full bg-futurum-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-futurum-text dark:text-dark-text mb-1">
            {getGreeting()}, {capitalizedName}
          </h1>
          <p className="text-futurum-textMuted dark:text-dark-textMuted">{getFormattedDate()}</p>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => handleChatClick("Show me all new reports published this week with key highlights and recommendations.")}
            className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-4 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-futurum-text dark:text-dark-text">12</p>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">New Reports</p>
              </div>
              <div className="w-10 h-10 bg-[#357CA3]/10 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-[#357CA3]" />
              </div>
            </div>
          </div>
          <div 
            onClick={() => handleChatClick("What are the top insights from this week? Summarize the key findings and trends.")}
            className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-4 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-futurum-text dark:text-dark-text">8</p>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">Insights This Week</p>
              </div>
              <div className="w-10 h-10 bg-[#357CA3]/10 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-[#357CA3]" />
              </div>
            </div>
          </div>
          <div 
            onClick={() => handleChatClick("What upcoming events should I know about? Give me details on dates, topics, and how to prepare.")}
            className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-4 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-futurum-text dark:text-dark-text">3</p>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">Upcoming Events</p>
              </div>
              <div className="w-10 h-10 bg-[#357CA3]/10 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-[#357CA3]" />
              </div>
            </div>
          </div>
          <div 
            onClick={() => handleChatClick("Show me my notifications and any important updates I should be aware of.")}
            className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-4 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-futurum-text dark:text-dark-text">5</p>
                <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">Notifications</p>
              </div>
              <div className="w-10 h-10 bg-[#357CA3]/10 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-[#357CA3]" />
              </div>
            </div>
          </div>
        </div>

        {/* Explore Practice Areas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-futurum-text dark:text-dark-text">Explore Practice Areas</h2>
            <button 
              onClick={() => handleChatClick("Give me an overview of all practice areas available, including AI Devices, AI Platforms, and Cybersecurity.")}
              className="text-sm text-futurum-textMuted dark:text-dark-textMuted hover:text-futurum-text dark:hover:text-dark-text transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div 
              onClick={() => handleChatClick("Give me a comprehensive overview of the AI Devices practice area. What are the key trends, market forecasts, and recent reports?")}
              className="group bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-[#357CA3] hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#357CA3]/10 rounded-xl flex items-center justify-center">
                  <Cpu size={24} className="text-[#357CA3]" />
                </div>
                <ArrowRight size={18} className="text-futurum-textMuted dark:text-dark-textMuted group-hover:text-[#357CA3] transition-colors" />
              </div>
              <h3 className="font-semibold text-futurum-text dark:text-dark-text mb-1">AI Devices</h3>
              <p className="text-sm text-futurum-textMuted dark:text-dark-textMuted">Intelligent devices and edge computing insights</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs bg-[#357CA3]/10 text-[#357CA3] px-2 py-1 rounded">24 Reports</span>
                <span className="text-xs bg-futurum-bg dark:bg-dark-bg text-futurum-textMuted dark:text-dark-textMuted px-2 py-1 rounded">Updated today</span>
              </div>
            </div>
            <div 
              onClick={() => handleChatClick("Give me a comprehensive overview of the AI Platforms practice area. What are the key trends, market forecasts, and recent reports?")}
              className="group bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-[#357CA3] hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#357CA3]/10 rounded-xl flex items-center justify-center">
                  <Layers size={24} className="text-[#357CA3]" />
                </div>
                <ArrowRight size={18} className="text-futurum-textMuted dark:text-dark-textMuted group-hover:text-[#357CA3] transition-colors" />
              </div>
              <h3 className="font-semibold text-futurum-text dark:text-dark-text mb-1">AI Platforms</h3>
              <p className="text-sm text-futurum-textMuted dark:text-dark-textMuted">Enterprise AI and machine learning platforms</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs bg-[#357CA3]/10 text-[#357CA3] px-2 py-1 rounded">18 Reports</span>
                <span className="text-xs bg-futurum-bg dark:bg-dark-bg text-futurum-textMuted dark:text-dark-textMuted px-2 py-1 rounded">Updated 2d ago</span>
              </div>
            </div>
            <div 
              onClick={() => handleChatClick("Give me a comprehensive overview of the Cybersecurity practice area. What are the key trends, threats, and vendor analysis?")}
              className="group bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:border-[#357CA3] hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#357CA3]/10 rounded-xl flex items-center justify-center">
                  <Shield size={24} className="text-[#357CA3]" />
                </div>
                <ArrowRight size={18} className="text-futurum-textMuted dark:text-dark-textMuted group-hover:text-[#357CA3] transition-colors" />
              </div>
              <h3 className="font-semibold text-futurum-text dark:text-dark-text mb-1">Cybersecurity</h3>
              <p className="text-sm text-futurum-textMuted dark:text-dark-textMuted">Security trends, threats, and vendor analysis</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs bg-[#357CA3]/10 text-[#357CA3] px-2 py-1 rounded">31 Reports</span>
                <span className="text-xs bg-futurum-bg dark:bg-dark-bg text-futurum-textMuted dark:text-dark-textMuted px-2 py-1 rounded">Updated 1d ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Personalized Cards + Recent Activity */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Left Column - Personalized Cards */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-futurum-text dark:text-dark-text mb-2">Your Coverage</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Your Coverage Card */}
              <div 
                onClick={() => handleChatClick("What has Futurum written about IBM? Show me all recent coverage, articles, and analyst mentions.")}
                className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
              >
                <h4 className="text-xs font-semibold text-futurum-textMuted dark:text-dark-textMuted uppercase tracking-wide mb-3">
                  RECENT ARTICLES
                </h4>
                <h3 className="text-base font-semibold text-futurum-text dark:text-dark-text mb-3">
                  What has Futurum written about your company?
                </h3>
                <ul className="space-y-1.5 mb-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-futurum-textMuted dark:text-dark-textMuted">•</span>
                    <span className="text-sm text-futurum-textMuted dark:text-dark-textMuted line-clamp-1">"IBM Q4 Earnings Analysis: AI & Hybrid Cloud"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-futurum-textMuted dark:text-dark-textMuted">•</span>
                    <span className="text-sm text-futurum-textMuted dark:text-dark-textMuted line-clamp-1">"IBM's watsonx Strategy: A Deep Dive"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-futurum-textMuted dark:text-dark-textMuted">•</span>
                    <span className="text-sm text-futurum-textMuted dark:text-dark-textMuted line-clamp-1">"Red Hat OpenShift Market Position"</span>
                  </li>
                </ul>
                <span className="text-sm font-medium text-[#357CA3]">
                  View All Coverage →
                </span>
              </div>
              
              {/* Your Research Card */}
              <div 
                onClick={() => handleChatClick("What is the latest research on IBM's market? Give me detailed takeaways on enterprise AI adoption, hybrid cloud spending, and consulting trends.")}
                className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
              >
                <h4 className="text-xs font-semibold text-futurum-textMuted dark:text-dark-textMuted uppercase tracking-wide mb-3">
                  YOUR RESEARCH
                </h4>
                <h3 className="text-base font-semibold text-futurum-text dark:text-dark-text mb-3">
                  3 key takeaways from your market
                </h3>
                <ol className="space-y-1.5 mb-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-futurum-text dark:text-dark-text">1.</span>
                    <span className="text-sm text-futurum-textMuted dark:text-dark-textMuted">Enterprise AI adoption up 47% YoY</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-futurum-text dark:text-dark-text">2.</span>
                    <span className="text-sm text-futurum-textMuted dark:text-dark-textMuted">Hybrid cloud spending accelerating</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-futurum-text dark:text-dark-text">3.</span>
                    <span className="text-sm text-futurum-textMuted dark:text-dark-textMuted">AI consulting demand rising</span>
                  </li>
                </ol>
                <span className="text-sm font-medium text-[#357CA3]">
                  Explore Research →
                </span>
              </div>
              
              {/* Signal Snapshot Card */}
              <div 
                onClick={() => handleChatClick("Show me IBM's full Signal ranking. How do we compare to competitors? What are our strengths and areas for improvement?")}
                className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
              >
                <h4 className="text-xs font-semibold text-futurum-textMuted dark:text-dark-textMuted uppercase tracking-wide mb-3">
                  SIGNAL SNAPSHOT
                </h4>
                <h3 className="text-base font-semibold text-futurum-text dark:text-dark-text mb-3">
                  Your position in the latest Signal
                </h3>
                <div className="bg-futurum-bg dark:bg-dark-bg rounded-lg p-3 mb-3">
                  <div className="text-2xl font-bold text-futurum-text dark:text-dark-text mb-1">
                    #3 of 12 vendors
                  </div>
                  <div className="h-1.5 bg-futurum-border dark:bg-dark-border rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-[#357CA3] rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                    <ArrowUp size={12} />
                    <span>Up 2 from last quarter</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#357CA3]">
                  See Full Signal →
                </span>
              </div>
              
              {/* Try Asking Card */}
              <div 
                onClick={() => handleChatClick("How does IBM compare to Microsoft on enterprise AI and hybrid cloud? What are our key strengths and gaps?")}
                className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 cursor-pointer hover:border-[#357CA3] hover:shadow-md transition-all"
              >
                <h4 className="text-xs font-semibold text-futurum-textMuted dark:text-dark-textMuted uppercase tracking-wide mb-3">
                  TRY ASKING
                </h4>
                <p className="text-sm text-futurum-textMuted dark:text-dark-textMuted italic mb-4 line-clamp-3">
                  "How does IBM compare to Microsoft on enterprise AI and hybrid cloud? What are our key strengths and gaps?"
                </p>
                <span className="inline-block px-4 py-2 bg-[#357CA3] hover:bg-[#2d6a8a] text-white text-sm font-medium rounded-lg transition-colors">
                  Ask This Question →
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="col-span-1">
            <h2 className="text-lg font-semibold text-futurum-text dark:text-dark-text mb-4">Recent Activity</h2>
            <div className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-4">
              <div className="space-y-4">
                <div 
                  onClick={() => handleChatClick("Tell me about the new AI Devices report that was published. What are the key findings?")}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#357CA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-[#357CA3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-futurum-text dark:text-dark-text font-medium line-clamp-1">New AI Devices report published</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">2 hours ago</p>
                  </div>
                </div>
                <div 
                  onClick={() => handleChatClick("Show me the Signal ranking update. How has our position changed and why?")}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#357CA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={14} className="text-[#357CA3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-futurum-text dark:text-dark-text font-medium line-clamp-1">Signal ranking updated</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">5 hours ago</p>
                  </div>
                </div>
                <div 
                  onClick={() => handleChatClick("Show me the Q1 Market Forecast. What are the key projections and trends?")}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#357CA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={14} className="text-[#357CA3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-futurum-text dark:text-dark-text font-medium line-clamp-1">Q1 Market Forecast available</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">Yesterday</p>
                  </div>
                </div>
                <div 
                  onClick={() => handleChatClick("Show me the new coverage mention. What did the analyst say about IBM?")}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#357CA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Radio size={14} className="text-[#357CA3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-futurum-text dark:text-dark-text font-medium line-clamp-1">New coverage mention</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">2 days ago</p>
                  </div>
                </div>
                <div 
                  onClick={() => handleChatClick("Tell me about the latest analyst insight. What are the key recommendations?")}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#357CA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={14} className="text-[#357CA3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-futurum-text dark:text-dark-text font-medium line-clamp-1">Analyst insight added</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">3 days ago</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleChatClick("Show me all my recent activity and updates in detail.")}
                className="w-full mt-4 text-sm text-futurum-textMuted dark:text-dark-textMuted hover:text-futurum-text dark:hover:text-dark-text transition-colors text-center py-2 border-t border-futurum-border dark:border-dark-border"
              >
                View All Activity →
              </button>
            </div>

            {/* Upcoming Events */}
            <h2 className="text-lg font-semibold text-futurum-text dark:text-dark-text mt-6 mb-4">Upcoming Events</h2>
            <div className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-4">
              <div className="space-y-3">
                <div 
                  onClick={() => handleChatClick("Tell me about the AI Strategy Webinar on February 15th. What topics will be covered and how should I prepare?")}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#357CA3]">15</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">FEB</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-futurum-text dark:text-dark-text">AI Strategy Webinar</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">2:00 PM EST</p>
                  </div>
                </div>
                <div 
                  onClick={() => handleChatClick("Tell me about the Quarterly Briefing on February 22nd. What should I expect and how should I prepare?")}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-futurum-bg dark:hover:bg-dark-bg rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#357CA3]">22</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">FEB</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-futurum-text dark:text-dark-text">Quarterly Briefing</p>
                    <p className="text-xs text-futurum-textMuted dark:text-dark-textMuted">10:00 AM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Insights */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-futurum-text dark:text-dark-text">Trending Insights</h2>
            <button 
              onClick={() => handleChatClick("Show me all trending insights across AI Platforms, Cybersecurity, and AI Devices.")}
              className="text-sm text-futurum-textMuted dark:text-dark-textMuted hover:text-futurum-text dark:hover:text-dark-text transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div 
              onClick={() => handleChatClick("Tell me more about enterprise AI spending reaching $150B by 2027. What's driving this growth and what are the implications?")}
              className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:shadow-lg hover:border-[#357CA3] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs bg-[#357CA3]/10 text-[#357CA3] px-2 py-0.5 rounded font-medium">HOT</span>
                <span className="text-xs text-futurum-textMuted dark:text-dark-textMuted">AI Platforms</span>
              </div>
              <h3 className="font-medium text-futurum-text dark:text-dark-text mb-2 line-clamp-2">Enterprise AI spending to reach $150B by 2027</h3>
              <div className="flex items-center space-x-1 text-xs text-futurum-textMuted dark:text-dark-textMuted">
                <Clock size={12} />
                <span>5 min read</span>
              </div>
            </div>
            <div 
              onClick={() => handleChatClick("Tell me more about Zero Trust adoption accelerating across enterprises. What are the key drivers and best practices?")}
              className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:shadow-lg hover:border-[#357CA3] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs bg-[#357CA3]/10 text-[#357CA3] px-2 py-0.5 rounded font-medium">NEW</span>
                <span className="text-xs text-futurum-textMuted dark:text-dark-textMuted">Cybersecurity</span>
              </div>
              <h3 className="font-medium text-futurum-text dark:text-dark-text mb-2 line-clamp-2">Zero Trust adoption accelerates across enterprises</h3>
              <div className="flex items-center space-x-1 text-xs text-futurum-textMuted dark:text-dark-textMuted">
                <Clock size={12} />
                <span>8 min read</span>
              </div>
            </div>
            <div 
              onClick={() => handleChatClick("Tell me more about Edge AI chips being the next battleground for vendors. Who are the key players and what's the competitive landscape?")}
              className="bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-xl p-5 hover:shadow-lg hover:border-[#357CA3] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs bg-[#357CA3]/10 text-[#357CA3] px-2 py-0.5 rounded font-medium">ANALYSIS</span>
                <span className="text-xs text-futurum-textMuted dark:text-dark-textMuted">AI Devices</span>
              </div>
              <h3 className="font-medium text-futurum-text dark:text-dark-text mb-2 line-clamp-2">Edge AI chips: The next battleground for vendors</h3>
              <div className="flex items-center space-x-1 text-xs text-futurum-textMuted dark:text-dark-textMuted">
                <Clock size={12} />
                <span>6 min read</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
