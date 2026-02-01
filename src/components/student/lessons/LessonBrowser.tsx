import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import SearchBar from '../../common/SearchBar'
import { getPublishedLessons } from '../../../services/lessons.service'
import type { GrammarLesson } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'
import { stripHtml, truncateText } from '../../../utils/helpers'

export default function LessonBrowser() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<GrammarLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPublishedLessons().then(data => { setLessons(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Grammar Lessons</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search lessons..." className="mb-6" />
      {filtered.length === 0 ? (
        <EmptyState title="No lessons available" description="Check back later for new lessons" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(lesson => (
            <Card key={lesson.id} hover onClick={() => navigate(ROUTES.STUDENT.LESSON_VIEW(lesson.id))}>
              <CardBody>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-sage-600" /></div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.description || truncateText(stripHtml(lesson.content), 80)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={DIFFICULTY_COLORS[lesson.difficulty]}>{lesson.difficulty}</Badge>
                  {lesson.tags.slice(0, 2).map(tag => <Badge key={tag} variant="sage">{tag}</Badge>)}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
