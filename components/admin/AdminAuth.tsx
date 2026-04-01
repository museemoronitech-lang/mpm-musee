'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AdminAuthProps {
  onLogin: (pwd: string) => boolean
  loginError: boolean
}

export default function AdminAuth({ onLogin, loginError }: AdminAuthProps) {
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    onLogin(password)
    setPassword('')
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div className="admin-login-logo">MPM</div>
        <div className="admin-login-sub">Accès Administration</div>
        <label className="admin-login-label">Mot de passe</label>
        <input
          className="admin-login-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
        />
        <button className="admin-login-btn" onClick={handleLogin}>Accéder →</button>
        <div className="admin-login-err" style={{ display: loginError ? 'block' : 'none' }}>
          Mot de passe incorrect.
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" style={{ background: 'none', border: 'none', color: 'rgba(242,237,228,0.28)', fontFamily: 'var(--mono)', fontSize: '0.58rem', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'none' }}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
