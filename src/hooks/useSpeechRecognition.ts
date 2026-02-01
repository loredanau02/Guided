import { useState, useEffect, useCallback, useRef } from 'react'

interface SpeechRecognitionResult {
  isListening: boolean
  transcript: string
  confidence: number
  error: string | null
  isSupported: boolean
  startListening: (lang?: string) => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = useCallback((lang = 'en-US') => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    setError(null)
    setTranscript('')
    setConfidence(0)

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let bestConfidence = 0

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
          bestConfidence = Math.max(bestConfidence, result[0].confidence)
        } else {
          finalTranscript += result[0].transcript
        }
      }

      setTranscript(finalTranscript)
      if (bestConfidence > 0) setConfidence(bestConfidence)
    }

    recognition.onerror = (event: any) => {
      setError(event.error === 'no-speech' ? 'No speech detected. Please try again.' : `Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
    setError(null)
  }, [])

  return { isListening, transcript, confidence, error, isSupported, startListening, stopListening, resetTranscript }
}