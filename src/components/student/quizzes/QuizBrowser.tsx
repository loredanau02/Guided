import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Clock, Target } from 'lucide-react'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import SearchBar from '../../common/SearchBar'
import { getPublishedQuizzes } from '../../../services/quizzes.service'
import type { Quiz } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function QuizBrowser() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPublishedQuizzes().then(data => { setQuizzes(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quizzes</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search quizzes..." className="mb-6" />
      {filtered.length === 0 ? (
        <EmptyState title="No quizzes available" description="Check back later for new quizzes" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(quiz => (
            <Card key={quiz.id} hover onClick={() => navigate(ROUTES.STUDENT.QUIZ_TAKE(quiz.id))}>
              <CardBody>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center shrink-0"><ClipboardList className="w-5 h-5 text-sage-600" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    {quiz.description && <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={DIFFICULTY_COLORS[quiz.difficulty]}>{quiz.difficulty}</Badge>
                  <Badge variant="blue">{quiz.type.replace('_', ' ')}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {quiz.questions.length} questions</span>
                  {quiz.timeLimit && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {quiz.timeLimit} min</span>}
                  <span>Pass: {quiz.passingScore}%</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}