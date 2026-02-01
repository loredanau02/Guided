import type { Timestamp } from 'firebase/firestore'
import type { Difficulty } from './lesson'

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection' | 'other'

export interface VocabularyItem {
  id: string
  word: string
  definition: string
  partOfSpeech: PartOfSpeech
  pronunciation: string
  audioUrl?: string
  usageExamples: string[]
  difficulty: Difficulty
  tags: string[]
  relatedLessonIds: string[]
  relatedStoryIds: string[]
  isPublished: boolean
  authorId: string
  authorName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}