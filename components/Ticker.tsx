'use client'

import { TICKER_ITEMS } from '@/lib/data'

export default function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {items.map((text, i) => (
          <span className="ticker-item" key={i}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
