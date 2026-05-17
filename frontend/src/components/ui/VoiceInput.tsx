import { motion, AnimatePresence } from 'framer-motion'
import { Mic } from 'lucide-react'
import { useVoice } from '@/hooks/useVoice'

// ══════════════════════════════════════════
// VoiceInput — Mic button with wave animation
// ══════════════════════════════════════════

interface VoiceInputProps {
  onResult: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onResult, disabled = false }: VoiceInputProps) {
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoice()

  if (!isSupported) return null

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening(onResult)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        id="voice-input-btn"
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
        style={{
          background: isListening
            ? 'rgba(255,107,26,0.2)'
            : 'var(--bg-elevated)',
          border: `1px solid ${isListening ? 'rgba(255,107,26,0.5)' : 'var(--border-subtle)'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-0.5"
            >
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div
                  key={i}
                  className="wave-bar"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="mic" 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0 }}
              className="group-hover:animate-pulse"
            >
              <Mic className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listening pulse */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ border: '1px solid #FF6B1A' }}
            animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Transcript preview */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-12 right-0 w-60 rounded-xl p-3 text-sm"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(255,107,26,0.3)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--saffron)' }}>Listening...</p>
            <p className="italic" style={{ color: 'var(--text-muted)' }}>{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
