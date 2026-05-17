import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, WifiOff, Mic, Camera, Cpu,
  Zap, Star, Heart, Shield, ChevronDown, Sparkles, BookOpen, CheckCircle, Plane, MapPin
} from 'lucide-react'
import { ParticleCanvas } from '@/components/ui/ParticleCanvas'
import { AIOrbAssistant } from '@/components/ui/AIOrbAssistant'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useAppStore } from '@/store/appStore'

// ── Scroll Section ───────────────────────────
function ScrollSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <div
      ref={ref as any}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── Data ─────────────────────────────────────




// ── Internet OFF Sequence Demo ─────────────
function InternetOffSequence({ isHindi }: { isHindi: boolean }) {
  const [phase, setPhase] = useState(0) // 0: connected, 1: dropping, 2: offline, 3: recovered

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setPhase(0) // Connected
        await new Promise(r => setTimeout(r, 3000))
        setPhase(1) // Dropping
        await new Promise(r => setTimeout(r, 1000))
        setPhase(2) // Red Offline
        await new Promise(r => setTimeout(r, 1500))
        setPhase(3) // Green Recovery
        await new Promise(r => setTimeout(r, 4000))
      }
    }
    sequence()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Interactive Demo Block */}
      <div className="relative w-full max-w-2xl h-64 mb-12 flex items-center justify-center bg-[#0C0C10] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">

        {/* Connection Line */}
        <div className="absolute top-1/2 left-1/4 right-1/4 h-[2px] -translate-y-1/2 overflow-hidden">
          <motion.div
            className={`w-full h-full ${phase === 0 ? 'bg-[#3b82f6]' : phase === 3 ? 'bg-[#22C55E]' : 'bg-[#ef4444]'}`}
            initial={{ x: '-100%' }}
            animate={{ x: phase === 1 || phase === 2 ? '100%' : '0%' }}
            transition={{ duration: phase === 1 ? 1 : 0.5 }}
          />
        </div>

        {/* Left Node: WiFi Router */}
        <div className="absolute left-[15%] flex flex-col items-center z-10">
          <motion.div
            className={`p-5 rounded-full ${phase === 0 ? 'bg-[#3b82f6]/20' : 'bg-[#ef4444]/20'}`}
            animate={phase === 0 ? { boxShadow: ['0 0 0px #3b82f6', '0 0 40px #3b82f6', '0 0 0px #3b82f6'] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <WifiOff className={`w-10 h-10 ${phase === 0 ? 'text-[#3b82f6]' : 'text-[#ef4444]'}`} />
          </motion.div>
          <span className={`mt-3 text-xs font-mono font-bold tracking-widest uppercase ${phase === 0 ? 'text-[#3b82f6]' : 'text-[#ef4444]'}`}>
            {phase === 0 ? 'Connected' : 'Connection Lost'}
          </span>
        </div>

        {/* Right Node: Limitless AI Orb */}
        <div className="absolute right-[15%] flex flex-col items-center z-10">
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center relative"
            animate={phase === 3 ? {
              boxShadow: ['0 0 30px #22C55E', '0 0 60px #22C55E', '0 0 30px #22C55E']
            } : {
              boxShadow: '0 0 20px #FF6B1A'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: phase === 3 ? 'radial-gradient(circle, #4ade80, #16a34a)' : 'radial-gradient(circle, #FF9A3C, #FF6B1A)' }}
          >
            {/* Waveform playing when recovered */}
            {phase === 3 && (
              <div className="flex items-end justify-center gap-1 h-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i} className="w-1 bg-white rounded-full"
                    animate={{ height: ['4px', '24px', '4px'] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() }}
                  />
                ))}
              </div>
            )}
          </motion.div>
          <span className={`mt-3 text-xs font-mono font-bold tracking-widest uppercase ${phase === 3 ? 'text-[#22C55E]' : 'text-[#FF6B1A]'}`}>
            {phase === 3 ? 'Streaming Reply' : 'Limitless Core'}
          </span>
        </div>
      </div>

      <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        {isHindi ? 'नेटवर्क गया?' : 'WiFi Goes Down?'}
        <br />
        <motion.span
          className="inline-block"
          animate={{ color: phase >= 2 ? '#22C55E' : '#9ca3af' }}
          transition={{ duration: 0.5 }}
        >
          {isHindi ? 'शिक्षा नहीं रुकती।' : 'Education Continues.'}
        </motion.span>
      </h2>

      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
        {isHindi
          ? 'Limitless AI पूरी तरह से लोकल है। बिजली जाए या इंटरनेट, आपकी पढ़ाई कभी नहीं रुकेगी।'
          : 'Disconnect the router. Turn on airplane mode. Limitless AI keeps generating answers locally. The ultimate resilient architecture for rural India.'}
      </p>

      <motion.div
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10"
        animate={phase === 3 ? { scale: [1, 1.05, 1], boxShadow: ['0 0 0px #22C55E', '0 0 20px #22C55E', '0 0 0px #22C55E'] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-3 h-3 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_10px_#22C55E]" />
        <span className="text-[#22C55E] font-bold tracking-widest text-sm uppercase">Local Backend Active</span>
      </motion.div>
    </div>
  )
}

// ── Live Streaming Demo Component ─────────────
function LiveDemo({ isHindi }: { isHindi: boolean }) {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [latency, setLatency] = useState(12)
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'typing'>('idle')

  const targetText = isHindi
    ? "पाइथागोरस प्रमेय कहता है कि एक समकोण त्रिभुज में, कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है: a² + b² = c²। इसे हम ऐसे समझ सकते हैं..."
    : "Pythagoras theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides: a² + b² = c²..."

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(c => !c), 500)
    const latencyInterval = setInterval(() => setLatency(Math.floor(8 + Math.random() * 10)), 1500)

    let timeout: ReturnType<typeof setTimeout>
    const startSequence = () => {
      setText('')
      setPhase('thinking')

      timeout = setTimeout(() => {
        setPhase('typing')
        let i = 0
        const typeNext = () => {
          if (i < targetText.length) {
            const chunkSize = Math.floor(1 + Math.random() * 3)
            setText(targetText.slice(0, i + chunkSize))
            i += chunkSize
            timeout = setTimeout(typeNext, 20 + Math.random() * 40)
          } else {
            setPhase('idle')
            timeout = setTimeout(startSequence, 6000)
          }
        }
        typeNext()
      }, 1500 + Math.random() * 1000)
    }

    startSequence()

    return () => {
      clearInterval(cursorInterval)
      clearInterval(latencyInterval)
      clearTimeout(timeout)
    }
  }, [targetText])

  return (
    <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] max-w-[440px] z-20 pointer-events-none flex flex-col items-center">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-fit max-w-[85%] mb-4 px-6 py-3.5 rounded-[24px] shadow-[0_15px_30px_rgba(0,0,0,0.6)] backdrop-blur-3xl border border-white/10"
        style={{ background: 'rgba(30,30,46,0.85)' }}
      >
        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', textAlign: 'center' }}>
          {isHindi ? "पाइथागोरस प्रमेय समझाओ" : "Explain Pythagoras theorem"}
        </p>
      </motion.div>

      {/* Answer Stream */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full p-6 pl-8 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl border border-white/5"
        style={{ background: 'rgba(15,15,20,0.85)' }}
      >
        <div className="scanline" />
        {/* Sleek straight orange indicator line */}
        <div className="absolute top-6 bottom-6 left-0 w-1.5 rounded-r-full bg-gradient-to-b from-[#FF6B1A] to-[#F5C842] shadow-[2px_0_12px_rgba(255,107,26,0.6)]" />

        {/* Header Badges */}
        <div className="flex items-center flex-wrap gap-2.5 mb-4 relative z-20">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FF6B1A]/10 border border-[#FF6B1A]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span className="text-[10px] font-bold text-[#FF6B1A] uppercase tracking-wider">LIMITLESS AI</span>
          </div>
          <div className="flex items-center px-2.5 py-1 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20">
            <span className="text-[10px] font-mono font-bold text-[#22C55E] tracking-wider">LOCAL ACTIVE</span>
          </div>
          {phase !== 'idle' && (
            <div className="ml-auto flex gap-1.5 items-center pr-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#FF6B1A] ${phase === 'thinking' ? 'animate-bounce' : 'animate-pulse'}`} />
              <span className="text-[10px] font-mono text-gray-400">
                {phase === 'thinking' ? 'Thinking...' : `${latency}ms/t`}
              </span>
            </div>
          )}
        </div>

        <div className="relative z-20 flex flex-col items-center text-center">
          {phase === 'thinking' ? (
            <div className="flex flex-col items-center justify-center gap-2 opacity-60">
              <span className="text-sm font-mono text-[#F5C842]">&gt; Initializing context...</span>
              <span className="text-sm font-mono text-[#F5C842]">&gt; Loading local weights...</span>
              <span className="text-sm font-mono text-[#FF6B1A] animate-pulse">&gt; Generating response...</span>
            </div>
          ) : (
            <p className="text-center" style={{ color: 'var(--text-primary)', lineHeight: 1.65, fontSize: '1rem', letterSpacing: '0.01em' }}>
              {text}
              <span className={`inline-block w-2 h-4 ml-1 align-middle bg-[#FF6B1A] shadow-[0_0_10px_#FF6B1A] ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Component ────────────────────────────
export function LandingPage() {
  const { settings } = useAppStore()
  const isHindi = settings.language === 'hi'
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <div style={{ background: 'var(--bg-base)', overflowX: 'hidden' }}>

      {/* ══════════ HERO (Cinematic Split Layout) ══════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
        {/* Deep Atmospheric Background Layers */}
        <div className="bg-noise" />
        <div className="rim-light-orange" />
        <div className="rim-light-green" />
        <div className="spotlight-center" />

        <div className="absolute inset-0"><ParticleCanvas count={120} color="#FF6B1A" /></div>
        <div className="absolute inset-0 bg-mesh pointer-events-none opacity-60 mix-blend-screen" />

        {/* Floating Glowing Orbs for Depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="orb orb-saffron" style={{ width: '800px', height: '800px', top: '-300px', left: '-200px', opacity: 0.5 }} />
          <div className="orb orb-forest" style={{ width: '600px', height: '600px', bottom: '-200px', right: '-100px', opacity: 0.4 }} />
          <div className="orb orb-gold" style={{ width: '400px', height: '400px', top: '20%', right: '10%', opacity: 0.3 }} />
        </div>

        {/* 3D Floating Formulas (Depth Layers) */}
        <motion.div
          className="absolute hidden lg:block opacity-30 pointer-events-none mix-blend-screen z-0"
          style={{ top: '15%', left: '45%', filter: 'blur(2px)' }}
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-5xl font-mono" style={{ color: '#FF6B1A' }}>E = mc²</div>
        </motion.div>

        <motion.div
          className="absolute hidden lg:block opacity-20 pointer-events-none mix-blend-screen z-0"
          style={{ bottom: '25%', left: '8%', filter: 'blur(4px)' }}
          animate={{ y: [20, -20, 20], rotate: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <div className="text-7xl font-mono" style={{ color: '#22C55E' }}>π</div>
        </motion.div>

        <motion.div
          className="absolute hidden lg:block opacity-25 pointer-events-none mix-blend-screen z-0"
          style={{ top: '30%', right: '8%', filter: 'blur(3px)' }}
          animate={{ y: [-15, 15, -15], rotate: [5, -5, 5] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="text-4xl font-mono tracking-widest" style={{ color: '#F5C842' }}>∫e^x dx</div>
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-[1600px] mx-auto w-full px-6 mt-12 md:mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column — Emotional Text & CTAs */}
            <div className="text-left z-20 flex flex-col items-center lg:items-start">
              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-md border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 shadow-[0_0_20px_rgba(255,107,26,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span className="text-sm font-medium tracking-wide text-[#FF6B1A]">Built for Rural India</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-7xl lg:text-[7.5rem] xl:text-[9.5rem] font-bold leading-[0.9] mb-8 tracking-tighter text-center lg:text-left"
                style={{ fontFamily: 'var(--font-display)' }}>
                <span className="text-gradient drop-shadow-2xl">{isHindi ? 'बुद्धि के लिए' : 'Intelligence'}</span>
                <br />
                <span className="text-glass">{isHindi ? 'इंटरनेट ज़रूरी नहीं' : 'Should Not Require'}</span>
                {!isHindi && <><br /><span className="text-gradient-animated drop-shadow-2xl">Internet.</span></>}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl sm:text-2xl mb-12 max-w-2xl font-light tracking-wide text-center lg:text-left"
                style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isHindi
                  ? 'Limitless AI — ग्रामीण भारत के हर बच्चे के लिए विश्व स्तरीय शिक्षा। पूरी तरह से ऑफलाइन, हमेशा आपके साथ।'
                  : 'Meet Limitless. The world-class AI teacher that runs completely offline on your device. Bringing the education revolution to every corner of rural India.'}
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 items-center w-full sm:w-auto">
                <Link to="/chat" id="hero-start-btn" className="btn btn-primary btn-lg btn-glow btn-shine-sweep flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_50px_rgba(255,107,26,0.4)] hover:shadow-[0_0_80px_rgba(255,107,26,0.6)]">
                  <Zap className="w-5 h-5" />
                  {isHindi ? 'मुफ़्त में शुरू करें' : 'Start Learning Free'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-3 px-4 py-2 opacity-90 backdrop-blur-sm rounded-full border border-white/5 bg-white/5">
                  <WifiOff className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-sm font-medium text-[#22C55E] tracking-wide uppercase">100% Offline Mode</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column — Cinematic Orb & Live Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1.2, type: 'spring', stiffness: 50, damping: 20 }}
              className="relative flex justify-center items-center h-[500px] lg:h-[600px] mt-16 lg:mt-0"
            >
              {/* "RUNNING LOCALLY" Glowing Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute top-0 lg:top-10 left-10 lg:-left-10 z-30 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl border border-[#22C55E]/30 bg-[#12121A]/80 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_10px_#22C55E]" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#22C55E] tracking-widest uppercase">
                  RUNNING LOCALLY <span className="text-gray-500 mx-1">•</span> Gemma 4 <span className="text-gray-500 mx-1">•</span> Ollama
                </span>
              </motion.div>

              {/* Airplane Mode Disconnect Demo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9], x: [20, 0, 0, -20], y: [0, -10, -20, -30] }}
                transition={{ duration: 8, repeat: Infinity, repeatDelay: 10, ease: 'easeInOut' }}
                className="absolute top-16 lg:top-24 right-0 lg:-right-10 z-30 flex items-start gap-3 p-3 rounded-2xl backdrop-blur-2xl border border-white/10 bg-[#1E1E2E]/90 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Plane className="w-4 h-4 text-red-500 -rotate-45" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5">Internet Disconnected</p>
                  <p className="text-[10px] text-gray-400 font-mono">Limitless still teaching...</p>
                </div>
              </motion.div>

              {/* Central Glowing AI Core */}
              <div className="relative z-10 lg:translate-y-[-10%] lg:translate-x-[10%] w-full flex justify-center">
                <AIOrbAssistant size="xl" isActive />
              </div>

              {/* Overlapping Live Demo Stream */}
              <LiveDemo isHindi={isHindi} />
            </motion.div>

          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#FF6B1A]">Discover</span>
            <ChevronDown className="w-5 h-5 text-[#FF6B1A]" />
          </div>
        </motion.div>
      </section>

      {/* ══════════ STORYTELLING (Meet Ayesha) ══════════ */}
      <section className="relative overflow-hidden" style={{ background: '#020203', padding: '12rem 1.5rem' }}>
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,26,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
          <ParticleCanvas count={30} color="#ffffff" />
        </div>

        <div style={{ maxWidth: '85rem', margin: '0 auto' }} className="relative z-10">
          <ScrollSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">

              {/* Left — Cinematic Visuals */}
              <div className="lg:col-span-7 relative z-10 w-full">
                {/* Soft ambient glow behind the card */}
                <div className="absolute -inset-10 bg-gradient-to-r from-[#FF6B1A]/10 to-green-500/10 rounded-[3rem] blur-3xl opacity-50" />
                
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative h-[550px] lg:h-[750px] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/5 bg-[#030305]"
                >
                  {/* Cinematic Image Texture (Girl studying silhouette) */}
                  <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity grayscale" />
                  
                  {/* Heavy Dark Vignette & Edge Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-[#020203]/50 to-[#020203]/80 z-10" />
                  <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-10" />

                  {/* Subtle Rain / Fog Layer */}
                  <motion.div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen z-10" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 6, repeat: Infinity }} />

                  {/* Warm Orange Lamp Lighting (Table light) */}
                  <motion.div
                    className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#FF6B1A] rounded-full blur-[150px] opacity-30 mix-blend-screen z-10"
                    animate={{ opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Cold Moonlight / Outage effect */}
                  <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-900/10 to-transparent blur-3xl z-10" />

                  {/* Blinking NO SIGNAL Indicator (Glitch Effect) */}
                  <motion.div
                    className="absolute top-10 left-10 flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/60 border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.2)] z-30"
                    animate={{ opacity: [1, 0.5, 1, 1, 0.2, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.2, 0.8, 0.9, 1] }}
                  >
                    <div className="relative">
                      <WifiOff className="w-4 h-4 text-red-500 relative z-10" />
                      <div className="absolute inset-0 text-red-500 animate-ping opacity-50 blur-[2px]"><WifiOff className="w-4 h-4" /></div>
                    </div>
                    <span className="text-xs font-mono font-semibold tracking-[0.2em] text-red-400 uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">No Signal</span>
                  </motion.div>

                  {/* AI System Monitor Chip */}
                  <motion.div
                    className="absolute bottom-10 right-10 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#0A1A10]/90 border border-green-500/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,197,94,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] z-30"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-400 z-10 shadow-[0_0_10px_#22C55E]" />
                      <motion.div className="absolute inset-0 rounded-full bg-green-500" animate={{ scale: [1, 3, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-green-500/80 tracking-[0.2em] uppercase mb-1">Local Engine</span>
                      <span className="text-[13px] font-extrabold text-green-400 tracking-wider drop-shadow-md">LIMITLESS AI ACTIVE</span>
                    </div>
                  </motion.div>

                  {/* Subject Info */}
                  <div className="absolute bottom-10 left-10 z-30">
                    <h3 className="text-5xl lg:text-6xl font-display font-black text-white mb-3 tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">Ayesha, 14</h3>
                    <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md w-max px-4 py-1.5 rounded-full border border-white/10">
                      <MapPin className="w-4 h-4 text-[#FF9A3C]" />
                      <p className="text-sm text-zinc-300 font-semibold tracking-[0.15em] uppercase">Bihar, India</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right — Progressive Emotional Storytelling */}
              <div className="lg:col-span-6 lg:-ml-12 relative z-20 flex flex-col justify-center">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
                  className="bg-[#020203]/80 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold uppercase tracking-[0.2em] text-[#FF9A3C] mb-8 shadow-[0_0_20px_rgba(255,107,26,0.15)]">
                    <Heart className="w-3.5 h-3.5" /> {isHindi ? 'हकीकत' : 'The Reality'}
                  </span>

                  <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    {isHindi ? 'आयशा ' : 'Ayesha wants to be a '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#FF9A3C] drop-shadow-[0_0_20px_rgba(255,107,26,0.4)]">
                      {isHindi ? 'डॉक्टर' : 'doctor.'}
                    </span>
                    {isHindi ? ' बनना चाहती है।' : ''}
                  </h2>

                  <div className="space-y-10">
                    {/* The Problem */}
                    <motion.p
                      className="text-xl lg:text-2xl text-zinc-400 leading-[1.8] font-medium"
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
                    >
                      {isHindi
                        ? 'लेकिन उसके गाँव में बिजली और इंटरनेट एक लग्जरी है। ऑनलाइन क्लासेज बफर होती हैं। खराब नेटवर्क की वजह से उसके सपने रुक जाते हैं।'
                        : 'But in her village, reliable internet is a luxury. Online classes buffer endlessly. Quality coaching is miles away. Her dreams are constantly paused by a broken network.'}
                    </motion.p>

                    {/* The Solution / Hope - Premium Glassmorphism Box */}
                    <motion.div
                      className="relative p-8 lg:p-10 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden group"
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }}
                    >
                      {/* Animated Green Edge Glow */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_30px_rgba(34,197,94,0.6)]" />
                      
                      {/* Light Sweep Animation */}
                      <motion.div 
                        animate={{ x: ['-200%', '300%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: 1 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-[25deg]"
                      />

                      <p className="relative z-10 text-xl lg:text-2xl text-zinc-200 font-semibold leading-[1.7]">
                        {isHindi
                          ? 'Limitless AI के साथ, उसे इंटरनेट की कोई जरूरत नहीं है। उसका AI ट्यूटर उसके डिवाइस पर 100% ऑफलाइन काम करता है। वर्ल्ड-क्लास एजुकेशन, बिना किसी सिग्नल के।'
                          : 'With Limitless AI, the internet no longer matters. Her personal AI tutor runs 100% offline directly on her device. World-class education, zero signal required.'}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ══════════ BENTO GRID FEATURES (Cinematic AI Operating System) ══════════ */}
      <section className="relative overflow-hidden" style={{ background: '#020203', padding: '12rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        {/* Cinematic Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

        {/* Animated Depth Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

        {/* Moving Neural Nodes Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 bg-green-500/20 rounded-full blur-[1px]"
              initial={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`], opacity: [0, 0.5, 0] }}
              transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>

        {/* Ambient Neural Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-green-500/5 blur-[150px] pointer-events-none rounded-full" />

        <div style={{ maxWidth: '80rem', margin: '0 auto' }} className="relative z-10">
          <ScrollSection>
            <div className="text-center mb-24 relative flex flex-col items-center">
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0A0A0F] border border-green-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-8 shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-default"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Local AI
              </motion.div>

              <h2 className="text-[4rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] max-w-[1200px] leading-[0.9] tracking-[-0.06em] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E2E8F0] to-[#94A3B8] drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] mb-8 relative" style={{ fontFamily: 'var(--font-display)' }}>
                {isHindi ? 'सुपरपावर, आपके डिवाइस पर' : 'Superpowers on your device.'}
                {/* Light Reflection Sweep */}
                <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-clip-text text-transparent opacity-30" animate={{ backgroundPosition: ['200% 0', '-200% 0'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
              </h2>
              <div className="flex flex-col items-center gap-4 relative">
                <p className="text-xl md:text-2xl text-zinc-400 font-medium tracking-wide max-w-2xl">
                  Advanced Local Architecture. Zero Cloud. Zero Latency.
                </p>
                {/* Random Tiny AI Thoughts Sequence */}
                <div className="h-6 overflow-hidden flex items-center justify-center mt-2 opacity-50 relative w-full max-w-md">
                  <motion.div animate={{ opacity: [0, 1, 1, 0, 0, 0, 0, 0] }} transition={{ duration: 9, repeat: Infinity, times: [0, 0.1, 0.3, 0.33, 0.4, 0.6, 0.8, 1] }} className="absolute">
                    <span className="font-mono text-[10px] md:text-xs text-green-500 tracking-widest uppercase">Generating educational reasoning...</span>
                  </motion.div>
                  <motion.div animate={{ opacity: [0, 0, 0, 1, 1, 0, 0, 0] }} transition={{ duration: 9, repeat: Infinity, times: [0, 0.2, 0.33, 0.43, 0.63, 0.66, 0.8, 1] }} className="absolute">
                    <span className="font-mono text-[10px] md:text-xs text-green-500 tracking-widest uppercase">Building personalized curriculum...</span>
                  </motion.div>
                  <motion.div animate={{ opacity: [0, 0, 0, 0, 0, 0, 1, 1] }} transition={{ duration: 9, repeat: Infinity, times: [0, 0.2, 0.4, 0.5, 0.66, 0.76, 0.96, 1] }} className="absolute">
                    <span className="font-mono text-[10px] md:text-xs text-green-500 tracking-widest uppercase">Optimizing offline inference...</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </ScrollSection>

          {/* Cinematic Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">

            {/* Bento 1: Gemma 3 Hero (Large Local Inference) */}
            <ScrollSection className="md:col-span-2 md:row-span-2 h-full">
              <motion.div
                className="relative h-full min-h-[600px] rounded-[2.5rem] p-10 overflow-hidden group border border-white/5 bg-[#050508] hover:bg-[#0A0A0F] hover:border-green-500/30 transition-all duration-700 flex flex-col items-center text-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_0_80px_rgba(34,197,94,0.15)]"
                whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              >
                {/* Holographic Neural Core (GOD LEVEL) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none mix-blend-screen">
                  <motion.div className="absolute inset-0 rounded-full border-[1px] border-green-500/40" style={{ borderStyle: 'dashed' }} animate={{ rotate: 360, scale: [1, 1.02, 1] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} />
                  <motion.div className="absolute inset-10 rounded-full border-[2px] border-green-500/10" animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                  <motion.div className="absolute inset-24 rounded-full border border-green-400/20" animate={{ rotate: 180, scale: [1, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-[30px] animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[conic-gradient(from_0deg,transparent,rgba(34,197,94,0.6),transparent)] rounded-full blur-[40px] animate-[spin_8s_linear_infinite]" />
                  {[...Array(15)].map((_, i) => (
                    <motion.div key={i} className="absolute w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_10px_#22c55e]" style={{ left: '50%', top: '50%' }} animate={{ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, opacity: [0, 1, 0], scale: [0, 1.5, 0] }} transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }} />
                  ))}
                </div>

                <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="flex flex-col items-center gap-5 mb-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-[#030305] border border-green-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                      <Cpu className="w-10 h-10 text-green-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-[0.3em] text-green-500/70 uppercase mb-3 block">Neural Engine Architecture</span>
                      <h3 className="text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
                        {isHindi ? 'llama.cpp + Gemma 4' : 'Powered by Gemma 4'}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xl leading-relaxed max-w-xl font-medium mb-12">
                    {isHindi
                      ? 'Google का सबसे एडवांस्ड मॉडल, सीधा आपके डिवाइस पर। कोई क्लाउड नहीं।'
                      : 'Google’s most advanced lightweight LLM running natively on your hardware. Experience instant, private, uncensored intelligence.'}
                  </p>

                  {/* Token Streaming Effect */}
                  <div className="bg-[#020203] border border-white/10 rounded-2xl p-6 font-mono text-sm shadow-inner max-w-2xl w-full mb-10 relative overflow-hidden group-hover:border-green-500/40 transition-colors text-left flex flex-col gap-2">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-20" />
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
                      <span className="text-zinc-500 tracking-widest text-xs uppercase">system.log</span>
                    </div>
                    <p className="text-zinc-400 flex justify-between"><span>[14:02:01] Loading model layers...</span> <span className="text-green-500 font-bold">[OK]</span></p>
                    <p className="text-zinc-400 flex justify-between"><span>[14:02:02] Allocating KV Cache (4GB)...</span> <span className="text-green-500 font-bold">[OK]</span></p>
                    <motion.p className="text-white mt-2 group-hover:text-green-300 transition-colors font-bold tracking-wide"
                      animate={{ opacity: [0, 1] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      Ayesha's physics tutor is ready_
                    </motion.p>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="relative z-10 flex flex-wrap justify-center gap-4 w-full">
                  {[
                    { label: 'Inference', val: 'Running', color: 'text-green-400' },
                    { label: 'Cloud', val: 'Disconnected', color: 'text-zinc-500' },
                    { label: 'Processing', val: 'Private Local', color: 'text-white' },
                    { label: 'Latency', val: '12ms', color: 'text-green-400' }
                  ].map((stat) => (
                    <div key={stat.label} className="px-5 py-3 rounded-2xl bg-[#030305] border border-white/5 flex flex-col items-center gap-1 group-hover:border-green-500/20 group-hover:bg-[#0A0A0F] transition-all shadow-lg hover:-translate-y-1 cursor-default">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500">{stat.label}</span>
                      <span className={`text-sm font-black tracking-wide ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollSection>

            {/* Bento 2: Multimodal Scanner */}
            <ScrollSection delay={100} className="md:col-span-1 md:row-span-1 h-full">
              <motion.div
                className="relative h-full rounded-[2.5rem] p-8 overflow-hidden group border border-white/5 bg-[#050508] hover:bg-[#0A0A0F] hover:border-[#818CF8]/30 transition-all duration-700 flex flex-col items-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_0_80px_rgba(129,140,248,0.15)]"
                whileHover={{ y: -5 }} transition={{ type: 'spring' }}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#818CF8]/10 blur-[100px] group-hover:bg-[#818CF8]/20 transition-colors duration-700" />

                <div className="mb-8 relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#030305] border border-[#818CF8]/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(129,140,248,0.2)] group-hover:scale-105 transition-transform">
                    <Camera className="w-8 h-8 text-[#818CF8]" />
                  </div>
                  <h3 className="text-3xl font-bold font-display text-white tracking-tight mb-3">
                    {isHindi ? 'गृहकार्य स्कैनर' : 'Vision Scanner'}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
                    {isHindi ? 'फोटो खींचें और AI समझाएगा।' : 'Snap equations. AI extracts and solves them instantly offline.'}
                  </p>
                </div>

                {/* Scanner Animation (Realistic OCR) */}
                <div className="flex-1 w-full min-h-[180px] bg-[#020203] rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-6 group-hover:border-[#818CF8]/30 transition-all shadow-inner">
                  {/* Notebook paper edge */}
                  <div className="absolute -right-4 -bottom-4 w-[120%] h-[120%] bg-[#FDFBF7] opacity-[0.03] rotate-3 border-l-4 border-t-4 border-white/20 rounded-tl-[3rem]" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-[0.15]" />

                  {/* Camera Frame Corners */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#818CF8]/60 tracking-widest uppercase flex items-center gap-1.5 bg-[#818CF8]/10 px-2 py-0.5 rounded-full border border-[#818CF8]/20 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-pulse shadow-[0_0_5px_#818CF8]" /> Vision Model Online
                  </div>

                  {/* OCR Box */}
                  <motion.div
                    className="relative border-2 border-dashed border-[#818CF8]/50 p-5 rounded-xl w-full max-w-[220px] bg-[#050508]/70 backdrop-blur-md group-hover:border-[#818CF8]/80 transition-colors shadow-[0_0_20px_rgba(129,140,248,0.1)]"
                    animate={{ scale: [1, 1.02, 1], y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#818CF8]" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#818CF8]" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#818CF8]" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#818CF8]" />

                    <div className="text-[#818CF8] font-serif text-3xl font-bold tracking-widest text-center drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]">
                      ∫(2x+1)dx
                    </div>
                  </motion.div>

                  {/* Laser Line */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-[#818CF8] shadow-[0_0_40px_rgba(129,140,248,1)]"
                    animate={{ top: ['15%', '85%', '15%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <motion.div
                    className="absolute bottom-6 px-4 py-1.5 bg-[#818CF8]/20 border border-[#818CF8]/50 rounded-full text-[10px] tracking-widest uppercase text-[#818CF8] font-bold shadow-[0_0_20px_rgba(129,140,248,0.4)] backdrop-blur-md"
                    animate={{ opacity: [0, 1, 0], scale: [0.95, 1, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Extraction Complete
                  </motion.div>
                </div>
              </motion.div>
            </ScrollSection>

            {/* Bento 3: Bilingual Voice */}
            <ScrollSection delay={200} className="md:col-span-1 md:row-span-1 h-full">
              <motion.div
                className="relative h-full rounded-[2.5rem] p-8 overflow-hidden group border border-white/5 bg-[#050508] hover:bg-[#0A0A0F] hover:border-[#F5C842]/30 transition-all duration-700 flex flex-col items-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_0_80px_rgba(245,200,66,0.15)]"
                whileHover={{ y: -5 }} transition={{ type: 'spring' }}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5C842]/10 blur-[100px] group-hover:bg-[#F5C842]/20 transition-colors duration-700" />

                <div className="mb-8 relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#030305] border border-[#F5C842]/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(245,200,66,0.2)] group-hover:scale-105 transition-transform">
                    <Mic className="w-8 h-8 text-[#F5C842]" />
                  </div>
                  <h3 className="text-3xl font-bold font-display text-white tracking-tight mb-3">
                    {isHindi ? 'आवाज़ शिक्षक' : 'Bilingual Voice'}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
                    {isHindi ? 'हिंदी या अंग्रेजी में बेझिझक बात करें।' : 'Speak naturally. Limitless detects and switches languages instantly.'}
                  </p>
                </div>

                {/* Voice Interaction Animation */}
                <div className="flex-1 w-full min-h-[180px] bg-[#020203] rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center gap-5 p-6 mt-auto group-hover:border-[#F5C842]/30 transition-all shadow-inner">
                  <div className="absolute top-4 right-5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse shadow-[0_0_10px_#F5C842]" />
                    <span className="text-[8px] font-mono text-[#F5C842]/70 uppercase tracking-widest">Synthesis Ready</span>
                  </div>

                  {/* Equalizer */}
                  <div className="w-full flex items-center justify-center gap-1.5 h-16">
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-[#F5C842]/30 to-[#F5C842] rounded-full shadow-[0_0_10px_rgba(245,200,66,0.3)] group-hover:shadow-[0_0_15px_rgba(245,200,66,0.6)]"
                        animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                        transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                      />
                    ))}
                  </div>

                  {/* Translation Subtitles */}
                  <div className="w-full bg-[#0A0A0F] rounded-xl p-3 border border-white/5 relative overflow-hidden flex flex-col gap-1 shadow-lg">
                    <motion.div className="text-[12px] font-mono text-[#F5C842]/90 text-left" animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 1] }}>
                      "Photosynthesis kya hota hai?"
                    </motion.div>
                    <motion.div className="text-[12px] font-mono text-green-400 text-left" animate={{ opacity: [0, 0, 1, 1] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.6, 1] }}>
                      → प्रकाश संश्लेषण वह प्रक्रिया है...
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </ScrollSection>

            {/* Bento 4: Wide Dream Builder */}
            <ScrollSection delay={300} className="md:col-span-3 md:row-span-1">
              <motion.div
                className="relative min-h-[300px] rounded-[2.5rem] p-8 lg:p-14 overflow-hidden group border border-white/5 bg-[#050508] hover:bg-[#0A0A0F] hover:border-[#22C55E]/30 flex flex-col items-center text-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_0_80px_rgba(34,197,94,0.15)] transition-all duration-700 gap-10"
                whileHover={{ y: -5 }} transition={{ type: 'spring' }}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#22C55E_0%,transparent_60%)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 max-w-3xl flex flex-col items-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#030305] border border-[#22C55E]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)] group-hover:scale-105 transition-transform">
                    <Star className="w-10 h-10 text-[#22C55E]" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight mb-5">
                    {isHindi ? 'ड्रीम बिल्डर' : 'Career Dream Builder'}
                  </h3>
                  <p className="text-zinc-400 text-xl leading-relaxed font-medium max-w-2xl">
                    {isHindi ? 'IAS, डॉक्टर, या इंजीनियर? अपना लक्ष्य बताएं, AI रोडमैप बनाएगा।' : 'Want to be an Astronaut? Tell Limitless. It generates a personalized, multi-year holographic curriculum to achieve it.'}
                  </p>
                </div>

                {/* Animated Roadmap Path (Holographic) */}
                <div className="relative z-10 w-full max-w-5xl bg-[#020203]/80 backdrop-blur-md rounded-[2rem] border border-[#22C55E]/10 p-10 flex flex-col items-center group-hover:border-[#22C55E]/40 transition-all overflow-hidden shadow-[inset_0_0_50px_rgba(34,197,94,0.05)] mt-4">
                  {/* Holographic Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                  <div className="absolute top-5 left-6 text-[10px] font-mono text-[#22C55E] uppercase tracking-[0.2em] flex items-center gap-2 bg-[#22C55E]/10 px-3 py-1.5 rounded-full border border-[#22C55E]/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E] animate-pulse" />
                    AI Career Blueprint Generated
                  </div>

                  <div className="relative w-full flex items-center justify-between mt-12 px-2 md:px-8">
                    {/* Connecting Line Base */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-2 bg-[#22C55E]/10 rounded-full overflow-hidden hidden sm:block border border-[#22C55E]/20">
                      {/* Pulse Sweep */}
                      <motion.div
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_30px_#22C55E]"
                        animate={{ left: ['-50%', '100%'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>

                    {/* Nodes */}
                    {['10th Grade', '12th Grade', 'Astrophysics BS', 'Astronaut'].map((step, index) => (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-5 group/node cursor-default">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-[#030305] border-[3px] border-[#020203] ring-2 ring-zinc-700 group-hover/node:ring-[#22C55E] group-hover/node:bg-[#0A0A0F] transition-all duration-500 flex items-center justify-center relative shadow-xl"
                          animate={index === 3 ? { boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 40px rgba(34,197,94,0.7)', '0 0 0px rgba(34,197,94,0)'] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {index === 3 && <div className="w-3.5 h-3.5 rounded-full bg-[#22C55E] shadow-[0_0_15px_#22C55E]" />}
                          {index < 3 && <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 group-hover/node:bg-[#22C55E] transition-colors shadow-inner" />}
                        </motion.div>
                        <span className={`text-xs md:text-sm font-extrabold uppercase tracking-widest ${index === 3 ? 'text-[#22C55E] drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'text-zinc-500 group-hover/node:text-zinc-300'} hidden sm:block whitespace-nowrap transition-colors`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ══════════ THE "INTERNET OFF" DEMO ══════════ */}
      <section className="relative overflow-hidden" style={{ background: '#08080B', padding: '10rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.05),transparent_70%)] pointer-events-none" />
        <div style={{ maxWidth: '60rem', margin: '0 auto', textAlign: 'center' }} className="relative z-10">
          <ScrollSection>
            <InternetOffSequence isHindi={isHindi} />
          </ScrollSection>
        </div>
      </section>

      {/* ══════════ AI ACTIVATION SEQUENCE (HOW Limitless Works) ══════════ */}
      <section className="relative overflow-hidden flex flex-col items-center w-full" style={{ background: '#020203', padding: '16rem 1.5rem 12rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        {/* Massive Cinematic Glowing Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,26,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,26,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_20%,#000_80%,transparent_100%)] pointer-events-none w-full" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(249,115,22,0.1),rgba(34,197,94,0.05),rgba(129,140,248,0.1),rgba(249,115,22,0.1))] blur-[120px] pointer-events-none rounded-full animate-[spin_20s_linear_infinite]" />

        {/* Faint Floating Holographic Math/Science Equations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20 w-full">
          <motion.div className="absolute top-[20%] left-[15%] text-2xl font-serif text-white/40 drop-shadow-[0_0_10px_white]" animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}>E = mc²</motion.div>
          <motion.div className="absolute top-[35%] right-[10%] text-3xl font-serif text-orange-500/30 drop-shadow-[0_0_15px_#f97316]" animate={{ y: [30, -30, 30], rotate: [10, -10, 10] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}>∫(2x+1)dx</motion.div>
          <motion.div className="absolute top-[60%] left-[5%] text-xl font-mono text-green-500/20 drop-shadow-[0_0_15px_#22c55e]" animate={{ x: [-15, 15, -15], rotate: [-10, 10, -10] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}>∇ × B = μ₀J</motion.div>
          <motion.div className="absolute bottom-[20%] right-[20%] text-2xl font-serif text-indigo-500/30 drop-shadow-[0_0_15px_#818cf8]" animate={{ y: [-25, 25, -25], rotate: [5, -5, 5] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}>F = G(m₁m₂/r²)</motion.div>
        </div>

        {/* Deep Fog Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-transparent to-[#020203] pointer-events-none z-10 w-full" />

        <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center">
          <div className="w-full flex justify-center">
            <ScrollSection className="w-full">
              <div className="text-center mb-28 relative flex flex-col items-center justify-center w-full">
                <h2 className="text-[4rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] font-extrabold tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-orange-900/60 drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] mb-6 relative" style={{ fontFamily: 'var(--font-display)' }}>
                  {isHindi ? 'कैसे काम करता है?' : 'How Limitless Works'}
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-clip-text text-transparent opacity-40" animate={{ backgroundPosition: ['200% 0', '-200% 0'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />
                </h2>
                <div className="overflow-hidden flex items-center justify-center mb-3 w-full">
                  <motion.h3
                    className="text-2xl md:text-4xl text-[#E2E8F0] font-semibold tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-center"
                    animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    "Internet disappears. Intelligence remains."
                  </motion.h3>
                </div>
                <p className="text-sm md:text-base text-green-400 font-bold tracking-widest drop-shadow-[0_0_15px_#22c55e] mb-8 font-mono text-center">
                  No cloud. No delay. Just intelligence.
                </p>
                <div className="px-6 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-md shadow-[0_0_30px_rgba(249,115,22,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                  <p className="text-xs md:text-sm text-orange-400 uppercase tracking-[0.3em] font-mono font-bold flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" /> Private AI education. Running fully offline.
                  </p>
                </div>
              </div>
            </ScrollSection>
          </div>

          <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mt-16 px-4 justify-items-center">
            {/* Cinematic Connection Line */}
            <div className="absolute top-[45%] left-[5%] right-[5%] h-[2px] hidden lg:block bg-white/5 overflow-hidden rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)] z-0">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_30px_#ffffff]"
                animate={{ left: ['-50%', '150%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-2 h-2 bg-white rounded-full shadow-[0_0_20px_#ffffff,0_0_40px_#ffffff] -translate-y-1/2 top-1/2"
                animate={{ left: ['-10%', '110%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              {/* Transfer Nodes */}
              <div className="absolute top-1/2 left-[33%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" /></div>
              <div className="absolute top-1/2 left-[66%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" /></div>
            </div>

            {/* STEP 1: DOWNLOAD ONCE */}
            <ScrollSection delay={100} className="relative z-10 w-full h-full">
              <motion.div
                className="flex flex-col items-center group w-full h-full"
                whileHover={{ y: -15, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-full h-[400px] rounded-[2.5rem] bg-gradient-to-b from-[#0F0F13]/90 to-[#030305]/95 backdrop-blur-xl border border-white/10 group-hover:border-orange-500/50 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_80px_rgba(249,115,22,0.2),inset_0_0_30px_rgba(249,115,22,0.05)] transition-all p-8 mb-8 flex flex-col justify-between relative overflow-hidden">
                  {/* Holographic Scanlines */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay" />

                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/25 blur-[60px] group-hover:bg-orange-500/40 transition-all pointer-events-none" />

                  <div className="flex flex-col items-center justify-center w-full relative z-10 mb-4">
                    <span className="text-orange-500 font-display font-black text-4xl drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] mb-1">01</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-mono flex items-center gap-2">
                      System Init <div className="w-1 h-3 bg-orange-500/80 animate-pulse" />
                    </span>
                  </div>

                  {/* Real Installation Experience Mockup */}
                  <div className="w-full flex flex-col gap-4 relative z-10 bg-black/60 border border-white/10 p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] items-center">
                    <div className="flex flex-col items-center justify-center w-full text-[11px] font-mono text-zinc-300 gap-1.5">
                      <span className="flex items-center gap-2"><div className="w-2 h-2 border border-zinc-400 rounded-sm animate-spin" /> Extracting gemma-4.gguf</span>
                      <span className="text-orange-400 font-bold drop-shadow-[0_0_5px_#f97316]">78%</span>
                    </div>
                    
                    <div className="w-[85%] h-2 bg-zinc-900 rounded-full overflow-hidden shadow-inner relative border border-white/5">
                      <motion.div className="absolute top-0 left-0 h-full bg-orange-500 shadow-[0_0_20px_#f97316]" animate={{ width: ['0%', '100%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
                    </div>

                    <div className="w-full h-[30px] flex flex-col gap-1.5 mt-1 overflow-hidden border-t border-white/10 pt-3 items-center">
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 1] }} className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                        <span className="text-green-400 font-bold">{'>'}</span> Initializing offline neural engine...
                      </motion.div>
                      <motion.div animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, times: [0, 0.4, 0.5, 1] }} className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                        <span className="text-green-400 font-bold">{'>'}</span> Allocating VRAM...
                      </motion.div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-1 h-0 group-hover:h-auto overflow-visible">
                      <p className="text-[11px] font-mono text-green-400 flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" /> Offline Intelligence Activated
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold font-display text-white mb-3 text-center group-hover:text-orange-400 transition-colors tracking-tight">Download Once</h3>
                <p className="text-base text-zinc-400 text-center max-w-[300px] leading-relaxed">Install Limitless AI with Gemma 4 using WiFi once. Never need internet again.</p>
              </motion.div>
            </ScrollSection>

            {/* STEP 2: ASK ANYTHING */}
            <ScrollSection delay={200} className="relative z-10 w-full h-full">
              <motion.div
                className="flex flex-col items-center group w-full h-full"
                whileHover={{ y: -15, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-full h-[400px] rounded-[2.5rem] bg-gradient-to-b from-[#0F0F13]/90 to-[#030305]/95 backdrop-blur-xl border border-white/10 group-hover:border-[#22C55E]/50 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_80px_rgba(34,197,94,0.2),inset_0_0_30px_rgba(34,197,94,0.05)] transition-all p-8 mb-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay" />

                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#22C55E]/25 blur-[60px] group-hover:bg-[#22C55E]/40 transition-all pointer-events-none" />

                  <div className="flex flex-col items-center justify-center w-full relative z-10 mb-4">
                    <span className="text-[#22C55E] font-display font-black text-4xl drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] mb-1">02</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-mono flex items-center gap-2">
                      Live IO Stream <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22c55e]" />
                    </span>
                  </div>

                  {/* Live AI Interaction Mockup */}
                  <div className="w-full flex flex-col gap-4 relative z-10 mt-2 items-center">
                    {/* Image Upload + User Bubble Preview */}
                    <div className="flex flex-col gap-2 w-full items-center">
                      <motion.div className="bg-black/40 border border-white/10 rounded-xl p-1 shadow-lg overflow-hidden group-hover:border-zinc-500/50 transition-all backdrop-blur-md relative" animate={{ y: [5, 0] }} transition={{ duration: 0.5 }}>
                        <div className="w-16 h-12 bg-zinc-900 rounded-lg relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-20" />
                          <span className="font-serif text-white/70 text-xs font-bold">2x + 4 = 10</span>
                          <motion.div className="absolute top-0 bottom-0 w-[2px] bg-[#22C55E] shadow-[0_0_15px_#22C55E]" animate={{ left: ['0%', '100%', '0%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                        </div>
                      </motion.div>
                      <motion.div className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-2 shadow-xl" animate={{ y: [5, 0] }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <p className="text-[11px] text-zinc-200 font-medium tracking-wide">Solve this step-by-step.</p>
                      </motion.div>
                    </div>

                    <div className="w-full flex flex-col items-center">
                      <div className="bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-2xl p-4 w-full relative shadow-[0_10px_30px_rgba(34,197,94,0.15)] backdrop-blur-md">
                        <motion.div className="flex flex-col gap-2 items-center">
                          <div className="flex items-center gap-2 mb-1 justify-center w-full">
                            <Sparkles className="w-3.5 h-3.5 text-[#22C55E] drop-shadow-[0_0_5px_#22c55e]" />
                            <span className="text-[9px] uppercase tracking-widest text-[#22C55E] font-bold">LIMITLESS AI <span className="opacity-70 lowercase font-mono tracking-normal ml-1">computing...</span></span>
                          </div>
                          <motion.div className="text-xs text-white font-medium leading-relaxed font-mono text-center" animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            {/* Token Streaming Effect */}
                            <span className="text-zinc-300">{"Step 1: Subtract 4."}</span><br />
                            <span className="text-[#22C55E]">{"2x = 6"}</span>
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-3.5 bg-[#22C55E] ml-1 align-middle shadow-[0_0_8px_#22c55e]" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Hindi <-> English switch animation & Voice Waveform */}
                    <div className="flex flex-col items-center gap-2 w-full mt-2">
                      <div className="flex items-center gap-1.5 opacity-80 bg-black/40 px-3 py-2 rounded-full border border-white/5 backdrop-blur-md justify-center w-fit">
                        {[...Array(12)].map((_, i) => (
                          <motion.div key={i} className="w-[3px] bg-[#22C55E] rounded-full shadow-[0_0_5px_#22c55e]" animate={{ height: ['4px', `${Math.random() * 14 + 6}px`, '4px'] }} transition={{ duration: 0.4 + Math.random(), repeat: Infinity, ease: 'easeInOut' }} />
                        ))}
                      </div>

                      <motion.div className="flex items-center gap-2 bg-black/50 p-1 rounded-full border border-white/10 shadow-xl backdrop-blur-md">
                        <div className="w-7 h-7 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/50 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center text-[9px] font-bold text-[#22C55E]">EN</div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-zinc-400 hover:text-white cursor-pointer transition-colors">HI</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold font-display text-white mb-3 text-center group-hover:text-[#22C55E] transition-colors tracking-tight">Ask Anything</h3>
                <p className="text-base text-zinc-400 text-center max-w-[300px] leading-relaxed">Type, speak, or photograph your question. Limitless understands instantly.</p>
              </motion.div>
            </ScrollSection>

            {/* STEP 3: LEARN & GROW */}
            <ScrollSection delay={300} className="relative z-10 w-full h-full">
              <motion.div
                className="flex flex-col items-center group w-full h-full"
                whileHover={{ y: -15, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-full h-[400px] rounded-[2.5rem] bg-gradient-to-b from-[#0F0F13]/90 to-[#030305]/95 backdrop-blur-xl border border-white/10 group-hover:border-[#818CF8]/50 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_80px_rgba(129,140,248,0.2),inset_0_0_30px_rgba(129,140,248,0.05)] transition-all p-8 mb-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay" />

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#818CF8]/25 blur-[60px] group-hover:bg-[#818CF8]/40 transition-all pointer-events-none" />

                  <div className="flex flex-col items-center justify-center w-full relative z-10 mb-4">
                    <span className="text-[#818CF8] font-display font-black text-4xl drop-shadow-[0_0_15px_rgba(129,140,248,0.5)] mb-1">03</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-mono flex items-center gap-2">
                      Neural Future <div className="w-3 h-3 border-[2px] border-[#818CF8]/80 rounded-sm animate-[spin_3s_linear_infinite]" />
                    </span>
                  </div>

                  {/* Emotional Future Mockup */}
                  <div className="w-full flex flex-col gap-6 items-center relative z-10 mt-4">
                    {/* Glowing achievement nodes */}
                    <div className="flex items-center gap-3">
                      {[1, 2, 3].map((node) => (
                        <div key={node} className="relative group/node">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${node === 3 ? 'border-[#818CF8] bg-[#818CF8]/20 shadow-[0_0_20px_#818CF8]' : 'border-[#818CF8]/30 bg-black'}`}>
                            {node === 3 ? <Star className="w-3.5 h-3.5 text-white" /> : <CheckCircle className="w-4 h-4 text-[#818CF8]/50" />}
                          </div>
                          {node < 3 && <div className="absolute top-1/2 -right-4 w-3 h-[2px] bg-[#818CF8]/30 -translate-y-1/2" />}
                        </div>
                      ))}
                    </div>

                    <div className="relative w-24 h-24 mt-2">
                      <motion.div className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#818CF8]/50" animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
                      <motion.div className="absolute inset-2 rounded-full border border-[#818CF8]/30" animate={{ rotate: -180 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
                      <div className="absolute inset-4 bg-[#818CF8]/20 rounded-full flex items-center justify-center backdrop-blur-md border border-[#818CF8]/40 shadow-[0_0_30px_rgba(129,140,248,0.3)]">
                        <Star className="w-8 h-8 text-[#818CF8] drop-shadow-[0_0_10px_#818CF8]" />
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-2 mt-2">
                      <div className="w-[85%] h-2 bg-black border border-white/5 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#818CF8] to-[#818CF8] shadow-[0_0_20px_#818CF8]" initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 2, delay: 0.5 }} />
                      </div>
                      <div className="w-full flex justify-center mt-1">
                        <p className="text-[11px] font-mono text-[#818CF8]/90 uppercase tracking-widest text-center flex items-center justify-center gap-2 bg-[#818CF8]/10 px-3 py-1.5 rounded-lg border border-[#818CF8]/20 backdrop-blur-md shadow-[0_0_20px_rgba(129,140,248,0.2)] w-fit">
                          <Sparkles className="w-3 h-3" /> AI Roadmap Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold font-display text-white mb-3 text-center group-hover:text-[#818CF8] transition-colors tracking-tight">Learn & Grow</h3>
                <p className="text-base text-zinc-400 text-center max-w-[300px] leading-relaxed">Get clear explanations, exam prep, and career guidance — completely offline.</p>
              </motion.div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CINEMATIC EMOTIONAL PASS ══════════ */}
      <section className="relative w-full py-32 lg:py-48 overflow-hidden bg-[#030305] flex items-center justify-center min-h-screen border-t border-white/5">
        {/* Cinematic Background & Parallax Depth */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep Atmospheric Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-orange-900/20 blur-[120px] rounded-[100%]" />
          <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }} 
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-amber-600/10 blur-[100px] rounded-[100%] mix-blend-screen" 
          />
          {/* Subtle Particles */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-40" />
          
          {/* Abstract Silhouette / Hope in Darkness */}
          <div className="absolute inset-0 flex items-end justify-center mix-blend-screen overflow-hidden">
            {/* Candle/Warm glow mimicking a dark room */}
            <div className="absolute bottom-[-10%] w-[80vw] h-[60vh] bg-gradient-to-t from-orange-600/10 via-amber-500/5 to-transparent blur-[100px]" />
            
            {/* Holographic interface reflection (The hope) */}
            <motion.div 
              animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-64 h-32 bg-[#22C55E]/10 rounded-[100%] blur-[60px] -skew-x-12" 
            />

            {/* Distant weak signal */}
            <div className="absolute top-[20%] right-[20%] opacity-30">
              <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="w-1.5 h-1.5 bg-red-500 rounded-full blur-[2px]" />
              <div className="w-[1px] h-24 bg-gradient-to-b from-red-500/20 to-transparent mx-auto mt-1" />
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          
          {/* Massive Typography Impact */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-2 mb-16 w-full"
          >
            <div className="text-zinc-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-zinc-600" />
              The Reality
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-zinc-600" />
            </div>
            
            <h2 className="font-display font-black leading-[0.95] tracking-[-0.04em] text-white flex flex-col items-center w-full">
              <span className="text-[clamp(2rem,5vw,4rem)] text-zinc-400 drop-shadow-lg opacity-80 mb-2">
                1 Child Offline =
              </span>
              <span className="text-[clamp(3.5rem,8vw,7.5rem)] relative inline-block py-2 w-full text-center overflow-visible">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-orange-300 via-orange-500 to-red-600 drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]">
                  1 Child Left Behind
                </span>
                {/* Animated Shine Sweep */}
                <motion.span 
                  animate={{ left: ['-100%', '200%'] }} 
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
                  className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 mix-blend-overlay pointer-events-none" 
                />
              </span>
            </h2>
          </motion.div>

          {/* Live Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent blur-2xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center p-8 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-2xl relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.span 
                className="text-5xl md:text-6xl font-display font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-tighter"
              >
                250M+
              </motion.span>
              <span className="text-xs md:text-sm font-mono text-zinc-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                Children Affected
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col items-center justify-center p-8 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-2xl relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="text-5xl md:text-6xl font-display font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-tighter">
                65%
              </span>
              <span className="text-xs md:text-sm font-mono text-zinc-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
                Rural Connectivity Gap
              </span>
            </motion.div>
          </div>

          {/* Emotional Paragraph & Keynote Line */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto flex flex-col items-center gap-10 mb-20"
          >
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-light text-center">
              Millions of brilliant minds are studying in the dark, disconnected from the world's knowledge. They deserve the exact same quality of education as city students. <strong className="text-zinc-200 font-medium">Limitless AI is that equalizer.</strong>
            </p>
            
            {/* The Keynote Line */}
            <div className="relative mt-4">
              <div className="absolute -inset-8 bg-orange-500/10 blur-2xl rounded-full opacity-50" />
              <p className="relative z-10 text-2xl md:text-3xl font-serif italic text-orange-200/90 tracking-wide leading-snug drop-shadow-md">
                "Education should depend on curiosity.<br/>Not connectivity."
              </p>
            </div>
          </motion.div>

          {/* Powerful CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            {/* Breathing Ambient Glow behind CTA */}
            <motion.div 
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-orange-500/30 blur-[40px] rounded-full" 
            />
            
            <Link 
              to="/chat" 
              className="relative group inline-flex items-center justify-center gap-3 px-12 py-6 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_80px_rgba(249,115,22,0.6)] bg-black"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Internal Moving Light Sweep */}
              <motion.div 
                animate={{ left: ['-100%', '200%'] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 mix-blend-overlay" 
              />
              
              <span className="relative z-10 font-display font-black text-2xl text-white tracking-wide flex items-center gap-3">
                Start the future.
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              
              {/* Particle Emission on Hover (CSS simulation) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-[ping_1.5s_infinite]" />
                <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] animate-[ping_2s_infinite]" />
                <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-[ping_1.2s_infinite]" />
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ══════════ THE INTELLIGENCE LAYER (TECH STACK) ══════════ */}
      <section className="relative w-full py-32 lg:py-48 overflow-hidden bg-[#0a0a0f] flex flex-col items-center justify-center border-t border-white/5">
        
        {/* Cinematic Computational Background */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden z-0">
          {/* Deep Atmosphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.08)_0%,rgba(10,10,15,0)_70%)] blur-[80px]" />
          
          {/* Abstract GPU Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTAgMGg2NHY2NEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDY0VjBoNjR2NjRoLTY0ek0xLjUgMS41djYxaDYxdi02MWgtNjF6IiBmaWxsPSJyZ2JhKDEwOCwgOTksIDI1NSwgMC4wMikiLz48L3N2Zz4=')] opacity-40" />
          
          {/* Faint Equations */}
          <div className="absolute top-[15%] left-[5%] opacity-[0.04] font-serif text-4xl md:text-6xl rotate-12 blur-[1px]">∇ × B = μ₀J + μ₀ε₀(∂E/∂t)</div>
          <div className="absolute bottom-[15%] right-[5%] opacity-[0.04] font-mono text-3xl md:text-5xl -rotate-12 blur-[1px]">f(x) = W₂·σ(W₁·x + b₁) + b₂</div>
          <div className="absolute top-[80%] left-[10%] opacity-[0.03] font-mono text-2xl md:text-4xl -rotate-6 blur-[1px]">Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V</div>
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 flex flex-col items-center">
          
          {/* Huge Cinematic Title */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="text-center mb-32 flex flex-col items-center"
          >
            <span className="text-sm font-mono tracking-[0.4em] text-[#6c63ff] uppercase mb-6 flex items-center gap-3">
              <Sparkles className="w-4 h-4" /> Neural Architecture
            </span>
            <h2 className="font-display font-black text-[clamp(3rem,8vw,6rem)] leading-[1.05] tracking-[-0.04em] text-white drop-shadow-[0_0_30px_rgba(108,99,255,0.3)]">
              The <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c63ff] via-[#818CF8] to-[#C084FC]">Intelligence</span> Layer
            </h2>
            <p className="text-zinc-400 mt-8 text-xl max-w-3xl font-light leading-relaxed">
              A complete frontier AI operating stack. Optimized for zero-latency edge computation and continuous local inference.
            </p>
          </motion.div>

          {/* AI Infrastructure Unified Ecosystem */}
          <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 min-h-[700px] mt-8 mb-16">
            
            {/* SVG Connecting Lines (Visible on Desktop) */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block z-0">
              <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(245, 200, 66, 0.1)" />
                    <stop offset="100%" stopColor="rgba(108, 99, 255, 0.6)" />
                  </linearGradient>
                  <linearGradient id="lineGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(108, 99, 255, 0.1)" />
                    <stop offset="100%" stopColor="rgba(108, 99, 255, 0.6)" />
                  </linearGradient>
                  <linearGradient id="lineGrad3" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
                    <stop offset="100%" stopColor="rgba(108, 99, 255, 0.6)" />
                  </linearGradient>
                  <linearGradient id="lineGrad4" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(14, 165, 233, 0.1)" />
                    <stop offset="100%" stopColor="rgba(108, 99, 255, 0.6)" />
                  </linearGradient>
                </defs>
                
                {/* Top Left to Center */}
                <path d="M 380 180 C 500 180, 550 350, 700 350" fill="none" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_3s_linear_infinite]" />
                {/* Bottom Left to Center */}
                <path d="M 380 520 C 500 520, 550 350, 700 350" fill="none" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_3s_linear_infinite]" />
                {/* Top Right to Center */}
                <path d="M 1020 180 C 900 180, 850 350, 700 350" fill="none" stroke="url(#lineGrad3)" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_3s_linear_infinite_reverse]" />
                {/* Bottom Right to Center */}
                <path d="M 1020 520 C 900 520, 850 350, 700 350" fill="none" stroke="url(#lineGrad4)" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_3s_linear_infinite_reverse]" />
                
                {/* Data Packets */}
                <circle cx="0" cy="0" r="4" fill="#F5C842" className="shadow-[0_0_15px_#F5C842]">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 380 180 C 500 180, 550 350, 700 350" />
                </circle>
                <circle cx="0" cy="0" r="4" fill="#6c63ff" className="shadow-[0_0_15px_#6c63ff]">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 380 520 C 500 520, 550 350, 700 350" />
                </circle>
                <circle cx="0" cy="0" r="4" fill="#22C55E" className="shadow-[0_0_15px_#22C55E]">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 1020 180 C 900 180, 850 350, 700 350" />
                </circle>
                <circle cx="0" cy="0" r="4" fill="#0ea5e9" className="shadow-[0_0_15px_#0ea5e9]">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M 1020 520 C 900 520, 850 350, 700 350" />
                </circle>
              </svg>
            </div>

            {/* Left Column (Gemma & Llama.cpp) */}
            <div className="flex flex-col gap-8 w-full max-w-[420px] lg:w-[400px] xl:w-[420px] shrink-0 z-10">
              
              {/* Card 1: Gemma 3 */}
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative group bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 hover:border-[#F5C842]/50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] shadow-inner-[inset_0_1px_1px_rgba(255,255,255,0.1)] w-full flex flex-col min-h-[400px] overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#F5C842]/15 to-transparent opacity-0 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F5C842]/[0.05] to-transparent" />
                  <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#F5C842]/20 rounded-full blur-[80px] group-hover:bg-[#F5C842]/30 transition-colors duration-700" />
                </div>

                <div className="relative z-10 h-full w-full px-6 py-6 sm:px-8 sm:py-8 flex flex-col justify-between min-w-0">
                  {/* TOP: Header Centered */}
                  <div className="flex flex-col items-center text-center w-full min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5C842]/10 border border-[#F5C842]/30 flex items-center justify-center text-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_30px_rgba(245,200,66,0.2)] mb-5 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(245,200,66,0.4)] transition-all duration-500 shrink-0">
                      ✨
                    </div>
                    <h4 className="text-white font-bold text-2xl sm:text-3xl font-display tracking-tight leading-none mb-3 max-w-full truncate">Gemma 4</h4>
                    <div className="flex items-center justify-center gap-2 px-4 max-w-full box-border">
                      <div className="w-2 h-2 bg-[#F5C842] rounded-full animate-pulse shadow-[0_0_10px_#f5c842] shrink-0" />
                      <p className="text-[10px] sm:text-xs text-[#F5C842] uppercase tracking-widest font-mono opacity-90 font-semibold truncate min-w-0">Neural Engine</p>
                    </div>
                  </div>
                    
                  {/* CENTER: Visuals */}
                  <div className="w-full flex-1 flex flex-col justify-center my-6 min-w-0 overflow-hidden">
                    <div className="w-full bg-[#050508]/80 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden group-hover:border-[#F5C842]/30 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F5C842]/50 to-transparent" />
                      <div className="relative flex justify-center items-center mb-4 px-5 pt-5 box-border w-full">
                         <span className="text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-widest min-w-0 text-center">REASONING_LOG</span>
                         <span className="absolute right-5 flex gap-1.5 items-end h-4 shrink-0">
                            <motion.div animate={{ height: ['6px', '16px', '6px'] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 bg-[#F5C842]/60 rounded-t-sm" />
                            <motion.div animate={{ height: ['6px', '12px', '6px'] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }} className="w-1.5 bg-[#F5C842]/60 rounded-t-sm" />
                            <motion.div animate={{ height: ['6px', '20px', '6px'] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 bg-[#F5C842]/60 rounded-t-sm" />
                         </span>
                      </div>
                      <div className="space-y-2 text-center font-mono px-5 pb-5 overflow-hidden box-border w-full">
                        <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed truncate">&gt; Parsing semantic intent...</p>
                        <p className="text-[10px] sm:text-xs text-[#F5C842] leading-relaxed flex justify-center items-center gap-2 truncate">
                          <span className="opacity-80 animate-pulse shrink-0">&gt;</span> <span className="truncate">Context aligned</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: Metrics */}
                  <div className="w-full pt-5 border-t border-white/10 flex justify-between items-end gap-4 min-w-0 mt-auto box-border">
                    <div className="flex flex-col gap-2 text-left flex-1 min-w-0">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">STATUS</span>
                      <span className="text-xs sm:text-sm text-white font-mono font-medium flex items-center gap-2 truncate"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F5C842] rounded-full animate-pulse shadow-[0_0_8px_#f5c842] shrink-0"/> <span className="truncate">Active</span></span>
                    </div>
                    <div className="flex flex-col gap-2 text-right flex-1 min-w-0 text-right">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">CONTEXT</span>
                      <span className="text-xs sm:text-sm text-[#F5C842] font-mono font-bold truncate">Streaming</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: llama.cpp */}
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative group bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 hover:border-[#6c63ff]/50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] shadow-inner-[inset_0_1px_1px_rgba(255,255,255,0.1)] w-full flex flex-col min-h-[400px] overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }} className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#6c63ff]/15 to-transparent opacity-0 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/[0.05] to-transparent" />
                  <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#6c63ff]/20 rounded-full blur-[80px] group-hover:bg-[#6c63ff]/30 transition-colors duration-700" />
                </div>

                <div className="relative z-10 h-full w-full px-6 py-6 sm:px-8 sm:py-8 flex flex-col justify-between min-w-0">
                  {/* TOP: Header Centered */}
                  <div className="flex flex-col items-center text-center w-full min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/30 flex items-center justify-center text-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_30px_rgba(108,99,255,0.2)] mb-5 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(108,99,255,0.4)] transition-all duration-500 shrink-0">
                      🚀
                    </div>
                    <h4 className="text-white font-bold text-2xl sm:text-3xl font-display tracking-tight leading-none mb-3 max-w-full truncate">llama.cpp</h4>
                    <div className="flex items-center justify-center gap-2 px-4 max-w-full box-border">
                      <div className="w-2 h-2 bg-[#6c63ff] rounded-full animate-pulse shadow-[0_0_10px_#6c63ff] shrink-0" />
                      <p className="text-[10px] sm:text-xs text-[#6c63ff] uppercase tracking-widest font-mono opacity-90 font-semibold truncate min-w-0">Edge Optimized</p>
                    </div>
                  </div>
                    
                  {/* CENTER: Visuals */}
                  <div className="w-full flex-1 flex flex-col justify-center my-6 min-w-0 overflow-hidden">
                    <div className="w-full bg-[#050508]/80 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden group-hover:border-[#6c63ff]/30 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                      <div className="relative flex justify-center items-center mb-5 px-5 pt-5 box-border w-full">
                         <span className="text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-widest min-w-0 text-center">MEMORY_MAPPED</span>
                         <span className="absolute right-5 text-xs sm:text-sm text-[#6c63ff] font-mono font-bold drop-shadow-[0_0_8px_rgba(108,99,255,0.5)] shrink-0">4.2 GB</span>
                      </div>
                      <div className="w-full px-5 box-border">
                        <div className="w-full bg-black rounded-full h-2.5 border border-white/10 overflow-hidden relative shadow-inner">
                          <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6c63ff]/80 to-[#818CF8] rounded-full shadow-[0_0_10px_#6c63ff]" animate={{ width: ['45%', '48%', '45%'] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
                        </div>
                      </div>
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-zinc-400 font-mono mt-3 mb-5 uppercase tracking-[0.15em] font-semibold gap-2 px-5 overflow-hidden box-border w-full text-center">
                        <span className="truncate flex-1 min-w-0">VRAM ALLOCATION</span>
                        <span className="truncate flex-1 min-w-0">QUANTIZED</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: Metrics */}
                  <div className="w-full pt-5 border-t border-white/10 flex justify-between items-end gap-4 min-w-0 mt-auto box-border">
                    <div className="flex flex-col gap-2 text-left flex-1 min-w-0">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">RUNTIME</span>
                      <span className="text-xs sm:text-sm text-white font-mono font-medium flex items-center gap-2 truncate"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#6c63ff] rounded-full animate-pulse shadow-[0_0_8px_#6c63ff] shrink-0"/> <span className="truncate">Quantized</span></span>
                    </div>
                    <div className="flex flex-col gap-2 text-right flex-1 min-w-0 text-right">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">RAM USAGE</span>
                      <span className="text-xs sm:text-sm text-[#6c63ff] font-mono font-bold truncate">Optimized</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Central AI Core (Massive & Immersive) */}
            <div className="relative hidden lg:flex flex-1 items-center justify-center z-0 px-4 xl:px-10 shrink-0">
              <div className="relative w-full max-w-[340px] xl:max-w-[440px] aspect-square flex items-center justify-center">
                
                {/* Rotating Outer Typography */}
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} 
                  className="absolute inset-0 flex items-center justify-center drop-shadow-[0_0_15px_rgba(108,99,255,0.5)]"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                    <path id="circlePath" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="transparent" />
                    <text className="text-[5.5px] font-mono fill-[#818CF8] tracking-[0.4em] uppercase font-bold">
                      <textPath href="#circlePath" startOffset="0%">LOCAL AI CORE • ZERO LATENCY INFERENCE • NEURAL SYSTEM ONLINE • </textPath>
                    </text>
                  </svg>
                </motion.div>

                {/* Layered Energy Rings */}
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-4 border-[1.5px] border-[#6c63ff]/20 rounded-full border-dashed shadow-[0_0_30px_rgba(108,99,255,0.1)]" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute inset-10 border border-[#818CF8]/20 rounded-full shadow-[inset_0_0_20px_rgba(108,99,255,0.1)]" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-16 border-2 border-[#C084FC]/10 rounded-full border-dotted" />
                
                {/* Massive Pulse Ring */}
                <motion.div 
                  animate={{ scale: [1, 2.2], opacity: [0.5, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-20 border-[1.5px] border-[#6c63ff]/50 rounded-full shadow-[0_0_20px_#6c63ff]" 
                />
                <motion.div 
                  animate={{ scale: [1, 2.2], opacity: [0.3, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeOut', delay: 2 }}
                  className="absolute inset-20 border border-[#818CF8]/40 rounded-full" 
                />
                
                {/* The Core Orb (2x Size) */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-36 h-36 bg-gradient-to-tr from-[#6c63ff] via-[#818CF8] to-[#C084FC] rounded-full blur-[24px] shadow-[0_0_100px_rgba(108,99,255,0.8)]" 
                />
                
                {/* Glass Inner Core */}
                <div className="absolute w-28 h-28 bg-black/50 backdrop-blur-2xl rounded-full border border-white/20 shadow-[0_0_40px_rgba(108,99,255,0.6),inset_0_0_30px_rgba(108,99,255,0.6)] flex items-center justify-center z-10 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#6c63ff]/30 to-transparent" />
                   <Zap className="w-12 h-12 text-white drop-shadow-[0_0_15px_#ffffff]" />
                </div>
                
                {/* Floating Core Particles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   {[...Array(12)].map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ 
                         y: [0, (Math.random() - 0.5) * 150], 
                         x: [0, (Math.random() - 0.5) * 150], 
                         opacity: [0, 1, 0],
                         scale: [0.5, 1.5, 0.5]
                       }} 
                       transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: i * 0.3 }} 
                       className="absolute w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_8px_white]" 
                     />
                   ))}
                </div>
              </div>
            </div>

            {/* Right Column (Ollama & FastAPI) */}
            <div className="flex flex-col gap-8 w-full max-w-[420px] lg:w-[400px] xl:w-[420px] shrink-0 z-10">
              
              {/* Card 3: Ollama */}
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative group bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 hover:border-[#22C55E]/50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] shadow-inner-[inset_0_1px_1px_rgba(255,255,255,0.1)] w-full flex flex-col min-h-[400px] overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 0.5 }} className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#22C55E]/15 to-transparent opacity-0 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#22C55E]/[0.05] to-transparent" />
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#22C55E]/20 rounded-full blur-[80px] group-hover:bg-[#22C55E]/30 transition-colors duration-700" />
                </div>

                <div className="relative z-10 h-full w-full px-6 py-6 sm:px-8 sm:py-8 flex flex-col justify-between min-w-0">
                  {/* TOP: Header Centered */}
                  <div className="flex flex-col items-center text-center w-full min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_30px_rgba(34,197,94,0.2)] mb-5 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-500 shrink-0">
                      ⚡
                    </div>
                    <h4 className="text-white font-bold text-2xl sm:text-3xl font-display tracking-tight leading-none mb-3 max-w-full truncate">Ollama</h4>
                    <div className="flex items-center justify-center gap-2 px-4 max-w-full box-border">
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_10px_#22C55E] shrink-0" />
                      <p className="text-[10px] sm:text-xs text-[#22C55E] uppercase tracking-widest font-mono opacity-90 font-semibold truncate min-w-0">Local Inference</p>
                    </div>
                  </div>
                    
                  {/* CENTER: Visuals */}
                  <div className="w-full flex-1 flex flex-col justify-center my-6 min-w-0 overflow-hidden">
                    <div className="w-full bg-[#050508]/80 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden group-hover:border-[#22C55E]/30 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                      <div className="relative flex justify-center items-center mb-4 px-5 pt-5 box-border w-full">
                         <span className="text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-widest min-w-0 text-center">INFERENCE_RATE</span>
                         <span className="absolute right-5 text-xs sm:text-sm text-[#22C55E] font-mono font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] shrink-0">48.2 t/s</span>
                      </div>
                      <div className="h-12 flex items-end gap-[3px] opacity-90 px-5 pb-5 overflow-hidden box-border w-full">
                        {[40, 70, 45, 90, 65, 80, 50, 85, 60, 100, 75, 50, 80, 95, 60, 85].map((h, i) => (
                          <motion.div 
                            key={i} 
                            animate={{ height: [`${Math.max(20, h - 30)}%`, `${h}%`, `${Math.max(20, h - 30)}%`] }} 
                            transition={{ repeat: Infinity, duration: 1.5 + Math.random(), delay: i * 0.1, ease: "easeInOut" }} 
                            className="flex-1 bg-gradient-to-t from-[#22C55E]/30 to-[#22C55E] rounded-t-sm shadow-[0_0_5px_rgba(34,197,94,0.3)] min-w-0" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: Metrics */}
                  <div className="w-full pt-5 border-t border-white/10 flex justify-between items-end gap-4 min-w-0 mt-auto box-border">
                    <div className="flex flex-col gap-2 text-left flex-1 min-w-0">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">NETWORK</span>
                      <span className="text-xs sm:text-sm text-white font-mono font-medium flex items-center gap-2 truncate"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_8px_#22C55E] shrink-0"/> <span className="truncate">Online</span></span>
                    </div>
                    <div className="flex flex-col gap-2 text-right flex-1 min-w-0 text-right">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">CLOUD DEP.</span>
                      <span className="text-xs sm:text-sm text-[#22C55E] font-mono font-bold truncate">0ms</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 4: FastAPI */}
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative group bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 hover:border-[#0ea5e9]/50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] shadow-inner-[inset_0_1px_1px_rgba(255,255,255,0.1)] w-full flex flex-col min-h-[400px] overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5 }} className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#0ea5e9]/15 to-transparent opacity-0 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-[#0ea5e9]/[0.05] to-transparent" />
                  <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#0ea5e9]/20 rounded-full blur-[80px] group-hover:bg-[#0ea5e9]/30 transition-colors duration-700" />
                </div>

                <div className="relative z-10 h-full w-full px-6 py-6 sm:px-8 sm:py-8 flex flex-col justify-between min-w-0">
                  {/* TOP: Header Centered */}
                  <div className="flex flex-col items-center text-center w-full min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center text-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_30px_rgba(14,165,233,0.2)] mb-5 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] transition-all duration-500 shrink-0">
                      ⚙️
                    </div>
                    <h4 className="text-white font-bold text-2xl sm:text-3xl font-display tracking-tight leading-none mb-3 max-w-full truncate">FastAPI</h4>
                    <div className="flex items-center justify-center gap-2 px-4 max-w-full box-border">
                      <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-pulse shadow-[0_0_10px_#0ea5e9] shrink-0" />
                      <p className="text-[10px] sm:text-xs text-[#0ea5e9] uppercase tracking-widest font-mono opacity-90 font-semibold truncate min-w-0">Streaming SSE</p>
                    </div>
                  </div>
                    
                  {/* CENTER: Visuals */}
                  <div className="w-full flex-1 flex flex-col justify-center my-6 min-w-0 overflow-hidden">
                    <div className="w-full bg-[#050508]/80 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden group-hover:border-[#0ea5e9]/30 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-[#0ea5e9]/50 to-transparent" />
                      <div className="relative flex justify-center items-center mb-5 px-5 pt-5 box-border w-full">
                         <span className="text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-widest min-w-0 text-center">PACKET_STREAM</span>
                         <div className="absolute right-5 flex items-center gap-2 shrink-0">
                           <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-ping shrink-0" />
                           <span className="text-xs text-[#0ea5e9] font-mono font-bold drop-shadow-[0_0_8px_rgba(14,165,233,0.5)] truncate">LIVE</span>
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto opacity-90 justify-center px-5 pb-5 box-border w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: [0.2, 1, 0.4], scale: [0.9, 1.05, 0.95] }} 
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15, ease: "easeInOut" }} 
                            className="h-2.5 w-8 bg-[#0ea5e9]/60 rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.3)] shrink-0" 
                          />
                        ))}
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="h-2.5 w-3 bg-[#0ea5e9] rounded-sm shadow-[0_0_10px_#0ea5e9] shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: Metrics */}
                  <div className="w-full pt-5 border-t border-white/10 flex justify-between items-end gap-4 min-w-0 mt-auto box-border">
                    <div className="flex flex-col gap-2 text-left flex-1 min-w-0">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">TOKENS</span>
                      <span className="text-xs sm:text-sm text-white font-mono font-medium flex items-center gap-2 truncate"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0ea5e9] rounded-full animate-pulse shadow-[0_0_8px_#0ea5e9] shrink-0"/> <span className="truncate">Streaming</span></span>
                    </div>
                    <div className="flex flex-col gap-2 text-right flex-1 min-w-0 text-right">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">LATENCY</span>
                      <span className="text-xs sm:text-sm text-[#0ea5e9] font-mono font-bold truncate">Ultra-low</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Final Touch Line */}
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
            className="mt-28 border border-white/10 bg-black/40 px-6 py-3 rounded-full backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            <span className="text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
              Running entirely on-device. <span className="text-white font-medium">No cloud required.</span>
            </span>
          </motion.div>

        </div>
      </section>

      {/* ══════════ FINAL CTA (WORLD-CLASS CINEMATIC) ══════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden py-40 px-6">
        {/* Deep Atmosphere & Vignette */}
        <div className="absolute inset-0 bg-[#0a0a0f] shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-0" />
        
        {/* Neural Sunrise Effect */}
        <motion.div 
          animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.05, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-t from-[#FF6B1A]/15 to-transparent blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen opacity-60 z-0" 
        />

        {/* Animated Radial Fog & Lighting */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,107,26,0.12)_0%,transparent_60%)] rounded-full blur-[100px] pointer-events-none z-0"
        />

        {/* Holographic AI Rays & Neural Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 mix-blend-screen z-0">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,107,26,0.15)_20%,transparent_40%,rgba(108,99,255,0.1)_60%,transparent_80%)] rounded-full" />
        </div>

        {/* Floating Embers / Particles */}
        <div className="absolute inset-0 z-0 opacity-40">
           <ParticleCanvas count={50} color="#FF9A3C" />
        </div>

        <div className="relative z-20 max-w-[1100px] mx-auto flex flex-col items-center text-center w-full">
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-10">
            <motion.div 
              animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.05] backdrop-blur-md shadow-[0_0_30px_rgba(255,107,26,0.1)]"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#FF9A3C] rounded-full animate-ping opacity-60" />
                <div className="w-2 h-2 rounded-full bg-[#FF9A3C]" />
              </div>
              <span className="text-[#FF9A3C] text-xs sm:text-sm font-mono uppercase tracking-[0.25em] font-medium">The Education Revolution</span>
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black mb-10 font-display tracking-tight leading-[1.15] text-white drop-shadow-[0_0_40px_rgba(255,107,26,0.25)] w-full px-4 sm:px-10"
          >
            {isHindi ? 'आज ही शुरू करें' : 'Every Child Deserves'}
            <motion.span 
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="block mt-6 text-transparent bg-clip-text bg-[linear-gradient(110deg,#FF6B1A,30%,#FF9A3C,50%,#FFF5D1,70%,#FF6B1A)] bg-[length:200%_auto] pb-4 drop-shadow-[0_0_20px_rgba(255,154,60,0.4)]"
            >
              {isHindi ? 'AI शिक्षा' : 'A Great Teacher'}
            </motion.span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="text-lg sm:text-2xl text-zinc-300 font-normal tracking-wide max-w-2xl mb-16 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          >
            {isHindi ? 'Limitless AI — बिना इंटरनेट के, बिना पैसे के, हर जगह।' : 'Limitless AI makes that possible. Zero internet required. Completely free. Available to every student on earth.'}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center justify-center w-full py-6"
          >
            {/* PRIMARY BUTTON: Premium Apple/OpenAI Level */}
            <Link to="/chat" className="relative group w-full sm:w-auto z-10 flex justify-center">
              {/* Volumetric Pulse Glow Behind */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6B1A] via-[#FF9A3C] to-[#FF6B1A] rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-500 group-hover:duration-300"></div>
              
              <button className="relative px-10 py-5 sm:px-12 sm:py-6 bg-gradient-to-r from-[#FF6B1A] to-[#FF9A3C] rounded-full leading-none flex items-center justify-center gap-3 w-full sm:w-auto 
                shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_15px_35px_-10px_rgba(255,107,26,0.6)] 
                hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_8px_rgba(0,0,0,0.2),0_25px_50px_-12px_rgba(255,154,60,0.8)]
                hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden"
              >
                {/* Dynamic Brightening on Hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                
                {/* Glass Reflection Sweep */}
                <motion.div 
                  animate={{ x: ['-200%', '300%'] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }} 
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[25deg]" 
                />
                
                <Zap className="w-5 h-5 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="text-white font-extrabold tracking-tight text-[1.1rem] relative z-10 drop-shadow-md">{isHindi ? 'पढ़ाई शुरू करें' : "Start Learning Free"}</span>
                <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-white transition-all group-hover:translate-x-2 duration-300 relative z-10" />
              </button>
            </Link>

            {/* SECONDARY BUTTON: Premium Apple/OpenAI Level (Matched) */}
            <Link to="/subjects" className="relative group w-full sm:w-auto z-10 flex justify-center">
              {/* Volumetric Pulse Glow Behind */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6B1A] via-[#FF9A3C] to-[#FF6B1A] rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-500 group-hover:duration-300"></div>
              
              <button className="relative px-10 py-5 sm:px-12 sm:py-6 bg-gradient-to-r from-[#FF6B1A] to-[#FF9A3C] rounded-full leading-none flex items-center justify-center gap-3 w-full sm:w-auto 
                shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_15px_35px_-10px_rgba(255,107,26,0.6)] 
                hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_8px_rgba(0,0,0,0.2),0_25px_50px_-12px_rgba(255,154,60,0.8)]
                hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden"
              >
                {/* Dynamic Brightening on Hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                
                {/* Glass Reflection Sweep */}
                <motion.div 
                  animate={{ x: ['-200%', '300%'] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }} 
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[25deg]" 
                />
                
                <BookOpen className="w-5 h-5 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="text-white font-extrabold tracking-tight text-[1.1rem] relative z-10 drop-shadow-md">
                  {isHindi ? 'विषय देखें' : 'Browse Subjects'}
                </span>
                <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-white transition-all group-hover:translate-x-2 duration-300 relative z-10" />
              </button>
            </Link>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}
             className="mt-12 text-center"
          >
             <span className="text-[10px] sm:text-xs font-mono text-[#FF9A3C]/70 uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,154,60,0.2)]">
                Internet optional. Intelligence included.
             </span>
          </motion.div>

          {/* Premium Glass Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8"
          >
            {[
              { label: '100% Offline' },
              { label: 'Private AI' },
              { label: 'Hindi + English' },
              { label: 'Zero Cloud' }
            ].map((item, i) => (
              <div key={i} className="group flex items-center justify-center gap-3 h-10 px-5 bg-white/[0.02] backdrop-blur-lg border border-white/5 hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] cursor-default">
                <div className="relative w-2 h-2 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#22C55E] rounded-full animate-ping opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                </div>
                <span className="text-xs sm:text-sm font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding: '2.5rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, background: 'radial-gradient(circle at 35% 35%, #FF9A3C, #FF6B1A)', boxShadow: '0 0 12px rgba(255,107,26,0.4)', fontFamily: 'var(--font-display)' }}>
              ن
            </div>
            <span className="text-gradient" style={{ fontWeight: 700, fontSize: '1.125rem', fontFamily: 'var(--font-display)' }}>Limitless AI</span>
          </div>
          <p style={{ fontSize: '0.875rem', textAlign: 'center', color: 'var(--text-faint)' }}>
            Built with ❤️ for rural India
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="online-ping" style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: 'var(--forest)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>gemma4:e4b • offline</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
