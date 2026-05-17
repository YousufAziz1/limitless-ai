import { useCallback, useRef } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useAppStore } from '@/store/appStore'
import { streamChat } from '@/services/api'
import type { Message } from '@/types'

// Simple nanoid-like fallback
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

interface UseChatReturn {
  sendMessage: (content: string, imageUrl?: string) => Promise<void>
  isStreaming: boolean
  cancelStream: () => void
}

export function useChat(): UseChatReturn {
  const abortRef = useRef<AbortController | null>(null)

  const {
    activeSessionId,
    createSession,
    addMessage,
    updateLastMessage,
    setStreaming,
    isStreaming,
    currentMode,
    getActiveSession,
  } = useChatStore()

  const { settings } = useAppStore()

  const cancelStream = useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [setStreaming])

  const sendMessage = useCallback(
    async (content: string, imageUrl?: string) => {
      if (isStreaming || !content.trim()) return

      // Ensure session exists
      let sessionId = activeSessionId
      if (!sessionId) {
        sessionId = createSession(undefined, settings.language)
      }

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        imageUrl,
        mode: currentMode,
      }
      addMessage(sessionId, userMessage)

      // Add placeholder assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        mode: currentMode,
        isStreaming: true,
      }
      addMessage(sessionId, assistantMessage)

      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const session = getActiveSession()
        const history = (session?.messages ?? [])
          .filter(m => !m.isStreaming)
          .slice(-10)
          .map(m => ({ role: m.role, content: m.content }))

        let accumulated = ''

        for await (const token of streamChat(
          {
            message: content,
            history,
            mode: currentMode,
            language: settings.language,
            modelName: settings.modelName,
          },
          controller.signal
        )) {
          accumulated += token
          updateLastMessage(sessionId!, accumulated, true)
        }

        updateLastMessage(sessionId!, accumulated, false)
      } catch (err) {
        const isAbort = err instanceof DOMException && err.name === 'AbortError'
        if (!isAbort) {
          const errMsg =
            settings.language === 'hi'
              ? '❌ AI से जुड़ने में समस्या हुई। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है।'
              : '❌ Could not connect to AI. Please make sure the backend server is running.'
          updateLastMessage(sessionId!, errMsg, false)
        }
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [
      isStreaming,
      activeSessionId,
      createSession,
      addMessage,
      updateLastMessage,
      setStreaming,
      currentMode,
      getActiveSession,
      settings,
    ]
  )

  return { sendMessage, isStreaming, cancelStream }
}
