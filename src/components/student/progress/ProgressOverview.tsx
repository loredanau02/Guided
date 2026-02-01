import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Circle } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import { getStudentProgress } from '../../../services/progress.service'
import type { StudentProgress, ContentType } from '../../../types'
import { formatDateRelative } from '../../../utils/helpers'
import clsx from 'clsx'

const CONTENT_TABS: { value: ContentType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'lesson', label: 'Lessons' },
  { value: 'story', label: 'Stories' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'pronunciation', label: 'Pronunciation' },
  { value: 'quiz', label: 'Quizzes' },
]

const statusIcons = {
  completed: CheckCircle,
  in_progress: Clock,
  not_started: Circle,
}

const statusColors = {
  completed: 'text-green-600',
  in_progress: 'text-yellow-600',
  not_started: 'text-gray-400',
}

export default function ProgressOverview() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all')

  useEffect(() => {
    if (!user) return
    getStudentProgress(user.uid)
      .then(data => { setProgress(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return <LoadingSpinner className="py-20" />

  const filtered = activeTab === 'all'
    ? progress
    : progress.filter(p => p.contentType === activeTab)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Progress</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CONTENT_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === value
                ? 'bg-sage-700 text-white'
                : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No progress to show"
          description="Start learning to track your progress"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(p => {
            const StatusIcon = statusIcons[p.status]
            return (
              <Card key={p.id}>
                <CardBody className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={clsx('w-5 h-5', statusColors[p.status])} />
                    <div>
                      <p className="font-medium text-gray-900">{p.contentTitle}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="sage">{p.contentType}</Badge>
                        <span className="text-xs text-gray-400">{formatDateRelative(p.lastAccessedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-cream-200 rounded-full h-2">
                        <div
                          className="bg-sage-500 h-2 rounded-full transition-all"
                          style={{ width: `${p.completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{p.completionPercentage}%</span>
                    </div>
                    {p.quizBestScore !== undefined && (
                      <p className="text-xs text-gray-400 mt-0.5">Best: {p.quizBestScore}%</p>
                    )}
                    {p.pronunciationBestScore !== undefined && (
                      <p className="text-xs text-gray-400 mt-0.5">Best: {p.pronunciationBestScore}%</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}