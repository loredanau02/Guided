import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import LoadingSpinner from '../../common/LoadingSpinner'
import { createVocabulary, getVocabularyItem, updateVocabulary } from '../../../services/vocabulary.service'
import type { Difficulty, PartOfSpeech } from '../../../types'
import { ROUTES, DIFFICULTY_OPTIONS, PART_OF_SPEECH_OPTIONS } from '../../../utils/constants'

interface VocabFormData {
  word: string
  definition: string
  partOfSpeech: PartOfSpeech
  pronunciation: string
  difficulty: Difficulty
  tags: string
}

export default function VocabularyForm() {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const navigate = useNavigate()
  const [examples, setExamples] = useState<string[]>([''])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VocabFormData>({
    defaultValues: { partOfSpeech: 'noun', difficulty: 'beginner', tags: '' },
  })

  useEffect(() => {
    if (isEdit && id) {
      getVocabularyItem(id).then((item) => {
        if (item) {
          reset({
            word: item.word,
            definition: item.definition,
            partOfSpeech: item.partOfSpeech,
            pronunciation: item.pronunciation,
            difficulty: item.difficulty,
            tags: item.tags.join(', '),
          })
          setExamples(item.usageExamples.length > 0 ? item.usageExamples : [''])
        }
        setLoading(false)
      })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data: VocabFormData) => {
    if (!user) return
    setSaving(true)
    try {
      const vocabData = {
        word: data.word,
        definition: data.definition,
        partOfSpeech: data.partOfSpeech,
        pronunciation: data.pronunciation,
        usageExamples: examples.filter((e) => e.trim()),
        difficulty: data.difficulty,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        relatedLessonIds: [],
        relatedStoryIds: [],
        isPublished: false,
        authorId: user.uid,
        authorName: user.displayName,
      }
      if (isEdit && id) {
        await updateVocabulary(id, vocabData)
      } else {
        await createVocabulary(vocabData)
      }
      navigate(ROUTES.TEACHER.VOCABULARY)
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
        {isEdit ? 'Edit Word' : 'New Word'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Word
            </label>
            <input
              {...register('word', { required: 'Word is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
            {errors.word && (
              <p className="text-red-500 text-xs mt-1">{errors.word.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pronunciation
            </label>
            <input
              {...register('pronunciation')}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="/prəˌnʌnsiˈeɪʃn/"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Definition
          </label>
          <textarea
            {...register('definition', { required: 'Definition is required' })}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
          {errors.definition && (
            <p className="text-red-500 text-xs mt-1">
              {errors.definition.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Part of Speech
            </label>
            <select
              {...register('partOfSpeech')}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              {PART_OF_SPEECH_OPTIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
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
              Tags
            </label>
            <input
              {...register('tags')}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="food, daily"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage Examples
          </label>
          {examples.map((ex, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={ex}
                onChange={(e) => {
                  const updated = [...examples]
                  updated[i] = e.target.value
                  setExamples(updated)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                placeholder={`Example sentence ${i + 1}`}
              />
              {examples.length > 1 && (
                <button
                  type="button"
                  onClick={() => setExamples(examples.filter((_, j) => j !== i))}
                  className="p-2 rounded-lg hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setExamples([...examples, ''])}
            className="text-sm text-sage-600 hover:text-sage-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Example
          </button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            {isEdit ? 'Update Word' : 'Create Word'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.TEACHER.VOCABULARY)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
