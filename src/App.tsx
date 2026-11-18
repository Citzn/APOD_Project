import { useRef, useState } from 'react'
import CloudHabitatDiagram from '../CloudHabitatDiagram'
import PhosphineFlowchart from '../PhosphineFlowchart'
import VenusAltitudeProfile from '../VenusAltitudeProfile'


type LearningSlide = {
  section: string
  heading: string
  body: string
  figure: string
}

const reflectionLightSlides: LearningSlide[] = [
  {
    section: 'What is Light?',
    heading: 'Spectrum of Light',
    body: 'Light is a form of energy that travels as electromagnetic waves, which are ripples of electric and magnetic fields moving through space (NASA 2010a). Different kinds of light differ in their wavelength, the distance from one wave peak to the next. The small part of this range that human eyes can detect is called visible light, and we see wavelength as color. The shortest visible wavelengths look violet, followed by blue, green, yellow and orange, and the longest look red (NASA 2010b). Shorter wavelengths also carry more energy than longer ones. Sunlight is a mixture of all these colors, plus light we cannot see. Just beyond violet is ultraviolet light, which has even shorter wavelengths (Figure 2.0).',
    figure: 'Figure 2.0',
  },
  {
    section: 'What is Light?',
    heading: 'Reflection of Light',
    body: 'When sunlight reaches a planet, its waves meet atoms, the tiny building blocks of all matter, and molecules, which are groups of atoms joined together. The waves make the electrons in these atoms and molecules vibrate, and the vibrating electrons give off new light in all directions (Nave 2016a). This is called scattering, which means light being redirected in many directions after hitting something. A planet contains an enormous number of atoms and molecules, and all of them scatter light at once. Their combined scattering sends part of the light back toward space, and this is what we call reflection (Figure 2.1).',
    figure: 'Figure 2.1',
  },
  {
    section: 'What is Light?',
    heading: 'Absorpion of Light',
    body: 'Not all of the light is scattered, though. Atoms and molecules can also take in light, which is called absorption. They can only absorb light whose energy exactly matches a step their electrons can make between allowed energy levels, a bit like rungs on a ladder with no footholds in between (NASA 2010b). Since the energy of light depends on its wavelength, each type of molecule absorbs its own particular wavelengths and scatters the rest. Absorbed light is not sent back out, and its energy usually becomes heat. This is why materials have color. A molecule that absorbs blue light but scatters red light looks red, because red is the light that returns to our eyes (Figure 2.2) (Nave 2016b).',
    figure: 'Figure 2.1',
  },
]

const reflectionPlanetsSlides: LearningSlide[] = [
  {
    section: 'How does Venus reflect light?',
    heading: 'Light reflecting in Venus',
    body: 'Venus is not perfectly white, though. It looks pale yellow, because something in its upper clouds absorbs some of the ultraviolet and blue light that would otherwise be reflected. Photographs taken in ultraviolet light show this clearly, with dark and bright patches moving across the cloud tops. Scientists have known about these patches for around a century but have not identified the substance responsible, so it is nicknamed the unknown absorber (Pérez-Hoyos et al. 2018, p. 147). Suggestions include compounds of iron and sulfur, and carbon-based molecules dissolved in the droplets. Whatever it turns out to be, it shows how even a small amount of a different molecule can change which wavelengths a planet absorbs and which it reflects. The energy it takes in also warms the clouds and affects how Venus’s atmosphere moves (Titov et al. 2018, p. 14).',
    figure: 'Figure 2.2',
  },
  {
    section: 'How does Jupiter reflect light?',
    heading: 'Light reflecting in Jupiter',
    body: 'Jupiter is a gas giant, a huge planet made mostly of gas with no solid surface to land on. Its atmosphere is about 90% hydrogen molecules and 10% helium, with small amounts of methane, ammonia, hydrogen sulfide and water (NASA 2023a). These gases scatter very little visible light, so most of Jupiter’s reflected light comes from its clouds, which form in layers. The highest layer is made of ice crystals of ammonia, a molecule of nitrogen and hydrogen that freezes in Jupiter’s cold upper atmosphere. Below it is a layer of a compound called ammonium hydrosulfide, and deeper still is water (Guillot 1999, p. 1184). Ammonia ice crystals scatter all visible wavelengths strongly, so they look white. Where this ice is thick, it forms the pale bands called zones (Figure 4) (NASA 2023a).',
    figure: 'Figure 2.4',
  }
]

function figureDisplayer(figure: string) {

  var widget;

  if (figure === 'Figure 2.0') {
    widget = <SpectrumWidget />;
  } else if (figure === 'Figure 2.1') {
    widget = <MoleculeInteractionWidget />
  } else if (figure === 'Figure 2.2') {
    widget = <VenusCloudWidget />
  } else if (figure === 'Figure 2.3') {
    widget = <VenusCloudWidget />
  }

  return widget;
}

function LearningCarousel({ slides }: { slides: LearningSlide[] }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const slide = slides[slideIndex]
  const isFirst = slideIndex === 0
  const isLast = slideIndex === slides.length - 1

  return (
    <section className="carousel-section">
      <h2>{slide.section}</h2>
      <div className="carousel flex flex-row items-center">
        {!isFirst && (
          <button
            className="carousel-arrow"
            type="button"
            aria-label="Previous topic"
            onClick={() => setSlideIndex((index) => index - 1)}
          >
            ←
          </button>
        )}
        <div className="carousel-copy">
          <h3>{slide.heading}</h3>
          <p>{slide.body}</p>
        </div>
        <div className="figure-wrap">
          {figureDisplayer(slide.figure)}
          <span>{slide.figure}</span>
        </div>
        {!isLast && (
          <button
            className="carousel-arrow"
            type="button"
            aria-label="Next topic"
            onClick={() => setSlideIndex((index) => index + 1)}
          >
            →
          </button>
        )}
      </div>
    </section>
  )
}

function SpectrumWidget() {
  const [position, setPosition] = useState(0.55)
  const trackRef = useRef<HTMLDivElement>(null)
  const wavelength = Math.round(250 + position * 450)
  const color = getSpectrumColor(wavelength)
  const waveCycles = 2.2 + (1 - position) * 5

  const updatePosition = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const { left, width } = track.getBoundingClientRect()
    setPosition(Math.min(1, Math.max(0, (clientX - left) / width)))
  }

  const wavePath = (cycles: number, height: number) => {
    const points = Array.from({ length: 81 }, (_, index) => {
      const x = (index / 80) * 269
      const y = height - Math.sin((index / 80) * Math.PI * 2 * cycles) * 11
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    return points.join(' ')
  }

  return (
    <div className="spectrum-widget">
      <svg className="spectrum-waves" viewBox="0 0 300 78" role="img" aria-label="Wave diagram showing wavelength">
        <line className="wave-axis" x1="25" y1="62" x2="294" y2="62" />
        <line className="wave-axis" x1="25" y1="8" x2="25" y2="62" />
        <path d={wavePath(waveCycles, 35)} transform="translate(25, 0)" />
        <text className="wave-axis-label wave-y-label" x="8" y="39">amplitude</text>
        <text className="wave-axis-label" x="143" y="76">wavelength (nm)</text>
      </svg>
      <div
        ref={trackRef}
        className="spectrum-track"
        role="slider"
        tabIndex={0}
        aria-label="Sunlight wavelength"
        aria-valuemin={250}
        aria-valuemax={700}
        aria-valuenow={wavelength}
        onClick={(event) => updatePosition(event.clientX)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            const direction = event.key === 'ArrowRight' ? 1 : -1
            setPosition((value) => Math.min(1, Math.max(0, value + direction * 0.02)))
          }
        }}
      >
        <span className="ultraviolet-label">ultraviolet<br /><small>invisible</small></span>
        <button
          className="spectrum-marker"
          type="button"
          aria-label={`Set wavelength to ${wavelength} nanometres`}
          style={{ left: `${position * 100}%`, backgroundColor: color }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) updatePosition(event.clientX)
          }}
        />
      </div>
      <div className="spectrum-scale" aria-hidden="true">
        <span>250 nm</span>
        <span>violet</span>
        <span>blue</span>
        <span>green</span>
        <span>yellow</span>
        <span>red</span>
        <span>700 nm</span>
      </div>
      <p className="spectrum-reading">
        <strong>{wavelength} nm</strong> · <span style={{ color }}>{color}</span>
        <em>shorter wavelength = more energy</em>
      </p>
    </div>
  )
}

function getSpectrumColor(wavelength: number) {
  if (wavelength < 380) return 'ultraviolet'
  if (wavelength < 450) return 'violet'
  if (wavelength < 495) return 'blue'
  if (wavelength < 570) return 'green'
  if (wavelength < 590) return 'yellow'
  if (wavelength < 620) return 'orange'
  return 'red'
}

function VenusCloudWidget() {
  const [absorber, setAbsorber] = useState(0.25)
  const droplets = Array.from({ length: 28 }, (_, index) => ({
    cx: 18 + ((index * 37) % 264),
    cy: 18 + ((index * 53) % 164),
    r: 3 + (index % 3),
  }))
  const graphPath = Array.from({ length: 31 }, (_, index) => {
    const x = 26 + index * 8.3
    const wavelength = index / 30
    const dip = absorber * Math.exp(-wavelength * 9)
    const y = 22 + (dip * 33) + wavelength * 7
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')

  return (
    <div className="venus-widget">
      <div className="venus-cloud-panel">
        <svg viewBox="0 0 300 200" role="img" aria-label="Schematic of sunlight scattering through Venus clouds">
          <defs>
            <linearGradient id="venus-rays" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="7" y="7" width="286" height="186" fill="#fafafa" stroke="#bbb" />
          <g className="sunlight-rays">
            <path d="M50 0 L86 42 L42 91 L92 132 L50 200" stroke="#4d7cff" opacity={1 - absorber * 0.8} />
            <path d="M145 0 L170 45 L123 87 L178 129 L138 200" stroke="#40b866" />
            <path d="M240 0 L218 42 L262 82 L214 125 L250 200" stroke="#ee4949" />
            <path d="M78 0 L110 34 L76 74 L118 116 L93 160" stroke="#4d7cff" opacity={1 - absorber * 0.8} />
            <path d="M194 0 L177 43 L220 80 L183 120 L208 165" stroke="#ee4949" />
          </g>
          <g className="cloud-droplets">
            {droplets.map(({ cx, cy, r }, index) => (
              <circle key={index} cx={cx} cy={cy} r={r} />
            ))}
          </g>
          <g className="scattered-rays" opacity={0.75}>
            <path d="M145 92 L105 68 L69 83 L36 58" />
            <path d="M145 92 L190 67 L230 83 L276 53" />
            <path d="M112 130 L72 145 L41 128 L20 143" />
            <path d="M190 130 L224 148 L260 130 L290 143" />
          </g>
          <path className="escape-ray" d="M150 140 L128 104 L150 65 L137 8" />
          <text x="12" y="11">sunlight</text>
          <text x="212" y="190">cloud layer</text>
        </svg>
      </div>
      <div className="venus-controls">
        <label htmlFor="absorber-slider">amount of absorber in the top layer</label>
        <input
          id="absorber-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={absorber}
          onChange={(event) => setAbsorber(Number(event.target.value))}
        />
        <div className="venus-swatch-row">
          <span>planet colour</span>
          <span className="venus-swatch" style={{ backgroundColor: `hsl(52 25% ${100 - absorber * 18}%)` }} />
          <span>{Math.round(absorber * 100)}%</span>
        </div>
        <div className="reflectance-graph">
          <svg viewBox="0 0 280 72" role="img" aria-label="Schematic reflectance against wavelength graph">
            <line x1="25" y1="8" x2="25" y2="58" />
            <line x1="25" y1="58" x2="273" y2="58" />
            <path className="reflectance-curve" d={graphPath} />
            <text x="1" y="10">reflectance</text>
            <text x="210" y="70">wavelength</text>
          </svg>
          <span>schematic, not real data</span>
        </div>
      </div>
    </div>
  )
}

function MoleculeInteractionWidget() {
  const [wavelength, setWavelength] = useState(0.52)
  const isAbsorbed = Math.abs(wavelength - 0.62) < 0.08
  const remainingColor = getSpectrumColor(Math.round(250 + wavelength * 450))
  const beamColor = getVisibleColor(wavelength)
  const scatteredRays = Array.from({ length: 5 }, (_, index) => {
    const y = 44 + index * 19
    return `M 174 ${y} L 86 91`
  })

  return (
    <div className="molecule-widget">
      <div className="molecule-diagram">
        <svg viewBox="0 0 300 180" role="img" aria-label="Schematic of sunlight interacting with a molecule">
          <defs>
            <marker id="molecule-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" />
            </marker>
          </defs>
          <line className="molecule-beam" x1="10" y1="91" x2="72" y2="91" stroke={beamColor} markerEnd="url(#molecule-arrow)" />
          <text className="molecule-label" x="10" y="82">incoming beam</text>
          <circle className="molecule-core" cx="86" cy="91" r="13" />
          <circle className="molecule-core" cx="86" cy="91" r="5" />
          <text className="molecule-label" x="67" y="119">molecule</text>
          {isAbsorbed ? (
            <>
              <line className="absorption-line" x1="100" y1="91" x2="143" y2="91" markerEnd="url(#molecule-arrow)" />
              <g className="energy-ladder">
                <line x1="191" y1="137" x2="238" y2="137" />
                <line x1="191" y1="103" x2="238" y2="103" />
                <line x1="191" y1="69" x2="238" y2="69" />
                <line className="electron-step" x1="205" y1="137" x2="205" y2="69" markerEnd="url(#molecule-arrow)" />
                <circle cx="205" cy="69" r="4" />
                <text x="242" y="139">ground</text>
                <text x="242" y="71">excited</text>
              </g>
              <text className="interaction-result" x="150" y="34">absorbed, becomes heat</text>
            </>
          ) : (
            <>
              <g className="scatter-rays">
                {scatteredRays.map((path, index) => (
                  <path key={index} d={path} stroke={beamColor} markerEnd="url(#molecule-arrow)" />
                ))}
              </g>
              <text className="interaction-result" x="125" y="29">scattered</text>
              <g className="reflection-group">
                <circle cx="215" cy="97" r="7" />
                <circle cx="241" cy="77" r="7" />
                <circle cx="241" cy="117" r="7" />
                <path d="M241 77 L215 97 M241 117 L215 97" markerEnd="url(#molecule-arrow)" />
                <path d="M281 48 L248 77 M281 145 L248 117" markerEnd="url(#molecule-arrow)" />
              </g>
              <text className="interaction-result" x="224" y="169">reflection</text>
            </>
          )}
        </svg>
      </div>
      <div className="molecule-controls">
        <label htmlFor="molecule-wavelength">incoming wavelength</label>
        <input
          id="molecule-wavelength"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={wavelength}
          onChange={(event) => setWavelength(Number(event.target.value))}
        />
        <p className="molecule-reading">
          <strong>{Math.round(250 + wavelength * 450)} nm</strong>
          <span style={{ color: beamColor }}>{remainingColor}</span>
        </p>
        <div className="molecule-rainbow" aria-label="Wavelengths absorbed by the molecule">
          <span className={isAbsorbed ? 'absorbed' : ''} />
        </div>
        <p className="molecule-help">
          {isAbsorbed ? 'This wavelength matches the molecule.' : 'This wavelength does not match the molecule.'}
        </p>
      </div>
    </div>
  )
}

function getVisibleColor(position: number) {
  const hue = 270 - position * 270
  return `hsl(${hue} 85% 50%)`
}

function App() {
  return (
    <main className="report-page">
      <header className="site-header">
        <div className="site-header-inner">
          <a href="/" aria-label="APOD home">APOD Picture Explained!</a>
          <div>
            <p>APOD Assessment</p>
            <p>2S492103</p>
          </div>
        </div>
      </header>

      <article className="report flex flex-col gap-5">

        <section className='flex flex-col gap-5'>
          <h1>Why do planets shine light and how does Venus and Jupiter do it?</h1>
          <p className="intro">
            The bright lights in the night sky are not only stars. Some are planets. A star, like our Sun, makes its own light. A planet does not. Instead, a planet shines by reflecting starlight, which means bouncing it back out into space (NASA 2023c). For the planets of our Solar System, that starlight comes from the Sun. To understand how a planet does this, and why Venus and Jupiter look the way they do, it helps to start with what light is.
          </p>

        <LearningCarousel slides={reflectionLightSlides} />

          <h2>Planet Albedos</h2>
          <p>
            Scattering and absorption together decide how much of the sunlight hitting a planet is returned. The fraction a planet reflects is called its albedo. For Venus and Jupiter, their albedos are 0.77 (Williams 2024a), and 0.343 (Williams 2024b) respectively, so Venus and Jupiter reflect roughly 77% and 34.3% of the sunlight that reaches them and absorbs the rest. A planet’s albedo depends on the molecules in its atmosphere, the layer of gas around it, and on its surface. For Venus and Jupiter the key part is their clouds, which are collections of tiny droplets or ice crystals floating in the atmosphere. Clouds contain so many small particles that they scatter light very efficiently (NASA 2023b).
          </p>

        <LearningCarousel slides={reflectionPlanetsSlides}/>
          <h2>Conclusion</h2>
          <p>
            Venus and Jupiter shine for the same basic reason as every planet: molecules in their clouds scatter sunlight back to space. What differs is which molecules are present, and therefore which colors of sunlight are absorbed and which are sent back (NASA 2023c).
          </p>
        </section>


        <section>
          <h1>Why do Venus and Jupiter meet about once a year?</h1>
          
        </section>


        <section>
          <h1>Possibility for Life on Venus and Jupiter</h1>
          <p>
            Although environments on other planets in our solar system are harsh, a family of organisms called Extremophiles found in the harsh environments on Earth could prove an example of similar organisms on other planets. Table 1.0 shows the types of Extremophiles which have been found on Earth. If the Extremophiles can be found in extreme environments on Earth and there are similar environments in the solar system, there could be life present.
          </p>
          <figure className="report-placeholder-figure">
            <table className="extremophile-table">
              <caption>Table 1: Types of extremophiles</caption>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Condition tolerated</th>
                  <th scope="col">Earth environment where found</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thermophile</td>
                  <td>High temperature</td>
                  <td>Hot springs, deep-sea hydrothermal vents</td>
                </tr>
                <tr>
                  <td>Acidophile</td>
                  <td>High acidity</td>
                  <td>Acid mine drainage, volcanic hot springs</td>
                </tr>
                <tr>
                  <td>Halophile</td>
                  <td>High salt concentration</td>
                  <td>Salt lakes, the Dead Sea</td>
                </tr>
                <tr>
                  <td>Psychrophile</td>
                  <td>Low temperature</td>
                  <td>Polar sea ice, glaciers</td>
                </tr>
                <tr>
                  <td>Radiation-resistant</td>
                  <td>High radiation</td>
                  <td>Deserts, irradiated sites</td>
                </tr>
                <tr>
                  <td>Piezophile</td>
                  <td>High pressure</td>
                  <td>Deep-ocean trenches</td>
                </tr>
              </tbody>
            </table>
          </figure>

          <p>
            Extremophiles matter for the search for life because they widen what counts as habitable (Shrestha 2026). If life can function in wet and near-boiling temperatures or in acid strong enough to dissolve metal, then the Earth-like conditions we usually treat as the baseline may be only one of many niches (Shrestha 2026). They also change where we look. A planet whose surface is lethal may still have a pocket of tolerable conditions elsewhere.
          </p>

          <h2>Life on Venus</h2>
          <p>
            Venus looks an unlikely home for life. Its dense carbon dioxide atmosphere traps heat and exerts crushing pressure at the surface, which is far too extreme for life as we know it (NASA 2024a). Instead Venus’s upper atmosphere has conditions much closer to Earth’s, with temperatures below 100 °C and pressure of around one atmosphere (NASA 2024). Figure 4.0 shows how temperature and pressure change with altitude (Author Year), and why the cloud layer stands out. This is where extremophiles come in.
          </p>

          <figure className="report-placeholder-figure venus-atmosphere-figure">
            <VenusAltitudeProfile />
          </figure>

          <h3>Why Venus's upper atmosphere is a candidate</h3>
          <p>
            Several things make the cloud layer a plausible niche:
          </p>
          <ul className="report-bullets">
            <li>Temperature and pressure. Moderate altitudes are still within what many microbes tolerate, and well below the limits of known thermophiles (NASA 2024; Shrestha 2026).</li>
            <li>A suspended habitat. Microbes could live inside or on the surface of cloud droplets, in the way that microbes on Earth are found drifting in clouds (ICU 2022).</li>
            <li>Energy and a possible shield. Sunlight is abundant at cloud height. The clouds also contain unidentified particles that absorb ultraviolet light, and some researchers have speculated that these could be biological (Cooper 2024b).</li>
          </ul>

          <h3>Extremophiles and existence of phosphine on Venus</h3>
          <p>
            Phosphine is where the extremophile idea became testable. On Earth, it is a known metabolic product of anaerobic bacteria, which live without oxygen in places such as swamps, sewage plants, lake sediments and animal guts (East Asian Observatory 2020). Nothing else known on a rocky planet like Venus produces phosphine in significant amounts (East Asian Observatory 2020).
          </p>

          <h3>Jupiter's atmosphere</h3>
          <p>
            The 2020 proposal was that acid-loving, oxygen-avoiding microbes in the cloud droplets might do this, so that an atmosphere beneath the clouds might be the right place. East Asian Observatory 2020 gave a spectrum of phosphine from the original report to its current status (Author Year).
          </p>
          <figure className="report-placeholder-figure continuation-figure">
            <PhosphineFlowchart />
          </figure>

          <p>
            The detection itself failed to hold up, since follow-up observations with the James Clerk Maxwell Telescope and ALMA found no phosphine, although the original analysis is still contested (NASA 2023; Snelten et al. 2020).
          </p>

          <h2>Life on Jupiter</h2>
          <p>
            In spite of Venus's clouds potentially supporting life, could Jupiter? The answer is no. It falls because the Venus speculation depends on a cloud layer that is stable enough for microbes to stay in. Jupiter's atmosphere does not offer that.
          </p>

          <h3>Jupiter's atmosphere</h3>
          <p>
            Heat in Jupiter's atmosphere is caused by convection, in which hot material rises and cooler material sinks (Laboratory for Atmospheric and Space Physics 2026). The simplest kind of space atmosphere is strongly convective and churns constantly, and its rapid rotation adds fast winds and intense storms (NASA 2026b). Jupiter's research institute and its atmosphere suspended in a temporary layer would not stay there. Sinking currents would carry it down to regions where the temperature and pressure rise steeply, until life cannot tolerate, and there is no surface for it to land on or to recycle it back (NASA 2026i).
          </p>
          <p>
            On Venus, the proposed habitat is a layer above a solid planet in which droplets could in principle remain in a suitable condition for long periods. On Jupiter, a particle's time spent in a habitable layer is brief before it is dragged to destruction. Figure 4.2 shows the Venus cloud layer and Jupiter's atmosphere.
          </p>
          <figure className="report-placeholder-figure continuation-figure">
            <CloudHabitatDiagram />
          </figure>

          <p>
            The problem goes beyond the clouds. Jupiter is a Jovian planet, and the features of such a planet leave no plausible place for life to begin, let alone persist. Table 1.1 compares what life needs across Earth, Venus's clouds and Jupiter (Author Year), and the points below explain the entries for Jupiter.
          </p>
          <figure className="report-placeholder-figure">
            <div className="report-table-placeholder" aria-label="Table 1.1 placeholder" />
            <figcaption>Table 1.1: Types of extremophiles and their relevance to Venus and Jupiter (Author Year)</figcaption>
          </figure>

          <ul className="report-bullets">
            <li>No solid surface. Terrestrial planets can have rock, which allows volcanism and tectonics. These processes release gases trapped in the interior and replenish an atmosphere, and they can power hydrothermal vents, where water meets chemical energy (NASA 2026). Life on Earth probably began in such ocean environments, Jupiter has no rock surface for this because it gathers gas that is a cloud of hydrogen and helium with no rocky layer in its middle (NASA 2026, Laboratory for Atmospheric and Space Physics 2026).</li>
            <li>Space physics and jet streams. Habitability starts with liquid water being able to exist on a surface, which depends on temperature and atmospheric pressure (NASA 2024b). Jupiter has no surface for water to pool on, so there is no stable liquid environment.</li>
            <li>Where it does exist, lakes and rivers form chemistry to concentrate it (NASA 2026). Where it formed, Jovian planets form far from the Sun, beyond the point where water and other compounds freeze into ice, and there may accumulate large amounts of ice.</li>
            <li>Space physics: The Jovian planet composition described above, and the floating nature of its clouds, means there is no dense or stable niche in which life can remain.</li>
            <li>Extreme weather. Rapid rotation in a deep atmosphere produces intense storms positioned above, a poor setting for any delicate chemistry (Southeast Research Institute n.d.).</li>
          </ul>
        </section>
      </article>
    </main>
  )
}

export default App
