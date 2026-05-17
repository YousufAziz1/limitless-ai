import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

// ══════════════════════════════════════════
// LanguageToggle — EN / HI animated switcher
// ══════════════════════════════════════════

export function LanguageToggle() {
  const { settings, setLanguage } = useAppStore()
  const isHindi = settings.language === 'hi'

  const toggle = () => setLanguage(isHindi ? 'en' : 'hi')

  return (
    <div
      className="relative flex items-center p-1 rounded-full cursor-pointer backdrop-blur-xl bg-black/40 border border-white/10 shadow-inner overflow-hidden group"
      onClick={toggle}
      id="language-toggle"
      aria-label={`Switch to ${isHindi ? 'English' : 'Hindi'}`}
      style={{ width: '84px', height: '36px' }}
    >
      {/* Sliding pill */}
      <motion.div
        className="absolute inset-y-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-white/20"
        style={{
          width: '38px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)'
        }}
        animate={{ x: isHindi ? 40 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>

      {/* EN label */}
      <div className="relative z-10 w-1/2 flex items-center justify-center">
        <span
          className="text-[11px] font-bold tracking-widest transition-all duration-300"
          style={{ color: !isHindi ? '#fff' : 'rgba(255,255,255,0.4)', textShadow: !isHindi ? '0 0 10px rgba(255,255,255,0.5)' : 'none' }}
        >
          EN
        </span>
      </div>

      {/* HI label */}
      <div className="relative z-10 w-1/2 flex items-center justify-center">
        <span
          className="text-[11px] font-bold tracking-widest transition-all duration-300"
          style={{ color: isHindi ? '#fff' : 'rgba(255,255,255,0.4)', textShadow: isHindi ? '0 0 10px rgba(255,255,255,0.5)' : 'none' }}
        >
          HI
        </span>
      </div>
    </div>
  )
}
