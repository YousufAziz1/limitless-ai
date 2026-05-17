import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { useAppStore } from '@/store/appStore'
import type { ChatMode } from '@/types'

const MODES: { id: ChatMode; label: string; labelHi: string; color: string }[] = [
  { id: 'explain', label: 'Explain Simply', labelHi: 'सरल व्याख्या', color: '#FF6B1A' },
  { id: 'exam', label: 'Exam Mode', labelHi: 'परीक्षा मोड', color: '#818CF8' },
  { id: 'revision', label: 'Fast Revision', labelHi: 'तेज़ दोहराव', color: '#F5C842' },
  { id: 'weak', label: 'Weak Student', labelHi: 'सरल मोड', color: '#22C55E' },
]

// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Main Sidebar Panel
// ─────────────────────────────────────────────────────────────
function SidebarPanel() {
  const { sessions, activeSessionId, setActiveSession, createSession, deleteSession, currentMode, setMode } = useChatStore()
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'
  const recentSessions = sessions.slice(0, 8)

  return (
    <div className="sidebar">





      {/* LEARNING MODES */}
      <p className="sidebar-label">{isHindi ? 'सीखने का तरीका' : 'LEARNING MODE'}</p>
      <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0, marginBottom: '16px' }}>
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className={`learning-item${currentMode === mode.id ? ' active' : ''}`}
          >
            <div style={{
              width: currentMode === mode.id ? '7px' : '5px',
              height: currentMode === mode.id ? '7px' : '5px',
              borderRadius: '50%', flexShrink: 0, transition: 'all 0.2s ease',
              background: mode.color,
              boxShadow: currentMode === mode.id ? `0 0 7px ${mode.color}` : 'none',
              opacity: currentMode === mode.id ? 1 : 0.45,
            }} />
            <span>{isHindi ? mode.labelHi : mode.label}</span>
          </button>
        ))}
      </div>

      {/* RECENT CHATS */}
      <p className="sidebar-label">{isHindi ? 'हालिया चैट' : 'RECENT CHATS'}</p>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 4px', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px', paddingRight: '12px' }}>
          <button
            onClick={() => createSession(undefined, settings.language)}
            style={{
              padding: '4px 6px', borderRadius: '6px', background: 'transparent',
              border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="New chat"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Plus style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}
          className="scrollbar-hide">
          <AnimatePresence>
            {(() => {
              const PLACEHOLDER_CHATS = [
                { id: '__p1', title: isHindi ? 'फिजिक्स मदद' : 'Physics Help' },
                { id: '__p2', title: isHindi ? 'DNA सवाल' : 'DNA Question' },
                { id: '__p3', title: isHindi ? 'गणित दोहरावन' : 'Math Revision' },
                { id: '__p4', title: isHindi ? 'इतिहास नोट्स' : 'History Notes' },
              ]
              const displaySessions = recentSessions.length > 0 ? recentSessions : PLACEHOLDER_CHATS
              return displaySessions.map((session, i) => {
                const isPlaceholder = session.id.startsWith('__p')
                const isActive = activeSessionId === session.id
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: isPlaceholder ? 0.42 : 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '0 16px', height: '34px', borderRadius: '10px',
                      cursor: isPlaceholder ? 'default' : 'pointer',
                      background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                      boxShadow: isActive ? 'inset 0 0 10px rgba(255,255,255,0.01)' : 'none',
                      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    whileHover={!isPlaceholder ? { backgroundColor: 'rgba(255,255,255,0.02)', x: 2 } : {}}
                    onClick={() => !isPlaceholder && setActiveSession(session.id)}
                  >
                    <div style={{
                      width: '4px', height: '4px', borderRadius: '50%', flexShrink: 0,
                      background: isActive ? '#FF6B1A' : 'rgba(255,255,255,0.1)',
                    }} />
                    <span style={{
                      flex: 1, fontSize: '12px', fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {session.title}
                    </span>
                    {!isPlaceholder && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteSession(session.id) }}
                        style={{
                          padding: '3px', borderRadius: '5px', background: 'transparent',
                          border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Trash2 style={{ width: '11px', height: '11px' }} />
                      </button>
                    )}
                  </motion.div>
                )
              })
            })()}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '14px 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ position: 'relative', width: '18px', height: '18px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} />
            <motion.div
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(34,197,94,0.3)' }}
              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '8.5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
              {isHindi ? 'लिमिटलेस कोर' : 'LIMITLESS CORE'}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', marginTop: '3px', lineHeight: 1 }}>
              {isHindi ? 'चालू' : 'ONLINE'}
            </div>
          </div>
        </div>

        {[
          { label: isHindi ? 'मेम' : 'MEM', val: '840M', pct: '35%', color: 'rgba(255,107,26,0.8)' },
          { label: isHindi ? 'स्टोर' : 'STRG', val: isHindi ? 'स्थानीय' : 'LCL', pct: '12%', color: 'rgba(59,130,246,0.8)' },
        ].map(bar => (
          <div key={bar.label} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '8.5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>{bar.label}</span>
              <span style={{ fontSize: '8.5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>{bar.val}</span>
            </div>
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: bar.color, borderRadius: '2px' }}
                initial={{ width: '0%' }}
                animate={{ width: bar.pct }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Sidebar export — single wrapper (58px rail + 240px panel)
// ─────────────────────────────────────────────────────────────
export function Sidebar() {
  return (
    <div className="hidden md:flex relative z-30 sidebar-wrapper">
      <div className="hidden lg:block h-full">
        <SidebarPanel />
      </div>
    </div>
  )
}


