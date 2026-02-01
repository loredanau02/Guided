import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { PronunciationExercise, Difficulty } from '../types'

const COLLECTION = 'pronunciationExercises'

export async function createPronunciation(data: Omit<PronunciationExercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updatePronunciation(id: string, data: Partial<PronunciationExercise>): Promise<void> {
  const { id: _id, createdAt: _ca, ...updateData } = data as any
  await updateDoc(doc(db, COLLECTION, id), {
    ...updateData,
    updatedAt: serverTimestamp(),
  })
}

export async function deletePronunciation(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function getPronunciation(id: string): Promise<PronunciationExercise | null> {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as PronunciationExercise
}

export async function getPronunciationExercises(filters?: { authorId?: string; isPublished?: boolean; difficulty?: Difficulty }): Promise<PronunciationExercise[]> {
  let q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  if (filters?.authorId) {
    q = query(collection(db, COLLECTION), where('authorId', '==', filters.authorId), orderBy('createdAt', 'desc'))
  }
  if (filters?.isPublished !== undefined) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', filters.isPublished), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PronunciationExercise))
}

export async function getPublishedPronunciation(difficulty?: Difficulty): Promise<PronunciationExercise[]> {
  let q = query(collection(db, COLLECTION), where('isPublished', '==', true), orderBy('createdAt', 'desc'))
  if (difficulty) {
    q = query(collection(db, COLLECTION), where('isPublished', '==', true), where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PronunciationExercise))
}