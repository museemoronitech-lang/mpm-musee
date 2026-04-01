'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  variant?: 'reveal' | 'reveal-left' | 'reveal-stagger'
  style?: React.CSSProperties
}

export default function ScrollReveal({
  children,
  className = '',
  variant = 'reveal',
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    )

    if (variant === 'reveal-stagger') {
      el.querySelectorAll(':scope > *:not(.visible)').forEach((child) =>
        observer.observe(child)
      )
    } else {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [variant])

  return (
    <div ref={ref} className={`${variant} ${className}`} style={style}>
      {children}
    </div>
  )
}
