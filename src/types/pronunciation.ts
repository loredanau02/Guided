import type { Timestamp } from 'firebase/firestore'
import type { Difficulty } from './lesson'

export interface PronunciationExercise {
  id: string
  title: string
  description: string
  targetPhrase: string
  targetPhonetic: string
  audioUrl?: string
  hints: string[]
  difficulty: Difficulty
  vocabularyIds: string[]
  storyId?: string
  lessonId?: string
  isPublished: boolean
  authorId: string
  authorName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}