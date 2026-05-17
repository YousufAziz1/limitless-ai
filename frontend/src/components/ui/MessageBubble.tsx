import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Volume2, User, Copy, CheckCheck } from 'lucide-react'
import { AIOrbAssistant } from './AIOrbAssistant'
import { useVoice } from '@/hooks/useVoice'
import { useAppStore } from '@/store/appStore'
import type { Message } from '@/types'

// ══════════════════════════════════════════
// MessageBubble — Chat message with markdown
// ══════════════════════════════════════════

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  const { speak, stopSpeaking, isSpeaking } = useVoice()
  const { settings } = useAppStore()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard errors
    }
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(message.content, settings.language === 'hi' ? 'hi-IN' : 'en-IN')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
        ) : (
          <AIOrbAssistant size="sm" isActive={message.isStreaming} />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Image preview */}
        {message.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl overflow-hidden mb-1"
            style={{ border: '1px solid var(--border-subtle)', maxWidth: '200px' }}
          >
            <img src={message.imageUrl} alt="Attached" className="w-full object-cover" />
          </motion.div>
        )}

        {/* Message content */}
        <div
          className="rounded-2xl px-4 py-3"
          style={
            isUser
              ? {
                  background: 'var(--saffron)',
                  color: '#fff',
                  borderBottomRightRadius: '4px',
                }
              : {
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderBottomLeftRadius: '4px',
                }
          }
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : message.isStreaming && !message.content ? (
            /* Typing dots */
            <div className="flex items-center gap-1.5 py-1">
              <motion.div className="w-2 h-2 rounded-full" style={{ background: 'var(--saffron)' }}
                animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-2 h-2 rounded-full" style={{ background: 'var(--saffron)' }}
                animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }} />
              <motion.div className="w-2 h-2 rounded-full" style={{ background: 'var(--saffron)' }}
                animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }} />
            </div>
          ) : (
            <div className="prose-limitless text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="cursor-blink" />
              )}
            </div>
          )}
        </div>

        {/* Action buttons for AI messages */}
        {!isUser && !message.isStreaming && message.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-faint)' }}
              title="Copy"
            >
              {copied ? (
                <CheckCheck className="w-3.5 h-3.5" style={{ color: 'var(--forest)' }} />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleSpeak}
              className="p-1.5 rounded-lg transition-all duration-200"
              style={{ color: isSpeaking ? 'var(--saffron)' : 'var(--text-faint)' }}
              title="Listen"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Timestamp */}
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}
