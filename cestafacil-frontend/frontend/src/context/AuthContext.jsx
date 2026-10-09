import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('cf_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, senha) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, senha })
      localStorage.setItem('cf_token', data.token)
      localStorage.setItem('cf_user', JSON.stringify(data))
      setUser(data)
      return data
    } finally { setLoading(false) }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register(payload)
      localStorage.setItem('cf_token', data.token)
      localStorage.setItem('cf_user', JSON.stringify(data))
      setUser(data)
      return data
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cf_token')
    localStorage.removeItem('cf_user')
    setUser(null)
  }, [])

  const isAdmin = user?.perfil === 'ADMIN'
  const isAuth  = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
