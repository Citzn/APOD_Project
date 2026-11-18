import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Interactive side-by-side diagram: a microbe released into the clouds of
 * Venus (stays in the habitable band) and Jupiter (carried down by convection).
 *
 * No dependencies beyond React and Tailwind utility classes.
 */

interface Point {
  x: number;
  y: number;
}

const W = 200; // SVG viewBox width
const H = 320; // SVG viewBox height
const BAND_TOP = 60; // top of the temperate band
const BAND_BOTTOM = 100; // bottom of the temperate band
const FLOOR = 300; // depth at which the Jupiter microbe is "lost"
const START: Point = { x: 100, y: 80 };

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Venus: the droplet drifts, but stays inside the band. */
function venusPosition(t: number): Point {
  return {
    x: 100 + 28 * Math.sin(t * 0.9) + 10 * Math.sin(t * 2.3),
    y: 80 + 10 * Math.sin(t * 1.3 + 1),
  };
}

/** Jupiter: a simple flow field with updrafts, downdrafts and a net downward drift. */
function jupiterStep(p: Point, t: number, dt: number): Point {
  const vy = 18 + 30 * Math.sin(p.x * 0.07 + t * 0.6);
  const vx = 16 * Math.cos(p.y * 0.06 - t * 0.8);
  return {
    x: Math.min(186, Math.max(14, p.x + vx * dt)),
    y: Math.min(FLOOR, p.y + vy * dt),
  };
}

function jupiterStatus(p: Point | null, done: boolean): string {
  if (!p) return "Waiting for a microbe.";
  if (done)
    return "Reached extreme depth, where temperature and pressure are far beyond what life tolerates.";
  if (p.y > BAND_BOTTOM) return "Carried below the temperate layer.";
  return "Still in the temperate layer.";
}

export default function CloudHabitatDiagram() {
  const [released, setReleased] = useState(false);
  const [venus, setVenus] = useState<Point>(START);
  const [jupiter, setJupiter] = useState<Point>(START);
  const [jupiterDone, setJupiterDone] = useState(false);

  const tRef = useRef(0);
  const jupiterRef = useRef<Point>(START);
  const doneRef = useRef(false);

  const reset = useCallback(() => {
    tRef.current = 0;
    jupiterRef.current = START;
    doneRef.current = false;
    setReleased(false);
    setJupiterDone(false);
    setVenus(START);
    setJupiter(START);
  }, []);

  const release = useCallback(() => {
    tRef.current = 0;
    jupiterRef.current = START;
    doneRef.current = false;
    setJupiterDone(false);
    setVenus(START);
    setJupiter(START);

    if (prefersReducedMotion()) {
      // Skip the animation and show the end state.
      jupiterRef.current = { x: START.x, y: FLOOR };
      doneRef.current = true;
      setJupiter(jupiterRef.current);
      setJupiterDone(true);
    }
    setReleased(true);
  }, []);

  useEffect(() => {
    if (!released || prefersReducedMotion()) return;

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      tRef.current += dt;
      const t = tRef.current;

      setVenus(venusPosition(t));

      if (!doneRef.current) {
        const next = jupiterStep(jupiterRef.current, t, dt);
        jupiterRef.current = next;
        setJupiter(next);
        if (next.y >= FLOOR) {
          doneRef.current = true;
          setJupiterDone(true);
        }
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [released]);

  const animateArrows = !prefersReducedMotion();

  return (
    <figure className="mx-auto w-full max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={release}
          disabled={released}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Release a microbe
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!released}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* VENUS */}
        <section className="rounded-lg border border-slate-200 p-3">
          <h3 className="mb-2 text-base font-semibold text-slate-900">Venus</h3>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full rounded bg-slate-50"
            role="img"
            aria-label="Venus: a cloud layer above a solid surface. A released microbe stays inside the temperate band."
          >
            <defs>
              <linearGradient id="venusSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f2e6b8" />
                <stop offset="1" stopColor="#c98b3c" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="url(#venusSky)" />

            {/* Temperate band */}
            <rect
              x="0"
              y={BAND_TOP}
              width={W}
              height={BAND_BOTTOM - BAND_TOP}
              fill="#ffffff"
              fillOpacity="0.4"
              stroke="#0f172a"
              strokeDasharray="4 3"
            />
            <text x="6" y={BAND_TOP - 5} fontSize="9" fill="#0f172a">
              Temperate band
            </text>

            {/* Surface */}
            <rect x="0" y="288" width={W} height="32" fill="#4a3a30" />
            <text x="6" y="308" fontSize="9" fill="#f5f5f4">
              Solid surface
            </text>

            {released && (
              <circle
                cx={venus.x}
                cy={venus.y}
                r="5"
                fill="#16a34a"
                stroke="#052e16"
                strokeWidth="1.5"
              />
            )}
          </svg>
          <p className="mt-2 min-h-[2.5rem] text-sm text-slate-700" aria-live="polite">
            {released
              ? "Stays within the temperate band."
              : "Waiting for a microbe."}
          </p>
        </section>

        {/* JUPITER */}
        <section className="rounded-lg border border-slate-200 p-3">
          <h3 className="mb-2 text-base font-semibold text-slate-900">Jupiter</h3>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full rounded bg-slate-50"
            role="img"
            aria-label="Jupiter: a deep, churning atmosphere with no surface. A released microbe is carried down into hotter, higher-pressure regions."
          >
            <defs>
              <linearGradient id="jupSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e3cfa8" />
                <stop offset="0.45" stopColor="#c98a5a" />
                <stop offset="1" stopColor="#6e1f14" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="url(#jupSky)" />

            {/* Temperate band for comparison */}
            <rect
              x="0"
              y={BAND_TOP}
              width={W}
              height={BAND_BOTTOM - BAND_TOP}
              fill="#ffffff"
              fillOpacity="0.35"
              stroke="#0f172a"
              strokeDasharray="4 3"
            />
            <text x="6" y={BAND_TOP - 5} fontSize="9" fill="#0f172a">
              Temperate layer
            </text>

            {/* Convection: dashes move up (updraft) or down (downdraft) */}
            {[30, 70, 110, 150, 185].map((x, i) => {
              const down = i % 2 === 0;
              return (
                <line
                  key={x}
                  x1={x}
                  y1="20"
                  x2={x}
                  y2="270"
                  stroke="#ffffff"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                >
                  {animateArrows && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values={down ? "0;-32" : "0;32"}
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
              );
            })}

            <text x="6" y="284" fontSize="9" fill="#fef3c7">
              Temperature and pressure rise
            </text>
            <text x="6" y="298" fontSize="9" fill="#fef3c7">
              No surface to land on
            </text>

            {released && (
              <circle
                cx={jupiter.x}
                cy={jupiter.y}
                r="5"
                fill={jupiterDone ? "#7f1d1d" : "#16a34a"}
                stroke="#052e16"
                strokeWidth="1.5"
              />
            )}
          </svg>
          <p className="mt-2 min-h-[2.5rem] text-sm text-slate-700" aria-live="polite">
            {jupiterStatus(released ? jupiter : null, jupiterDone)}
          </p>
        </section>
      </div>

      {/* UNSW Harvard: caption directly under the figure, followed by in-text citation */}
      <figcaption className="mt-3 text-sm text-slate-700">
        Figure 4.2: Behaviour of a suspended microbe in the clouds of Venus and Jupiter (“create a diagram of the behaviour of a suspended microbe in the clouds of Venus and Jupiter” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)
      </figcaption>
    </figure>
  );
}
