import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, BookOpenCheck, Languages, Mic, ClipboardList, CheckCircle, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import Card, { CardBody } from '../common/Card'
import LoadingSpinner from '../common/LoadingSpinner'
import { getStudentProgress } from '../../services/progress.service'
import { getStudentAttempts } from '../../services/quizzes.service'
import type { StudentProgress, QuizAttempt } from '../../types'
import { ROUTES } from '../../utils/constants'
import { formatDateRelative } from '../../utils/helpers'

const COLORS = ['#6F8C4E', '#E0B84E', '#C8D6B8']

export default function StudentDashboard() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<StudentProgress[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getStudentProgress(user.uid),
      getStudentAttempts(user.uid),
    ]).then(([p, a]) => {
      setProgress(p)
      setAttempts(a)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  if (loading) return <LoadingSpinner className="py-20" />

  const completed = progress.filter(p => p.status === 'completed').length
  const inProgressCount = progress.filter(p => p.status === 'in_progress').length
  const total = progress.length

  const contentTypeCounts = ['lesson', 'story', 'vocabulary', 'pronunciation', 'quiz'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    completed: progress.filter(p => p.contentType === type && p.status === 'completed').length,
    total: progress.filter(p => p.contentType === type).length,
  }))

  const pieData = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgressCount },
    { name: 'Not Started', value: Math.max(0, total - completed - inProgressCount) },
  ].filter(d => d.value > 0)

  const recentAttempts = attempts.slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.displayName}</h1>
      <p className="text-gray-500 mb-8">Track your learning progress</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
              <p className="text-sm text-gray-500">Quizzes Taken</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {pieData.length > 0 && (
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-gray-500">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {contentTypeCounts.some(c => c.total > 0) && (
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress by Type</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={contentTypeCounts.filter(c => c.total > 0)}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#6F8C4E" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#C8D6B8" name="Total" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}
      </div>

      {recentAttempts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Attempts</h2>
          <div className="space-y-2">
            {recentAttempts.map(attempt => (
              <Card key={attempt.id}>
                <CardBody className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{attempt.quizTitle}</p>
                    <p className="text-xs text-gray-400">{formatDateRelative(attempt.completedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold" style={{ color: attempt.passed ? '#16a34a' : '#dc2626' }}>
                      {attempt.percentage}%
                    </span>
                    <span className="text-xs text-gray-400">{attempt.passed ? 'Passed' : 'Failed'}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Lessons', to: ROUTES.STUDENT.LESSONS, icon: FileText },
          { label: 'Stories', to: ROUTES.STUDENT.STORIES, icon: BookOpenCheck },
          { label: 'Vocabulary', to: ROUTES.STUDENT.VOCABULARY, icon: Languages },
          { label: 'Pronunciation', to: ROUTES.STUDENT.PRONUNCIATION, icon: Mic },
          { label: 'Quizzes', to: ROUTES.STUDENT.QUIZZES, icon: ClipboardList },
        ].map(({ label, to, icon: Icon }) => (
          <Link key={label} to={to}>
            <Card hover>
              <CardBody className="flex items-center gap-3 py-3">
                <Icon className="w-5 h-5 text-sage-600" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}