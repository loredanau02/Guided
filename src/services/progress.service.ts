import {
  collection, doc, updateDoc, getDoc, getDocs, setDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { StudentProgress, ContentType, ProgressStatus } from '../types'

const COLLECTION = 'progress'

function progressDocId(studentId: string, contentType: ContentType, contentId: string) {
  return `${studentId}_${contentType}_${contentId}`
}

export async function upsertProgress(data: {
  studentId: string
  contentType: ContentType
  contentId: string
  contentTitle: string
  status: ProgressStatus
  completionPercentage: number
  quizBestScore?: number
  pronunciationBestScore?: number
}): Promise<void> {
  const docId = progressDocId(data.studentId, data.contentType, data.contentId)
  const docRef = doc(db, COLLECTION, docId)
  const existing = await getDoc(docRef)

  if (existing.exists()) {
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
      ...(data.status === 'completed' ? { completedAt: serverTimestamp() } : {}),
    })
  } else {
    await setDoc(docRef, {
      id: docId,
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
      ...(data.status === 'completed' ? { completedAt: serverTimestamp() } : {}),
    })
  }
}

export async function getStudentProgress(studentId: string, contentType?: ContentType): Promise<StudentProgress[]> {
  let q;
  if (contentType) {
    q = query(
      collection(db, COLLECTION),
      where('studentId', '==', studentId),
      where('contentType', '==', contentType),
      orderBy('updatedAt', 'desc')
    )
  } else {
    q = query(
      collection(db, COLLECTION),
      where('studentId', '==', studentId),
      orderBy('updatedAt', 'desc')
    )
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentProgress))
}

export async function getContentProgress(studentId: string, contentType: ContentType, contentId: string): Promise<StudentProgress | null> {
  const docId = progressDocId(studentId, contentType, contentId)
  const snap = await getDoc(doc(db, COLLECTION, docId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as StudentProgress
}

export async function getAllStudentProgress(): Promise<StudentProgress[]> {
  const q = query(collection(db, COLLECTION), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentProgress))
}