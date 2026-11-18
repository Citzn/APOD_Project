export default function KeplersFirstLawFigure() {
  return (
    <figure className="report-placeholder-figure conjunction-figure">
      <svg
        viewBox="0 0 640 300"
        role="img"
        aria-label="An elliptical orbit with the Sun at one focus and the semi-major and semi-minor axes labelled"
      >
        <ellipse cx="320" cy="145" rx="245" ry="105" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
        <line x1="75" y1="145" x2="565" y2="145" stroke="#2563eb" strokeWidth="2" />
        <line x1="320" y1="40" x2="320" y2="250" stroke="#dc2626" strokeWidth="2" />
        <line x1="320" y1="145" x2="153" y2="145" stroke="#2563eb" strokeWidth="5" />
        <line x1="320" y1="145" x2="320" y2="40" stroke="#dc2626" strokeWidth="5" />

        <circle cx="153" cy="145" r="13" fill="#f4b63d" stroke="#d97706" strokeWidth="2" />
        <text x="153" y="178" textAnchor="middle" fill="#334155" fontSize="14">Sun</text>
        <circle cx="487" cy="145" r="4" fill="#334155" />
        <text x="487" y="178" textAnchor="middle" fill="#64748b" fontSize="12">second focus</text>
        <circle cx="320" cy="145" r="4" fill="#334155" />

        <circle cx="490" cy="70" r="8" fill="#38bdf8" stroke="#0f4c81" strokeWidth="2" />
        <text x="505" y="66" fill="#334155" fontSize="13">planet</text>

        <text x="236" y="136" textAnchor="middle" fill="#1d4ed8" fontSize="13" fontWeight="700">semi-major axis</text>
        <text x="332" y="92" fill="#b91c1c" fontSize="13" fontWeight="700">semi-minor axis</text>
      </svg>
      <figcaption>Figure 3.1: Kepler&apos;s First Law. Planets follow elliptical orbits, with the Sun at one focus rather than at the centre (“create a diagram of Kepler&apos;s First Law showing an elliptical orbit with the Sun at one focus” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/).</figcaption>
    </figure>
  )
}
