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
import { getStories, deleteStory, updateStory } from '../../../services/stories.service'
import type { Story } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function StoryList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [user])

  async function loadData() {
    if (!user) return
    try {
      setStories(await getStories({ authorId: user.uid }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePublish(story: Story) {
    await updateStory(story.id, { isPublished: !story.isPublished })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteStory(deleteId)
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
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <Link to={ROUTES.TEACHER.STORY_NEW}>
          <Button>
            <Plus className="w-4 h-4" /> New Story
          </Button>
        </Link>
      </div>

      {stories.length === 0 ? (
        <EmptyState
          title="No stories yet"
          description="Create engaging stories with linked vocabulary and grammar"
          action={
            <Link to={ROUTES.TEACHER.STORY_NEW}>
              <Button>
                <Plus className="w-4 h-4" /> Create Story
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {stories.map((story) => (
            <Card key={story.id}>
              <CardBody className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {story.title}
                    </h3>
                    <Badge variant={story.isPublished ? 'green' : 'yellow'}>
                      {story.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge className={DIFFICULTY_COLORS[story.difficulty]}>
                      {story.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {story.description}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>{story.vocabularyRefs?.length || 0} vocab linked</span>
                    <span>{story.grammarRefs?.length || 0} grammar linked</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(story)}
                    className="p-2 rounded-lg hover:bg-cream-100"
                  >
                    {story.isPublished ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-sage-600" />
                    )}
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.TEACHER.STORY_EDIT(story.id))}
                    className="p-2 rounded-lg hover:bg-cream-100"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setDeleteId(story.id)}
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
        title="Delete Story"
        message="This will permanently delete this story."
        loading={deleting}
      />
    </div>
  )
}