import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, ChevronLeft, CheckCircle, XCircle } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getQuiz, submitQuizAttempt } from '../../../services/quizzes.service'
import { upsertProgress } from '../../../services/progress.service'
import type { Quiz, AttemptAnswer } from '../../../types'
import { ROUTES } from '../../../utils/constants'
import clsx from 'clsx'

export default function QuizTaker() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ score: number; maxScore: number; percentage: number; passed: boolean; answerResults: AttemptAnswer[] } | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const startTime = useRef(Date.now())

  useEffect(() => {
    if (!id) return
    getQuiz(id).then(q => { setQuiz(q); if (q?.timeLimit) setTimeLeft(q.timeLimit * 60); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev !== null && prev <= 1) { handleSubmit(); return 0 }
        return prev !== null ? prev - 1 : null
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  async function handleSubmit() {
    if (!quiz || !user || submitted) return
    setSubmitted(true)
    setSaving(true)

    const answerResults: AttemptAnswer[] = quiz.questions.map(q => {
      const selected = answers[q.id] || ''
      const isCorrect = selected.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
      return { questionId: q.id, selectedAnswer: selected, isCorrect, pointsEarned: isCorrect ? q.points : 0 }
    })

    const score = answerResults.reduce((sum, a) => sum + a.pointsEarned, 0)
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0)
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    const passed = percentage >= quiz.passingScore

    setResults({ score, maxScore, percentage, passed, answerResults })

    try {
      await submitQuizAttempt({
        quizId: quiz.id, quizTitle: quiz.title, studentId: user.uid, studentName: user.displayName,
        answers: answerResults, score, maxScore, percentage, passed,
        timeSpent: Math.round((Date.now() - startTime.current) / 1000), completedAt: Timestamp.now(),
      })
      await upsertProgress({
        studentId: user.uid, contentType: 'quiz', contentId: quiz.id, contentTitle: quiz.title,
        status: 'completed', completionPercentage: 100, quizBestScore: percentage,
      })
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  if (loading) return <LoadingSpinner className="py-20" />
  if (!quiz) return <div className="text-center py-20 text-gray-500">Quiz not found</div>

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (submitted && results) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody className="text-center py-8">
            {results.passed ? <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /> : <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{results.passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
            <p className="text-4xl font-bold mb-2" style={{ color: results.passed ? '#16a34a' : '#dc2626' }}>{results.percentage}%</p>
            <p className="text-gray-500 mb-6">{results.score} / {results.maxScore} points</p>
            <div className="space-y-3 text-left mt-8">
              {quiz.questions.map((q, i) => {
                const ans = results.answerResults[i]
                return (
                  <div key={q.id} className={clsx('p-4 rounded-lg border', ans.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50')}>
                    <p className="text-sm font-medium text-gray-900 mb-1">{i + 1}. {q.questionText}</p>
                    <p className="text-sm">Your answer: <span className={ans.isCorrect ? 'text-green-700' : 'text-red-700'}>{ans.selectedAnswer || '(no answer)'}</span></p>
                    {!ans.isCorrect && <p className="text-sm text-green-700">Correct: {q.correctAnswer}</p>}
                    {q.explanation && <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>}
                  </div>
                )
              })}
            </div>
            <div className="mt-6"><Button onClick={() => navigate(ROUTES.STUDENT.QUIZZES)}>Back to Quizzes</Button></div>
          </CardBody>
        </Card>
      </div>
    )
  }

  const question = quiz.questions[currentQ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
        {timeLeft !== null && <Badge variant={timeLeft < 60 ? 'red' : 'sage'}><Clock className="w-3.5 h-3.5 mr-1" /> {formatTime(timeLeft)}</Badge>}
      </div>
      <div className="flex gap-1.5 mb-6 overflow-x-auto">
        {quiz.questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={clsx('w-8 h-8 rounded-lg text-xs font-medium shrink-0 transition-colors',
              i === currentQ ? 'bg-sage-700 text-white' : answers[quiz.questions[i].id] ? 'bg-sage-100 text-sage-700' : 'bg-cream-100 text-gray-500'
            )}>{i + 1}</button>
        ))}
      </div>
      <Card>
        <CardBody>
          <p className="text-xs text-gray-400 mb-2">Question {currentQ + 1} of {quiz.questions.length} · {question.points} pts</p>
          <h2 className="text-lg font-medium text-gray-900 mb-4">{question.questionText}</h2>
          {question.questionType === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <button key={i} type="button" onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                  className={clsx('w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                    answers[question.id] === opt ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-cream-200 hover:bg-cream-50'
                  )}>{opt}</button>
              ))}
            </div>
          )}
          {question.questionType === 'true_false' && (
            <div className="flex gap-4">
              {['True', 'False'].map(opt => (
                <button key={opt} type="button" onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                  className={clsx('flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                    answers[question.id] === opt ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-cream-200 hover:bg-cream-50'
                  )}>{opt}</button>
              ))}
            </div>
          )}
          {question.questionType === 'fill_in_blank' && (
            <input value={answers[question.id] || ''} onChange={e => setAnswers({ ...answers, [question.id]: e.target.value })}
              placeholder="Type your answer" className="w-full px-4 py-3 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
          )}
        </CardBody>
      </Card>
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}><ChevronLeft className="w-4 h-4" /> Previous</Button>
        {currentQ < quiz.questions.length - 1 ? (
          <Button onClick={() => setCurrentQ(currentQ + 1)}>Next <ChevronRight className="w-4 h-4" /></Button>
        ) : (
          <Button onClick={handleSubmit} loading={saving}>Submit Quiz</Button>
        )}
      </div>
    </div>
  )
}