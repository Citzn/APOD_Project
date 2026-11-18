import { useState, type ReactNode } from "react";

/**
 * Figure 4.1: the phosphine argument as an interactive flowchart.
 * Click an explanation to see what evidence would support or rule it out.
 */

type ExplanationId = "microbes" | "chemistry" | "artifact";

interface Explanation {
  id: ExplanationId;
  label: string;
  summary: string;
  supports: string[];
  rulesOut: string[];
}

const EXPLANATIONS: Explanation[] = [
  {
    id: "microbes",
    label: "Microbes",
    summary: "Acid-tolerant, oxygen-avoiding microbes in the cloud droplets are making phosphine.",
    supports: [
      "Independent observations that confirm phosphine at a steady abundance",
      "Direct sampling of cloud particles showing biological chemistry",
      "Evidence that a microbe could survive in the droplets' acidity",
    ],
    rulesOut: [
      "No phosphine is actually present",
      "A non-biological process explains the amount found",
      "Droplets too acidic and dry for any known biochemistry",
    ],
  },
  {
    id: "chemistry",
    label: "Unknown non-biological chemistry",
    summary: "A process we have not yet identified, such as geological or atmospheric chemistry, produces phosphine.",
    supports: [
      "Models or laboratory work showing a non-biological route that reaches the observed amount",
      "Evidence of a likely source, for example volcanic activity",
    ],
    rulesOut: [
      "Calculations showing no known process can reach the observed amount",
      "No phosphine is actually present",
    ],
  },
  {
    id: "artifact",
    label: "No phosphine at all",
    summary: "The original signal was a misreading, so there is nothing to explain.",
    supports: [
      "Follow-up observations with other instruments finding no phosphine",
      "Reanalyses showing the spectral feature could come from another molecule",
    ],
    rulesOut: [
      "Repeated detections by independent telescopes at consistent levels",
    ],
  },
];

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 28"
      className="mx-auto h-7 w-5 text-slate-400"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="2" />
      <polygon points="3,18 17,18 10,27" fill="currentColor" />
    </svg>
  );
}

function Step({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-300 bg-white p-3 text-center">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {children && <p className="mt-1 text-sm text-slate-700">{children}</p>}
    </div>
  );
}

export default function PhosphineFlowchart() {
  const [selected, setSelected] = useState<ExplanationId | null>(null);
  const active = EXPLANATIONS.find((e) => e.id === selected) ?? null;

  return (
    <figure className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col">
        <Step title="Phosphine reported in Venus's clouds">
          Astronomers report phosphine in 2020. On Earth it is made by anaerobic bacteria.
        </Step>
        <Arrow />
        <Step title="Puzzling">
          Phosphine is fragile and Venus's oxygen-rich chemistry should destroy it, so something
          would have to keep making it.
        </Step>
        <Arrow />

        <div>
          <p className="mb-2 text-center text-sm font-semibold text-slate-900">
            Competing explanations
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="Competing explanations">
            {EXPLANATIONS.map((e) => {
              const isOn = e.id === selected;
              return (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={isOn}
                  aria-controls="explanation-detail"
                  onClick={() => setSelected(isOn ? null : e.id)}
                  className={`rounded-lg border p-3 text-left text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                    isOn
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {e.label}
                </button>
              );
            })}
          </div>

          <div
            id="explanation-detail"
            aria-live="polite"
            className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800"
          >
            {active ? (
              <>
                <p className="font-medium">{active.summary}</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-green-900">Evidence that would support it</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {active.supports.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-red-900">Evidence that would rule it out</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {active.rulesOut.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <p>Select an explanation to see what evidence would support or rule it out.</p>
            )}
          </div>
        </div>

        <Arrow />
        <Step title="Follow-up observations">
          The James Clerk Maxwell Telescope and ALMA found no phosphine.
        </Step>
        <Arrow />
        <div className="mx-auto max-w-md rounded-lg border-2 border-slate-900 bg-slate-900 p-3 text-center text-white">
          <p className="text-sm font-semibold">Status: unconfirmed</p>
          <p className="mt-1 text-sm">The original analysis is still contested.</p>
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-slate-700">
        Figure 4.1: The phosphine argument and its current status (Author Year)
      </figcaption>
    </figure>
  );
}
