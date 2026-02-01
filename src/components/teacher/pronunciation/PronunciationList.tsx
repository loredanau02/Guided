import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Mic } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import EmptyState from '../../common/EmptyState'
import ConfirmDialog from '../../common/ConfirmDialog'
import LoadingSpinner from '../../common/LoadingSpinner'
import { getPronunciationExercises, deletePronunciation, updatePronunciation } from '../../../services/pronunciation.service'
import type { PronunciationExercise } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function PronunciationList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<PronunciationExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [user])

  async function loadData() {
    if (!user) return
    try {
      setExercises(await getPronunciationExercises({ authorId: user.uid }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePublish(ex: PronunciationExercise) {
    await updatePronunciation(ex.id, { isPublished: !ex.isPublished })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deletePronunciation(deleteId)
      await loadData()
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Pronunciation Exercises
        </h1>
        <Link to={ROUTES.TEACHER.PRONUNCIATION_NEW}>
          <Button>
            <Plus className="w-4 h-4" /> New Exercise
          </Button>
        </Link>
      </div>

      {exercises.length === 0 ? (
        <EmptyState
          title="No pronunciation exercises yet"
          description="Create exercises for your students to practice speaking"
          action={
            <Link to={ROUTES.TEACHER.PRONUNCIATION_NEW}>
              <Button>
                <Plus className="w-4 h-4" /> Create Exercise
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <Card key={ex.id}>
              <CardBody className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                  <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5 text-sage-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-gray-900 truncate">
                        {ex.title}
                      </h3>
                      <Badge variant={ex.isPublished ? 'green' : 'yellow'}>
                        {ex.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge className={DIFFICULTY_COLORS[ex.difficulty]}>
                        {ex.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      &ldquo;{ex.targetPhrase}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(ex)}
                    className="p-2 rounded-lg hover:bg-cream-100"
                  >
                    {ex.isPublished ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-sage-600" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      navigate(ROUTES.TEACHER.PRONUNCIATION_EDIT(ex.id))
                    }
                    className="p-2 rounded-lg hover:bg-cream-100"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setDeleteId(ex.id)}
                    className="p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Exercise"
        message="Oh uh. Are you sure? This will permanently delete this pronunciation exercise."
        loading={deleting}
      />
    </div>
  )
}
