import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mic, MicOff, RotateCcw, Lightbulb } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getPronunciation } from '../../../services/pronunciation.service'
import { upsertProgress } from '../../../services/progress.service'
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition'
import { comparePronunciation } from '../../../utils/speechUtils'
import type { PronunciationExercise } from '../../../types'
import { ROUTES } from '../../../utils/constants'
import clsx from 'clsx'

export default function PronunciationPractice() {
  const { id } = useParams()
  const { user } = useAuth()
  const [exercise, setExercise] = useState<PronunciationExercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [bestScore, setBestScore] = useState(0)
  const [result, setResult] = useState<{ score: number; wordResults: Array<{ word: string; matched: boolean }> } | null>(null)
  const [showHints, setShowHints] = useState(false)
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition()

  useEffect(() => {
    if (!id) return
    getPronunciation(id).then(ex => { setExercise(ex); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (transcript && exercise && !isListening) {
      const comparison = comparePronunciation(exercise.targetPhrase, transcript)
      setResult(comparison)
      if (comparison.score > bestScore) {
        setBestScore(comparison.score)
        if (user && id) {
          upsertProgress({
            studentId: user.uid, contentType: 'pronunciation', contentId: id, contentTitle: exercise.title,
            status: comparison.score >= 80 ? 'completed' : 'in_progress', completionPercentage: comparison.score, pronunciationBestScore: comparison.score,
          }).catch(console.error)
        }
      }
    }
  }, [transcript, isListening])

  function handleStart() { resetTranscript(); setResult(null); startListening('en-US') }
  function handleRetry() { resetTranscript(); setResult(null) }

  if (loading) return <LoadingSpinner className="py-20" />
  if (!exercise) return <div className="text-center py-20 text-gray-500">Exercise not found</div>
  if (!isSupported) return (
    <div className="max-w-xl mx-auto text-center py-20">
      <MicOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Speech Recognition not supported</h2>
      <p className="text-gray-500">Please use a different browser like Chrome or Edge.</p>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto">
      <Link to={ROUTES.STUDENT.PRONUNCIATION} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{exercise.title}</h1>
      {exercise.description && <p className="text-gray-500 mb-6">{exercise.description}</p>}

      <Card className="mb-6">
        <CardBody className="text-center py-8">
          <p className="text-xs text-gray-400 mb-2">Say this phrase:</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{exercise.targetPhrase}</p>
          {exercise.targetPhonetic && <p className="text-sm text-sage-600">{exercise.targetPhonetic}</p>}
        </CardBody>
      </Card>

      <div className="flex justify-center mb-6">
        {isListening ? (
          <button onClick={stopListening} className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Mic className="w-8 h-8 text-white" />
          </button>
        ) : (
          <button onClick={handleStart} className="w-20 h-20 bg-sage-700 rounded-full flex items-center justify-center shadow-lg hover:bg-sage-800 transition-colors">
            <Mic className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
      <p className="text-center text-sm text-gray-500 mb-6">{isListening ? 'Listening... speak now' : 'Tap the microphone to start'}</p>

      {transcript && (
        <Card className="mb-6">
          <CardBody>
            <p className="text-xs text-gray-400 mb-1">You said:</p>
            <p className="text-lg text-gray-900">{transcript}</p>
          </CardBody>
        </Card>
      )}

      {result && (
        <Card className="mb-6">
          <CardBody className="text-center">
            <p className="text-4xl font-bold mb-2" style={{ color: result.score >= 80 ? '#16a34a' : result.score >= 50 ? '#ca8a04' : '#dc2626' }}>{result.score}%</p>
            <p className="text-sm text-gray-500 mb-4">{result.score >= 80 ? 'Excellent!' : result.score >= 50 ? 'Good effort! Try again.' : 'Keep practicing!'}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {result.wordResults.map((w, i) => (
                <span key={i} className={clsx('px-2 py-1 rounded text-sm font-medium', w.matched ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{w.word}</span>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleRetry}><RotateCcw className="w-4 h-4" /> Try Again</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {bestScore > 0 && <p className="text-center text-sm text-gray-400 mb-4">Best score: {bestScore}%</p>}

      {exercise.hints.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setShowHints(!showHints)} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"><Lightbulb className="w-4 h-4" /> {showHints ? 'Hide' : 'Show'} Hints</button>
          {showHints && (
            <ul className="mt-2 space-y-1">
              {exercise.hints.map((h, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-sage-400">*</span>{h}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
