import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Eye } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import { getPublishedVocabulary } from '../../../services/vocabulary.service'
import { upsertProgress } from '../../../services/progress.service'
import type { VocabularyItem } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function VocabStudy() {
  const { user } = useAuth()
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    getPublishedVocabulary().then(data => { setVocabulary(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  function next() {
    if (current < vocabulary.length - 1) { setCurrent(current + 1); setShowAnswer(false) }
    // Track progress on last card
    if (current === vocabulary.length - 2 && user && vocabulary.length > 0) {
      upsertProgress({ studentId: user.uid, contentType: 'vocabulary', contentId: 'study-session', contentTitle: 'Vocabulary Study', status: 'completed', completionPercentage: 100 }).catch(console.error)
    }
  }
  function prev() { if (current > 0) { setCurrent(current - 1); setShowAnswer(false) } }
  function shuffle() { setVocabulary([...vocabulary].sort(() => Math.random() - 0.5)); setCurrent(0); setShowAnswer(false) }

  if (loading) return <LoadingSpinner className="py-20" />
  if (vocabulary.length === 0) return <EmptyState title="No vocabulary to study" description="Check back later" />

  const word = vocabulary[current]

  return (
    <div className="max-w-xl mx-auto">
      <Link to={ROUTES.STUDENT.VOCABULARY} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Vocabulary</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Flashcard Study</h1>
        <button onClick={shuffle} className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"><RotateCcw className="w-4 h-4" /> Shuffle</button>
      </div>

      <p className="text-sm text-gray-500 mb-4 text-center">{current + 1} of {vocabulary.length}</p>

      <Card className="mb-6">
        <CardBody className="text-center py-12 min-h-[280px] flex flex-col items-center justify-center">
          <Badge className={DIFFICULTY_COLORS[word.difficulty]} >{word.difficulty}</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">{word.word}</h2>
          <p className="text-sm text-sage-600 mt-1">{word.pronunciation}</p>
          <Badge variant="sage" className="mt-2">{word.partOfSpeech}</Badge>

          {showAnswer ? (
            <div className="mt-6 w-full">
              <p className="text-lg text-gray-700 mb-3">{word.definition}</p>
              {word.usageExamples.length > 0 && (
                <div className="bg-cream-50 rounded-lg p-3 mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Examples:</p>
                  {word.usageExamples.map((ex, i) => <p key={i} className="text-sm text-gray-600 italic">{ex}</p>)}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowAnswer(true)} className="mt-6 flex items-center gap-2 text-sage-600 hover:text-sage-700 text-sm font-medium">
              <Eye className="w-4 h-4" /> Show Definition
            </button>
          )}
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={current === 0} onClick={prev}><ChevronLeft className="w-4 h-4" /> Previous</Button>
        <Button disabled={current === vocabulary.length - 1} onClick={next}>Next <ChevronRight className="w-4 h-4" /></Button>
      </div>
    </div>
  )
}
