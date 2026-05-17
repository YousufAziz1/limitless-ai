// ══════════════════════════════════════════
// Limitless AI — Global TypeScript Types
// ══════════════════════════════════════════

export type Language = 'en' | 'hi'
export type ChatMode = 'explain' | 'exam' | 'revision' | 'weak'
export type Career = 'doctor' | 'engineer' | 'ias' | 'teacher' | 'scientist' | 'artist' | 'entrepreneur'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  imageUrl?: string
  mode?: ChatMode
  isStreaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  subject?: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  language: Language
  mode: ChatMode
}

export interface Subject {
  id: string
  name: string
  nameHi: string
  emoji: string
  color: string
  description: string
  descriptionHi: string
  topics: string[]
}

export interface DreamPlan {
  career: Career
  roadmap: RoadmapStep[]
  dailySchedule: ScheduleItem[]
  motivation: string
  studyPlan: string
  milestone: string
  generatedAt: number
}

export interface RoadmapStep {
  phase: string
  duration: string
  goals: string[]
  resources: string[]
  tips: string
}

export interface ScheduleItem {
  time: string
  activity: string
  duration: string
}

export interface ModelStatus {
  available: boolean
  modelName: string
  version?: string
  ram?: string
  status: 'running' | 'loading' | 'offline' | 'error'
  responseTime?: number
}

export interface AppSettings {
  language: Language
  liteMode: boolean
  modelName: string
  fontSize: 'sm' | 'md' | 'lg'
  soundEnabled: boolean
}

export interface SubjectProgress {
  subjectId: string
  sessionsCompleted: number
  lastActive: number
  streak: number
}
