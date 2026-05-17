import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Square, Image as ImageIcon } from 'lucide-react'
import { VoiceInput } from './VoiceInput'
import { useAppStore } from '@/store/appStore'

// ══════════════════════════════════════════
// InputBar — Chat input with voice + image
// ══════════════════════════════════════════

interface InputBarProps {
  onSend: (text: string, imageUrl?: string) => void
  onImageUploadRequest?: () => void
  isStreaming?: boolean
  onCancel?: () => void
  placeholder?: string
  disabled?: boolean
}

export function InputBar({
  onSend,
  onImageUploadRequest,
  isStreaming = false,
  onCancel,
  placeholder,
  disabled = false,
}: InputBarProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'

  const defaultPlaceholder = isHindi
    ? 'कोई भी सवाल पूछें... (Hindi or English)'
    : 'Ask anything... Limitless is here to help'

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceResult = (text: string) => {
    setValue(prev => prev ? `${prev} ${text}` : text)
    textareaRef.current?.focus()
  }

  const canSend = value.trim().length > 0 && !isStreaming && !disabled

  return (
    <div
      className={`relative rounded-[1.25rem] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-visible backdrop-blur-[40px] group/dock ${!canSend ? 'idle-glow' : ''}`}
      style={{
        background: 'linear-gradient(180deg, rgba(15,15,20,0.4) 0%, rgba(5,5,8,0.6) 100%)',
        border: `1px solid ${canSend ? 'rgba(255,107,26,0.3)' : 'rgba(255,255,255,0.05)'}`,
        boxShadow: canSend ? '0 10px 40px rgba(255,107,26,0.15), inset 0 2px 20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,107,26,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.03), 0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      {/* Outer focus glow using an absolute div so we don't clip it */}
      <div className="absolute -inset-[2px] rounded-[1.35rem] bg-gradient-to-r from-[#FF6B1A]/0 via-[#FF6B1A]/20 to-[#FF6B1A]/0 opacity-0 group-focus-within/dock:opacity-100 blur-[20px] transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-[-1]" />
      {/* Animated focus edge glow */}
      {canSend && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6B1A]/0 via-[#FF6B1A]/20 to-[#FF6B1A]/0 opacity-60 blur-md pointer-events-none" />
      )}
      
      <div className="flex items-end gap-2 px-3 py-3 relative z-10">
        {/* Left Actions */}
        <div className="flex items-center gap-1.5 pb-0.5">
          {onImageUploadRequest && (
            <button
              onClick={onImageUploadRequest}
              id="attach-image-btn"
              aria-label="Attach image"
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:text-white text-white/40"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          )}
          <div className="h-10 flex items-center">
            <VoiceInput onResult={handleVoiceResult} disabled={isStreaming || disabled} />
          </div>
        </div>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? defaultPlaceholder}
          disabled={isStreaming || disabled}
          rows={1}
          className="flex-1 bg-transparent resize-none py-2.5 px-2 outline-none text-[15px] leading-relaxed placeholder-shimmer transition-colors self-center min-h-[44px] max-h-[160px] scrollbar-hide"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            caretColor: 'var(--saffron)',
          }}
        />

        {/* Right Actions */}
        <div className="flex items-center pb-0.5">
          <AnimatePresence mode="wait">
            {isStreaming ? (
              <motion.button
                key="cancel"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={onCancel}
                id="cancel-stream-btn"
                aria-label="Cancel generation"
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              >
                <Square className="w-4 h-4 fill-current" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={handleSend}
                id="send-message-btn"
                disabled={!canSend}
                aria-label="Send message"
                className="relative group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
                style={{
                  background: canSend ? '#FF6B1A' : 'rgba(255,255,255,0.03)',
                  color: canSend ? '#fff' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${canSend ? '#FF6B1A' : 'rgba(255,255,255,0.03)'}`,
                  boxShadow: canSend ? '0 4px 15px rgba(255,107,26,0.3), inset 0 -2px 10px rgba(0,0,0,0.1)' : 'none',
                  cursor: canSend ? 'pointer' : 'not-allowed',
                }}
                whileHover={canSend ? { scale: 1.05, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.4 } } : {}}
                whileTap={canSend ? { scale: 0.95 } : {}}
              >
                {canSend && (
                  <>
                    {/* Liquid glow effect behind send icon */}
                    <motion.div 
                      className="absolute inset-0 opacity-60 mix-blend-screen"
                      style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] skew-x-12 group-hover:animate-[bgShimmer_1.5s_infinite] pointer-events-none" />
                  </>
                )}
                <Send className="w-4 h-4 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] ml-0.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
