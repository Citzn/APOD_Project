import { useEffect, useRef, useState } from 'react'

const CX = 200
const CY = 200
const END = 365.25
const DAYS_PER_SECOND = 26

type Body = {
  name: string
  radius: number
  period: number
  color: string
  size: number
}

const BODIES: Body[] = [
  { name: 'Earth', radius: 82, period: 365.25, color: '#38bdf8', size: 6 },
  { name: 'Venus', radius: 58, period: 224.5, color: '#fbbf24', size: 5 },
  { name: 'Jupiter', radius: 150, period: 4332, color: '#fb923c', size: 9 },
]

const rad = (degrees: number) => (degrees * Math.PI) / 180
const point = (radius: number, degrees: number): [number, number] => [CX + radius * Math.cos(rad(degrees)), CY - radius * Math.sin(rad(degrees))]

function arc(radius: number, angle: number) {
  const end = Math.min(angle, 359.99)
  const [startX, startY] = point(radius, 0)
  const [endX, endY] = point(radius, end)
  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${end > 180 ? 1 : 0} 0 ${endX} ${endY}`
}

const buttonClassName =
  'rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'

export default function OrbitsInOneYearWidget({
  caption = 'Figure 3.2: Distance travelled around the Sun by Earth, Venus and Jupiter in one Earth year (“create an interactive diagram of how far Earth, Venus and Jupiter travel around the Sun in one Earth year” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
}: {
  caption?: string
}) {
  const [day, setDay] = useState(0)
  const [playing, setPlaying] = useState(false)
  const dayRef = useRef(0)

  useEffect(() => {
    dayRef.current = day
  }, [day])

  useEffect(() => {
    if (!playing) return
    let last: number | null = null
    let animationId = 0
    const tick = (now: number) => {
      if (last !== null) {
        const next = Math.min(END, dayRef.current + ((now - last) / 1000) * DAYS_PER_SECOND)
        dayRef.current = next
        setDay(next)
        if (next >= END) {
          setPlaying(false)
          return
        }
      }
      last = now
      animationId = requestAnimationFrame(tick)
    }
    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [playing])

  const finished = day >= END
  const toggle = () => {
    if (finished) {
      dayRef.current = 0
      setDay(0)
      setPlaying(true)
    } else {
      setPlaying((isPlaying) => !isPlaying)
    }
  }
  const reset = () => {
    setPlaying(false)
    dayRef.current = 0
    setDay(0)
  }
  const travelled = BODIES.map((body) => ({ ...body, degrees: (360 * day) / body.period }))

  return (
    <figure className="mx-auto my-6 w-full max-w-xl">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-lg">
        <svg viewBox="0 0 400 400" role="img" aria-label="Top-down view of Earth, Venus and Jupiter orbiting the Sun, with trails showing the distance each has travelled" className="mx-auto h-auto w-full max-w-md">
          {BODIES.map((body) => (
            <circle key={body.name} cx={CX} cy={CY} r={body.radius} fill="none" stroke="#334155" strokeWidth="1" />
          ))}
          <line x1={CX} y1={CY} x2={CX + 150} y2={CY} stroke="#475569" strokeDasharray="3 4" />
          <text x={CX + 156} y={CY + 4} fontSize="11" fill="#94a3b8">Start</text>

          {travelled.map((body) => (
            <g key={body.name} fill="none" stroke={body.color} strokeLinecap="round">
              {body.degrees > 0.1 && <path d={arc(body.radius, Math.min(body.degrees, 360))} strokeWidth="3" strokeOpacity=".85" />}
              {body.degrees > 360 && <path d={arc(body.radius - 7, body.degrees - 360)} strokeWidth="3" strokeOpacity=".5" />}
            </g>
          ))}

          <circle cx={CX} cy={CY} r="13" fill="#fde047" fillOpacity=".25" />
          <circle cx={CX} cy={CY} r="8" fill="#fde047" />

          {travelled.map((body) => {
            const [x, y] = point(body.radius, body.degrees % 360)
            return (
              <g key={body.name}>
                <circle cx={x} cy={y} r={body.size} fill={body.color} />
                <text x={x + body.size + 4} y={y - body.size} fontSize="12" fill="#cbd5e1">{body.name}</text>
              </g>
            )
          })}
          <text x="10" y="392" fontSize="10" fill="#64748b">Orbits not to scale. Second laps are drawn just inside the first.</text>
        </svg>

        <p className="mt-2 text-sm text-slate-300">Day {Math.round(day)} of 365 ({(day / 365.25).toFixed(2)} years). All three start lined up on the same line from the Sun.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {travelled.map((body) => (
            <li key={body.name} className="rounded-lg bg-slate-800 px-3 py-2 text-sm">
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: body.color }} />
              <span className="font-medium">{body.name}</span>
              <div className="text-slate-300">{body.degrees.toFixed(0)}° · {(body.degrees / 360).toFixed(2)} laps</div>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-3">
          <label className="block text-sm text-slate-300">
            Time through the year
            <input type="range" min="0" max={END} step="0.25" value={day} onChange={(event) => { setPlaying(false); setDay(Number(event.target.value)) }} className="mt-1 w-full accent-sky-400" />
          </label>
          <div className="flex gap-2">
            <button className={buttonClassName} onClick={toggle}>{playing ? 'Pause' : finished ? 'Replay' : 'Play'}</button>
            <button className={buttonClassName} onClick={reset}>Reset</button>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-slate-600">{caption}</figcaption>
    </figure>
  )
}
