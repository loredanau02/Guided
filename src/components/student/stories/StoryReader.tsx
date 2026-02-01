import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getStory } from '../../../services/stories.service'
import { upsertProgress, getContentProgress } from '../../../services/progress.service'
import type { Story, StudentProgress, VocabReference } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function StoryReader() {
  const { id } = useParams()
  const { user } = useAuth()
  const [story, setStory] = useState<Story | null>(null)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [activeVocab, setActiveVocab] = useState<VocabReference | null>(null)

  useEffect(() => {
    if (!id || !user) return
    Promise.all([getStory(id), getContentProgress(user.uid, 'story', id)]).then(([s, p]) => {
      setStory(s)
      setProgress(p)
      setLoading(false)
      if (s && (!p || p.status === 'not_started')) {
        upsertProgress({ studentId: user.uid, contentType: 'story', contentId: id, contentTitle: s.title, status: 'in_progress', completionPercentage: 50 })
      }
    })
  }, [id, user])

  async function handleComplete() {
    if (!story || !user || !id) return
    setCompleting(true)
    await upsertProgress({ studentId: user.uid, contentType: 'story', contentId: id, contentTitle: story.title, status: 'completed', completionPercentage: 100 })
    setProgress({ ...progress, status: 'completed', completionPercentage: 100 } as StudentProgress)
    setCompleting(false)
  }

  if (loading) return <LoadingSpinner className="py-20" />
  if (!story) return <div className="text-center py-20 text-gray-500">Story not found</div>

  return (
    <div className="max-w-3xl">
      <Link to={ROUTES.STUDENT.STORIES} className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Stories</Link>
      <div className="flex items-center gap-3 mb-4">
        <Badge className={DIFFICULTY_COLORS[story.difficulty]}>{story.difficulty}</Badge>
        {story.tags?.map(tag => <Badge key={tag} variant="sage">{tag}</Badge>)}
        {progress?.status === 'completed' && <Badge variant="green"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
      {story.description && <p className="text-gray-500 mb-6">{story.description}</p>}

      {story.grammarRefs && story.grammarRefs.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400">Grammar:</span>
          {story.grammarRefs.map((ref, i) => (
            <Badge key={i} variant="sage">
              <FileText className="w-3 h-3 mr-1" />
              {ref.lessonTitle}{ref.note ? ` - ${ref.note}` : ''}
            </Badge>
          ))}
        </div>
      )}

      {story.vocabularyRefs && story.vocabularyRefs.length > 0 && (
        <div className="mb-6 bg-cream-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Key Vocabulary in this story:</p>
          <div className="flex flex-wrap gap-2">
            {story.vocabularyRefs.map((ref, i) => (
              <button key={i} onClick={() => setActiveVocab(activeVocab?.vocabularyId === ref.vocabularyId ? null : ref)} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium hover:bg-yellow-200 transition-colors">
                {ref.word}
              </button>
            ))}
          </div>
          {activeVocab && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-cream-200">
              <p className="font-semibold text-gray-900">{activeVocab.word}</p>
              {activeVocab.contextSentence && <p className="text-sm text-gray-500 mt-1 italic">"{activeVocab.contextSentence}"</p>}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: story.content }} />

      {progress?.status !== 'completed' && (
        <Button onClick={handleComplete} loading={completing}><CheckCircle className="w-4 h-4" /> Mark as Complete</Button>
      )}
    </div>
  )
}