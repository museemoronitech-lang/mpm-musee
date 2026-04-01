'use client'

import { useState, useEffect } from 'react'

let _setToast: ((msg: string, err?: boolean) => void) | null = null

export function toast(msg: string, err = false) {
  if (_setToast) _setToast(msg, err)
}

export default function Toast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    _setToast = (msg, err = false) => {
      setMessage(msg)
      setIsError(err)
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }
    return () => { _setToast = null }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: 'var(--ink)',
        color: 'var(--cr)',
        fontFamily: 'var(--mono)',
        fontSize: '0.62rem',
        letterSpacing: '0.1em',
        padding: '0.85rem 1.5rem',
        zIndex: 9000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
        borderLeft: `3px solid ${isError ? '#ef4444' : 'var(--rust)'}`,
      }}
    >
      {message}
    </div>
  )
}