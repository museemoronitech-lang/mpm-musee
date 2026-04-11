'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2000)
    const t2 = setTimeout(() => setGone(true), 2300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (gone) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 300ms ease',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <img
        src="/Logo_Medina_Wiratha.png"
        alt="MPM"
        style={{ height: '192px', width: 'auto', filter: 'brightness(0) invert(1)' }}
      />
    </div>
  )
}
