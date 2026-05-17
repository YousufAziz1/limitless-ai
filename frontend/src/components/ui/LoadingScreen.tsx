import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

// ══════════════════════════════════════════
// LoadingScreen — Cinematic intro
// ══════════════════════════════════════════

export function LoadingScreen() {
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-saffron absolute" style={{ width: '600px', height: '600px', top: '-200px', left: '-150px' }} />
        <div className="orb orb-forest absolute" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo orb */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #FF6B1A, #F5C842, #22C55E, transparent)',
              filter: 'blur(3px)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Logo circle */}
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FF9A3C, #FF6B1A 55%, #C44D0A)',
              boxShadow: '0 0 60px rgba(255,107,26,0.5), 0 0 120px rgba(255,107,26,0.2)',
            }}
          >
            <span
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ن
            </span>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h1
            className="text-5xl font-bold tracking-tight text-gradient"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LIMITLESS AI
          </h1>
          <p className="mt-2 text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            {isHindi ? 'हर बच्चे के लिए ऑफलाइन AI स्कूल' : 'Offline AI School for Every Child'}
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center max-w-xs text-sm italic"
          style={{ color: 'var(--text-muted)' }}
        >
          {isHindi
            ? '"Limitless" का अर्थ है असीम — भारत के हर कोने में ज्ञान का प्रकाश लाना'
            : '"Limitless" means boundless — bringing light of knowledge to every corner of India'}
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '200px' }}
          transition={{ delay: 1, duration: 0.4 }}
          className="relative h-0.5 rounded-full overflow-hidden"
          style={{ background: 'var(--border-subtle)' }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--saffron), var(--gold))' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.2, duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Powered by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--forest)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
            {isHindi ? 'Gemma 4 · Ollama · llama.cpp द्वारा संचालित' : 'Powered by Gemma 4 · Ollama · llama.cpp'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
