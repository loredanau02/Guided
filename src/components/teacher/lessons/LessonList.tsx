import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import EmptyState from '../../common/EmptyState'
import ConfirmDialog from '../../common/ConfirmDialog'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getLessons, deleteLesson, updateLesson } from '../../../services/lessons.service'
import type { GrammarLesson } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function LessonList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<GrammarLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [user])

  async function loadData() {
    if (!user) return
    try {
      setLessons(await getLessons({ authorId: user.uid }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePublish(lesson: GrammarLesson) {
    await updateLesson(lesson.id, { isPublished: !lesson.isPublished })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteLesson(deleteId)
      await loadData()
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Grammar Lessons</h1>
        <Link to={ROUTES.TEACHER.LESSON_NEW}>
          <Button>
            <Plus className="w-4 h-4" /> New Lesson
          </Button>
        </Link>
      </div>

      {lessons.length === 0 ? (
        <EmptyState
          title="No lessons yet"
          description="Create your first grammar lesson to get started"
          action={
            <Link to={ROUTES.TEACHER.LESSON_NEW}>
              <Button>
                <Plus className="w-4 h-4" /> Create Lesson
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardBody className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {lesson.title}
                    </h3>
                    <Badge variant={lesson.isPublished ? 'green' : 'yellow'}>
                      {lesson.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge className={DIFFICULTY_COLORS[lesson.difficulty]}>
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {lesson.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(lesson)}
                    className="p-2 rounded-lg hover:bg-cream-100"
                    title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {lesson.isPublished ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-sage-600" />
                    )}
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.TEACHER.LESSON_EDIT(lesson.id))}
                    className="p-2 rounded-lg hover:bg-cream-100"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setDeleteId(lesson.id)}
                    className="p-2 rounded-lg hover:bg-red-50"
                  >
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
        title="Delete Lesson"
        message="Oh uh. Are you sure?  This will permanently delete the lesson."
        loading={deleting}
      />
    </div>
  )
}