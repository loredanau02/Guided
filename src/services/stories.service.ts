import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Story, Difficulty } from '../types'

const COLLECTION = 'stories'

export async function createStory(data: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateStory(id: string, data: Partial<Story>): Promise<void> {
  const { id: _id, createdAt: _ca, ...updateData } = data as any
  await updateDoc(doc(db, COLLECTION, id), {
    ...updateData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteStory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function getStory(id: string): Promise<Story | null> {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Story
}

export async function getStories(filters?: { authorId?: string; isPublished?: boolean; difficulty?: Difficulty }): Promise<Story[]> {
  let q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  if (filters?.authorId) {
    q = query(collection(db, COLLECTION), where('authorId', '==', filters.authorId), orderBy('createdAt', 'desc'))
  }
  if (filters?.isPublished !== undefined) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', filters.isPublished), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Story))
}

export async function getPublishedStories(difficulty?: Difficulty): Promise<Story[]> {
  let q = query(collection(db, COLLECTION), where('isPublished', '==', true), orderBy('createdAt', 'desc'))
  if (difficulty) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', true), where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Story))
}