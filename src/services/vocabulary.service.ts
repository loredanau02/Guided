import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { VocabularyItem, Difficulty } from '../types'

const COLLECTION = 'vocabulary'

export async function createVocabulary(data: Omit<VocabularyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateVocabulary(id: string, data: Partial<VocabularyItem>): Promise<void> {
  const { id: _id, createdAt: _ca, ...updateData } = data as any
  await updateDoc(doc(db, COLLECTION, id), {
    ...updateData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteVocabulary(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function getVocabularyItem(id: string): Promise<VocabularyItem | null> {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as VocabularyItem
}

export async function getVocabulary(filters?: { authorId?: string; isPublished?: boolean; difficulty?: Difficulty }): Promise<VocabularyItem[]> {
  let q = query(collection(db, COLLECTION), orderBy('word', 'asc'))
  if (filters?.authorId) {
    q = query(collection(db, COLLECTION), where('authorId', '==', filters.authorId), orderBy('word', 'asc'))
  }
  if (filters?.isPublished !== undefined) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', filters.isPublished), orderBy('word', 'asc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as VocabularyItem))
}

export async function getPublishedVocabulary(difficulty?: Difficulty): Promise<VocabularyItem[]> {
  let q = query(collection(db, COLLECTION), where('isPublished', '==', true), orderBy('word', 'asc'))
  if (difficulty) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', true), where('difficulty', '==', difficulty), orderBy('word', 'asc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as VocabularyItem))
}