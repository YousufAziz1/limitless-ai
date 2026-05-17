import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, AppSettings, ModelStatus, SubjectProgress } from '@/types'

interface AppState {
  settings: AppSettings
  modelStatus: ModelStatus
  isFirstVisit: boolean
  subjectProgress: SubjectProgress[]
  showLoadingScreen: boolean

  // Actions
  setLanguage: (lang: Language) => void
  setLiteMode: (val: boolean) => void
  setModelName: (name: string) => void
  updateModelStatus: (status: Partial<ModelStatus>) => void
  setFirstVisit: (val: boolean) => void
  setShowLoadingScreen: (val: boolean) => void
  updateSubjectProgress: (subjectId: string) => void
  getSubjectProgress: (subjectId: string) => SubjectProgress | undefined
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  liteMode: false,
  modelName: 'gemma4:e4b',
  fontSize: 'md',
  soundEnabled: false,
}

const DEFAULT_MODEL_STATUS: ModelStatus = {
  available: false,
  modelName: 'gemma4:e4b',
  status: 'offline',
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      modelStatus: DEFAULT_MODEL_STATUS,
      isFirstVisit: true,
      subjectProgress: [],
      showLoadingScreen: true,

      setLanguage: lang =>
        set(state => ({ settings: { ...state.settings, language: lang } })),

      setLiteMode: val =>
        set(state => ({ settings: { ...state.settings, liteMode: val } })),

      setModelName: name =>
        set(state => ({ settings: { ...state.settings, modelName: name } })),

      updateModelStatus: status =>
        set(state => ({ modelStatus: { ...state.modelStatus, ...status } })),

      setFirstVisit: val => set({ isFirstVisit: val }),

      setShowLoadingScreen: val => set({ showLoadingScreen: val }),

      updateSubjectProgress: subjectId => {
        const existing = get().subjectProgress.find(p => p.subjectId === subjectId)
        if (existing) {
          set(state => ({
            subjectProgress: state.subjectProgress.map(p =>
              p.subjectId === subjectId
                ? {
                    ...p,
                    sessionsCompleted: p.sessionsCompleted + 1,
                    lastActive: Date.now(),
                    streak: p.streak + 1,
                  }
                : p
            ),
          }))
        } else {
          set(state => ({
            subjectProgress: [
              ...state.subjectProgress,
              { subjectId, sessionsCompleted: 1, lastActive: Date.now(), streak: 1 },
            ],
          }))
        }
      },

      getSubjectProgress: subjectId =>
        get().subjectProgress.find(p => p.subjectId === subjectId),
    }),
    { name: 'limitless-app-store' }
  )
)
