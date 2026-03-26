import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const EXP_CAP = 200
const STORAGE_KEY = 'nucleohub_auth_state'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [exp, setExp] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return
      }

      const parsed = JSON.parse(raw)
      setUser(parsed.user ?? null)
      setExp(parsed.exp ?? 0)
      setProgress(parsed.progress ?? 0)
    } catch {
      setUser(null)
      setExp(0)
      setProgress(0)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        exp,
        progress,
      }),
    )
  }, [user, exp, progress])

  const login = (_email, _password) => {
    setUser({
      name: 'Huy',
      role: 'Student',
      university: 'HUST',
    })
    return true
  }

  const logout = () => {
    setUser(null)
    setExp(0)
    setProgress(0)
  }

  const addExp = (amount) => {
    setExp((prevExp) => {
      const nextExp = prevExp + Math.max(0, Number(amount) || 0)
      const nextProgress = Math.min(Math.round(((nextExp % EXP_CAP) / EXP_CAP) * 100), 100)
      setProgress(nextProgress)
      return nextExp
    })
  }

  const value = useMemo(
    () => ({
      user,
      exp,
      progress,
      login,
      logout,
      addExp,
    }),
    [user, exp, progress],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
