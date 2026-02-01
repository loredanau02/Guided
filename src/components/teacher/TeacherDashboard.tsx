import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, BookOpenCheck, Languages, Mic, ClipboardList, Users, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Card, { CardBody } from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import { getLessons } from '../../services/lessons.service'
import { getStories } from '../../services/stories.service'
import { getVocabulary } from '../../services/vocabulary.service'
import { getPronunciationExercises } from '../../services/pronunciation.service'
import { getQuizzes } from '../../services/quizzes.service'
import { ROUTES } from '../../utils/constants'

interface ContentStats {
  lessons: number
  stories: number
  vocabulary: number
  pronunciation: number
  quizzes: number
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ContentStats>({ lessons: 0, stories: 0, vocabulary: 0, pronunciation: 0, quizzes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const authorId = user.uid
    Promise.all([
      getLessons({ authorId }),
      getStories({ authorId }),
      getVocabulary({ authorId }),
      getPronunciationExercises({ authorId }),
      getQuizzes({ authorId }),
    ]).then(([lessons, stories, vocab, pron, quizzes]) => {
      setStats({
        lessons: lessons.length,
        stories: stories.length,
        vocabulary: vocab.length,
        pronunciation: pron.length,
        quizzes: quizzes.length,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  if (loading) return <LoadingSpinner className="py-20" />

  const cards = [
    { label: 'Lessons', count: stats.lessons, icon: FileText, to: ROUTES.TEACHER.LESSONS, newTo: ROUTES.TEACHER.LESSON_NEW, color: 'bg-sage-100 text-sage-600' },
    { label: 'Stories', count: stats.stories, icon: BookOpenCheck, to: ROUTES.TEACHER.STORIES, newTo: ROUTES.TEACHER.STORY_NEW, color: 'bg-earth-100 text-earth-600' },
    { label: 'Vocabulary', count: stats.vocabulary, icon: Languages, to: ROUTES.TEACHER.VOCABULARY, newTo: ROUTES.TEACHER.VOCAB_NEW, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pronunciation', count: stats.pronunciation, icon: Mic, to: ROUTES.TEACHER.PRONUNCIATION, newTo: ROUTES.TEACHER.PRONUNCIATION_NEW, color: 'bg-red-50 text-red-500' },
    { label: 'Quizzes', count: stats.quizzes, icon: ClipboardList, to: ROUTES.TEACHER.QUIZZES, newTo: ROUTES.TEACHER.QUIZ_NEW, color: 'bg-yellow-100 text-yellow-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.displayName}</h1>
        <p className="text-gray-500 mt-1">Manage your learning content</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, count, icon: Icon, to, newTo, color }) => (
          <Card key={label}>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
              <div className="flex gap-2">
                <Link to={to} className="text-xs text-sage-600 hover:text-sage-700 font-medium">View all</Link>
                <span className="text-gray-300">·</span>
                <Link to={newTo} className="text-xs text-sage-600 hover:text-sage-700 font-medium">Create new</Link>
              </div>
            </CardBody>
          </Card>
        ))}

        <Link to={ROUTES.TEACHER.STUDENTS}>
          <Card hover className="h-full">
            <CardBody className="flex items-center gap-4 h-full">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Students</p>
                <p className="text-xs text-gray-400">View student progress</p>
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to={ROUTES.TEACHER.LESSON_NEW}>
            <Button variant="outline" className="w-full"><Plus className="w-4 h-4" /> New Lesson</Button>
          </Link>
          <Link to={ROUTES.TEACHER.STORY_NEW}>
            <Button variant="outline" className="w-full"><Plus className="w-4 h-4" /> New Story</Button>
          </Link>
          <Link to={ROUTES.TEACHER.VOCAB_NEW}>
            <Button variant="outline" className="w-full"><Plus className="w-4 h-4" /> New Word</Button>
          </Link>
          <Link to={ROUTES.TEACHER.QUIZ_NEW}>
            <Button variant="outline" className="w-full"><Plus className="w-4 h-4" /> New Quiz</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}