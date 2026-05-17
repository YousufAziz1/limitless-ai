import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

// ══════════════════════════════════════════
// AIOrbAssistant — Cinematic Jarvis-style Orb
// ══════════════════════════════════════════

interface AIOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'xl' | 'scanner'
  isActive?: boolean
  isListening?: boolean
  className?: string
}

const sizes = {
  sm:   { container: 'w-12 h-12', orb: 'w-8 h-8' },
  md:   { container: 'w-20 h-20', orb: 'w-12 h-12' },
  lg:   { container: 'w-32 h-32', orb: 'w-20 h-20' },
  hero: { container: 'w-[380px] h-[380px]', orb: 'w-[180px] h-[180px]' }, // Balanced for chat hero
  xl:   { container: 'w-[700px] h-[700px]', orb: 'w-[320px] h-[320px]' }, // Massive for landing page
  scanner: { container: 'w-[340px] h-[340px]', orb: 'w-[170px] h-[170px]' },
}

// Particle system for the orb
function OrbParticles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<{ id: number; r: number; angle: number; speed: number; size: number; depth: number }[]>([])

  useEffect(() => {
    if (!active) return
    const p = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      r: 100 + Math.random() * 300,
      angle: Math.random() * 360,
      speed: 6 + Math.random() * 8,
      size: 1 + Math.random() * 3,
      depth: Math.random() // 0 to 1 for parallax depth blur
    }))
    setParticles(p)
  }, [active])

  if (!active) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#FF6B1A] mix-blend-screen"
          style={{ 
            width: p.size, 
            height: p.size, 
            filter: `blur(${p.depth * 3}px)`, // Depth blur
            opacity: 1 - p.depth * 0.5
          }}
          animate={{
            rotate: [p.angle, p.angle + (Math.random() > 0.5 ? 360 : -360)],
            scale: [0, 1 + p.depth, 0],
            opacity: [0, 0.8 - p.depth * 0.3, 0],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          initial={{ x: Math.cos(p.angle) * p.r, y: Math.sin(p.angle) * p.r }}
        />
      ))}
    </div>
  )
}

export function AIOrbAssistant({ size = 'md', isActive = false, isListening = false, className = '' }: AIOrbProps) {
  const dims = sizes[size]
  
  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2 // -1 to 1
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  // 3D Transformations
  const rotateX = useTransform(smoothY, [-1, 1], [15, -15])
  const rotateY = useTransform(smoothX, [-1, 1], [-15, 15])
  
  // Parallax layers
  const innerX = useTransform(smoothX, [-1, 1], [-20, 20])
  const innerY = useTransform(smoothY, [-1, 1], [-20, 20])
  
  const outerX = useTransform(smoothX, [-1, 1], [30, -30])
  const outerY = useTransform(smoothY, [-1, 1], [30, -30])

  return (
    <motion.div 
      className={`relative flex items-center justify-center ${dims.container} ${className} group perspective-1000`}
      style={{ 
        rotateX: (size === 'xl' || size === 'hero') ? rotateX : 0, 
        rotateY: (size === 'xl' || size === 'hero') ? rotateY : 0,
        transformStyle: 'preserve-3d'
      }}
    >
      
      {/* ── Outer Energy Ring (Layer 1) ── */}
      <motion.div
        className="absolute inset-[0%] rounded-full border border-[#FF6B1A]/5"
        style={{ x: outerX, y: outerY, z: -50 }}
        animate={{ rotate: 360, scale: [1, 1.03, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute top-0 left-1/2 w-32 h-1 bg-[#FF6B1A] blur-md -translate-x-1/2 opacity-20" />
      </motion.div>

      {/* ── Rotating Concentric Rings (Layer 2) ── */}
      <motion.div
        className="absolute inset-[10%] rounded-full border-[2px] border-dashed border-[#FF6B1A]/20"
        style={{ x: outerX, y: outerY, z: -30 }}
        animate={{ rotate: -360, scale: [1, 1.02, 1] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div
        className="absolute inset-[16%] rounded-full border border-[#F5C842]/15"
        style={{ x: outerX, y: outerY, z: -20 }}
        animate={{ rotate: 360, scale: [1, 1.01, 1] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute inset-[22%] rounded-full border-[1.5px] border-[#FF6B1A]/30 border-t-transparent border-b-transparent"
        style={{ z: -10 }}
        animate={{ rotate: 360, scale: [1, 1.03, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Outer Glow & Shaders ── */}
      <motion.div
        className="absolute inset-[24%] rounded-full opacity-50 mix-blend-screen pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(255,107,26,0.6), rgba(245,200,66,0.6), rgba(255,107,26,0.6), transparent)',
          filter: 'blur(15px)',
        }}
        animate={{ rotate: 360, scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* ── Holographic Ring (New) ── */}
      <motion.div
        className="absolute inset-[18%] rounded-full border border-[#FF6B1A]/10 pointer-events-none"
        style={{ x: outerX, y: outerY, z: -15, borderStyle: 'dotted', borderWidth: '1.5px' }}
        animate={{ rotate: -360, scale: [1, 1.02, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Mid ring blanking */}
      <motion.div
        className="absolute inset-[26%] rounded-full backdrop-blur-3xl"
        style={{ background: 'var(--bg-base)' }}
      />

      {/* ── Core Orb Body (Layer 3) ── */}
      <motion.div
        className={`absolute rounded-full flex items-center justify-center overflow-hidden ${dims.orb}`}
        style={{
          x: innerX, y: innerY, z: 50,
          background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FFB067 20%, #FF5B00 50%, #5A1C00 80%, #000000 100%)',
          boxShadow: isActive
            ? '0 0 60px rgba(255,107,26,0.4), inset 0 0 40px rgba(255,255,255,0.5), inset 0 -50px 60px rgba(0,0,0,1)'
            : '0 0 25px rgba(255,107,26,0.2), inset 0 0 25px rgba(255,255,255,0.25), inset 0 -30px 40px rgba(0,0,0,0.8)',
        }}
        animate={isActive ? { 
          scale: [1, 1.01, 1],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner neural mesh (Subtle lines) */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {/* Inner Energy Turbulence (Animated gradient overlay) */}
        <motion.div 
          className="absolute inset-0 opacity-50 mix-blend-color-dodge"
          style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(255,107,26,0.4), transparent, rgba(245,200,66,0.3), transparent)' }}
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Deep lens distortion effect (simulated glass reflection) */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_20px_50px_rgba(255,255,255,0.7)] opacity-90" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_-40px_80px_rgba(0,0,0,1)] mix-blend-multiply" />
        <div className="absolute inset-2 rounded-full border border-white/10 blur-[1px]" />

        {/* Inner sparkle / core focus */}
        <motion.div
          className="w-[40%] h-[40%] rounded-full bg-white/90 blur-[6px] shadow-[0_0_30px_white]"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Inner Plasma Motion */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent)] mix-blend-overlay animate-[spin_8s_linear_infinite]" />

        {/* Waveform Pulse (Iconic Engine) */}
        {isActive && (size === 'xl' || size === 'hero') && (
          <motion.div
            className="absolute inset-0 rounded-full border-[3px] border-white/20"
            animate={{ scale: [0.5, 1.3], opacity: [0.8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.div>

      {/* ── Scanner-Specific Rings ── */}
      {size === 'scanner' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Radar Sweep */}
          <div className="absolute inset-[-40px] rounded-full mix-blend-screen bg-[conic-gradient(from_0deg,transparent,transparent_60%,rgba(255,107,26,0.1)_90%,rgba(255,107,26,0.4)_100%)] animate-[spin_4s_linear_infinite]" />
          
          {/* Layered Rotating Depth Rings */}
          <motion.div className="absolute inset-[-30px] rounded-full border border-[#FF6B1A]/20" animate={{ rotate: 360 }} transition={{ duration: 30, ease: 'linear', repeat: Infinity }} />
          <motion.div className="absolute inset-[-60px] rounded-full border border-dashed border-[#FF6B1A]/15" animate={{ rotate: -360 }} transition={{ duration: 50, ease: 'linear', repeat: Infinity }} />
          <motion.div className="absolute inset-[-90px] rounded-full border border-[#FF6B1A]/5" animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }} />
          
          {/* Scanning Reticles */}
          <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-1 h-3 bg-[#FF6B1A]/50 rounded-full" />
          <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-1 h-3 bg-[#FF6B1A]/50 rounded-full" />
          <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 w-3 h-1 bg-[#FF6B1A]/50 rounded-full" />
          <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-3 h-1 bg-[#FF6B1A]/50 rounded-full" />
        </div>
      )}

      {/* Floating Particles */}
      {isActive && (size === 'xl' || size === 'hero' || size === 'scanner') && <OrbParticles active={true} />}

      {/* Listening pulse rings */}
      {isListening && (
        <>
          <motion.div
            className="absolute inset-[15%] rounded-full border-2 border-[#FF6B1A]"
            animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-[15%] rounded-full border-2 border-[#FF6B1A]"
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
          />
        </>
      )}
    </motion.div>
  )
}
