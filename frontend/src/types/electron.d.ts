/**
 * types/electron.d.ts
 * Global type declarations for window.electronAPI
 */
import type { SetupProgress } from '@/hooks/useElectronSetup'

declare global {
  interface Window {
    electronAPI?: {
      startSetup: (modelChoice: string) => Promise<{ started: boolean }>
      getSetupStatus: () => Promise<SetupProgress>
      onSetupProgress: (callback: (data: SetupProgress) => void) => () => void
      platform: string
    }
  }
}

export {}
