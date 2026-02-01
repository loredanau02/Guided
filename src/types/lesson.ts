import type { Timestamp } from 'firebase/firestore'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface GrammarLesson {
  id: string
  title: string
  description: string
  content: string
  difficulty: Difficulty
  tags: string[]
  order: number
  isPublished: boolean
  authorId: string
  authorName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}