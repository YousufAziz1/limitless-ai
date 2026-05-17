import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Stethoscope, Cpu, Shield,
  FlaskConical, ArrowRight, Sparkles, RotateCcw,
  Target, Send, BrainCircuit, Activity, Clock
} from 'lucide-react'
import { AIOrbAssistant } from '@/components/ui/AIOrbAssistant'

import { useAppStore } from '@/store/appStore'
import { streamDreamPlan } from '@/services/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ══════════════════════════════════════════
// DreamBuilderPage — Ultra Cinematic Mentorship
// ══════════════════════════════════════════

interface CareerOption {
  id: string
  label: string
  labelHi: string
  icon: React.FC<{ className?: string }>
  color: string
  emoji: string
  tagline: string
  taglineHi: string
}

const CAREERS: CareerOption[] = [
  {
    id: 'doctor', label: 'Doctor', labelHi: 'डॉक्टर', icon: Stethoscope, color: '#F87171',
    emoji: '🏥', tagline: 'Heal the world', taglineHi: 'दुनिया को ठीक करो',
  },
  {
    id: 'engineer', label: 'Engineer', labelHi: 'इंजीनियर', icon: Cpu, color: '#60A5FA',
    emoji: '⚙️', tagline: 'Build the future', taglineHi: 'भविष्य बनाओ',
  },
  {
    id: 'ias', label: 'IAS Officer', labelHi: 'IAS अधिकारी', icon: Shield, color: '#FF6B1A',
    emoji: '🏛️', tagline: 'Serve the nation', taglineHi: 'राष्ट्र की सेवा करो',
  },
  {
    id: 'scientist', label: 'Scientist', labelHi: 'वैज्ञानिक', icon: FlaskConical, color: '#A78BFA',
    emoji: '🔬', tagline: 'Discover the unknown', taglineHi: 'अज्ञात की खोज करो',
  },
]

const SUGGESTIONS_EN = [
  "I want to become an AI engineer",
  "Help me become a doctor",
  "Roadmap for IAS",
  "Become financially independent"
]

const SUGGESTIONS_HI = [
  "मैं AI इंजीनियर बनना चाहता हूं",
  "डॉक्टर बनने में मदद करो",
  "IAS के लिए रोडमैप",
  "आर्थिक रूप से स्वतंत्र बनो"
]

export function DreamBuilderPage() {
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'
  
  const [customInput, setCustomInput] = useState('')
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [roadmap, setRoadmap] = useState('')
  const [phase, setPhase] = useState<'select' | 'generating' | 'result'>('select')
  
  // Right side simulated metrics — start with realistic non-zero values
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    successProb: 45,
    timeMastery: 68,
    skillMatch: 30,
    focus: 72
  })

  const abortRef = useRef<AbortController | null>(null)

  // Simulate telemetry increasing while generating
  useEffect(() => {
    if (phase === 'generating' || phase === 'result') {
      const interval = setInterval(() => {
        setSimulatedMetrics(prev => ({
          successProb: Math.min(prev.successProb + Math.floor(Math.random() * 5), 92),
          timeMastery: Math.min(prev.timeMastery + Math.floor(Math.random() * 10), 100),
          skillMatch: Math.min(prev.skillMatch + Math.floor(Math.random() * 6), 88),
          focus: Math.min(prev.focus + Math.floor(Math.random() * 8), 95),
        }))
      }, 500)
      return () => clearInterval(interval)
    } else {
      setSimulatedMetrics({ successProb: 45, timeMastery: 68, skillMatch: 30, focus: 72 })
    }
  }, [phase])

  const generateRoadmap = async (careerStr: string) => {
    if (!careerStr.trim()) return
    setSelectedCareer(careerStr)
    setPhase('generating')
    setRoadmap('')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      let accumulated = ''
      for await (const token of streamDreamPlan(
        { career: careerStr, language: settings.language, modelName: settings.modelName },
        controller.signal
      )) {
        accumulated += token
        setRoadmap(accumulated)
      }
      setPhase('result')
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError'
      if (!isAbort) {
        setRoadmap('❌ Could not generate roadmap. Please ensure the backend server is running.')
        setPhase('result')
      } else {
        setPhase('select')
      }
    }
  }

  const handleReset = () => {
    abortRef.current?.abort()
    setSelectedCareer(null)
    setRoadmap('')
    setCustomInput('')
    setPhase('select')
  }

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-x-hidden">
      
      {/* ── Cinematic Background Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Volumetric Orange Fog */}
        <div className="absolute top-[5%] -left-[10%] w-[1000px] h-[1000px] bg-[#FF6B1A] opacity-[0.04] blur-[160px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Neural Green Reflection */}
        <div className="absolute bottom-[-10%] -right-[10%] w-[1200px] h-[1200px] bg-[#22C55E] opacity-[0.03] blur-[180px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Pulsing Neural Grid Overlay */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,107,26,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,26,0.03)_1px,transparent_1px)]"
          style={{ backgroundSize: '48px 48px' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Particles Noise */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03] mix-blend-overlay" />

        {/* Slow Animated Vignette */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050507_100%)] opacity-80"
          animate={{ opacity: [0.8, 0.9, 0.8] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* ── Main Layout ── */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
          style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 80px 80px 80px' }}
        >

          {/* ── LEFT: Content Panel ── */}
          <div className="flex flex-col gap-6 w-full">
          
          <AnimatePresence mode="wait">
            {phase === 'select' ? (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-y-6"
              >
                {/* Hero */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 text-[#FF9A3C] text-[10px] font-bold tracking-[0.25em] uppercase">
                    <Star className="w-3 h-3" />
                    {isHindi ? 'AI करियर मार्गदर्शक' : 'AI Career Mentor'}
                  </div>

                  <h1
                    className="font-black font-display leading-none"
                    style={{ fontSize: 'clamp(38px, 4.5vw, 58px)', letterSpacing: '-0.01em', lineHeight: '1.0' }}
                  >
                    <span className="bg-gradient-to-br from-white via-orange-50 to-[#FF9A3C] bg-clip-text text-transparent block mb-1">
                      BUILD YOUR
                    </span>
                    <span className="bg-gradient-to-br from-[#FF9A3C] to-[#FF6B1A] bg-clip-text text-transparent block">
                      DREAM
                    </span>
                  </h1>

                  <p className="text-[14px] text-gray-400 leading-[1.6] max-w-[400px]">
                    {isHindi
                      ? 'Limitless AI आपकी महत्वाकांक्षा को हकीकत में बदलने के लिए एक AI रोडमैप बनाता है।'
                      : 'Limitless AI builds a personalized AI roadmap to turn your ambition into reality.'}
                  </p>
                </div>

                {/* Input Dock */}
                <div className="space-y-3">
                  <div className="relative group">
                    {/* Breathing Shadow / Edge Scanning */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-[#FF6B1A]/30 via-transparent to-[#F5C842]/30 rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#FF6B1A]/40 to-transparent rounded-3xl blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative flex items-center bg-[#0B0B12]/80 backdrop-blur-[50px] border border-white/10 rounded-3xl p-2 h-[68px] transition-all duration-700 hover:bg-[#12121A]/90 hover:border-white/20 shadow-[0_10px_60px_rgba(255,120,40,0.12)]">
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateRoadmap(customInput)}
                        placeholder={isHindi ? "अपने सपनों के करियर का वर्णन करें..." : "Describe your dream future..."}
                        className="w-full h-full bg-transparent border-none outline-none text-white px-6 text-[17px] placeholder:text-gray-500 font-medium tracking-wide"
                      />
                      <button 
                        onClick={() => generateRoadmap(customInput)}
                        disabled={!customInput.trim()}
                        className="h-12 w-12 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E85D04] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,107,26,0.4)] group-hover:shadow-[0_0_30px_rgba(255,107,26,0.6)] ml-2"
                      >
                        <Send className="w-5 h-5 -ml-0.5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-3">
                    {(isHindi ? SUGGESTIONS_HI : SUGGESTIONS_EN).map((s, i) => (
                      <motion.button 
                        key={s}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        onClick={() => generateRoadmap(s)}
                        className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-[13px] text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-sm"
                      >
                        "{s}"
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Career Cards */}
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    {CAREERS.map((career, i) => (
                      <motion.button
                        key={career.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
                        onClick={() => generateRoadmap(career.label)}
                        className="relative flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-500 group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#FF6B1A]/30"
                        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        whileHover={{ 
                          y: -4, 
                          scale: 1.015, 
                          borderColor: 'rgba(255,120,40,0.4)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.45)'
                        }}
                      >
                        {/* Layered Depth & Reflective Edge Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-3xl pointer-events-none" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#FF6B1A]/10 to-transparent rounded-3xl transition-opacity duration-700 pointer-events-none" />
                        <div className="absolute inset-[1px] border border-white/[0.03] rounded-3xl pointer-events-none mix-blend-overlay" />
                        
                        <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${career.color}15`, border: `1px solid ${career.color}30` }}>
                          <span className="text-[20px]">{career.emoji}</span>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-[14px] text-white">{isHindi ? career.labelHi : career.label}</p>
                          <p className="text-[12px] mt-0.5" style={{ color: career.color }}>{isHindi ? career.taglineHi : career.tagline}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full lg:max-h-[85vh]"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      Neural Roadmap Synthesized
                    </div>
                    <h2 className="text-[40px] leading-none font-black font-display text-white tracking-tight">
                      {selectedCareer}
                    </h2>
                  </div>
                  <button onClick={handleReset} className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-700 group shadow-lg hover:shadow-xl">
                    <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-white transition-transform group-hover:-rotate-90 duration-700" />
                  </button>
                </div>

                {/* Holographic Timeline */}
                <div className="relative flex-1 overflow-y-auto pr-4 scrollbar-hide">
                  <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#FF6B1A] via-[#F5C842] to-transparent opacity-20" />
                  
                  {/* Glowing Tracker */}
                  {phase === 'generating' && (
                    <motion.div 
                      className="absolute left-[21px] top-0 w-[6px] h-[60px] bg-[#FF6B1A] rounded-full blur-[2px] z-10"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  <div className="prose-limitless relative z-20 pl-12 roadmap-markdown pb-10">
                    {roadmap ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{roadmap}</ReactMarkdown>
                    ) : (
                      <div className="flex flex-col gap-6 pt-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="skeleton h-28 w-full rounded-2xl opacity-10" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                {phase === 'result' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-6 pt-6 border-t border-white/5"
                  >
                    <button
                      onClick={() => {
                        const chatPrompt = `I want to become a ${selectedCareer}. Help me get started with my first study session.`
                        window.location.href = `/chat?q=${encodeURIComponent(chatPrompt)}`
                      }}
                      className="w-full relative overflow-hidden group bg-white text-black font-bold py-5 rounded-2xl text-[17px] flex items-center justify-center gap-3 transition-transform duration-700 hover:scale-[1.015] active:scale-[0.985] shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.25)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <Sparkles className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{isHindi ? 'AI से पढ़ाई शुरू करें' : 'Initialize Training Program'}</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-700" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT SIDE: Cinematic Dream Visualization (Desktop only) ── */}
        <div className="hidden lg:flex relative flex-col items-center justify-center min-h-[500px]">
          
          {/* Orbital Connection System (Animated SVGs) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
            <svg className="w-full h-full" viewBox="0 0 800 800" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1">
              <motion.circle cx="400" cy="400" r="320" strokeDasharray="4 12" animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} style={{ originX: '50%', originY: '50%' }} />
              <motion.circle cx="400" cy="400" r="220" strokeDasharray="2 8" animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} style={{ originX: '50%', originY: '50%' }} />
              <line x1="400" y1="80" x2="400" y2="720" />
              <line x1="80" y1="400" x2="720" y2="400" />
              
              {/* Signal dots running along tracks */}
              <circle cx="400" cy="80" r="3" fill="#FF6B1A">
                <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="15s" repeatCount="indefinite" />
              </circle>
              <circle cx="400" cy="180" r="2" fill="#22C55E">
                <animateTransform attributeName="transform" type="rotate" from="360 400 400" to="0 400 400" dur="20s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Main Orb Centerpiece (Conscious Entity) */}
          <motion.div 
            className="relative flex items-center justify-center"
            animate={{ y: [-15, 15, -15], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Holographic rings */}
            <motion.div 
              className="absolute w-[500px] h-[500px] rounded-full border border-orange-500/10 border-dashed mix-blend-screen"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-[380px] h-[380px] rounded-full border-[2px] border-green-500/5 mix-blend-screen"
              animate={{ rotate: -360, scale: [1, 1.02, 1] }}
              transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Ambient Breathing Halo */}
            <motion.div 
              className="absolute w-[400px] h-[400px] bg-[#FF6B1A] rounded-full blur-[140px] opacity-[0.12]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Neural Scanning Sweep */}
            <motion.div 
              className="absolute w-[550px] h-[2px] bg-gradient-to-r from-transparent via-[#FF6B1A]/30 to-transparent blur-sm z-30"
              animate={{ y: [-240, 240, -240], opacity: [0, 1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* The Orb - Brightness slightly reduced to feel more solid/expensive */}
            <div className="relative z-10 scale-[1.7] drop-shadow-[0_0_100px_rgba(255,107,26,0.2)]" style={{ filter: 'brightness(0.92)' }}>
              <AIOrbAssistant size="xl" isActive={phase === 'generating'} />
            </div>
          </motion.div>


          {/* Floating Telemetry Panels */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Top Left — Success Probability */}
            <motion.div
              className="absolute top-[15%] left-[2%] bg-[#0B0B12]/60 backdrop-blur-[50px] border border-white/5 rounded-[18px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              animate={{ y: [-12, 12, -12] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <Target className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.25em] mb-0.5">Success Prob</p>
                  <p className="text-[20px] font-bold font-display text-white leading-none">{simulatedMetrics.successProb}%</p>
                </div>
              </div>
            </motion.div>

            {/* Bottom Left — Skill Match */}
            <motion.div
              className="absolute bottom-[22%] left-[1%] bg-[#0B0B12]/60 backdrop-blur-[50px] border border-white/5 rounded-[18px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              animate={{ y: [12, -12, 12] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Activity className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.25em] mb-0.5">Skill Match</p>
                  <p className="text-[20px] font-bold font-display text-white leading-none">{simulatedMetrics.skillMatch}%</p>
                </div>
              </div>
            </motion.div>

            {/* Top Right — Mastery Time */}
            <motion.div
              className="absolute top-[30%] right-[2%] bg-[#0B0B12]/60 backdrop-blur-[50px] border border-white/5 rounded-[18px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.25em] mb-0.5">Mastery Time</p>
                  <p className="text-[20px] font-bold font-display text-white leading-none">{simulatedMetrics.timeMastery}%</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
        </div>
      </div>
    </div>
  )
}
