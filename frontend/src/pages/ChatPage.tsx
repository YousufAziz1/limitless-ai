import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { MessageBubble } from '@/components/ui/MessageBubble'
import { InputBar } from '@/components/ui/InputBar'
import { AIOrbAssistant } from '@/components/ui/AIOrbAssistant'
import { Sidebar } from '@/components/layout/Sidebar'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store/chatStore'
import { useAppStore } from '@/store/appStore'
import { ParticleCanvas } from '@/components/ui/ParticleCanvas'
// ChatPage — Full AI tutor interface
// ══════════════════════════════════════════

const WELCOME_SUGGESTIONS_EN = [
  '📐 Explain Pythagoras theorem simply',
  '⚗️ What is photosynthesis? Step by step',
  '🏛️ Tell me about the Mughal Empire',
  '✏️ Help me write an essay on environment',
  '🔢 Solve: 2x + 5 = 15',
  '🧬 How does DNA work?',
]

const WELCOME_SUGGESTIONS_HI = [
  '📐 पाइथागोरस प्रमेय सरल भाषा में समझाएं',
  '⚗️ प्रकाश संश्लेषण क्या है? चरण-दर-चरण',
  '🏛️ मुगल साम्राज्य के बारे में बताएं',
  '✏️ पर्यावरण पर निबंध लिखने में मदद करें',
  '🔢 हल करें: 2x + 5 = 15',
  '🧬 DNA कैसे काम करता है?',
]

export function ChatPage() {
  const { sendMessage, isStreaming, cancelStream } = useChat()
  const { getActiveSession, createSession } = useChatStore()
  const { settings, modelStatus } = useAppStore()
  const isHindi = settings.language === 'hi'
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const session = getActiveSession()
  const messages = session?.messages ?? []

  const suggestions = isHindi ? WELCOME_SUGGESTIONS_HI : WELCOME_SUGGESTIONS_EN

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string, imageUrl?: string) => {
    await sendMessage(text, imageUrl)
  }

  const handleNewChat = () => {
    createSession(undefined, settings.language)
  }

  return (
    <div
      className="flex overflow-hidden relative"
      style={{ height: '100%', background: 'radial-gradient(circle at top right, rgba(34,197,94,0.04) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(0,0,0,1) 0%, #030305 100%), #050508' }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main chat area */}
      <div className={`main-content flex flex-col flex-1 min-w-0 transition-all duration-500 ${messages.length === 0 ? 'xl:pr-[300px]' : ''}`}>
        {/* Particle canvas on top of CSS bg */}
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.4 }}><ParticleCanvas count={50} color="#FF6B1A" /></div>

        {/* Ambient Right Side Knowledge Graph (Visible on xl screens) */}
        {messages.length === 0 && (
          <div className="hidden xl:flex absolute right-0 top-0 bottom-0 w-[270px] pointer-events-auto z-20 flex-col justify-center gap-3 pb-12 px-4">

            {/* Ambient System Haze */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.02),transparent_70%)] pointer-events-none" />

            {/* Neural Path Panel */}
            <motion.div
              className="w-full h-32 p-5 flex flex-col gap-3 rounded-2xl relative overflow-hidden group cursor-default z-10 backdrop-blur-[24px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.3)]"
              style={{ background: 'linear-gradient(135deg, rgba(10,10,14,0.48) 0%, rgba(10,10,14,0.28) 100%)' }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-white/40 tracking-[0.2em] group-hover:text-white/60 transition-colors duration-500">{isHindi ? 'न्यूरल पथ' : 'NEURAL PATH'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/5 to-transparent" />
              <div className="flex-1 flex items-end gap-[3px] overflow-hidden opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-full bg-white/10 rounded-t-[1px]"
                    animate={{ height: ['15%', '85%', '15%'] }}
                    transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random(), ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Inference Panel */}
            <motion.div
              className="w-full h-24 p-5 flex flex-col justify-center rounded-2xl relative overflow-hidden group cursor-default z-10 backdrop-blur-[24px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.3)]"
              style={{ background: 'linear-gradient(135deg, rgba(10,10,14,0.48) 0%, rgba(10,10,14,0.28) 100%)' }}
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-[9px] font-mono text-white/40 tracking-[0.2em] mb-3 group-hover:text-white/60 transition-colors duration-500">{isHindi ? 'अनुमान' : 'INFERENCE'}</span>
              <div className="flex items-center gap-3">
                <div className="relative w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-dashed border-[#FF6B1A]/40" />
                  <div className="w-1.5 h-1.5 bg-[#FF6B1A] rounded-full shadow-[0_0_8px_rgba(255,107,26,0.4)]" />
                </div>
                <span className="text-[11px] font-bold text-[#FF6B1A]/80 tracking-widest">{isHindi ? 'सक्रिय' : 'ACTIVE'}</span>
              </div>
              {/* Token stream simulation */}
              <div className="mt-3 flex gap-1 opacity-40">
                <motion.div className="w-1.5 h-px bg-[#FF6B1A]/60" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-3 h-px bg-[#FF6B1A]/60" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-2 h-px bg-[#FF6B1A]/60" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
                <motion.div className="w-4 h-px bg-[#FF6B1A]/60" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
              </div>
            </motion.div>

            {/* Memory Graph Panel */}
            <motion.div
              className="w-full p-5 rounded-2xl relative overflow-hidden group cursor-default z-10 backdrop-blur-[24px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.3)]"
              style={{ background: 'linear-gradient(135deg, rgba(10,10,14,0.48) 0%, rgba(10,10,14,0.28) 100%)' }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-white/40 tracking-[0.2em] group-hover:text-white/60 transition-colors duration-500">{isHindi ? 'मेमोरी ग्राफ' : 'MEMORY GRAPH'}</span>
                <span className="text-[9px] font-mono text-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">840 MB / 1 GB</span>
              </div>
              <svg className="w-full h-10 mt-2 opacity-60 group-hover:opacity-90 transition-opacity duration-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <motion.path
                  d="M0 15 Q 10 5, 20 15 T 40 15 T 60 15 T 80 15 T 100 15"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-blue-400/60"
                  strokeWidth="1.5"
                  animate={{ d: ["M0 15 Q 10 5, 20 15 T 40 15 T 60 15 T 80 15 T 100 15", "M0 15 Q 10 25, 20 15 T 40 15 T 60 15 T 80 15 T 100 15"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M0 15 Q 10 25, 20 15 T 40 15 T 60 15 T 80 15 T 100 15"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-white/10"
                  strokeWidth="1"
                  animate={{ d: ["M0 15 Q 10 25, 20 15 T 40 15 T 60 15 T 80 15 T 100 15", "M0 15 Q 10 5, 20 15 T 40 15 T 60 15 T 80 15 T 100 15"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* Neural connector lines */}
            <div className="absolute top-[35%] -left-[20px] w-[20px] h-px bg-gradient-to-r from-transparent to-white/5 pointer-events-none" />
            <div className="absolute top-[50%] -left-[40px] w-[40px] h-px bg-gradient-to-r from-transparent to-white/5 pointer-events-none" />
            <div className="absolute top-[75%] -left-[30px] w-[30px] h-px bg-gradient-to-r from-transparent to-white/5 pointer-events-none" />
          </div>
        )}

        {/* ── Chat Header ── */}
        <div
          className="flex items-center justify-between px-6 py-3.5 flex-shrink-0 relative z-20 border-b border-white/[0.04]"
          style={{ background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(30px)' }}
        >
          <div className="flex items-center gap-3">
            <AIOrbAssistant size="sm" isActive={isStreaming} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {isHindi ? 'Limitless AI शिक्षक' : 'Limitless AI Tutor'}
                </h2>
                {isStreaming && (
                  <div className="flex items-center gap-[3px] ml-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div
                        key={i}
                        className="w-[2px] bg-green-400 rounded-full shadow-[0_0_4px_#22C55E]"
                        animate={{ height: ['4px', '12px', '4px'] }}
                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-mono tracking-wider" style={{ color: 'var(--text-faint)' }}>
                {isStreaming
                  ? (isHindi ? 'सोच रहा है...' : 'Thinking...')
                  : (isHindi ? 'तैयार है' : 'Ready')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" />
              <span className="text-[10px] font-mono text-green-400/80 tracking-wider">{isHindi ? 'लोकल AI' : 'LOCAL AI'}</span>
            </div>
            <button
              onClick={handleNewChat}
              id="new-chat-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 group"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-[12px] font-medium text-zinc-400 group-hover:text-white">
                {isHindi ? 'नई बात' : 'New Chat'}
              </span>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide" style={{ padding: '0 clamp(16px, 4vw, 48px)' }}>
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              /* Welcome screen Cinematic */
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center pt-4 pb-16 gap-2 max-w-4xl mx-auto relative -translate-y-[44px]"
              >
                {/* Radial vignette for text anchoring */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 flex-col">
                  {/* Subtle spotlight beneath orb */}
                  <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.06)_0%,transparent_60%)] -translate-y-20 blur-[50px]" />
                  {/* Text vignette */}
                  <div className="w-[120%] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(5,5,8,0.7)_0%,transparent_60%)] translate-y-16" />
                </div>

                {/* Huge AI Orb */}
                <div className="hero-orb-wrapper">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="mb-0 mt-2"
                  >
                    <AIOrbAssistant size="hero" isActive={true} />
                  </motion.div>
                </div>

                {/* Cinematic Typewriter Intro */}
                <div className="text-center flex flex-col gap-3 relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-black tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mx-auto leading-none pb-2 text-[clamp(2rem,4vw+0.5rem,3rem)]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      background: 'linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {isHindi ? 'अस्सलामु अलैकुम। मैं Limitless AI हूँ।' : 'Hello! I\'m Limitless AI.'}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-sm sm:text-base text-zinc-500 font-medium tracking-wide max-w-xl mx-auto drop-shadow-md"
                  >
                    {isHindi ? 'आपका पूरी तरह से ऑफलाइन AI ट्यूटर।' : 'Your fully offline AI tutor.'}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center gap-3 mt-1 text-[10px] font-mono tracking-widest text-[#22C55E]/70"
                  >
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#22C55E] rounded-full shadow-[0_0_8px_#22C55E]"></span>{isHindi ? 'निजी' : 'PRIVATE'}</span>
                    <span className="text-zinc-700/50">•</span>
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#22C55E] rounded-full shadow-[0_0_8px_#22C55E]"></span>{isHindi ? 'तत्काल' : 'INSTANT'}</span>
                    <span className="text-zinc-700/50">•</span>
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#22C55E] rounded-full shadow-[0_0_8px_#22C55E]"></span>{isHindi ? 'कोई क्लाउड नहीं' : 'ZERO CLOUD'}</span>
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-3 bg-[#FF6B1A]/80 ml-2" />
                  </motion.div>
                </div>

                {/* Input Dock (Welcome Screen) */}
                <div className="w-full max-w-3xl mx-auto mt-4 mb-8 relative z-30 px-4 sm:px-8">
                  {/* Volumetric ambient glow underneath the dock */}
                  <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[70%] h-24 bg-[#FF6B1A] blur-[80px] opacity-[0.15] pointer-events-none" />
                  <InputBar
                    onSend={handleSend}
                    isStreaming={isStreaming}
                    onCancel={cancelStream}
                    disabled={false}
                  />
                </div>

                {/* Floating Glass Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto px-4 relative z-20">
                  {suggestions.map((suggestion, i) => {
                    const icon = suggestion.substring(0, 2);
                    const text = suggestion.substring(2).trim();
                    return (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 + i * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => handleSend(text)}
                        className="relative group text-left p-4 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden border border-white/[0.02] bg-white/[0.015] backdrop-blur-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.06), inset 0 1px 1px rgba(255,255,255,0.05)' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-[200%] group-hover:animate-[bgShimmer_1.5s_infinite] skew-x-12" />

                        {/* Dynamic edge glow on hover */}
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="relative z-10 flex items-start gap-4">
                          <div className="text-[1.35rem] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">{icon}</div>
                          <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors duration-700 leading-snug">
                            {text}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Model status */}
                {modelStatus.status !== 'running' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-medium mt-4 bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    {isHindi
                      ? 'सिस्टम ऑफलाइन: सर्वर शुरू करें (python main.py)'
                      : 'SYSTEM OFFLINE: Initialize local core (python main.py)'}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Messages list */
              <motion.div
                key="messages"
                className="flex flex-col gap-6 py-10 max-w-4xl mx-auto w-full"
              >
                {messages.map((message, i) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                      delay: i === messages.length - 1 ? 0.1 : 0
                    }}
                  >
                    <MessageBubble
                      message={message}
                      isLatest={i === messages.length - 1}
                    />
                  </motion.div>
                ))}
                <div ref={messagesEndRef} className="h-40" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Input dock (Active Chat Mode) */}
        {messages.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none">
            {/* Volumetric ambient glow underneath the dock */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[60%] h-20 bg-[#FF6B1A] blur-[80px] opacity-[0.08] pointer-events-none" />

            <div className="max-w-3xl mx-auto pointer-events-auto relative">
              <InputBar
                onSend={handleSend}
                isStreaming={isStreaming}
                onCancel={cancelStream}
                disabled={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}

    </div>
  )
}
