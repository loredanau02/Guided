import type { Timestamp } from 'firebase/firestore'
import type { Difficulty } from './lesson'

export type QuizType = 'grammar' | 'vocabulary' | 'story_comprehension' | 'mixed'
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_blank'

export interface QuizQuestion {
  id: string
  questionText: string
  questionType: QuestionType
  options: string[]
  correctAnswer: string
  explanation?: string
  points: number
  order: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  type: QuizType
  difficulty: Difficulty
  timeLimit?: number
  passingScore: number
  questions: QuizQuestion[]
  lessonIds: string[]
  storyIds: string[]
  vocabularyIds: string[]
  isPublished: boolean
  authorId: string
  authorName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AttemptAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  pointsEarned: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  quizTitle: string
  studentId: string
  studentName: string
  answers: AttemptAnswer[]
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  timeSpent: number
  completedAt: Timestamp
  createdAt: Timestamp
}
