import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, ChatSession, ChatMode, Language } from '@/types'

interface ChatState {
  sessions: ChatSession[]
  activeSessionId: string | null
  isStreaming: boolean
  currentMode: ChatMode
  activeSubject: string | null

  // Actions
  createSession: (subject?: string, language?: Language) => string
  setActiveSession: (id: string) => void
  addMessage: (sessionId: string, message: Message) => void
  updateLastMessage: (sessionId: string, content: string, isStreaming: boolean) => void
  setStreaming: (val: boolean) => void
  setMode: (mode: ChatMode) => void
  setActiveSubject: (subject: string | null) => void
  clearSession: (id: string) => void
  deleteSession: (id: string) => void
  getActiveSession: () => ChatSession | null
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isStreaming: false,
      currentMode: 'explain',
      activeSubject: null,

      createSession: (subject, language = 'en') => {
        const id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
        const session: ChatSession = {
          id,
          title: subject ? `${subject} Session` : 'New Session',
          subject,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          language,
          mode: get().currentMode,
        }
        set(state => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }))
        return id
      },

      setActiveSession: id => set({ activeSessionId: id }),

      addMessage: (sessionId, message) => set(state => ({
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
            : s
        ),
      })),

      updateLastMessage: (sessionId, content, isStreaming) => set(state => ({
        sessions: state.sessions.map(s => {
          if (s.id !== sessionId) return s
          const messages = [...s.messages]
          const lastIdx = messages.length - 1
          if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
            messages[lastIdx] = { ...messages[lastIdx], content, isStreaming }
          }
          return { ...s, messages, updatedAt: Date.now() }
        }),
      })),

      setStreaming: val => set({ isStreaming: val }),
      setMode: mode => set({ currentMode: mode }),
      setActiveSubject: subject => set({ activeSubject: subject }),

      clearSession: id => set(state => ({
        sessions: state.sessions.map(s =>
          s.id === id ? { ...s, messages: [], updatedAt: Date.now() } : s
        ),
      })),

      deleteSession: id => set(state => ({
        sessions: state.sessions.filter(s => s.id !== id),
        activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
      })),

      getActiveSession: () => {
        const { sessions, activeSessionId } = get()
        return sessions.find(s => s.id === activeSessionId) ?? null
      },
    }),
    { name: 'limitless-chat-store' }
  )
)
