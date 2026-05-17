import { motion } from 'framer-motion'
import { Cpu, Zap, WifiOff } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

// ══════════════════════════════════════════
// OfflineBadge — Always-visible AI status
// ══════════════════════════════════════════

interface OfflineBadgeProps {
  compact?: boolean
}

export function OfflineBadge({ compact = false }: OfflineBadgeProps) {
  const { modelStatus } = useAppStore()
  const isRunning = modelStatus.status === 'running'

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
        style={{
          background: isRunning ? 'rgba(34,197,94,0.12)' : 'rgba(255,107,26,0.12)',
          border: `1px solid ${isRunning ? 'rgba(34,197,94,0.25)' : 'rgba(255,107,26,0.25)'}`,
        }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: isRunning ? '#22C55E' : '#FF6B1A' }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span
          className="text-xs font-semibold font-mono"
          style={{ color: isRunning ? '#22C55E' : '#FF6B1A' }}
        >
          {isRunning ? 'LOCAL AI' : 'OFFLINE'}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${isRunning ? 'rgba(34,197,94,0.2)' : 'rgba(255,107,26,0.2)'}`,
      }}
    >
      {/* Status dot */}
      <div className="relative flex items-center">
        <motion.div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: isRunning ? '#22C55E' : '#FF6B1A' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: '#22C55E' }}
            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3" style={{ color: isRunning ? '#22C55E' : '#FF6B1A' }} />
          <span
            className="text-xs font-bold font-mono tracking-wider"
            style={{ color: isRunning ? '#22C55E' : '#FF6B1A' }}
          >
            {isRunning ? 'LOCAL AI ACTIVE' : 'AI OFFLINE'}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
          {modelStatus.modelName} • No Internet Required
        </span>
      </div>

      <div className="flex items-center">
        {isRunning ? (
          <Zap className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
        ) : (
          <WifiOff className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
        )}
      </div>
    </motion.div>
  )
}
