import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import type { User, UserRole } from '../types'

export async function signUp(email: string, password: string, displayName: string, role: UserRole): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })

  const userData: Omit<User, 'uid'> & { uid: string } = {
    uid: credential.user.uid,
    email,
    displayName,
    role,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  }

  await setDoc(doc(db, 'users', credential.user.uid), userData)
  return userData as User
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signOutUser() {
  return firebaseSignOut(auth)
}

export async function getUserData(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() } as User
}