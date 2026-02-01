import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, Circle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getUserData } from '../../../services/auth.service'
import { getStudentProgress } from '../../../services/progress.service'
import { getStudentAttempts } from '../../../services/quizzes.service'
import type { User, StudentProgress, QuizAttempt } from '../../../types'
import { ROUTES } from '../../../utils/constants'
import { formatDate, getInitials } from '../../../utils/helpers'
import clsx from 'clsx'

export default function StudentProgressView() {
  const { id } = useParams()
  const [student, setStudent] = useState<User | null>(null)
  const [progress, setProgress] = useState<StudentProgress[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getUserData(id),
      getStudentProgress(id),
      getStudentAttempts(id),
    ]).then(([u, p, a]) => {
      setStudent(u)
      setProgress(p)
      setAttempts(a)
      setLoading(false)
    })
  }, [id])

  if (loading) return <LoadingSpinner className="py-20" />
  if (!student) return <div className="text-center py-20 text-gray-500">Student not found</div>

  const completed = progress.filter(p => p.status === 'completed').length
  const inProgressCount = progress.filter(p => p.status === 'in_progress').length

  const chartData = ['lesson', 'story', 'vocabulary', 'pronunciation', 'quiz'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    completed: progress.filter(p => p.contentType === type && p.status === 'completed').length,
    inProgress: progress.filter(p => p.contentType === type && p.status === 'in_progress').length,
  }))

  return (
    <div>
      <Link to={ROUTES.TEACHER.STUDENTS} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-sage-700">{getInitials(student.displayName)}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.displayName}</h1>
          <p className="text-gray-500">{student.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-sage-600">{attempts.length}</p>
            <p className="text-sm text-gray-500">Quizzes Taken</p>
          </CardBody>
        </Card>
      </div>

      {chartData.some(d => d.completed > 0 || d.inProgress > 0) && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress by Type</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#6F8C4E" name="Completed" stackId="a" />
                <Bar dataKey="inProgress" fill="#E0B84E" name="In Progress" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      {attempts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Attempts</h2>
          <div className="space-y-2">
            {attempts.map(a => (
              <Card key={a.id}>
                <CardBody className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{a.quizTitle}</p>
                    <p className="text-xs text-gray-400">{formatDate(a.completedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" style={{ color: a.passed ? '#16a34a' : '#dc2626' }}>{a.percentage}%</span>
                    <Badge variant={a.passed ? 'green' : 'red'}>{a.passed ? 'Passed' : 'Failed'}</Badge>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Progress</h2>
      {progress.length === 0 ? (
        <p className="text-gray-500 text-sm">No progress recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {progress.map(p => {
            const icons = { completed: CheckCircle, in_progress: Clock, not_started: Circle }
            const colors = { completed: 'text-green-600', in_progress: 'text-yellow-600', not_started: 'text-gray-400' }
            const Icon = icons[p.status]
            return (
              <Card key={p.id}>
                <CardBody className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Icon className={clsx('w-4 h-4', colors[p.status])} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.contentTitle}</p>
                      <Badge variant="sage">{p.contentType}</Badge>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{p.completionPercentage}%</span>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}