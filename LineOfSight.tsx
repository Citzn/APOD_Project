import { useEffect, useState, type ReactNode } from 'react'

const R_VENUS = 72
const R_EARTH = 100
const R_JUPITER = 170
const CX = 200
const CY = 200
const EARTH_DEG = -90
const JUPITER_DEG = 60
const SKY_RANGE = 60
const CONJ_LIMIT = 2
const TICKS = [-45, -30, -15, 0, 15, 30, 45]

type Point = [number, number]

type DotProps = {
  off: number
  size: number
  color: string
  glow?: string
}

type TagProps = {
  off: number
  children: ReactNode
  className: string
}

const rad = (degrees: number) => (degrees * Math.PI) / 180
const deg = (radians: number) => (radians * 180) / Math.PI
const norm = (degrees: number) => ((((degrees + 180) % 360) + 360) % 360) - 180
const polar = (radius: number, degrees: number): Point => [radius * Math.cos(rad(degrees)), radius * Math.sin(rad(degrees))]
const toSvg = ([x, y]: Point): Point => [CX + x, CY - y]

const SUN: Point = [0, 0]
const EARTH = polar(R_EARTH, EARTH_DEG)
const JUPITER = polar(R_JUPITER, JUPITER_DEG)
const bearing = (point: Point) => deg(Math.atan2(point[1] - EARTH[1], point[0] - EARTH[0]))
const offset = (point: Point) => norm(bearing(point) - bearing(SUN))
const skyX = (offsetDegrees: number) => Math.min(97, Math.max(3, 50 - (offsetDegrees / SKY_RANGE) * 50))

const CONJ = (() => {
  const dx = JUPITER[0] - EARTH[0]
  const dy = JUPITER[1] - EARTH[1]
  const length = Math.hypot(dx, dy)
  const unit: Point = [dx / length, dy / length]
  const b = EARTH[0] * unit[0] + EARTH[1] * unit[1]
  const root = Math.sqrt(b * b - (R_EARTH ** 2 - R_VENUS ** 2))
  return [-b - root, -b + root].map((distance) => {
    const point: Point = [EARTH[0] + distance * unit[0], EARTH[1] + distance * unit[1]]
    return Math.round((deg(Math.atan2(point[1], point[0])) + 360) % 360)
  })
})()

function Dot({ off, size, color, glow }: DotProps) {
  return (
    <span
      className="absolute top-1/2 rounded-full"
      style={{
        left: `${skyX(off)}%`,
        width: size,
        height: size,
        background: color,
        boxShadow: glow ? `0 0 10px 3px ${glow}` : undefined,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

function Tag({ off, children, className }: TagProps) {
  return (
    <span
      className={`absolute text-[11px] text-slate-300 ${className}`}
      style={{ left: `${skyX(off)}%`, transform: 'translateX(-50%)' }}
    >
      {children}
    </span>
  )
}

const buttonClassName =
  'rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'

export default function LineOfSightWidget({
  caption = 'Figure 3.0: Earth, Venus and Jupiter lined up so that one line of sight from Earth passes through both planets (“create an interactive diagram of Earth, Venus and Jupiter aligned along a line of sight” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
}: {
  caption?: string
}) {
  const [venusDegrees, setVenusDegrees] = useState(CONJ[0])
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    let last: number | null = null
    let animationId = 0
    const tick = (now: number) => {
      if (last !== null) {
        const deltaSeconds = (now - last) / 1000
        setVenusDegrees((angle) => (angle + deltaSeconds * 20) % 360)
      }
      last = now
      animationId = requestAnimationFrame(tick)
    }
    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [playing])

  const venus = polar(R_VENUS, venusDegrees)
  const venusOffset = offset(venus)
  const jupiterOffset = offset(JUPITER)
  const separation = Math.abs(venusOffset - jupiterOffset)
  const aligned = separation < CONJ_LIMIT
  const [earthX, earthY] = toSvg(EARTH)
  const [venusX, venusY] = toSvg(venus)
  const [jupiterX, jupiterY] = toSvg(JUPITER)
  const reach = Math.hypot(JUPITER[0] - EARTH[0], JUPITER[1] - EARTH[1])
  const venusLength = Math.hypot(venus[0] - EARTH[0], venus[1] - EARTH[1])
  const sightEndX = earthX + ((venusX - earthX) / venusLength) * reach
  const sightEndY = earthY + ((venusY - earthY) / venusLength) * reach
  const sightColor = aligned ? '#fde68a' : '#94a3b8'
  const jump = (degrees: number) => {
    setPlaying(false)
    setVenusDegrees(degrees)
  }

  return (
    <figure className="mx-auto my-6 w-full max-w-xl">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-lg">
        <svg viewBox="0 0 400 400" role="img" aria-label="Top-down view of the Sun, Earth, Venus and Jupiter with a line of sight from Earth through Venus" className="mx-auto h-auto w-full max-w-md">
          {[R_VENUS, R_EARTH, R_JUPITER].map((radius) => (
            <circle key={radius} cx={CX} cy={CY} r={radius} fill="none" stroke="#334155" strokeWidth="1" />
          ))}
          <line x1={earthX} y1={earthY} x2={jupiterX} y2={jupiterY} stroke="#fb923c" strokeOpacity=".35" strokeDasharray="2 4" />
          <line x1={earthX} y1={earthY} x2={venusX} y2={venusY} stroke={sightColor} strokeWidth="2" />
          <line x1={venusX} y1={venusY} x2={sightEndX} y2={sightEndY} stroke={sightColor} strokeWidth="1.5" strokeDasharray="5 4" />
          <circle cx={CX} cy={CY} r="13" fill="#fde047" fillOpacity=".25" />
          <circle cx={CX} cy={CY} r="8" fill="#fde047" />
          <circle cx={earthX} cy={earthY} r="6" fill="#38bdf8" />
          <circle cx={jupiterX} cy={jupiterY} r="9" fill="#fb923c" />
          <circle cx={venusX} cy={venusY} r="5" fill="#fde68a" />
          <g fontSize="12" fill="#cbd5e1">
            <text x={CX} y={CY + 26} textAnchor="middle">Sun</text>
            <text x={earthX} y={earthY + 22} textAnchor="middle">Earth</text>
            <text x={jupiterX + 13} y={jupiterY + 4}>Jupiter</text>
            <text x={venusX + 10} y={venusY - 9}>Venus</text>
          </g>
          <text x="10" y="392" fontSize="10" fill="#64748b">Orbits not to scale</text>
        </svg>


        <p aria-live="polite" className="mt-2 text-sm text-slate-200">
          Venus and Jupiter are in
          {aligned ? <span className="ml-2 rounded bg-amber-300 px-2 py-0.5 text-xs font-semibold text-slate-900">conjunction</span> : <span className="ml-2 rounded bg-red-300 px-2 py-0.5 text-xs font-semibold text-slate-900">not conjunction</span>}
        </p>

        <div className="mt-3 space-y-3">
          <label className="block text-sm text-slate-300">
            Venus’s position in its orbit
            <input type="range" min="0" max="359" step="1" value={Math.round(venusDegrees) % 360} onChange={(event) => jump(Number(event.target.value))} className="mt-1 w-full accent-sky-400" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className={buttonClassName} onClick={() => setPlaying((isPlaying) => !isPlaying)}>{playing ? 'Pause' : 'Play'}</button>
            <button className={buttonClassName} onClick={() => jump(CONJ[0])}>Align on near side</button>
            <button className={buttonClassName} onClick={() => jump(CONJ[1])}>Align on far side</button>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-slate-600">{caption}</figcaption>
    </figure>
  )
}
