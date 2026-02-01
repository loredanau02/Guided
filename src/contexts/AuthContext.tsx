import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../config/firebase'
import { signUp as signUpService, signIn as signInService, signOutUser, getUserData } from '../services/auth.service'
import type { User, UserRole } from '../types'

interface AuthContextValue {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
  isTeacher: boolean
  isStudent: boolean
  firebaseReady: boolean
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        try {
          const userData = await getUserData(fbUser.uid)
          setUser(userData)
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleSignUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Please set up your environment variables.')
      return
    }
    try {
      setError(null)
      setLoading(true)
      const userData = await signUpService(email, password, displayName, role)
      setUser(userData)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Please set up your environment variables.')
      return
    }
    try {
      setError(null)
      setLoading(true)
      await signInService(email, password)
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      setLoading(false)
      throw err
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      setUser(null)
    } catch (err: any) {
      setError(err.message || 'Failed to sign out')
    }
  }

  const value: AuthContextValue = {
    user,
    firebaseUser,
    loading,
    error,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    firebaseReady: isFirebaseConfigured,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
