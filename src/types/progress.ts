import type { Timestamp } from 'firebase/firestore'

export type ContentType = 'lesson' | 'story' | 'vocabulary' | 'pronunciation' | 'quiz'
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface StudentProgress {
  id: string
  studentId: string
  contentType: ContentType
  contentId: string
  contentTitle: string
  status: ProgressStatus
  completionPercentage: number
  quizBestScore?: number
  pronunciationBestScore?: number
  lastAccessedAt: Timestamp
  completedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}