import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck } from 'lucide-react'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import SearchBar from '../../common/SearchBar'
import { getPublishedStories } from '../../../services/stories.service'
import type { Story } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'
import { truncateText, stripHtml } from '../../../utils/helpers'

export default function StoryBrowser() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPublishedStories().then(data => { setStories(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = stories.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Stories</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search stories..." className="mb-6" />
      {filtered.length === 0 ? (
        <EmptyState title="No stories available" description="Check back later for new stories" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(story => (
            <Card key={story.id} hover onClick={() => navigate(ROUTES.STUDENT.STORY_VIEW(story.id))}>
              <CardBody>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center shrink-0"><BookOpenCheck className="w-5 h-5 text-earth-600" /></div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{story.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{story.description || truncateText(stripHtml(story.content), 80)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={DIFFICULTY_COLORS[story.difficulty]}>{story.difficulty}</Badge>
                  {(story.vocabularyRefs?.length || 0) > 0 && <Badge variant="blue">{story.vocabularyRefs.length} vocab</Badge>}
                  {(story.grammarRefs?.length || 0) > 0 && <Badge variant="sage">{story.grammarRefs.length} grammar</Badge>}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}