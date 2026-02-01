import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Quiz, QuizAttempt, Difficulty } from '../types'

const QUIZ_COLLECTION = 'quizzes'
const ATTEMPT_COLLECTION = 'quizAttempts'

export async function createQuiz(data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, QUIZ_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateQuiz(id: string, data: Partial<Quiz>): Promise<void> {
  const { id: _id, createdAt: _ca, ...updateData } = data as any
  await updateDoc(doc(db, QUIZ_COLLECTION, id), {
    ...updateData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteQuiz(id: string): Promise<void> {
  await deleteDoc(doc(db, QUIZ_COLLECTION, id))
}

export async function getQuiz(id: string): Promise<Quiz | null> {
  const snap = await getDoc(doc(db, QUIZ_COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Quiz
}

export async function getQuizzes(filters?: { authorId?: string; isPublished?: boolean; difficulty?: Difficulty; type?: string }): Promise<Quiz[]> {
  let q = query(collection(db, QUIZ_COLLECTION), orderBy('createdAt', 'desc'))
  if (filters?.authorId) {
    q = query(collection(db, QUIZ_COLLECTION), where('authorId', '==', filters.authorId), orderBy('createdAt', 'desc'))
  }
  if (filters?.isPublished !== undefined) {
    q = query(collection(db, QUIZ_COLLECTION), where('isPublished', '==', filters.isPublished), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quiz))
}

export async function getPublishedQuizzes(difficulty?: Difficulty): Promise<Quiz[]> {
  let q = query(collection(db, QUIZ_COLLECTION), where('isPublished', '==', true), orderBy('createdAt', 'desc'))
  if (difficulty) {
    q = query(collection(db, QUIZ_COLLECTION), where('isPublished', '==', true), where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quiz))
}

export async function submitQuizAttempt(data: Omit<QuizAttempt, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, ATTEMPT_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  const q = query(collection(db, ATTEMPT_COLLECTION), where('quizId', '==', quizId), orderBy('completedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizAttempt))
}

export async function getStudentAttempts(studentId: string): Promise<QuizAttempt[]> {
  const q = query(collection(db, ATTEMPT_COLLECTION), where('studentId', '==', studentId), orderBy('completedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizAttempt))
}

export async function getStudentQuizAttempts(studentId: string, quizId: string): Promise<QuizAttempt[]> {
  const q = query(
    collection(db, ATTEMPT_COLLECTION),
    where('studentId', '==', studentId),
    where('quizId', '==', quizId),
    orderBy('completedAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizAttempt))
}

export async function getAttempt(id: string): Promise<QuizAttempt | null> {
  const snap = await getDoc(doc(db, ATTEMPT_COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as QuizAttempt
}