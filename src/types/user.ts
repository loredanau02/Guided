import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'teacher' | 'student'

export interface User {
  uid: string
  email: string
  displayName: string
  role: UserRole
  avatarUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}