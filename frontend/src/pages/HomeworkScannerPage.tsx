import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Lightbulb, BookOpen, Languages, Wand2, Upload, X, FileScan, Crosshair, BrainCircuit, ScanLine, Activity } from 'lucide-react'
import { InputBar } from '@/components/ui/InputBar'
import { MessageBubble } from '@/components/ui/MessageBubble'
import { AIOrbAssistant } from '@/components/ui/AIOrbAssistant'

import { ParticleCanvas } from '@/components/ui/ParticleCanvas'
import { useAppStore } from '@/store/appStore'
import { streamImageAnalysis } from '@/services/api'
import type { Message } from '@/types'

// ══════════════════════════════════════════
// ScannerPage — Premium Cinematic Redesign
// ══════════════════════════════════════════

const QUICK_PROMPTS_EN = [
  { icon: Lightbulb, label: 'Explain this', prompt: 'Please explain this content clearly and simply.' },
  { icon: Wand2, label: 'Solve step-by-step', prompt: 'Solve this step by step, showing all working.' },
  { icon: Languages, label: 'Translate to Hindi', prompt: 'Translate and explain this content in Hindi.' },
  { icon: BookOpen, label: 'Make notes', prompt: 'Create clear, concise notes from this content.' },
]

const QUICK_PROMPTS_HI = [
  { icon: Lightbulb, label: 'समझाएं', prompt: 'इस सामग्री को स्पष्ट और सरल तरीके से समझाएं।' },
  { icon: Wand2, label: 'हल करें', prompt: 'इसे चरण-दर-चरण हल करें।' },
  { icon: Languages, label: 'अंग्रेजी में', prompt: 'इस सामग्री को अंग्रेजी में समझाएं।' },
  { icon: BookOpen, label: 'नोट्स बनाएं', prompt: 'इस सामग्री से स्पष्ट नोट्स बनाएं।' },
]

const SCAN_MODES = [
  { id: 'hw', label: 'Homework', icon: BookOpen },
  { id: 'math', label: 'Math Solver', icon: Wand2 },
  { id: 'doc', label: 'Document', icon: FileScan },
  { id: 'vision', label: 'Neural Vision', icon: BrainCircuit },
]

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function HomeworkScannerPage() {
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeMode, setActiveMode] = useState('hw')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = isHindi ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const preview = e.target?.result as string
      setSelectedFile(file)
      setSelectedImage(preview)
      setMessages([])
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleClear = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setMessages([])
    abortRef.current?.abort()
  }

  const analyzeImage = async (prompt: string) => {
    if (!selectedFile || isStreaming) return

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
      imageUrl: messages.length === 0 ? selectedImage ?? undefined : undefined,
    }
    const assistantMsg: Message = { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      let accumulated = ''
      for await (const token of streamImageAnalysis(selectedFile, prompt, settings.language, settings.modelName, controller.signal)) {
        accumulated += token
        setMessages(prev => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = { ...updated[lastIdx], content: accumulated, isStreaming: true }
          }
          return updated
        })
      }
      setMessages(prev => {
        const updated = [...prev]
        const lastIdx = updated.length - 1
        if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
          updated[lastIdx] = { ...updated[lastIdx], isStreaming: false }
        }
        return updated
      })
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setMessages(prev => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = { ...updated[lastIdx], content: '❌ Neural scan failed. Vision engine offline.', isStreaming: false }
          }
          return updated
        })
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  return (
    <div className="relative min-h-screen pb-20 md:pb-0 overflow-x-hidden bg-[var(--bg-base)] text-[var(--text-primary)] font-body selection:bg-[#FF6B1A]/30 flex flex-col" style={{ paddingTop: '88px' }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
      
      {/* ── Cinematic Atmosphere & Lighting ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <ParticleCanvas count={60} color="rgba(255, 107, 26, 0.2)" />

        {/* Environmental Lighting */}
        <div className="absolute top-[20%] -left-[10%] w-[800px] h-[800px] bg-[#FF6B1A] opacity-[0.06] blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] w-[700px] h-[700px] bg-[#22C55E] opacity-[0.03] blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-[#FF6B1A] opacity-[0.04] blur-[150px] rounded-[100%] mix-blend-screen" />

        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,26,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,26,0.03)_1px,transparent_1px)] opacity-60 animate-[pulse_6s_ease-in-out_infinite_alternate]" style={{ backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_30%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

        {/* Ambient Lower Depth with Volumetric Fog */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[var(--bg-base)] via-[#050508]/80 to-transparent" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.03),transparent_70%)] blur-[80px] animate-[pulse_8s_ease-in-out_infinite_alternate]" />

        {/* Faint ambient moving scan lines at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMNCA2TTEwIDBMNiA0IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-60 animate-[slideUp_20s_linear_infinite]" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 pb-8 h-full flex flex-col flex-1">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mb-8 pl-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 text-[#FF6B1A] text-[10px] font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,107,26,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A] animate-[neuralPulse_2s_ease-in-out_infinite]" />
            Neural Vision Subsystem Active
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white/90" style={{ fontFamily: 'var(--font-display)' }}>
            {isHindi ? 'दृश्य बुद्धिमत्ता' : 'Visual Intelligence'}
          </h1>
        </motion.div>

        {/* 3-Column Architecture */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 flex-1">

          {/* ── LEFT PANEL: Tool Dock ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="xl:col-span-3 flex flex-col gap-10">

            <div className="p-6 rounded-[2rem] bg-[#0A0A0F]/50 backdrop-blur-[80px] shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] border border-white/[0.03]">
              <div className="flex items-center gap-3 mb-6">
                <p className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase">Scan Modes</p>
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
              </div>
              <div className="flex flex-col gap-3">
                {SCAN_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`relative overflow-hidden flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group ${activeMode === mode.id
                        ? 'bg-gradient-to-r from-[#FF6B1A]/10 to-transparent border border-[#FF6B1A]/20 text-white shadow-[inset_2px_0_0_#FF6B1A,0_0_20px_rgba(255,107,26,0.05)]'
                        : 'text-white/30 hover:text-white/80 border border-white/[0.01] hover:border-white/[0.08] bg-transparent hover:bg-white/[0.03] hover:-translate-y-[1px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]'
                      }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <mode.icon className={`w-4 h-4 transition-colors duration-700 relative z-10 ${activeMode === mode.id ? 'text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(255,107,26,0.5)]' : 'opacity-60 group-hover:text-white group-hover:opacity-100'}`} />
                    <span className="text-[13px] font-medium tracking-wide relative z-10">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-[#0A0A0F]/50 backdrop-blur-[80px] shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] border border-white/[0.03]">
              <div className="flex items-center gap-3 mb-6">
                <p className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase">Quick Actions</p>
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-transparent hover:bg-white/[0.03] border border-white/[0.02] hover:border-[#FF6B1A]/30 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] hover:shadow-[0_15px_30px_rgba(255,107,26,0.1)] hover:-translate-y-[1px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,26,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <Upload className="w-5 h-5 text-white/30 group-hover:text-[#FF6B1A] transition-all duration-700 drop-shadow-[0_0_0_rgba(255,107,26,0)] group-hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.4)] relative z-10" />
                  <span className="text-[11px] font-medium text-white/40 group-hover:text-white/80 relative z-10 tracking-wide">Upload File</span>
                </button>
                <button onClick={() => cameraInputRef.current?.click()} className="relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-transparent hover:bg-white/[0.03] border border-white/[0.02] hover:border-[#FF6B1A]/30 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] hover:shadow-[0_15px_30px_rgba(255,107,26,0.1)] hover:-translate-y-[1px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,26,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <Camera className="w-5 h-5 text-white/30 group-hover:text-[#FF6B1A] transition-all duration-700 drop-shadow-[0_0_0_rgba(255,107,26,0)] group-hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.4)] relative z-10" />
                  <span className="text-[11px] font-medium text-white/40 group-hover:text-white/80 relative z-10 tracking-wide">Take Photo</span>
                </button>
              </div>
            </div>

            {/* Hidden Inputs */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} disabled={isStreaming} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} disabled={isStreaming} />
          </motion.div>

          {/* ── CENTER PANEL: Main Scan Canvas ── */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="xl:col-span-6 flex flex-col gap-6">

            {!selectedImage ? (
              <div
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)} onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center min-h-[550px] rounded-[2.5rem] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer overflow-hidden scanner-canvas-hover ${isDragging ? 'bg-[#FF6B1A]/5 shadow-[0_0_100px_rgba(255,107,26,0.15),inset_0_0_40px_rgba(255,107,26,0.05)] scale-[1.01]' : 'bg-[#0A0A0F]/70 hover:bg-black/50 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_0_120px_rgba(0,0,0,0.9),inset_0_2px_1px_rgba(255,255,255,0.06)]'
                  }`}
              >
                {/* Advanced Depth Borders & Glass Reflection */}
                <div className={`absolute inset-0 rounded-[2.5rem] border ${isDragging ? 'border-[#FF6B1A]/50' : 'border-white/[0.05] border-b-black/50'} pointer-events-none z-20`} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/60 opacity-60 pointer-events-none" />
                <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[1px] pointer-events-none z-20" />

                {/* Idle Background Glows & Volumetric Haze */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.1),transparent_70%)] mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" style={{ backgroundSize: '32px 32px' }} />

                {/* Layered Depth Planes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#FF6B1A]/[0.015] blur-[80px] pointer-events-none rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#FF6B1A]/[0.03] blur-[60px] pointer-events-none rounded-full animate-[pulse_6s_ease-in-out_infinite]" />

                <AIOrbAssistant size="scanner" isActive={isDragging} className="mb-14 scale-100 opacity-100 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] drop-shadow-[0_0_80px_rgba(255,107,26,0.2)]" />

                <div className="relative z-10 text-center">
                  <p className="text-3xl tracking-tighter font-medium text-white/95 mb-5" style={{ fontFamily: 'var(--font-display)' }}>{isDragging ? 'Analyze Visual Data' : 'Upload an image to begin'}</p>
                  <p className="text-[14px] text-white/30 max-w-[280px] mx-auto leading-relaxed tracking-wide">Books, homework, diagrams, equations — Limitless understands everything.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Image Preview Canvas */}
                <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.04] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                  <img src={selectedImage} alt="Scan preview" className={`w-full max-h-[50vh] object-contain transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isStreaming ? 'brightness-50 contrast-125 grayscale-[30%] scale-105' : 'brightness-100'}`} />

                  {isStreaming && (
                    <>
                      {/* Scanning Laser */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute left-0 right-0 h-1 bg-[#FF6B1A]/90 shadow-[0_0_40px_rgba(255,107,26,0.5),0_0_15px_rgba(255,255,255,0.6)] animate-[scannerSweep_3.5s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,26,0.08)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30 mix-blend-screen" />
                      </div>

                      {/* OCR Bounding Boxes */}
                      <div className="absolute top-[20%] left-[15%] w-[35%] h-[12%] border border-[#22C55E]/60 bg-[#22C55E]/10 animate-[ocrBoxAppear_1.5s_ease-out_infinite] pointer-events-none flex items-start justify-start p-1 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <span className="text-[8px] bg-[#22C55E] text-black px-1.5 font-mono font-bold tracking-widest uppercase">OCR: Equation Found</span>
                      </div>
                      <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[8%] border border-[#3b82f6]/60 bg-[#3b82f6]/10 animate-[ocrBoxAppear_2.1s_ease-out_infinite] pointer-events-none flex items-start justify-start p-1 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <span className="text-[8px] bg-[#3b82f6] text-white px-1.5 font-mono font-bold tracking-widest uppercase">Detecting Context...</span>
                      </div>
                    </>
                  )}

                  {!isStreaming && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-[20px] border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                        <ScanLine className="w-4 h-4 text-[#FF6B1A]" />
                        <span className="text-xs font-medium text-white/90">Scan Complete</span>
                      </div>
                      <button onClick={handleClear} className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-[#FF6B1A] border border-white/10 backdrop-blur-md transition-colors text-white/70 hover:text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div className="relative z-20 mt-2">
                  <InputBar onSend={analyzeImage} isStreaming={isStreaming} onCancel={() => abortRef.current?.abort()} placeholder="Ask anything about this scan..." />
                </div>

                {/* Quick Prompts (If no messages yet) */}
                {messages.length === 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {quickPrompts.map((qp, i) => (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        key={qp.label} onClick={() => analyzeImage(qp.prompt)}
                        className="relative overflow-hidden flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#0A0A0F]/40 hover:bg-white/[0.04] border border-white/[0.04] hover:border-[#FF6B1A]/30 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-white/60 hover:text-white/95 text-[12px] font-medium shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_15px_30px_rgba(255,107,26,0.15)] hover:-translate-y-[2px] group backdrop-blur-[20px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B1A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <qp.icon className="w-4 h-4 text-[#FF6B1A]/80 group-hover:text-[#FF6B1A] drop-shadow-[0_0_0_rgba(255,107,26,0)] group-hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.5)] transition-all duration-700 relative z-10" />
                        <span className="relative z-10">{qp.label}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message History */}
            {messages.length > 0 && (
              <div className="flex flex-col gap-6 mt-8">
                {messages.map((msg, i) => <MessageBubble key={msg.id} message={msg} isLatest={i === messages.length - 1} />)}
                <div ref={messagesEndRef} />
              </div>
            )}
          </motion.div>

          {/* ── RIGHT PANEL: Neural Telemetry ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="hidden xl:flex flex-col col-span-3 gap-8">

            <div className="p-6 rounded-[2rem] bg-[#0A0A0F]/50 backdrop-blur-[80px] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] border border-white/[0.03] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B1A] opacity-10 blur-[50px] pointer-events-none mix-blend-screen" />

              <div className="flex items-center gap-3 mb-8">
                <p className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase">Telemetry</p>
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
                <Activity className="w-3.5 h-3.5 text-[#FF6B1A]/50" />
              </div>

              <div className="space-y-8 relative z-10">
                {/* Engine Status */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-medium text-white/60">Vision Engine</span>
                    <span className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[neuralPulse_2s_ease-in-out_infinite] shadow-[0_0_10px_#22C55E]" /> ONLINE
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#22C55E]/20 to-[#22C55E] w-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                </div>

                {/* Processing Load */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-medium text-white/60">Inference Load</span>
                    <span className="text-[10px] font-mono tracking-widest text-[#FF6B1A]">{isStreaming ? '89%' : '12%'}</span>
                  </div>
                  <div className="flex items-end gap-[3px] h-8">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#FF6B1A]/20 to-[#FF6B1A]/80 rounded-t-[1px] animate-[waveformLine_1.5s_ease-in-out_infinite]" style={{ animationDelay: `${isStreaming ? Math.random() : i * 0.1}s`, height: isStreaming ? `${10 + Math.random() * 90}%` : `${10 + Math.random() * 20}%` }} />
                    ))}
                  </div>
                </div>

                {/* Model Info with Live Activity */}
                <div className="pt-6 border-t border-white/[0.04] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-2 font-mono"><span className="w-1.5 h-1.5 bg-[#FF6B1A] rounded-full animate-pulse" /> Model Core</span>
                    <span className="text-xs font-mono text-white/80">Gemma-2b-IT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Network Latency</span>
                    <span className="text-xs font-mono text-[#22C55E] animate-[pulse_3s_ease-in-out_infinite]">{isStreaming ? '42ms' : '8ms'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Context Window</span>
                    <span className="text-xs font-mono text-white/80">8K Tokens</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-[60px] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Crosshair className="w-4 h-4 text-[#FF6B1A]/60" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">Scan Accuracy</span>
              </div>
              <div className="relative h-36 w-36 flex items-center justify-center z-10">
                <div className="absolute inset-0 rounded-full border border-[#FF6B1A]/20 bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.04),transparent)] shadow-[0_0_30px_rgba(255,107,26,0.15),inset_0_0_20px_rgba(255,107,26,0.1)] scale-[0.7]" />

                {/* Multi-layered confidence rings */}
                <div className="absolute inset-0 rounded-full border border-[#FF6B1A]/30 scale-[0.85] animate-[spin_20s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
                <div className="absolute inset-0 rounded-full border-t border-l border-[#FF6B1A] scale-[0.95] animate-[spin_4s_ease-in-out_infinite_alternate]" />
                <div className="absolute inset-0 rounded-full border-b border-r border-[#FF6B1A]/50 scale-[1.05] animate-[spin_8s_linear_infinite]" />

                {/* Confidence Glow */}
                <div className="absolute inset-0 rounded-full bg-[#FF6B1A]/[0.07] blur-[20px] animate-[pulse_2s_ease-in-out_infinite]" />

                <div className="text-4xl font-display font-light text-white/95 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-start">
                  98<span className="text-lg text-white/30 ml-1 mt-1">%</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

    </div>
  )
}
