import type { Timestamp } from 'firebase/firestore'
import type { Difficulty } from './lesson'

export interface VocabReference {
  vocabularyId: string
  word: string
  contextSentence: string
}

export interface GrammarReference {
  lessonId: string
  lessonTitle: string
  note: string
}

export interface Story {
  id: string
  title: string
  description: string
  content: string
  difficulty: Difficulty
  tags: string[]
  vocabularyRefs: VocabReference[]
  grammarRefs: GrammarReference[]
  isPublished: boolean
  authorId: string
  authorName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
