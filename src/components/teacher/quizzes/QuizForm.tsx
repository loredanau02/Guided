import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import LoadingSpinner from '../../common/LoadingSpinner'
import { createQuiz, getQuiz, updateQuiz } from '../../../services/quizzes.service'
import type { Difficulty, QuizType, QuizQuestion, QuestionType } from '../../../types'
import { ROUTES, DIFFICULTY_OPTIONS, QUIZ_TYPE_OPTIONS, QUESTION_TYPE_OPTIONS } from '../../../utils/constants'

interface QuizFormData {
  title: string
  description: string
  type: QuizType
  difficulty: Difficulty
  timeLimit: string
  passingScore: number
}

const emptyQuestion = (): QuizQuestion => ({
  id: uuidv4(),
  questionText: '',
  questionType: 'multiple_choice',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  points: 1,
  order: 0,
})

export default function QuizForm() {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuizFormData>({
    defaultValues: { type: 'grammar', difficulty: 'beginner', passingScore: 70, timeLimit: '' },
  })

  useEffect(() => {
    if (isEdit && id) {
      getQuiz(id).then(quiz => {
        if (quiz) {
          reset({
            title: quiz.title,
            description: quiz.description,
            type: quiz.type,
            difficulty: quiz.difficulty,
            timeLimit: quiz.timeLimit?.toString() || '',
            passingScore: quiz.passingScore,
          })
          setQuestions(quiz.questions.length > 0 ? quiz.questions : [emptyQuestion()])
        }
        setLoading(false)
      })
    }
  }, [id, isEdit, reset])

  function updateQuestion(index: number, updates: Partial<QuizQuestion>) {
    const updated = [...questions]
    updated[index] = { ...updated[index], ...updates }
    setQuestions(updated)
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const updated = [...questions]
    const options = [...(updated[qIndex].options || [])]
    options[oIndex] = value
    updated[qIndex] = { ...updated[qIndex], options }
    setQuestions(updated)
  }

  function changeQuestionType(index: number, type: QuestionType) {
    const updated = [...questions]
    if (type === 'true_false') {
      updated[index] = { ...updated[index], questionType: type, options: ['True', 'False'], correctAnswer: '' }
    } else if (type === 'fill_in_blank') {
      updated[index] = { ...updated[index], questionType: type, options: [], correctAnswer: '' }
    } else {
      updated[index] = { ...updated[index], questionType: type, options: ['', '', '', ''], correctAnswer: '' }
    }
    setQuestions(updated)
  }

  const onSubmit = async (data: QuizFormData) => {
    if (!user) return
    setSaving(true)
    try {
      const quizData = {
        title: data.title,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        timeLimit: data.timeLimit ? parseInt(data.timeLimit) : undefined,
        passingScore: data.passingScore,
        questions: questions.map((q, i) => ({ ...q, order: i })),
        lessonIds: [] as string[],
        storyIds: [] as string[],
        vocabularyIds: [] as string[],
        isPublished: false,
        authorId: user.uid,
        authorName: user.displayName,
      }
      if (isEdit && id) {
        await updateQuiz(id, quizData)
      } else {
        await createQuiz(quizData)
      }
      navigate(ROUTES.TEACHER.QUIZZES)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Quiz' : 'New Quiz'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input {...register('title', { required: 'Title is required' })} className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea {...register('description')} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select {...register('type')} className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
              {QUIZ_TYPE_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select {...register('difficulty')} className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
              {DIFFICULTY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (min)</label>
            <input type="number" {...register('timeLimit')} className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" placeholder="No limit" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input type="number" {...register('passingScore', { valueAsNumber: true, min: 1, max: 100 })} className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Questions</h2>
          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={q.id} className="bg-white border border-cream-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <span className="text-sm font-medium text-gray-500">Question {qi + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={q.questionType}
                      onChange={e => changeQuestionType(qi, e.target.value as QuestionType)}
                      className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-400"
                    >
                      {QUESTION_TYPE_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <input
                      type="number"
                      value={q.points}
                      onChange={e => updateQuestion(qi, { points: parseInt(e.target.value) || 1 })}
                      className="w-16 px-2 py-1.5 rounded-lg border border-cream-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-400"
                      min={1}
                    />
                    <span className="text-xs text-gray-400">pts</span>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qi))} className="p-1 rounded hover:bg-red-50">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  value={q.questionText}
                  onChange={e => updateQuestion(qi, { questionText: e.target.value })}
                  placeholder="Enter your question"
                  className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 mb-3"
                />

                {q.questionType === 'multiple_choice' && (
                  <div className="space-y-2 mb-3">
                    {(q.options || []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === opt && opt !== ''}
                          onChange={() => updateQuestion(qi, { correctAnswer: opt })}
                          className="text-sage-600 focus:ring-sage-400"
                        />
                        <input
                          value={opt}
                          onChange={e => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 px-3 py-2 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {q.questionType === 'true_false' && (
                  <div className="flex gap-4 mb-3">
                    {['True', 'False'].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === opt}
                          onChange={() => updateQuestion(qi, { correctAnswer: opt })}
                          className="text-sage-600 focus:ring-sage-400"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.questionType === 'fill_in_blank' && (
                  <div className="mb-3">
                    <input
                      value={q.correctAnswer}
                      onChange={e => updateQuestion(qi, { correctAnswer: e.target.value })}
                      placeholder="Correct answer"
                      className="w-full px-3 py-2 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                  </div>
                )}

                <input
                  value={q.explanation || ''}
                  onChange={e => updateQuestion(qi, { explanation: e.target.value })}
                  placeholder="Explanation (shown after answering)"
                  className="w-full px-3 py-2 rounded-lg border border-cream-200 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setQuestions([...questions, emptyQuestion()])}
            className="mt-4 flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{isEdit ? 'Update Quiz' : 'Create Quiz'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.TEACHER.QUIZZES)}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}