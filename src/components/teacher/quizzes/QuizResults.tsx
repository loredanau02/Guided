import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import { getQuiz, getQuizAttempts } from '../../../services/quizzes.service'
import type { Quiz, QuizAttempt } from '../../../types'
import { ROUTES } from '../../../utils/constants'
import { formatDate } from '../../../utils/helpers'

export default function QuizResults() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getQuiz(id), getQuizAttempts(id)]).then(([q, a]) => {
      setQuiz(q)
      setAttempts(a)
      setLoading(false)
    })
  }, [id])

  if (loading) return <LoadingSpinner className="py-20" />
  if (!quiz) return <EmptyState title="Quiz not found" />

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0
  const passRate = attempts.length > 0
    ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100)
    : 0

  return (
    <div>
      <Link to={ROUTES.TEACHER.QUIZZES} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title} - Results</h1>
      <p className="text-gray-500 mb-6">{quiz.questions.length} questions · Pass: {quiz.passingScore}%</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-gray-900">{attempts.length}</p>
            <p className="text-sm text-gray-500">Total Attempts</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-sage-700">{avgScore}%</p>
            <p className="text-sm text-gray-500">Average Score</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-green-600">{passRate}%</p>
            <p className="text-sm text-gray-500">Pass Rate</p>
          </CardBody>
        </Card>
      </div>

      {attempts.length === 0 ? (
        <EmptyState title="No attempts yet" description="Students haven't taken this quiz yet" />
      ) : (
        <div className="space-y-3">
          {attempts.map(attempt => (
            <Card key={attempt.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{attempt.studentName}</p>
                  <p className="text-sm text-gray-500">{formatDate(attempt.completedAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{attempt.percentage}%</span>
                  <span className="text-sm text-gray-500">{attempt.score}/{attempt.maxScore} pts</span>
                  {attempt.passed ? (
                    <Badge variant="green"><CheckCircle className="w-3 h-3 mr-1" /> Passed</Badge>
                  ) : (
                    <Badge variant="red"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
