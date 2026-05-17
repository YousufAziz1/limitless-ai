import { useState, useCallback, useRef } from 'react'

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition?: new () => any
    webkitSpeechRecognition?: new () => any
  }
}

interface UseVoiceReturn {
  isListening: boolean
  transcript: string
  isSpeaking: boolean
  startListening: (onResult: (text: string) => void) => void
  stopListening: () => void
  speak: (text: string, lang?: string) => void
  stopSpeaking: () => void
  isSupported: boolean
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition !== undefined || window.webkitSpeechRecognition !== undefined) &&
    'speechSynthesis' in window

  const startListening = useCallback(
    (onResult: (text: string) => void) => {
      if (!isSupported) return

      const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition
      if (!SpeechRecognitionAPI) return

      const recognition = new SpeechRecognitionAPI()
      recognition.lang = 'hi-IN'
      recognition.interimResults = true
      recognition.maxAlternatives = 1
      recognition.continuous = false

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('')
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }

        const combined = finalTranscript || interimTranscript
        setTranscript(combined)

        if (finalTranscript) {
          onResult(finalTranscript.trim())
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    },
    [isSupported]
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const speak = useCallback((text: string, lang = 'en-IN') => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const cleaned = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\n+/g, '. ')
      .slice(0, 600)

    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    isListening,
    transcript,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported,
  }
}
