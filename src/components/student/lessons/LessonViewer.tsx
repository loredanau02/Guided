import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getLesson } from '../../../services/lessons.service'
import { upsertProgress, getContentProgress } from '../../../services/progress.service'
import type { GrammarLesson, StudentProgress } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function LessonViewer() {
  const { id } = useParams()
  const { user } = useAuth()
  const [lesson, setLesson] = useState<GrammarLesson | null>(null)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (!id || !user) return
    Promise.all([
      getLesson(id),
      getContentProgress(user.uid, 'lesson', id),
    ]).then(([l, p]) => {
      setLesson(l)
      setProgress(p)
      setLoading(false)
      if (l && (!p || p.status === 'not_started')) {
        upsertProgress({ studentId: user.uid, contentType: 'lesson', contentId: id, contentTitle: l.title, status: 'in_progress', completionPercentage: 50 })
      }
    })
  }, [id, user])

  async function handleComplete() {
    if (!lesson || !user || !id) return
    setCompleting(true)
    await upsertProgress({ studentId: user.uid, contentType: 'lesson', contentId: id, contentTitle: lesson.title, status: 'completed', completionPercentage: 100 })
    setProgress({ ...progress, status: 'completed', completionPercentage: 100 } as StudentProgress)
    setCompleting(false)
  }

  if (loading) return <LoadingSpinner className="py-20" />
  if (!lesson) return <div className="text-center py-20 text-gray-500">Lesson not found</div>

  return (
    <div className="max-w-3xl">
      <Link to={ROUTES.STUDENT.LESSONS} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Lessons</Link>
      <div className="flex items-center gap-3 mb-4">
        <Badge className={DIFFICULTY_COLORS[lesson.difficulty]}>{lesson.difficulty}</Badge>
        {lesson.tags.map(tag => <Badge key={tag} variant="sage">{tag}</Badge>)}
        {progress?.status === 'completed' && <Badge variant="green"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
      {lesson.description && <p className="text-gray-500 mb-6">{lesson.description}</p>}
      <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      {progress?.status !== 'completed' && (
        <Button onClick={handleComplete} loading={completing}><CheckCircle className="w-4 h-4" /> Mark as Complete</Button>
      )}
    </div>
  )
}
