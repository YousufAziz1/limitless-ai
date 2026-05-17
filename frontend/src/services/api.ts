// ══════════════════════════════════════════
// Limitless AI — API Service Layer
// Connects to FastAPI backend (offline-first)
// ══════════════════════════════════════════

import type { ModelStatus, Subject, Language, ChatMode } from '@/types'

const BASE_URL = '/api'

// ── Health Check ──────────────────────────
export async function checkHealth(): Promise<ModelStatus> {
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error('Backend not reachable')
    const data = await res.json()
    return data as ModelStatus
  } catch {
    return {
      available: false,
      modelName: 'gemma4:e4b',
      status: 'offline',
    }
  }
}

// ── Subjects ──────────────────────────────
export async function fetchSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch(`${BASE_URL}/subjects`)
    if (!res.ok) throw new Error('Failed to fetch subjects')
    return await res.json()
  } catch {
    return FALLBACK_SUBJECTS
  }
}

// ── Streaming Chat ─────────────────────────
export interface ChatRequest {
  message: string
  history?: { role: string; content: string }[]
  mode?: ChatMode
  language?: Language
  subject?: string
  modelName?: string
}

export async function* streamChat(
  request: ChatRequest,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Server error' }))
    throw new Error(err.detail ?? 'Chat request failed')
  }

  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') return
          if (data) {
            try {
              const parsed = JSON.parse(data)
              if (parsed.token) yield parsed.token
            } catch {
              // Ignore malformed SSE chunks
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// ── Image + Text Analysis ─────────────────
export interface ImageAnalysisRequest {
  prompt: string
  language?: Language
  modelName?: string
}

export async function* streamImageAnalysis(
  file: File,
  prompt: string,
  language: Language = 'en',
  modelName = 'gemma4:e4b',
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('prompt', prompt)
  formData.append('language', language)
  formData.append('model_name', modelName)

  const res = await fetch(`${BASE_URL}/chat-image`, {
    method: 'POST',
    body: formData,
    signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Image analysis failed' }))
    throw new Error(err.detail ?? 'Image analysis failed')
  }

  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') return
          if (data) {
            try {
              const parsed = JSON.parse(data)
              if (parsed.token) yield parsed.token
            } catch {
              // Ignore
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// ── Dream Builder ─────────────────────────
export interface DreamRequest {
  career: string
  language?: Language
  modelName?: string
}

export async function* streamDreamPlan(
  request: DreamRequest,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: buildDreamPrompt(request.career, request.language ?? 'en'),
      mode: 'explain',
      language: request.language ?? 'en',
      modelName: request.modelName ?? 'gemma4:e4b',
    }),
    signal,
  })

  if (!res.ok) throw new Error('Dream plan generation failed')
  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') return
          if (data) {
            try {
              const parsed = JSON.parse(data)
              if (parsed.token) yield parsed.token
            } catch {
              // Ignore
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

function buildDreamPrompt(career: string, language: Language): string {
  if (language === 'hi') {
    return `मैं ${career} बनना चाहता हूँ। मुझे एक विस्तृत रोडमैप बनाएं जिसमें:
1. 📚 पढ़ाई का चरण-दर-चरण प्लान (कक्षा 8-12 से आगे)
2. ⏰ दैनिक पढ़ाई का समय-सारिणी
3. 🎯 महत्वपूर्ण परीक्षाएं और तारीखें
4. 📖 जरूरी किताबें और संसाधन
5. 💪 प्रेरणादायक संदेश
6. 🏆 सफलता के मील के पत्थर

Hindi में सरल और प्रेरणादायक भाषा में उत्तर दें।`
  }
  return `I want to become a ${career}. Please create a detailed roadmap including:
1. 📚 Step-by-step study plan (from Class 8-12 onwards)
2. ⏰ Daily study schedule with time blocks
3. 🎯 Key exams, entrance tests and important dates
4. 📖 Essential books and free resources
5. 💪 Motivational guidance for tough times
6. 🏆 Milestone achievements to track progress

Be warm, encouraging and specific. Use emojis. Make it feel achievable for a rural student.`
}

// ── Fallback Subjects (offline-safe) ──────
export const FALLBACK_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    nameHi: 'गणित',
    emoji: '📐',
    color: '#FF6B1A',
    description: 'Algebra, Geometry, Calculus and more',
    descriptionHi: 'बीजगणित, ज्यामिति, कैलकुलस और अधिक',
    topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
  },
  {
    id: 'science',
    name: 'Science',
    nameHi: 'विज्ञान',
    emoji: '🔬',
    color: '#22C55E',
    description: 'Physics, Chemistry and Biology',
    descriptionHi: 'भौतिकी, रसायन और जीव विज्ञान',
    topics: ['Physics', 'Chemistry', 'Biology', 'Experiments'],
  },
  {
    id: 'hindi',
    name: 'Hindi',
    nameHi: 'हिंदी',
    emoji: '📖',
    color: '#F5C842',
    description: 'Grammar, Literature and Writing',
    descriptionHi: 'व्याकरण, साहित्य और लेखन',
    topics: ['Grammar', 'Literature', 'Essay', 'Poetry'],
  },
  {
    id: 'english',
    name: 'English',
    nameHi: 'अंग्रेजी',
    emoji: '🌐',
    color: '#818CF8',
    description: 'Grammar, Reading and Writing skills',
    descriptionHi: 'व्याकरण, पठन और लेखन कौशल',
    topics: ['Grammar', 'Reading', 'Writing', 'Speaking'],
  },
  {
    id: 'history',
    name: 'History & Civics',
    nameHi: 'इतिहास और नागरिक शास्त्र',
    emoji: '🏛️',
    color: '#F97316',
    description: 'Indian and World History, Civics',
    descriptionHi: 'भारतीय और विश्व इतिहास, नागरिक शास्त्र',
    topics: ['Ancient India', 'Modern India', 'World History', 'Constitution'],
  },
  {
    id: 'geography',
    name: 'Geography',
    nameHi: 'भूगोल',
    emoji: '🌍',
    color: '#34D399',
    description: 'Physical and Human Geography',
    descriptionHi: 'भौतिक और मानव भूगोल',
    topics: ['Physical Features', 'Climate', 'Maps', 'Resources'],
  },
]
