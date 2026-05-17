import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Cpu, Terminal, Download, Zap, WifiOff } from 'lucide-react'
import { useElectronSetup, isElectron } from '@/hooks/useElectronSetup'
import { useAppStore } from '@/store/appStore'
import type { SetupProgress } from '@/hooks/useElectronSetup'

// ══════════════════════════════════════════
// SetupPage — Cinematic Auto-Installer UI
// Electron: fully automatic pipeline
// Web: guides user to start backend
// ══════════════════════════════════════════

interface ModelOption {
  id: string
  label: string
  labelHi: string
  size: string
  time: string
  badge?: string
  desc: string
  descHi: string
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'gemma3:4b',
    label: 'Quick Start',
    labelHi: 'तेज़ शुरुआत',
    size: '~2.5 GB',
    time: '~20 min',
    desc: 'Lighter, faster. Great for basic learning.',
    descHi: 'हल्का और तेज़। बेसिक पढ़ाई के लिए बेस्ट।',
  },
  {
    id: 'gemma4:e4b',
    label: 'Full Brain',
    labelHi: 'पूरा दिमाग',
    size: '~9.6 GB',
    time: '~1 hour',
    badge: 'Recommended',
    desc: 'Multimodal vision, math OCR, full power.',
    descHi: 'इमेज देख सकता है, गणित OCR, पूरी ताकत।',
  },
]

const PHASES = [
  { id: 'ollama',  label: 'AI Engine',   labelHi: 'AI इंजन',    icon: Download  },
  { id: 'model',   label: 'AI Brain',    labelHi: 'AI दिमाग',    icon: Cpu       },
  { id: 'backend', label: 'AI Core',     labelHi: 'AI कोर',      icon: Terminal  },
]

function formatMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${Math.round(mb)} MB`
}

function ProgressBar({ percent, color = '#FF6B1A' }: { percent: number; color?: string }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percent, 100)}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

export function SetupPage({ onConnected }: { onConnected: () => void }) {
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'

  const [progress, setProgress] = useState<SetupProgress | null>(null)
  const [started, setStarted] = useState(false)

  // Web mode: poll count for display
  const handleReady = useCallback(() => {
    onConnected()
  }, [onConnected])

  // Override: hook handles polling for web, IPC for Electron
  const { startSetup } = useElectronSetup(handleReady)

  // Listen to Electron progress in Electron mode
  if (isElectron() && typeof window.electronAPI !== 'undefined') {
    window.electronAPI.onSetupProgress((data) => {
      setProgress(data)
      if (data.phase === 'ready') setTimeout(onConnected, 1200)
    })
  }

  const handleStart = (model: ModelOption) => {
    setStarted(true)
    setProgress({ phase: 'checking', percent: 0, message: isHindi ? 'सिस्टम जाँच रहे हैं...' : 'Checking your system...' })
    startSetup(model.id)
  }

  // Current active phase index
  const activePhaseIdx = progress
    ? PHASES.findIndex(p => p.id === progress.phase)
    : -1

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#08080f' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 600, height: 600, top: -200, left: -150, background: 'radial-gradient(circle, rgba(255,107,26,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute rounded-full" style={{ width: 500, height: 500, bottom: -150, right: -100, background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'radial-gradient(rgba(255,107,26,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 w-full max-w-xl px-6 py-12">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'radial-gradient(circle at 35% 35%, #FF9A3C, #FF6B1A 55%, #C44D0A)', boxShadow: '0 0 40px rgba(255,107,26,0.35)' }}
          >
            <span className="text-2xl font-bold text-white">∞</span>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{ background: 'linear-gradient(135deg, #e8e8f0, #FF6B1A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            LIMITLESS AI
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isHindi ? 'आपके डिवाइस पर — बिल्कुल मुफ्त, पूरी तरह ऑफलाइन' : 'On your device — free, fully offline, forever'}
          </p>
        </motion.div>

        {/* ═══ ELECTRON MODE: Auto-installer ═══ */}
        {isElectron() ? (
          <AnimatePresence mode="wait">
            {!started ? (
              /* Model selection */
              <motion.div key="model-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="text-center text-sm font-medium mb-5" style={{ color: 'var(--text-muted)' }}>
                  {isHindi ? 'AI मॉडल चुनें' : 'Choose your AI model'}
                </p>
                <div className="space-y-3">
                  {MODEL_OPTIONS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleStart(model)}
                      className="w-full text-left p-5 rounded-2xl transition-all duration-300 group relative"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,107,26,0.2)' }} />
                      {model.badge && (
                        <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(255,107,26,0.15)', color: '#FF6B1A', border: '1px solid rgba(255,107,26,0.3)' }}>
                          {model.badge}
                        </span>
                      )}
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,26,0.1)' }}>
                          <Cpu className="w-5 h-5" style={{ color: '#FF6B1A' }} />
                        </div>
                        <div>
                          <p className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                            {isHindi ? model.labelHi : model.label}
                          </p>
                          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                            {isHindi ? model.descHi : model.desc}
                          </p>
                          <div className="flex gap-3">
                            <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{model.size}</span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>⏱ {model.time}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Auto-install progress */
              <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* Steps */}
                <div className="space-y-3 mb-6">
                  {PHASES.map((phase, idx) => {
                    const Icon = phase.icon
                    const isDone = activePhaseIdx > idx
                    const isActive = activePhaseIdx === idx
                    const isPending = activePhaseIdx < idx

                    return (
                      <div
                        key={phase.id}
                        className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-500"
                        style={{
                          background: isActive ? 'rgba(255,107,26,0.07)' : isDone ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isActive ? 'rgba(255,107,26,0.25)' : isDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
                          opacity: isPending ? 0.4 : 1,
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: isDone ? 'rgba(34,197,94,0.12)' : isActive ? 'rgba(255,107,26,0.12)' : 'rgba(255,255,255,0.04)' }}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
                          ) : isActive ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                              <div style={{ color: '#FF6B1A' }}><Icon className="w-4 h-4" /></div>
                            </motion.div>
                          ) : (
                            <div style={{ color: 'rgba(255,255,255,0.2)' }}><Icon className="w-4 h-4" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono mb-0.5" style={{ color: isDone ? '#22C55E' : isActive ? '#FF6B1A' : 'var(--text-faint)' }}>
                            {isDone ? '✓ DONE' : isActive ? 'INSTALLING' : 'PENDING'}
                          </p>
                          <p className="text-sm font-medium truncate" style={{ color: isActive || isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {isHindi ? phase.labelHi : phase.label}
                          </p>
                          {isActive && progress && (
                            <div className="mt-1.5">
                              <ProgressBar percent={progress.percent} />
                              <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>
                                {progress.message}
                                {progress.speed && <span style={{ color: 'var(--text-faint)' }}> — {progress.speed.toFixed(1)} MB/s</span>}
                                {progress.eta && <span style={{ color: 'var(--text-faint)' }}> · {progress.eta} left</span>}
                              </p>
                              {progress.downloaded != null && progress.total != null && (
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                                  {formatMB(progress.downloaded)} / {formatMB(progress.total)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Overall progress */}
                {progress?.phase === 'ready' ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 py-6">
                    <CheckCircle2 className="w-12 h-12" style={{ color: '#22C55E' }} />
                    <p className="text-lg font-bold" style={{ color: '#22C55E' }}>
                      {isHindi ? '🎉 Limitless AI तैयार है!' : '🎉 Limitless AI is Ready!'}
                    </p>
                  </motion.div>
                ) : progress?.phase === 'error' ? (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    <p className="text-sm font-medium" style={{ color: '#f87171' }}>❌ {progress.error}</p>
                    <button onClick={() => { setStarted(false); setProgress(null) }} className="mt-2 text-xs underline" style={{ color: 'var(--text-muted)' }}>
                      {isHindi ? 'पुनः प्रयास करें' : 'Try again'}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
                    {isHindi ? 'कृपया प्रतीक्षा करें — बैकग्राउंड में इंस्टॉल हो रहा है' : 'Please wait — installing silently in background'}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        ) : (
          /* ═══ WEB MODE: Beautiful connect page ═══ */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Hero message */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {isHindi ? 'AI को अपने डिवाइस पर चलाएं' : 'Run AI on Your Device'}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {isHindi
                  ? 'Limitless AI आपके कंप्यूटर पर चलता है — पूरी तरह मुफ्त, प्राइवेट, और ऑफलाइन।'
                  : 'Limitless AI runs locally on your computer — completely free, private, and offline.'}
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '🔒', label: isHindi ? 'प्राइवेट' : 'Private', desc: isHindi ? 'डेटा आपके डिवाइस पर' : 'Data stays on device' },
                { emoji: '⚡', label: isHindi ? 'मुफ्त' : 'Free', desc: isHindi ? 'कोई API खर्चा नहीं' : 'No API costs ever' },
                { emoji: '📡', label: isHindi ? 'ऑफलाइन' : 'Offline', desc: isHindi ? 'बिना इंटरनेट काम करे' : 'Works without internet' },
              ].map(b => (
                <div key={b.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-2xl mb-1">{b.emoji}</div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{b.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Download CTA */}
            <a
              href="https://github.com/YousufAziz1/limitless-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #FF6B1A, #FF9A3C)',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(255,107,26,0.3)',
              }}
            >
              <Download className="w-4 h-4" />
              {isHindi ? 'डेस्कटॉप ऐप डाउनलोड करें' : 'Download Desktop App'}
            </a>

            {/* Already have it? */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <WifiOff className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {isHindi ? 'पहले से इंस्टॉल है? बस बैकएंड चालू करें' : 'Already installed? Just start the backend'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  {isHindi ? 'यह पेज ऑटो-अनलॉक हो जाएगा' : 'This page auto-unlocks when detected'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom tag */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-2 mt-8">
          <div style={{ color: '#FF6B1A' }}><Zap className="w-3.5 h-3.5" /></div>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {isHindi ? 'इंटरनेट सिर्फ एक बार — उसके बाद हमेशा ऑफलाइन' : 'Internet once — then forever offline'}
          </p>
        </motion.div>

      </div>
    </div>
  )
}
