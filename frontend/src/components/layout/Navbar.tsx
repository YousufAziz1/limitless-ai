import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, MessageSquare, Star, BookOpen,
  Zap, ChevronRight, Camera
} from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { OfflineBadge } from '@/components/ui/OfflineBadge'
import { useAppStore } from '@/store/appStore'

// ══════════════════════════════════════════
// Navbar — Cinematic AI OS Navigation
// Matches Scanner page visual identity
// ══════════════════════════════════════════

const NAV_LINKS = [
  { href: '/chat',     label: 'AI Tutor',  labelHi: 'AI शिक्षक',  icon: MessageSquare },
  { href: '/scan',     label: 'Scanner',   labelHi: 'स्कैनर',      icon: Camera },
  { href: '/dream',    label: 'Dream',     labelHi: 'सपने',       icon: Star },
  { href: '/subjects', label: 'Subjects',  labelHi: 'विषय',       icon: BookOpen },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'

  return (
    <>
      <header
        className="fixed top-4 left-6 right-6 z-40 rounded-full"
        style={{
          background: 'rgba(5, 5, 7, 0.75)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
          animation: 'float 6s ease-in-out infinite',
        }}
      >
        {/* ── Atmospheric Lighting Layers ── */}
        <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
          {/* Orange glow — top-left */}
          <div
            className="absolute -top-4 -left-4 w-40 h-16 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 107, 26, 0.10) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }}
          />
          {/* Green neural reflection — right */}
          <div
            className="absolute -top-2 right-8 w-24 h-10 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.06) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
          {/* Subtle inner gradient sweep */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(255,107,26,0.03) 0%, transparent 40%, rgba(34,197,94,0.02) 100%)',
            }}
          />
        </div>

        <div className="px-5 py-3.5 min-h-[68px] flex items-center justify-between gap-4 relative z-10">

          {/* ── Logo ── */}
          <Link to="/" className="group flex items-center gap-3 flex-shrink-0 relative">
            <div
              className="relative w-9 h-9 rounded-[11px] flex items-center justify-center text-white font-bold text-lg overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:rotate-[4deg]"
              style={{
                background: 'radial-gradient(circle at top left, #FF9A3C, #FF6B1A)',
                boxShadow: '0 0 18px rgba(255,107,26,0.28)',
                fontFamily: 'var(--font-display)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full" style={{ animation: 'shimmer 4s infinite' }} />
              ن
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-[18px] tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(135deg, #FFB27A, #FF6B1A, #FFD07A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                LIMITLESS
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: 'rgba(255,107,26,0.45)' }}>
                {isHindi ? 'ऑफलाइन AI OS' : 'Offline AI OS'}
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav — Perfectly Centered ── */}
          <nav className="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.href

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[13.5px] font-medium tracking-wide transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.38)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.38)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {/* Active indicator pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 0 18px rgba(255,120,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  <Icon
                    className="relative z-10 transition-all duration-300"
                    style={{
                      width: '15px',
                      height: '15px',
                      color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(255,255,255,0.3))' : 'none',
                    }}
                  />
                  <span className="relative z-10">{isHindi ? link.labelHi : link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Live AI Status */}
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.18)',
                boxShadow: '0 0 12px rgba(34,197,94,0.07)',
              }}
            >
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #22c55e' }} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: 'rgba(74,222,128,0.9)' }}>
                  {isHindi ? '● लाइव लोकल AI' : '● LIVE LOCAL AI'}
                </span>
                <span className="text-[8px] font-mono mt-0.5" style={{ color: 'rgba(74,222,128,0.55)' }}>
                  {isHindi ? 'Gemma 4 चालू है' : 'Gemma 4 Running'}
                </span>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* CTA Button */}
            <Link
              to="/chat"
              id="nav-start-btn"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-semibold tracking-wide relative overflow-hidden group transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                background: 'linear-gradient(135deg, #E8702E, #D45A18)',
                boxShadow: '0 4px 16px rgba(230,109,41,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,109,41,0.42), inset 0 1px 0 rgba(255,255,255,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(230,109,41,0.28), inset 0 1px 0 rgba(255,255,255,0.12)'
              }}
            >
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-in-out" />
              <Zap className="w-3.5 h-3.5 fill-current relative z-10" />
              <span className="relative z-10">{isHindi ? 'पढ़ें' : 'Start Learning Free'}</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              id="mobile-menu-btn"
              aria-label="Toggle menu"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-4 h-4 text-white/70" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-4 h-4 text-white/70" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-40 md:hidden flex flex-col"
              style={{
                background: 'rgba(8,8,12,0.96)',
                backdropFilter: 'blur(40px)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <span className="font-semibold text-white/80" style={{ fontFamily: 'var(--font-display)' }}>{isHindi ? 'मेनू' : 'Menu'}</span>
                <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                        style={{
                          color: isActive ? '#FF8A4A' : 'rgba(255,255,255,0.6)',
                          background: isActive ? 'rgba(255,107,26,0.08)' : 'transparent',
                          border: isActive ? '1px solid rgba(255,107,26,0.15)' : '1px solid transparent',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{isHindi ? link.labelHi : link.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-30" />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom section */}
              <div className="mt-auto p-4 border-t border-white/5 space-y-3">
                <LanguageToggle />
                <OfflineBadge />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
