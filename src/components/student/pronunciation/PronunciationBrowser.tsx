import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic } from 'lucide-react'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import SearchBar from '../../common/SearchBar'
import { getPublishedPronunciation } from '../../../services/pronunciation.service'
import type { PronunciationExercise } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function PronunciationBrowser() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<PronunciationExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPublishedPronunciation().then(data => { setExercises(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = exercises.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.targetPhrase.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pronunciation Practice</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search exercises..." className="mb-6" />
      {filtered.length === 0 ? (
        <EmptyState title="No exercises available" description="Check back later" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ex => (
            <Card key={ex.id} hover onClick={() => navigate(ROUTES.STUDENT.PRONUNCIATION_PRACTICE(ex.id))}>
              <CardBody>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0"><Mic className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ex.title}</h3>
                    {ex.description && <p className="text-sm text-gray-500 mt-1">{ex.description}</p>}
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-3">"{ex.targetPhrase}"</p>
                <Badge className={DIFFICULTY_COLORS[ex.difficulty]}>{ex.difficulty}</Badge>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}