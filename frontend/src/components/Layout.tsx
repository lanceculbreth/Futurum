import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LogOut, ChevronDown, Radio, Moon, Sun,
  Lightbulb, FileBarChart, Download, Cpu, Layers, Shield, Home, User
} from 'lucide-react'
import { useState, useEffect } from 'react'
import futurumLogo from '../assets/futurum-logo.png'
import { useAuthStore } from '../stores/authStore'
import { useChatStore } from '../stores/chatStore'
import { useThemeStore } from '../stores/themeStore'
import GlobalChatInput from './GlobalChatInput'
import clsx from 'clsx'

export default function Layout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { conversations, loadConversations } = useChatStore()
  const { isDark, toggle: toggleTheme } = useThemeStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAllPracticeAreas, setShowAllPracticeAreas] = useState(false)
  
  useEffect(() => {
    loadConversations()
  }, [loadConversations])
  
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')
  
  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/account', label: 'My Account', icon: User },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
    { path: '/reports', label: 'Reports', icon: FileBarChart },
    { path: '/signal', label: 'Signal', icon: Radio },
    { path: '/export', label: 'Export Data', icon: Download },
  ]
  
  const practiceAreaItems = [
    { path: '/chat', label: 'AI Devices', icon: Cpu },
    { path: '/practice/ai-platforms', label: 'AI Platforms', icon: Layers },
    { path: '/practice/cybersecurity', label: 'Cybersecurity', icon: Shield },
  ]
  
  const additionalPracticeAreas = [
    { path: '/practice/data-intelligence', label: 'Data Intelligence', icon: Cpu },
    { path: '/practice/ceo-insights', label: 'CEO Insights', icon: Cpu },
    { path: '/practice/channel-ecosystems', label: 'Channel Ecosystems', icon: Cpu },
    { path: '/practice/cio-insights', label: 'CIO Insights', icon: Cpu },
    { path: '/practice/enterprise-software', label: 'Enterprise Software', icon: Cpu },
    { path: '/practice/semiconductors', label: 'Semiconductors', icon: Cpu },
    { path: '/practice/software-engineering', label: 'Software Engineering', icon: Cpu },
  ]
  
  
  
  return (
    <div className="h-screen flex bg-futurum-bg dark:bg-dark-bg">
      {/* Sidebar */}
      <aside className="w-60 bg-futurum-white dark:bg-dark-surface border-r border-futurum-border dark:border-dark-border flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-futurum-border dark:border-dark-border">
          <Link to="/" className="flex items-center">
            <img src={futurumLogo} alt="Futurum" className="h-7" />
          </Link>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                isActive(item.path) 
                  ? "bg-futurum-sidebarActive dark:bg-dark-primaryLight text-[#313436] dark:text-dark-text font-bold" 
                  : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt hover:text-futurum-text dark:hover:text-dark-text"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="my-6 border-t border-futurum-border dark:border-dark-border" />
          
          {/* Practice Area Header */}
          <p className="px-3 py-2 text-xs font-medium text-futurum-textDim dark:text-dark-textDim uppercase tracking-wide">
            Practice Area
          </p>
          
          {/* Practice Area Items */}
          {practiceAreaItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                isActive(item.path) 
                  ? "bg-futurum-sidebarActive dark:bg-dark-primaryLight text-[#313436] dark:text-dark-text font-bold" 
                  : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt hover:text-futurum-text dark:hover:text-dark-text"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Additional Practice Areas (expanded) */}
          {showAllPracticeAreas && additionalPracticeAreas.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                isActive(item.path) 
                  ? "bg-futurum-sidebarActive dark:bg-dark-primaryLight text-[#313436] dark:text-dark-text font-bold" 
                  : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt hover:text-futurum-text dark:hover:text-dark-text"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* See all / Show less toggle */}
          <button
            onClick={() => setShowAllPracticeAreas(!showAllPracticeAreas)}
            className="px-3 py-1.5 text-xs text-[#357CA3] hover:text-[#2d6a8a] font-medium transition-colors"
          >
            {showAllPracticeAreas ? 'Show less' : 'See all 11'}
          </button>
          
          {/* Divider */}
          <div className="my-6 border-t border-futurum-border dark:border-dark-border" />
          
          {/* Recents Section */}
          <div className="pt-[10px]">
            <p className="px-3 py-2 text-xs font-medium text-futurum-textDim dark:text-dark-textDim uppercase tracking-wide">
              Recent Chats
            </p>
            <div className="space-y-0.5">
              {conversations.slice(0, 5).map((conv) => (
                <Link
                  key={conv.id}
                  to={`/chat/${conv.id}`}
                  className={clsx(
                    "block px-3 py-2 text-sm rounded-lg truncate transition-colors",
                    location.pathname === `/chat/${conv.id}`
                      ? "bg-futurum-sidebarActive dark:bg-dark-primaryLight text-[#313436] dark:text-dark-text"
                      : "text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt hover:text-futurum-text dark:hover:text-dark-text"
                  )}
                >
                  {conv.title || 'New conversation'}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        
        {/* User section */}
        <div className="p-3 border-t border-futurum-border dark:border-dark-border">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-futurum-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-futurum-text dark:text-dark-text truncate">
                  {user?.company_name || user?.email.split('@')[0]}
                </p>
                <p className="text-xs text-futurum-textDim dark:text-dark-textDim truncate">
                  {user?.practice_areas?.[0]?.name || 'Customer'}
                </p>
              </div>
              <ChevronDown size={14} className="text-futurum-textDim dark:text-dark-textDim" />
            </button>
            
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)} 
                />
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-futurum-white dark:bg-dark-surface border border-futurum-border dark:border-dark-border rounded-lg shadow-lg z-20 overflow-hidden">
                  <div className="px-3 py-2 border-b border-futurum-border dark:border-dark-border bg-futurum-bg dark:bg-dark-bg">
                    <p className="text-sm font-medium text-futurum-text dark:text-dark-text">{user?.email}</p>
                    <p className="text-xs text-futurum-textDim dark:text-dark-textDim">
                      {user?.is_admin ? 'Admin' : 'Customer'}
                    </p>
                  </div>
                  {user?.practice_areas && user.practice_areas.length > 0 && (
                    <div className="px-3 py-2 border-b border-futurum-border dark:border-dark-border">
                      <p className="text-xs text-futurum-textDim dark:text-dark-textDim mb-1.5">Practice Areas</p>
                      <div className="flex flex-wrap gap-1">
                        {user.practice_areas.map((pa) => (
                          <span 
                            key={pa.id}
                            className="text-xs bg-futurum-primaryLight dark:bg-dark-primaryLight text-futurum-primary dark:text-dark-primary px-2 py-0.5 rounded-full"
                          >
                            {pa.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt transition-colors border-b border-futurum-border dark:border-dark-border"
                  >
                    <div className="flex items-center space-x-2">
                      {isDark ? <Moon size={14} /> : <Sun size={14} />}
                      <span>Dark Mode</span>
                    </div>
                    <div className={clsx(
                      "w-9 h-5 rounded-full p-0.5 transition-colors",
                      isDark ? "bg-futurum-primary" : "bg-futurum-border"
                    )}>
                      <div className={clsx(
                        "w-4 h-4 rounded-full bg-white transition-transform",
                        isDark ? "translate-x-4" : "translate-x-0"
                      )} />
                    </div>
                  </button>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false) }}
                    className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-futurum-textMuted dark:text-dark-textMuted hover:bg-futurum-sidebarHover dark:hover:bg-dark-bgAlt transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Schedule a Session Button - Fixed Top Right */}
        <div className="absolute top-4 right-6 z-50">
          <button className="px-4 py-2 bg-[#831840] hover:bg-[#6a1334] text-white text-sm font-medium rounded-lg transition-colors">
            Schedule a Session
          </button>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        
        {/* Global Chat Input - Sticky Bottom */}
        <div className="sticky bottom-0 left-0 right-0">
          <GlobalChatInput />
        </div>
      </main>
    </div>
  )
}
