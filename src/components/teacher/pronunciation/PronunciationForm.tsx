import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import LoadingSpinner from '../../common/LoadingSpinner'
import { createPronunciation, getPronunciation, updatePronunciation } from '../../../services/pronunciation.service'
import type { Difficulty } from '../../../types'
import { ROUTES, DIFFICULTY_OPTIONS } from '../../../utils/constants'

interface PronunciationFormData {
  title: string
  description: string
  targetPhrase: string
  targetPhonetic: string
  difficulty: Difficulty
}

export default function PronunciationForm() {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hints, setHints] = useState<string[]>([''])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PronunciationFormData>({
    defaultValues: { difficulty: 'beginner' },
  })

  useEffect(() => {
    if (isEdit && id) {
      getPronunciation(id).then((ex) => {
        if (ex) {
          reset({
            title: ex.title,
            description: ex.description,
            targetPhrase: ex.targetPhrase,
            targetPhonetic: ex.targetPhonetic,
            difficulty: ex.difficulty,
          })
          setHints(ex.hints.length > 0 ? ex.hints : [''])
        }
        setLoading(false)
      })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data: PronunciationFormData) => {
    if (!user) return
    setSaving(true)
    try {
      const exData = {
        ...data,
        hints: hints.filter((h) => h.trim()),
        vocabularyIds: [],
        isPublished: false,
        authorId: user.uid,
        authorName: user.displayName,
      }
      if (isEdit && id) {
        await updatePronunciation(id, exData)
      } else {
        await createPronunciation(exData)
      }
      navigate(ROUTES.TEACHER.PRONUNCIATION)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Exercise' : 'New Exercise'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            placeholder="e.g. Greetings Practice"
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
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Phrase
            </label>
            <input
              {...register('targetPhrase', {
                required: 'Target phrase is required',
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="How are you doing today?"
            />
            {errors.targetPhrase && (
              <p className="text-red-500 text-xs mt-1">
                {errors.targetPhrase.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phonetic
            </label>
            <input
              {...register('targetPhonetic')}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="/haʊ ɑːr juː/"
            />
          </div>
        </div>

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
            Pronunciation Hints
          </label>
          {hints.map((hint, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={hint}
                onChange={(e) => {
                  const updated = [...hints]
                  updated[i] = e.target.value
                  setHints(updated)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                placeholder="e.g. Stress the first syllable"
              />
              {hints.length > 1 && (
                <button
                  type="button"
                  onClick={() => setHints(hints.filter((_, j) => j !== i))}
                  className="p-2 rounded-lg hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHints([...hints, ''])}
            className="text-sm text-sage-600 hover:text-sage-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Hint
          </button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            {isEdit ? 'Update Exercise' : 'Create Exercise'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.TEACHER.PRONUNCIATION)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
