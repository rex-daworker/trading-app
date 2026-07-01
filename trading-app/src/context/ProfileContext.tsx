import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'

export interface Profile {
  fullName: string
  dob: string
  address: string
  avatar: 'man' | 'woman'
}

interface ProfileContextValue {
  profile: Profile | null
  loading: boolean
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = doc(db, 'profiles', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      setProfile(snap.exists() ? (snap.data() as Profile) : null)
      setLoading(false)
    })
    return unsub
  }, [user])

  return (
    <ProfileContext.Provider value={{ profile, loading }}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (ctx === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return ctx
}