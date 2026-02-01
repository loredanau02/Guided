import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import RichTextEditor from '../../common/RichTextEditor'
import LoadingSpinner from '../../common/LoadingSpinner'
import { createStory, getStory, updateStory } from '../../../services/stories.service'
import { getVocabulary } from '../../../services/vocabulary.service'
import { getLessons } from '../../../services/lessons.service'
import type { Difficulty, VocabReference, GrammarReference, VocabularyItem, GrammarLesson } from '../../../types'
import { ROUTES, DIFFICULTY_OPTIONS } from '../../../utils/constants'

interface StoryFormData {
  title: string
  description: string
  difficulty: Difficulty
  tags: string
}

export default function StoryForm() {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [vocabRefs, setVocabRefs] = useState<VocabReference[]>([])
  const [grammarRefs, setGrammarRefs] = useState<GrammarReference[]>([])
  const [allVocab, setAllVocab] = useState<VocabularyItem[]>([])
  const [allLessons, setAllLessons] = useState<GrammarLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoryFormData>({
    defaultValues: { difficulty: 'beginner', tags: '' },
  })

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [vocab, lessons] = await Promise.all([
          user ? getVocabulary({ authorId: user.uid }) : Promise.resolve([]),
          user ? getLessons({ authorId: user.uid }) : Promise.resolve([]),
        ])
        setAllVocab(vocab)
        setAllLessons(lessons)

        if (isEdit && id) {
          const story = await getStory(id)
          if (story) {
            reset({
              title: story.title,
              description: story.description,
              difficulty: story.difficulty,
              tags: story.tags.join(', '),
            })
            setContent(story.content)
            setVocabRefs(story.vocabularyRefs || [])
            setGrammarRefs(story.grammarRefs || [])
          }
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    loadAll()
  }, [id, isEdit, reset, user])

  function addVocabRef() {
    setVocabRefs([
      ...vocabRefs,
      { vocabularyId: '', word: '', contextSentence: '' },
    ])
  }

  function addGrammarRef() {
    setGrammarRefs([
      ...grammarRefs,
      { lessonId: '', lessonTitle: '', note: '' },
    ])
  }

  const onSubmit = async (data: StoryFormData) => {
    if (!user) return
    setSaving(true)
    try {
      const storyData = {
        title: data.title,
        description: data.description,
        content,
        difficulty: data.difficulty,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        vocabularyRefs: vocabRefs.filter((r) => r.vocabularyId),
        grammarRefs: grammarRefs.filter((r) => r.lessonId),
        isPublished: false,
        authorId: user.uid,
        authorName: user.displayName,
      }
      if (isEdit && id) {
        await updateStory(id, storyData)
      } else {
        await createStory(storyData)
      }
      navigate(ROUTES.TEACHER.STORIES)
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
        {isEdit ? 'Edit Story' : 'New Story'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2.5 rounded-lg border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
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
              placeholder="adventure, daily life"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Story Content
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your story here..."
          />
        </div>

        <div className="bg-cream-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Linked Vocabulary
          </h3>
          {vocabRefs.map((ref, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <select
                value={ref.vocabularyId}
                onChange={(e) => {
                  const vocab = allVocab.find((v) => v.id === e.target.value)
                  const updated = [...vocabRefs]
                  updated[i] = {
                    vocabularyId: e.target.value,
                    word: vocab?.word || '',
                    contextSentence: ref.contextSentence,
                  }
                  setVocabRefs(updated)
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-cream-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="">Select word...</option>
                {allVocab.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.word}
                  </option>
                ))}
              </select>
              <input
                value={ref.contextSentence}
                onChange={(e) => {
                  const updated = [...vocabRefs]
                  updated[i] = { ...updated[i], contextSentence: e.target.value }
                  setVocabRefs(updated)
                }}
                placeholder="Context sentence"
                className="flex-1 px-3 py-2 rounded-lg border border-cream-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
              <button
                type="button"
                onClick={() => setVocabRefs(vocabRefs.filter((_, j) => j !== i))}
                className="p-2 rounded hover:bg-red-50"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVocabRef}
            className="text-sm text-sage-600 hover:text-sage-700 flex items-center gap-1 mt-1"
          >
            <Plus className="w-4 h-4" /> Link Vocabulary
          </button>
        </div>

        <div className="bg-cream-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Linked Grammar Lessons
          </h3>
          {grammarRefs.map((ref, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <select
                value={ref.lessonId}
                onChange={(e) => {
                  const lesson = allLessons.find((l) => l.id === e.target.value)
                  const updated = [...grammarRefs]
                  updated[i] = {
                    lessonId: e.target.value,
                    lessonTitle: lesson?.title || '',
                    note: ref.note,
                  }
                  setGrammarRefs(updated)
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-cream-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="">Select lesson...</option>
                {allLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
              <input
                value={ref.note}
                onChange={(e) => {
                  const updated = [...grammarRefs]
                  updated[i] = { ...updated[i], note: e.target.value }
                  setGrammarRefs(updated)
                }}
                placeholder="Note (e.g., See past tense usage)"
                className="flex-1 px-3 py-2 rounded-lg border border-cream-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
              <button
                type="button"
                onClick={() =>
                  setGrammarRefs(grammarRefs.filter((_, j) => j !== i))
                }
                className="p-2 rounded hover:bg-red-50"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addGrammarRef}
            className="text-sm text-sage-600 hover:text-sage-700 flex items-center gap-1 mt-1"
          >
            <Plus className="w-4 h-4" /> Link Grammar
          </button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            {isEdit ? 'Update Story' : 'Create Story'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.TEACHER.STORIES)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}