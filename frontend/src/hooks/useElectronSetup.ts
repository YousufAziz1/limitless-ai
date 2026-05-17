/**
 * hooks/useElectronSetup.ts
 * Listens to Electron IPC events and exposes setup state.
 * Gracefully falls back to web polling if not in Electron.
 */
import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { checkHealth } from '@/services/api'

// Detect if running inside Electron
export const isElectron = () =>
  typeof window !== 'undefined' && typeof window.electronAPI !== 'undefined'

export type SetupPhase =
  | 'idle'
  | 'checking'
  | 'ollama'
  | 'model'
  | 'backend'
  | 'ready'
  | 'error'

export interface SetupProgress {
  phase: SetupPhase
  percent: number
  message: string
  downloaded?: number   // MB
  total?: number        // MB
  speed?: number        // MB/s
  eta?: string          // "2m30s"
  error?: string
}

export function useElectronSetup(
  onReady: () => void,
) {
  const { updateModelStatus } = useAppStore()

  // ── Electron mode: listen to IPC ───────────────
  useEffect(() => {
    if (!isElectron()) return

    const unsubscribe = window.electronAPI?.onSetupProgress((data: SetupProgress) => {
      if (data.phase === 'ready') {
        checkHealth().then(updateModelStatus)
        setTimeout(onReady, 1200)
      }
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [onReady, updateModelStatus])

  // ── Web mode: poll backend every 3s ────────────
  useEffect(() => {
    if (isElectron()) return

    let cancelled = false
    const poll = async () => {
      try {
        const status = await checkHealth()
        if (status.available) {
          updateModelStatus(status)
          onReady()
          return
        }
      } catch { /* still offline */ }
      if (!cancelled) setTimeout(poll, 3000)
    }
    poll()
    return () => { cancelled = true }
  }, [onReady, updateModelStatus])

  // ── Start setup (Electron only) ─────────────────
  const startSetup = useCallback((modelChoice: string) => {
    if (isElectron()) {
      window.electronAPI?.startSetup(modelChoice)
    }
  }, [])

  return { startSetup, isElectron: isElectron() }
}
