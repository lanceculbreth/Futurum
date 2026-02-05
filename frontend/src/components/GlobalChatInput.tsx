import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import clsx from 'clsx'

export default function GlobalChatInput() {
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { 
    currentConversation,
    isSending,
    sendMessage,
  } = useChatStore()
  
  const [input, setInput] = useState('')
  
  // Check if we're already on a conversation page
  const isOnConversationPage = location.pathname.startsWith('/chat/')
  
  const handleSubmit = async () => {
    if (!input.trim() || isSending) return
    const message = input
    setInput('')
    await sendMessage(message)
    // Only navigate if we're not already on a conversation page
    if (currentConversation && !isOnConversationPage) {
      navigate(`/chat/${currentConversation.id}`)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])
  
  return (
    <div className="bg-futurum-white dark:bg-dark-surface border-t border-futurum-border dark:border-dark-border px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-3xl mx-auto">
        {/* Chat Input */}
        <div className="bg-futurum-bg dark:bg-dark-bg border border-futurum-border dark:border-dark-border rounded-xl">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOnConversationPage ? "Ask a follow-up question..." : "Ask about market trends, vendor analysis, AI strategy..."}
            className="w-full bg-transparent text-futurum-text dark:text-dark-text placeholder-futurum-textDim dark:placeholder-dark-textDim px-4 py-3 resize-none focus:outline-none min-h-[44px] max-h-[120px] text-sm"
            rows={1}
          />
          <div className="flex items-center justify-between px-3 py-2 border-t border-futurum-border dark:border-dark-border">
            <div className="flex items-center space-x-2">
              <button className="p-1.5 hover:bg-futurum-white dark:hover:bg-dark-surface rounded transition-colors">
                <Plus size={18} className="text-futurum-textMuted dark:text-dark-textMuted" />
              </button>
            </div>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isSending}
              className={clsx(
                "px-4 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors",
                input.trim() 
                  ? "bg-[#0083df] hover:bg-[#006bb3] text-white" 
                  : "bg-futurum-border dark:bg-dark-border text-futurum-textDim dark:text-dark-textDim cursor-not-allowed"
              )}
            >
              <span>Ask FuturumAI →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
