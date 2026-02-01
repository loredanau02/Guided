import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import RichTextEditor from '../../common/RichTextEditor'
import LoadingSpinner from '../../common/LoadingSpinner'
import { createLesson, getLesson, updateLesson } from '../../../services/lessons.service'
import type { Difficulty } from '../../../types'
import { ROUTES, DIFFICULTY_OPTIONS } from '../../../utils/constants'

interface LessonFormData {
  title: string
  description: string
  difficulty: Difficulty
  tags: string
  order: number
}

export default function LessonForm() {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    defaultValues: { difficulty: 'beginner', order: 0, tags: '' },
  })

  useEffect(() => {
    if (isEdit && id) {
      getLesson(id).then((lesson) => {
        if (lesson) {
          reset({
            title: lesson.title,
            description: lesson.description,
            difficulty: lesson.difficulty,
            tags: lesson.tags.join(', '),
            order: lesson.order,
          })
          setContent(lesson.content)
        }
        setLoading(false)
      })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data: LessonFormData) => {
    if (!user) return
    setSaving(true)
    try {
      const lessonData = {
        title: data.title,
        description: data.description,
        content,
        difficulty: data.difficulty,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        order: data.order,
        isPublished: false,
        authorId: user.uid,
        authorName: user.displayName,
      }
      if (isEdit && id) {
        await updateLesson(id, lessonData)
      } else {
        await createLesson(lessonData)
      }
      navigate(ROUTES.TEACHER.LESSONS)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Lesson' : 'New Lesson'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            placeholder="e.g. Present Simple Tense"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            placeholder="Brief description of the lesson"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              {...register('tags')}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="verbs, present tense"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your lesson content here..."
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            {isEdit ? 'Update Lesson' : 'Create Lesson'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.TEACHER.LESSONS)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
