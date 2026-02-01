import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { GrammarLesson, Difficulty } from '../types'

const COLLECTION = 'lessons'

export async function createLesson(data: Omit<GrammarLesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateLesson(id: string, data: Partial<GrammarLesson>): Promise<void> {
  const { id: _id, createdAt: _ca, ...updateData } = data as any
  await updateDoc(doc(db, COLLECTION, id), {
    ...updateData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteLesson(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function getLesson(id: string): Promise<GrammarLesson | null> {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as GrammarLesson
}

export async function getLessons(filters?: { authorId?: string; isPublished?: boolean; difficulty?: Difficulty }): Promise<GrammarLesson[]> {
  let q = query(collection(db, COLLECTION), orderBy('order', 'asc'))

  if (filters?.authorId) {
    q = query(collection(db, COLLECTION), where('authorId', '==', filters.authorId), orderBy('order', 'asc'))
  }
  if (filters?.isPublished !== undefined) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', filters.isPublished), orderBy('order', 'asc'))
  }

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GrammarLesson))
}

export async function getPublishedLessons(difficulty?: Difficulty): Promise<GrammarLesson[]> {
  let q = query(collection(db, COLLECTION), where('isPublished', '==', true), orderBy('order', 'asc'))
  if (difficulty) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', true), where('difficulty', '==', difficulty), orderBy('order', 'asc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GrammarLesson))
}