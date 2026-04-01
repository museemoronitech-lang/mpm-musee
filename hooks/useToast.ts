'use client'

import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const [isError, setIsError] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const toast = useCallback((msg: string, err = false) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(msg)
    setIsError(err)
    setVisible(true)
    timerRef.current = setTimeout(() => setVisible(false), 3000)
  }, [])

  return { message, visible, isError, toast }
}
