import { useState, useEffect } from 'react'

const GOATCOUNTER_SITE = 'in-naamgpt'
const API_BASE = `https://${GOATCOUNTER_SITE}.goatcounter.com`

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function parseCount(str) {
  if (!str) return 0
  const n = parseInt(String(str).replace(/,/g, ''), 10)
  return Number.isNaN(n) ? 0 : n
}

export default function VisitorStats() {
  const [stats, setStats] = useState({ today: 0, month: 0, total: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE}/counter/%2F.json`)
        if (!res.ok) return
        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('json')) return
        const data = await res.json()
        const total = parseCount(data.count) || parseCount(data.count_unique) || 0
        setStats({ today: 0, month: 0, total })
        setLoaded(true)
      } catch {
        // API not available — keep component hidden
      }
    }

    fetchStats()
  }, [])

  const counters = [
    { label: 'All Time', value: stats.total, color: '#F0C020' },
  ]

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
        Visitors
      </span>
      {loaded ? (
        counters.map((c) => (
          <div key={c.label} className="flex items-center gap-2">
            <div
              className="w-2 h-2"
              style={{ backgroundColor: c.color }}
            />
            <span className="text-white/50 text-xs">
              {c.label}
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: c.color }}
            >
              {formatNumber(c.value)}
            </span>
          </div>
        ))
      ) : (
        <span className="text-white/30 text-xs">loading...</span>
      )}
      <a
        href={`${API_BASE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/20 text-[10px] hover:text-white/40 transition-colors"
        title="View analytics dashboard"
      >
        dashboard ↗
      </a>
    </div>
  )
}
