import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Cpu, Terminal, Download, Zap } from 'lucide-react'
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
          /* ═══ WEB MODE: Super simple guide for non-tech users ═══ */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Friendly heading */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {isHindi ? '🎯 बस 3 आसान कदम!' : '🎯 Just 3 Easy Steps!'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isHindi
                  ? 'अपने कंप्यूटर पर AI टीचर चालू करें — बिल्कुल मुफ्त!'
                  : 'Get your own AI Teacher on your computer — totally free!'}
              </p>
            </div>

            {/* 3 Steps */}
            <div className="space-y-3">
              {[
                {
                  num: '1',
                  emoji: '⬇️',
                  title: isHindi ? 'ZIP डाउनलोड करो' : 'Download ZIP',
                  desc: isHindi ? 'नीचे बटन दबाओ — एक फाइल डाउनलोड होगी' : 'Click the button below — a file will download',
                },
                {
                  num: '2',
                  emoji: '📦',
                  title: isHindi ? 'Extract करो' : 'Extract the ZIP',
                  desc: isHindi ? 'डाउनलोड हुई ZIP पर Right Click → Extract All' : 'Right-click the ZIP → Extract All',
                },
                {
                  num: '3',
                  emoji: '🚀',
                  title: isHindi ? 'install.bat चलाओ' : 'Run install.bat',
                  desc: isHindi ? 'फोल्डर खोलो → install.bat पर डबल क्लिक → सब अपने आप!' : 'Open the folder → double-click install.bat → all automatic!',
                },
              ].map(step => (
                <div
                  key={step.num}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
                    style={{ background: 'rgba(255,107,26,0.12)', color: '#FF6B1A' }}
                  >
                    {step.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,107,26,0.15)', color: '#FF6B1A' }}>
                        {step.num}
                      </span>
                      {step.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Big Download Button */}
            <a
              href="https://github.com/YousufAziz1/limitless-ai/archive/refs/heads/main.zip"
              download
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #FF6B1A, #FF9A3C)',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(255,107,26,0.35)',
              }}
            >
              <Download className="w-5 h-5" />
              {isHindi ? '🎁 मुफ्त डाउनलोड करें' : '🎁 Free Download'}
            </a>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[
                isHindi ? '✅ कोई पैसा नहीं' : '✅ 100% Free',
                isHindi ? '🔒 प्राइवेट' : '🔒 Private',
                isHindi ? '📡 ऑफलाइन' : '📡 Works Offline',
              ].map(badge => (
                <span key={badge} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {badge}
                </span>
              ))}
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
