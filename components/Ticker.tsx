'use client'

import { useEffect, useRef, useState } from 'react'
import { TICKER_ITEMS } from '@/lib/data'

export default function Ticker() {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  const show = () => {
    setVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 3000)
  }

  const hide = () => {
    setVisible(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY === 0 && e.deltaY < 0) show()
      else if (e.deltaY > 0) hide()
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const delta = e.touches[0].clientY - touchStartY
      if (window.scrollY === 0 && delta > 10) show()
      else if (delta < -10) hide()
    }

    const onScroll = () => {
      if (window.scrollY > 0) hide()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div
      className="ticker-wrap"
      style={{
        opacity: visible ? 1 : 0,
        height: visible ? '32px' : '0',
        visibility: visible ? 'visible' : 'hidden',
        transition: 'opacity 300ms ease, height 300ms ease',
        overflow: 'hidden',
      }}
    >
      <div className="ticker">
        {items.map((text, i) => (
          <span className="ticker-item" key={i}>{text}</span>
        ))}
      </div>
    </div>
  )
}
