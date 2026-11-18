import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

/**
 * Figure 4.0: interactive vertical profile of Venus's atmosphere.
 * Drag the marker (or use the arrow keys) to read temperature and pressure
 * at each height. The cloud-layer band is highlighted.
 *
 * The values below are approximate and rounded. Check them against the source
 * you cite before submitting.
 */

interface Sample {
  alt: number; // km
  tempC: number; // degrees Celsius
  pressureAtm: number; // Earth atmospheres
}

const DATA: Sample[] = [
  { alt: 0, tempC: 464, pressureAtm: 92 },
  { alt: 10, tempC: 392, pressureAtm: 47 },
  { alt: 20, tempC: 327, pressureAtm: 22 },
  { alt: 30, tempC: 257, pressureAtm: 8.9 },
  { alt: 40, tempC: 187, pressureAtm: 3.3 },
  { alt: 50, tempC: 77, pressureAtm: 1.07 },
  { alt: 55, tempC: 27, pressureAtm: 0.53 },
  { alt: 60, tempC: -13, pressureAtm: 0.24 },
  { alt: 65, tempC: -43, pressureAtm: 0.1 },
  { alt: 70, tempC: -58, pressureAtm: 0.04 },
];

const MAX_ALT = 70;
const BAND = { low: 50, high: 60 };

// SVG layout
const W = 420;
const H = 420;
const TOP = 30;
const PH = 350; // plot height
const TEMP = { x0: 70, w: 150, min: -60, max: 470 };
const PRES = { x0: 250, w: 150, minLog: -1.5, maxLog: 2 }; // 0.03 to 100 atm

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const yOf = (alt: number) => TOP + (1 - alt / MAX_ALT) * PH;
const xTemp = (t: number) => TEMP.x0 + ((t - TEMP.min) / (TEMP.max - TEMP.min)) * TEMP.w;
const xPres = (p: number) =>
  PRES.x0 + ((Math.log10(p) - PRES.minLog) / (PRES.maxLog - PRES.minLog)) * PRES.w;

function sampleAt(altRaw: number): Sample {
  const alt = clamp(altRaw, 0, MAX_ALT);
  if (alt === 0) return DATA[0];
  const j = DATA.findIndex((d) => d.alt >= alt);
  const lo = DATA[j - 1];
  const hi = DATA[j];
  const f = (alt - lo.alt) / (hi.alt - lo.alt);
  return {
    alt,
    tempC: lo.tempC + f * (hi.tempC - lo.tempC),
    // pressure falls roughly exponentially, so interpolate in log space
    pressureAtm: Math.pow(
      10,
      Math.log10(lo.pressureAtm) + f * (Math.log10(hi.pressureAtm) - Math.log10(lo.pressureAtm)),
    ),
  };
}

function noteFor(alt: number): string {
  if (alt < 1)
    return "Surface: around 460 °C and roughly 90 times Earth's sea-level pressure, far beyond what any known organism tolerates.";
  if (alt < 45)
    return "Still extremely hot and under high pressure, though both fall steadily with height.";
  if (alt < BAND.low)
    return "Temperatures are approaching tolerable levels. The main cloud deck begins at around this height.";
  if (alt <= BAND.high)
    return "Temperature and pressure are closest to conditions on Earth. The droplets here are still concentrated sulphuric acid.";
  return "Cold and thin: pressure is a small fraction of an Earth atmosphere and temperatures are below freezing.";
}

const formatPressure = (p: number) =>
  p >= 10 ? p.toFixed(0) : p >= 1 ? p.toFixed(1) : p.toFixed(2);

function curvePath(xFn: (s: Sample) => number): string {
  const pts: string[] = [];
  for (let a = 0; a <= MAX_ALT; a += 1) {
    const s = sampleAt(a);
    pts.push(`${pts.length === 0 ? "M" : "L"}${xFn(s).toFixed(1)},${yOf(a).toFixed(1)}`);
  }
  return pts.join(" ");
}

const TEMP_PATH = curvePath((s) => xTemp(s.tempC));
const PRES_PATH = curvePath((s) => xPres(s.pressureAtm));

export default function VenusAltitudeProfile() {
  const [alt, setAlt] = useState(55);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  const s = sampleAt(alt);
  const inBand = alt >= BAND.low && alt <= BAND.high;

  const updateFromPointer = useCallback((e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const y = ((e.clientY - rect.top) * H) / rect.height;
    setAlt(clamp(Math.round((1 - (y - TOP) / PH) * MAX_ALT), 0, MAX_ALT));
  }, []);

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e);
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging.current) updateFromPointer(e);
  };
  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    const step: Record<string, number> = { ArrowUp: 1, ArrowDown: -1, PageUp: 5, PageDown: -5 };
    if (e.key in step) {
      e.preventDefault();
      setAlt((a) => clamp(a + step[e.key], 0, MAX_ALT));
    } else if (e.key === "Home") {
      e.preventDefault();
      setAlt(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setAlt(MAX_ALT);
    }
  };

  const yMarker = yOf(alt);
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70];

  return (
    <figure className="mx-auto w-full max-w-2xl">
      <p className="mb-2 text-sm text-slate-700">
        Drag the marker up and down the column, or focus it and use the arrow keys.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none select-none rounded border border-slate-200 bg-white"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Cloud-layer band */}
          <rect
            x="0"
            y={yOf(BAND.high)}
            width={W}
            height={yOf(BAND.low) - yOf(BAND.high)}
            fill="#16a34a"
            fillOpacity="0.15"
          />
          <text x={W - 6} y={yOf(BAND.high) + 12} fontSize="10" textAnchor="end" fill="#166534">
            Cloud-layer band
          </text>

          {/* Surface */}
          <rect x="0" y={yOf(0)} width={W} height={H - yOf(0)} fill="#4a3a30" />
          <text x="6" y={yOf(0) + 16} fontSize="10" fill="#f5f5f4">
            Surface (extreme)
          </text>

          {/* Altitude axis */}
          <line x1="50" y1={TOP} x2="50" y2={yOf(0)} stroke="#475569" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1="46" y1={yOf(t)} x2="50" y2={yOf(t)} stroke="#475569" />
              <text x="42" y={yOf(t) + 3} fontSize="9" textAnchor="end" fill="#334155">
                {t === ticks[0] ? "Low" : t === ticks[ticks.length - 1] ? "High" : ""}
              </text>
            </g>
          ))}
          <text x="8" y="16" fontSize="10" fill="#334155">
            Altitude (km)
          </text>

          {/* Temperature panel */}
          <text x={TEMP.x0} y="16" fontSize="10" fill="#334155">
            Temperature (°C)
          </text>
          <line x1={TEMP.x0} y1={yOf(0)} x2={TEMP.x0 + TEMP.w} y2={yOf(0)} stroke="#cbd5e1" />
          {[0, 200, 400].map((t) => (
            <g key={t}>
              <line x1={xTemp(t)} y1={TOP} x2={xTemp(t)} y2={yOf(0)} stroke="#e2e8f0" />
              <text x={xTemp(t)} y={yOf(0) - 4} fontSize="9" textAnchor="middle" fill="#64748b">
                {t === 0 ? "Low" : t === 400 ? "High" : ""}
              </text>
            </g>
          ))}
          <path d={TEMP_PATH} fill="none" stroke="#c2410c" strokeWidth="2" />

          {/* Pressure panel */}
          <text x={PRES.x0} y="16" fontSize="10" fill="#334155">
            Pressure (atm, log scale)
          </text>
          {[0.1, 1, 10, 100].map((p) => (
            <g key={p}>
              <line x1={xPres(p)} y1={TOP} x2={xPres(p)} y2={yOf(0)} stroke="#e2e8f0" />
              <text x={xPres(p)} y={yOf(0) - 4} fontSize="9" textAnchor="middle" fill="#64748b">
                {p === 0.1 ? "Low" : p === 100 ? "High" : ""}
              </text>
            </g>
          ))}
          <path d={PRES_PATH} fill="none" stroke="#1d4ed8" strokeWidth="2" />

          {/* Marker */}
          <g
            tabIndex={0}
            role="slider"
            aria-label="Altitude above the surface of Venus"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={MAX_ALT}
            aria-valuenow={Math.round(alt)}
            aria-valuetext={`${Math.round(alt)} kilometres, ${Math.round(s.tempC)} degrees Celsius, ${formatPressure(s.pressureAtm)} atmospheres`}
            onKeyDown={onKeyDown}
            className="cursor-grab outline-none focus-visible:[&_.handle]:stroke-sky-500 focus-visible:[&_.handle]:stroke-[3]"
          >
            <line x1="50" y1={yMarker} x2={W - 10} y2={yMarker} stroke="#0f172a" strokeDasharray="4 3" />
            <circle className="handle" cx="50" cy={yMarker} r="8" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
            <circle cx={xTemp(s.tempC)} cy={yMarker} r="4" fill="#c2410c" />
            <circle cx={xPres(s.pressureAtm)} cy={yMarker} r="4" fill="#1d4ed8" />
          </g>
        </svg>

        <div className="rounded-lg border border-slate-200 p-3" aria-live="polite">
          <p
            className={`mt-3 inline-block rounded px-2 py-0.5 text-xs font-medium ${
              inBand ? "bg-green-100 text-green-900" : "bg-slate-100 text-slate-700"
            }`}
          >
            {inBand ? "Inside the cloud-layer band" : "Outside the cloud-layer band"}
          </p>
          <p className="mt-2 text-sm text-slate-700">{noteFor(alt)}</p>
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-slate-700">
        Figure 4.0: Temperature and pressure in Venus&rsquo;s atmosphere by altitude (“create an interactive diagram of temperature and pressure in Venus&apos;s atmosphere by altitude” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)
      </figcaption>
    </figure>
  );
}
