import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../common/Button'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import EmptyState from '../../common/EmptyState'
import ConfirmDialog from '../../common/ConfirmDialog'
import LoadingSpinner from '../../common/LoadingSpinner'
import SearchBar from '../../common/SearchBar'
import { getVocabulary, deleteVocabulary, updateVocabulary } from '../../../services/vocabulary.service'
import type { VocabularyItem } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function VocabularyList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [user])

  async function loadData() {
    if (!user) return
    try {
      setVocabulary(await getVocabulary({ authorId: user.uid }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePublish(item: VocabularyItem) {
    await updateVocabulary(item.id, { isPublished: !item.isPublished })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteVocabulary(deleteId)
      await loadData()
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filtered = vocabulary.filter(
    (v) =>
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.definition.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary</h1>
        <Link to={ROUTES.TEACHER.VOCAB_NEW}>
          <Button>
            <Plus className="w-4 h-4" /> New Word
          </Button>
        </Link>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search vocabulary..."
        className="mb-4"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No matches found' : 'No vocabulary yet'}
          description={
            search
              ? 'Try a different search term'
              : 'Add vocabulary words for students to learn'
          }
          action={
            !search ? (
              <Link to={ROUTES.TEACHER.VOCAB_NEW}>
                <Button>
                  <Plus className="w-4 h-4" /> Add Word
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardBody>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.word}
                    </h3>
                    <p className="text-xs text-sage-600">{item.pronunciation}</p>
                  </div>
                  <Badge className={DIFFICULTY_COLORS[item.difficulty]}>
                    {item.difficulty}
                  </Badge>
                </div>
                <Badge variant="sage" className="mb-2">
                  {item.partOfSpeech}
                </Badge>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.definition}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                  <Badge variant={item.isPublished ? 'green' : 'yellow'}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className="p-1.5 rounded hover:bg-cream-100"
                    >
                      {item.isPublished ? (
                        <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-sage-600" />
                      )}
                    </button>
                    <button
                      onClick={() => navigate(ROUTES.TEACHER.VOCAB_EDIT(item.id))}
                      className="p-1.5 rounded hover:bg-cream-100"
                    >
                      <Edit className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
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
        title="Delete Word"
        message="This will permanently delete this vocabulary word."
        loading={deleting}
      />
    </div>
  )
}
