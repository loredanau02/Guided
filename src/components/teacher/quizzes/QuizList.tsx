import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import EmptyState from '../../common/EmptyState'
import ConfirmDialog from '../../common/ConfirmDialog'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getQuizzes, deleteQuiz, updateQuiz } from '../../../services/quizzes.service'
import type { Quiz } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function QuizList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { loadQuizzes() }, [user])

  async function loadQuizzes() {
    if (!user) return
    try {
      setQuizzes(await getQuizzes({ authorId: user.uid }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePublish(quiz: Quiz) {
    await updateQuiz(quiz.id, { isPublished: !quiz.isPublished })
    await loadQuizzes()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteQuiz(deleteId)
      await loadQuizzes()
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <Link to={ROUTES.TEACHER.QUIZ_NEW}>
          <Button><Plus className="w-4 h-4" /> New Quiz</Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes yet"
          description="Create quizzes to test student knowledge"
          action={<Link to={ROUTES.TEACHER.QUIZ_NEW}><Button><Plus className="w-4 h-4" /> Create Quiz</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {quizzes.map(quiz => (
            <Card key={quiz.id}>
              <CardBody className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                    <Badge variant={quiz.isPublished ? 'green' : 'yellow'}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge className={DIFFICULTY_COLORS[quiz.difficulty]}>{quiz.difficulty}</Badge>
                    <Badge variant="blue">{quiz.type.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {quiz.questions.length} questions · Pass: {quiz.passingScore}%
                    {quiz.timeLimit ? ` · ${quiz.timeLimit} min` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(ROUTES.TEACHER.QUIZ_RESULTS(quiz.id))} className="p-2 rounded-lg hover:bg-cream-100" title="View Results">
                    <BarChart3 className="w-4 h-4 text-sage-600" />
                  </button>
                  <button onClick={() => handleTogglePublish(quiz)} className="p-2 rounded-lg hover:bg-cream-100">
                    {quiz.isPublished ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-sage-600" />}
                  </button>
                  <button onClick={() => navigate(ROUTES.TEACHER.QUIZ_EDIT(quiz.id))} className="p-2 rounded-lg hover:bg-cream-100">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setDeleteId(quiz.id)} className="p-2 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Quiz"
        message="Oh uh. Are you sure? This will permanently delete the quiz and cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
