import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import Card, { CardBody } from '../../common/Card'
import Badge from '../../common/Badge'
import Button from '../../common/Button'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import SearchBar from '../../common/SearchBar'
import { getPublishedVocabulary } from '../../../services/vocabulary.service'
import type { VocabularyItem } from '../../../types'
import { ROUTES, DIFFICULTY_COLORS } from '../../../utils/constants'

export default function VocabBrowser() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPublishedVocabulary().then(data => { setVocabulary(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = vocabulary.filter(v => v.word.toLowerCase().includes(search.toLowerCase()) || v.definition.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary</h1>
        <Link to={ROUTES.STUDENT.VOCAB_STUDY}><Button variant="outline"><BookOpen className="w-4 h-4" /> Study Mode</Button></Link>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search words..." className="mb-6" />
      {filtered.length === 0 ? (
        <EmptyState title="No vocabulary available" description="Check back later for new words" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <Card key={item.id}>
              <CardBody>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.word}</h3>
                  <Badge className={DIFFICULTY_COLORS[item.difficulty]}>{item.difficulty}</Badge>
                </div>
                <p className="text-xs text-sage-600 mb-1">{item.pronunciation}</p>
                <Badge variant="sage" className="mb-2">{item.partOfSpeech}</Badge>
                <p className="text-sm text-gray-600 mb-3">{item.definition}</p>
                {item.usageExamples.length > 0 && (
                  <div className="bg-cream-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Example:</p>
                    <p className="text-sm text-gray-700 italic">{item.usageExamples[0]}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
