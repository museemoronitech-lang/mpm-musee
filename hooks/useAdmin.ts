'use client'

import { useState, useCallback } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Medina2025MPM'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('mpm_admin') === '1'
  })
  const [adminPassword, setAdminPassword] = useState(ADMIN_PASSWORD)
  const [loginError, setLoginError] = useState(false)

  const login = useCallback(
    (pwd: string) => {
      if (pwd === adminPassword) {
        setIsAdmin(true)
        sessionStorage.setItem('mpm_admin', '1')
        setLoginError(false)
        return true
      }
      setLoginError(true)
      setTimeout(() => setLoginError(false), 2500)
      return false
    },
    [adminPassword]
  )

  const logout = useCallback(() => {
    setIsAdmin(false)
    sessionStorage.removeItem('mpm_admin')
  }, [])

  const changePassword = useCallback(
    (p1: string, p2: string): { ok: boolean; msg: string } => {
      if (!p1) return { ok: false, msg: 'Entrez un mot de passe.' }
      if (p1 !== p2) return { ok: false, msg: 'Les mots de passe ne correspondent pas.' }
      setAdminPassword(p1)
      return { ok: true, msg: "Mot de passe mis à jour (valable jusqu'au rechargement de la page)." }
    },
    []
  )

  return { isAdmin, login, logout, loginError, changePassword }
}
