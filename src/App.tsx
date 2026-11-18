import { useRef, useState } from 'react'
import CloudHabitatDiagram from '../CloudHabitatDiagram'
import KeplersFirstLawFigure from '../KeplersFirstLawFigure'
import LineOfSightWidget from '../LineOfSight'
import OrbitsInOneYearWidget from '../OrbitsInOneYear'
import PhosphineFlowchart from '../PhosphineFlowchart'
import VenusAltitudeProfile from '../VenusAltitudeProfile'


type LearningSlide = {
  section: string
  heading: string
  body: string
  figure: string
  id: number
}

const reflectionLightSlides: LearningSlide[] = [
  {
    section: 'What is Light?',
    heading: 'Spectrum of Light',
    body: 'Light is a form of energy that travels as electromagnetic waves, which are ripples of electric and magnetic fields moving through space (NASA 2010a). Different kinds of light differ in their wavelength, the distance from one wave peak to the next. The small part of this range that human eyes can detect is called visible light, and we see wavelength as color. The shortest visible wavelengths look violet, followed by blue, green, yellow and orange, and the longest look red (NASA 2010b). Shorter wavelengths also carry more energy than longer ones. Sunlight is a mixture of all these colors, plus light we cannot see. Just beyond violet is ultraviolet light, which has even shorter wavelengths (Figure 2.0).',
    figure: 'Figure 2.0: The spectrum of sunlight (“create an interactive diagram of the spectrum of sunlight and wavelength selection” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 1
  },
  {
    section: 'What is Light?',
    heading: 'Reflection of Light',
    body: 'When sunlight reaches a planet, its waves meet atoms, the tiny building blocks of all matter, and molecules, which are groups of atoms joined together. The waves make the electrons in these atoms and molecules vibrate, and the vibrating electrons give off new light in all directions (Nave 2016a). This is called scattering, which means light being redirected in many directions after hitting something. A planet contains an enormous number of atoms and molecules, and all of them scatter light at once. Their combined scattering sends part of the light back toward space, and this is what we call reflection (Figure 2.1).',
    figure: 'Figure 2.1: What happens when sunlight meets a molecule (“create an interactive diagram of sunlight scattering or being absorbed by a molecule” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 2
  },
  {
    section: 'What is Light?',
    heading: 'Absorpion of Light',
    body: 'Not all of the light is scattered, though. Atoms and molecules can also take in light, which is called absorption. They can only absorb light whose energy exactly matches a step their electrons can make between allowed energy levels, a bit like rungs on a ladder with no footholds in between (NASA 2010b). Since the energy of light depends on its wavelength, each type of molecule absorbs its own particular wavelengths and scatters the rest. Absorbed light is not sent back out, and its energy usually becomes heat. This is why materials have color. A molecule that absorbs blue light but scatters red light looks red, because red is the light that returns to our eyes (Figure 2.2) (Nave 2016b).',
    figure: 'Figure 2.1: What happens when sunlight meets a molecule (“create an interactive diagram of sunlight scattering or being absorbed by a molecule” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 2
  },
]

const reflectionPlanetsSlides: LearningSlide[] = [
  {
    section: 'How does Venus reflect light?',
    heading: 'Light reflecting in Venus',
    body: 'The atmosphere of Venus is mostly carbon dioxide, but what makes the planet shine is its clouds. These are made of tiny droplets of sulfuric acid, which scatter sunlight very effectively (Titov et al. 2018, p. 12). Sunlight entering the cloud is scattered by one droplet, then another, then another, a process called multiple scattering, until most of it has been sent back out to space. The clouds are so thick and opaque that the surface of Venus is completely hidden, so what we see from Earth is the top of the clouds (Figure 2.2) (NASA 2023b). ',
    figure: 'Figure 2.2: Venus’s clouds (“create an interactive diagram of sunlight scattering through Venus’s clouds and an unknown absorber” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 3
  },
  {
    section: 'How does Venus reflect light?',
    heading: 'Light reflecting in Venus',
    body: 'Venus is not perfectly white, though. It looks pale yellow, because something in its upper clouds absorbs some of the ultraviolet and blue light that would otherwise be reflected. Photographs taken in ultraviolet light show this clearly, with dark and bright patches moving across the cloud tops. Scientists have known about these patches for around a century but have not identified the substance responsible, so it is nicknamed the unknown absorber (Pérez-Hoyos et al. 2018, p. 147). Suggestions include compounds of iron and sulfur, and carbon-based molecules dissolved in the droplets. Whatever it turns out to be, it shows how even a small amount of a different molecule can change which wavelengths a planet absorbs and which it reflects. The energy it takes in also warms the clouds and affects how Venus’s atmosphere moves (Titov et al. 2018, p. 14).',
    figure: 'Figure 2.2: Venus’s clouds (“create an interactive diagram of sunlight scattering through Venus’s clouds and an unknown absorber” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 3
  },
  {
    section: 'How does Jupiter reflect light?',
    heading: 'Light reflecting in Jupiter',
    body: 'Jupiter is a gas giant, a huge planet made mostly of gas with no solid surface to land on. Its atmosphere is about 90% hydrogen molecules and 10% helium, with small amounts of methane, ammonia, hydrogen sulfide and water (NASA 2023a). These gases scatter very little visible light, so most of Jupiter’s reflected light comes from its clouds, which form in layers. The highest layer is made of ice crystals of ammonia, a molecule of nitrogen and hydrogen that freezes in Jupiter’s cold upper atmosphere. Below it is a layer of a compound called ammonium hydrosulfide, and deeper still is water (Guillot 1999, p. 1184). Ammonia ice crystals scatter all visible wavelengths strongly, so they look white. Where this ice is thick, it forms the pale bands called zones (Figure 2.3) (NASA 2023a).',
    figure: 'Figure 2.3: Jupiter’s cloud layers (“create an interactive diagram of Jupiter’s cloud layers and how they reflect light” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 4
  },
  {
    section: 'How does Jupiter reflect light?',
    heading: 'Light reflecting in Jupiter',
    body: "Jupiter’s darker bands, called belts, and its orange and brown colors come from other molecules that absorb part of the visible spectrum. Scientists call molecules that give color this way chromophores (Carlson, Baines & Ocampo 2016, p. 107). Jupiter’s chromophores are thought to be compounds of phosphorus, sulfur or carbon that change when ultraviolet light from the Sun strikes them, but their identity is still uncertain. A molecule that absorbs blue light would leave the red and brown light that we see. Where the white ammonia clouds are thin, we can see deeper clouds that contain these molecules. Where the white clouds are thick, they hide them (NASA 2023a).",
    figure: 'Figure 2.3: Jupiter’s cloud layers (“create an interactive diagram of Jupiter’s cloud layers and how they reflect light” prompt, Sonnet 5.5 from Anthropic, 18 November 2026, https://claude.ai/)',
    id: 4
  }
]

function figureDisplayer(figure: number) {

  var widget;

  if (figure === 1) {
    widget = <SpectrumWidget />;
  } else if (figure === 2) {
    widget = <MoleculeInteractionWidget />
  } else if (figure === 3) {
    widget = <VenusCloudWidget />
  } else if (figure === 4) {
    widget = <JupiterCloudWidget />
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
          {figureDisplayer(slide.id)}
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
  const [wavelength, setWavelength] = useState(520)
  const colorName = spectrumName(wavelength)
  const waveColor = wavelengthToHsl(wavelength)
  const wavePath = Array.from({ length: 141 }, (_, index) => {
    const x = 20 + index * 4
    const cycles = 520 / wavelength
    const y = 64 + 20 * Math.sin(index / 560 * Math.PI * 2 * (1 + cycles * 4))
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`
  }).join(' ')
  const strip = Array.from({ length: 90 }, (_, index) => 300 + index * 5)

  return (
    <figure className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900">
      <figcaption className="mb-2 text-xs font-semibold">The spectrum of sunlight</figcaption>
      <svg viewBox="0 0 600 190" className="h-auto w-full" role="img" aria-label="Wave and colour strip">
        <text x="20" y="14" className="fill-slate-500 text-[11px]">One wavelength = distance from peak to peak</text>
        <path d={wavePath} fill="none" stroke={waveColor} strokeWidth="3" />
        {strip.map((length) => (
          <rect
            key={length}
            x={20 + ((length - 300) / 450) * 560}
            y="120"
            width="7"
            height="26"
            fill={wavelengthToHsl(length)}
          />
        ))}
        <line
          x1={20 + ((wavelength - 300) / 450) * 560}
          x2={20 + ((wavelength - 300) / 450) * 560}
          y1="112"
          y2="154"
          stroke="#1b1d22"
          strokeWidth="2"
        />
        <text x="20" y="166" className="fill-slate-500 text-[11px]">ultraviolet</text>
        <text x={20 + (80 / 450) * 560} y="166" className="fill-slate-500 text-[11px]">violet</text>
        <text x={20 + (400 / 450) * 560} y="166" className="fill-slate-500 text-[11px]">red</text>
        <text x="20" y="184" className="fill-slate-500 text-[11px]">shorter wavelength, more energy</text>
        <text x="580" y="184" textAnchor="end" className="fill-slate-500 text-[11px]">longer wavelength, less energy</text>
      </svg>
      <div className="mt-2 flex items-center gap-3 text-xs">
        <label htmlFor="w1" className="font-medium">Wavelength</label>
        <input
          id="w1"
          className="min-w-32 flex-1 accent-slate-800"
          type="range"
          min="300"
          max="750"
          value={wavelength}
          onChange={(event) => setWavelength(Number(event.target.value))}
        />
        <span>{wavelength} nm: {colorName}</span>
      </div>
    </figure>
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
  const [absorber, setAbsorber] = useState(30)
  const amount = absorber / 100
  const droplets = Array.from({ length: 70 }, (_, index) => {
    let seed = 7 + index * 9301
    seed = (seed * 9301 + 49297) % 233280
    const x = ((seed % 233280) / 233280) * 580 + 10
    let seed2 = (seed * 9301 + 49297) % 233280
    const y = 60 + (seed2 / 233280) * 190
    return { x, y }
  })
  const graph = Array.from({ length: 41 }, (_, index) => {
    const wavelength = 300 + index * 10
    const x = 40 + ((wavelength - 300) / 400) * 540
    const y = 100 - (0.95 * (1 - amount * 0.9 / (1 + Math.exp((wavelength - 430) / 35))) * 80)
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`
  }).join(' ')

  return (
    <figure className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900">
      <figcaption className="mb-2 text-xs font-semibold">Venus’s clouds</figcaption>
      <svg viewBox="0 0 600 270" className="h-auto w-full" role="img" aria-label="Sunlight scattering among cloud droplets">
        <rect x="0" y="60" width="600" height="40" fill="#e0a020" fillOpacity={amount * 0.35} />
        <text x="8" y="56" className="fill-slate-500 text-[11px]">upper cloud layer, where the absorber sits</text>
        {droplets.map((drop, index) => (
          <circle key={index} cx={drop.x} cy={drop.y} r="8" fill="none" stroke="#5d6370" strokeOpacity=".45" />
        ))}
        {[
          ['#9a6bff', [[60,12],[85,80],[60,120],[100,170],[75,125],[120,90],[150,12]], 1],
          ['#3d6dff', [[210,12],[235,85],[205,130],[245,180],[225,135],[262,95],[290,12]], 0.9],
          ['#25a244', [[350,12],[375,80],[345,125],[385,175],[360,130],[400,90],[430,12]], 0.25],
          ['#e0463a', [[490,12],[510,75],[485,115],[525,160],[505,120],[540,85],[570,12]], 0.1],
        ].map(([color, points, factor]) => {
          const path = (points as number[][]).map((point) => point.join(',')).join(' ')
          return (
            <polyline
              key={String(color)}
              points={path}
              fill="none"
              stroke={String(color)}
              strokeWidth="3"
              opacity={Math.max(1 - amount * Number(factor), 0.04)}
            />
          )
        })}
        <text x="60" y="262" className="fill-slate-700 text-xs">ultraviolet</text>
        <text x="215" y="262" className="fill-slate-700 text-xs">blue</text>
        <text x="352" y="262" className="fill-slate-700 text-xs">green</text>
        <text x="495" y="262" className="fill-slate-700 text-xs">red</text>
      </svg>
      <svg viewBox="0 0 600 130" className="mt-1 h-auto w-full" role="img" aria-label="Schematic reflectance graph">
        <path d={graph} fill="none" stroke="#2b5fc7" strokeWidth="3" />
        <line x1="40" x2="580" y1="102" y2="102" stroke="#5d6370" />
        <text x="40" y="118" className="fill-slate-500 text-[11px]">ultraviolet</text>
        <text x="580" y="118" textAnchor="end" className="fill-slate-500 text-[11px]">red</text>
        <text x="44" y="12" className="fill-slate-500 text-[11px]">light reflected (schematic, not real data)</text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        <label htmlFor="a3">Unknown absorber in top layer</label>
        <input id="a3" className="min-w-32 flex-1 accent-slate-800" type="range" min="0" max="100" value={absorber} onChange={(event) => setAbsorber(Number(event.target.value))} />
        <span>Planet colour:
          <span className="ml-2 inline-block h-4 w-8 rounded border border-slate-300" style={{ backgroundColor: `rgb(${255 * (1 - 0.1 * amount)}, ${255 * (1 - 0.25 * amount)}, ${255 * (1 - 0.9 * amount)})` }} />
        </span>
      </div>
    </figure>
  )
}

function MoleculeInteractionWidget() {
  const [wavelength, setWavelength] = useState(470)
  const [molecule, setMolecule] = useState('none')
  const bands: Record<string, number[][]> = {
    none: [],
    blue: [[430, 500]],
    red: [[600, 700]],
    uvb: [[380, 490]],
  }
  const absorbed = bands[molecule].some(([low, high]) => wavelength >= low && wavelength <= high)
  const beamColor = wavelengthToHsl(wavelength)

  let remaining = [0, 0, 0]
  let total = [0, 0, 0]
  for (let length = 380; length <= 700; length += 5) {
    const rgb = wavelengthToRgb(length)
    const isAbsorbed = bands[molecule].some(([low, high]) => length >= low && length <= high)
    rgb.forEach((value, index) => {
      total[index] += value
      if (!isAbsorbed) remaining[index] += value
    })
  }
  const returnedColor = `rgb(${remaining.map((value, index) => Math.round(255 * value / total[index])).join(',')})`

  return (
    <figure className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900">
      <figcaption className="mb-2 text-xs font-semibold">What happens when sunlight meets a molecule</figcaption>
      <svg viewBox="0 0 600 260" className="h-auto w-full" role="img" aria-label="Light scattered or absorbed by a molecule">
        <line x1="30" y1="110" x2="276" y2="110" stroke={beamColor} strokeWidth="4" />
        <text x="30" y="98" className="fill-slate-500 text-[11px]">sunlight</text>
        <circle cx="300" cy="110" r="22" fill="#8a909c" />
        <circle cx="286" cy="118" r="10" fill="#aab0bb" />
        <circle cx="314" cy="102" r="10" fill="#aab0bb" />
        {absorbed ? (
          <>
            <text x="300" y="160" textAnchor="middle" className="fill-slate-700 text-sm">absorbed: energy becomes heat</text>
            <circle cx="495" cy="94" r="6" fill="#2b5fc7" />
            <line x1="470" y1="146" x2="470" y2="100" stroke="#2b5fc7" strokeDasharray="3 3" />
          </>
        ) : (
          <>
            {[-150,-110,-60,-25,25,60,110,150].map((degrees) => {
              const radians = degrees * Math.PI / 180
              return <line key={degrees} x1={300 + 26 * Math.cos(radians)} y1={110 + 26 * Math.sin(radians)} x2={300 + 90 * Math.cos(radians)} y2={110 + 90 * Math.sin(radians)} stroke={beamColor} strokeWidth="3" />
            })}
            <text x="300" y="22" textAnchor="middle" className="fill-slate-700 text-sm">scattered in many directions; many molecules together = reflection</text>
            <circle cx="495" cy="150" r="6" fill="#2b5fc7" />
          </>
        )}
        {[0,1,2].map((index) => (
          <line key={index} x1="450" x2="540" y1={150 - index * 28} y2={150 - index * 28} stroke="#5d6370" strokeWidth="2" />
        ))}
        <text x="450" y="172" className="fill-slate-500 text-[11px]">energy levels</text>
        {Array.from({ length: 65 }, (_, index) => {
          const length = 380 + index * 5
          const isAbsorbed = bands[molecule].some(([low, high]) => length >= low && length <= high)
          return <rect key={length} x={40 + ((length - 380) / 320) * 520} y="204" width="8.4" height="16" fill={isAbsorbed ? '#6b707a' : wavelengthToHsl(length)} />
        })}
        <path d={`M${40 + ((wavelength - 380) / 320) * 520 - 6} 198 L${40 + ((wavelength - 380) / 320) * 520 + 6} 198 L${40 + ((wavelength - 380) / 320) * 520} 206Z`} fill="#1b1d22" />
        <text x="40" y="240" className="fill-slate-500 text-[11px]">violet</text>
        <text x="560" y="240" textAnchor="end" className="fill-slate-500 text-[11px]">red</text>
        <text x="300" y="240" textAnchor="middle" className="fill-slate-500 text-[11px]">grey = absorbed</text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        <label htmlFor="m2">Molecule</label>
        <select id="m2" className="rounded border border-slate-300 bg-white px-2 py-1" value={molecule} onChange={(event) => setMolecule(event.target.value)}>
          <option value="none">Absorbs no visible light</option>
          <option value="blue">Absorbs blue light</option>
          <option value="red">Absorbs red light</option>
          <option value="uvb">Absorbs ultraviolet and blue</option>
        </select>
        <input id="w2" className="min-w-32 flex-1 accent-slate-800" type="range" min="380" max="700" value={wavelength} aria-label="Wavelength" onChange={(event) => setWavelength(Number(event.target.value))} />
        <span>{wavelength} nm: {spectrumName(wavelength)}</span>
      </div>
      <div className="mt-2 text-xs">Colour that returns:
        <span className="ml-2 inline-block h-4 w-8 rounded border border-slate-300 align-middle" style={{ backgroundColor: returnedColor }} />
      </div>
    </figure>
  )
}

function JupiterCloudWidget() {
  const [zone, setZone] = useState(true)
  const bandTop = zone ? 70 : 94
  const bandBottom = zone ? bandTop + 70 : bandTop + 24

  return (
    <figure className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900">
      <figcaption className="mb-2 text-xs font-semibold">Jupiter’s cloud layers</figcaption>
      <svg viewBox="0 0 600 300" className="h-auto w-full" role="img" aria-label="Cutaway of Jupiter cloud layers">
        <text x="10" y="26" className="fill-slate-500 text-[11px]">sunlight</text>
        <rect x="0" y={bandTop} width="600" height={bandBottom - bandTop} fill="#f4f4f1" />
        <rect x="0" y={bandBottom} width="600" height="70" fill="#d9b98a" />
        <rect x="0" y={bandBottom + 70} width="600" height="70" fill="#7fb3d9" />
        {!zone && <rect x="0" y={bandBottom} width="600" height="14" fill="#b5651d" fillOpacity=".75" />}
        <text x="10" y={bandTop + 16} className="fill-slate-800 text-xs">Ammonia ice crystals (colourless, scatter all colours)</text>
        <text x="10" y={bandBottom + (zone ? 20 : 34)} className="fill-slate-800 text-xs">Ammonium hydrosulfide</text>
        <text x="10" y={bandBottom + 90} className="fill-slate-800 text-xs">Water</text>
        {!zone && (
          <text x="590" y={bandBottom + 11} textAnchor="end" className="fill-white text-[11px]">
            chromophore molecules (identity uncertain)
          </text>
        )}
        {[[170,'#3d6dff'],[300,'#25a244'],[430,'#e0463a']].map(([x, color]) => {
          const startX = Number(x)
          if (zone) {
            return <polyline key={String(color)} points={`${startX},12 ${startX + 40},${bandTop} ${startX + 80},12`} fill="none" stroke={String(color)} strokeWidth="3" />
          }
          if (color === '#3d6dff') {
            return (
              <g key={String(color)}>
                <polyline points={`${startX},12 ${startX + 40},${bandBottom + 4}`} fill="none" stroke={String(color)} strokeWidth="3" />
                <text x={startX + 34} y={bandBottom + 12} className="fill-white text-base">x</text>
              </g>
            )
          }
          return <polyline key={String(color)} points={`${startX},12 ${startX + 40},${bandBottom + 4} ${startX + 80},12`} fill="none" stroke={String(color)} strokeWidth="3" />
        })}
        <text x="590" y="292" textAnchor="end" className="fill-slate-500 text-[11px]">
          {zone ? 'Zone: thick ice reflects everything at the top' : 'Belt: thin ice lets light reach molecules that absorb blue'}
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        <button type="button" aria-pressed={zone} onClick={() => setZone(true)} className={`rounded border px-3 py-1 ${zone ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'}`}>Zone</button>
        <button type="button" aria-pressed={!zone} onClick={() => setZone(false)} className={`rounded border px-3 py-1 ${!zone ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'}`}>Belt</button>
        <span>Returned light:
          <span className="ml-2 inline-block h-4 w-8 rounded border border-slate-300 align-middle" style={{ backgroundColor: zone ? '#f4f4f1' : '#c98a5b' }} />
        </span>
      </div>
    </figure>
  )
}

function wavelengthToHsl(wavelength: number) {
  if (wavelength < 380) return '#8d7bb5'
  if (wavelength > 700) return '#a07070'
  const hue = 270 - ((wavelength - 380) / 320) * 270
  return `hsl(${hue} 100% 50%)`
}

function wavelengthToRgb(wavelength: number) {
  const hue = 270 - ((wavelength - 380) / 320) * 270
  return [0, 8, 4].map((offset) => {
    const k = (offset + hue / 30) % 12
    return 255 * (0.5 - 0.5 * Math.max(-1, Math.min(k - 3, 9 - k, 1)))
  })
}

function spectrumName(wavelength: number) {
  if (wavelength < 380) return 'ultraviolet (invisible)'
  if (wavelength < 450) return 'violet'
  if (wavelength < 495) return 'blue'
  if (wavelength < 570) return 'green'
  if (wavelength < 590) return 'yellow'
  if (wavelength < 620) return 'orange'
  if (wavelength <= 700) return 'red'
  return 'infrared (invisible)'
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
            <p>z5492103</p>
          </div>
        </div>
      </header>

      <article className="report flex flex-col gap-5">
        <section className="intro-section flex flex-col gap-2">
          <h1>Introduction</h1>
          <figure className="intro-figure">
            <img src="/assets/apod_poc.jpg" alt="Venus and Jupiter above a sunset horizon" />
            <figcaption>Figure 1.0: Venus and Jupiter on the horizon (Casado 2019)</figcaption>
          </figure>

          <div>
            <h2>What’s happening in this picture?</h2>
            <p>
              On November 26, 2019, Juan Carlos Casodo captured both Venus and Jupiter visibly together in conjunction in the sky (figure 1.0). Can you see where exactly they are? This might surprise you but, in the picture, the two brightest lights along the horizon is actually Venus and Jupiter!
            </p>
          </div>
          
          <p>
            The lights in the night sky aren’t just stars but can also include planets too! Venus and Jupiter’s conjunctions happen almost every year where they can be seen close in the sky together! The next time they can be seen together on the horizon is 26/08/2027 (Rao 2025) and in recent years scientists have discovered on Venus that we might not be the only life in our solar system!
          </p>

          <div>
            <p>You might now be asking:</p>
            <ol className="report-bullets">
              <li>“How can planets possibly shine light?”</li>
              <li>“Why does Venus and Jupiter’s conjunctions happen almost every year?”</li>
              <li>“Venus is an uninhabitable planet! How can there possibly be life on Venus?”</li>
            </ol>
          </div>

          <div>
          <p>Let’s answer each of them!</p>
            <ol className="report-bullets">
              <li>Why do planets shine light and how do Venus and Jupiter do it?</li>
              <li>Why do Venus and Jupiter have a conjunction every year?</li>
              <li>The possibility of life on different planets</li>
            </ol>
          </div>
        </section>
        
        <section className='flex flex-col gap-5'>
          <div>
            <h1>Why do planets shine light and how does Venus and Jupiter do it?</h1>
            <p className="intro">
              The bright lights in the night sky are not only stars. Some are planets. A star, like our Sun, makes its own light. A planet does not. Instead, a planet shines by reflecting starlight, which means bouncing it back out into space (NASA 2023c). For the planets of our Solar System, that starlight comes from the Sun. To understand how a planet does this, and why Venus and Jupiter look the way they do, it helps to start with what light is.
            </p>
          </div>

          <div>
            <LearningCarousel slides={reflectionLightSlides} />
            <h2>Planet Albedos</h2>
            <p>
              Scattering and absorption together decide how much of the sunlight hitting a planet is returned. The fraction a planet reflects is called its albedo. For Venus and Jupiter, their albedos are 0.77 (Williams 2024a), and 0.343 (Williams 2024b) respectively, so Venus and Jupiter reflect roughly 77% and 34.3% of the sunlight that reaches them and absorbs the rest. A planet’s albedo depends on the molecules in its atmosphere, the layer of gas around it, and on its surface. For Venus and Jupiter the key part is their clouds, which are collections of tiny droplets or ice crystals floating in the atmosphere. Clouds contain so many small particles that they scatter light very efficiently (NASA 2023b).
            </p>
          </div>

        <LearningCarousel slides={reflectionPlanetsSlides}/>
          <div>
            <h2>Conclusion</h2>
            <p>
              Venus and Jupiter shine for the same basic reason as every planet: molecules in their clouds scatter sunlight back to space. What differs is which molecules are present, and therefore which colors of sunlight are absorbed and which are sent back (NASA 2023c).
            </p>
          </div>
        </section>


        <section className="conjunction-section flex flex-col gap-2">
          <div>  
            <h1>Why do Venus and Jupiter meet about once a year?</h1>
            <p>
              Every so often, the two brightest planets in the sky, Venus and Jupiter, drift close enough together to look like a pair of glowing dots. Astronomers call this a conjunction. A conjunction is when two or more planets appear in nearly the same direction in the sky as seen from Earth (NASA 2021). They do not need to overlap; they only need to look close together.
            </p>
            <p>
              From space, the planets are still hundreds of millions of kilometres apart. What has happened is that Earth, Venus, and Jupiter have lined up, so from Earth we look along nearly the same line of sight at both planets. The closeness is a trick of perspective, like holding your thumb up so it appears to touch a distant mountain.
            </p>
            <figure className="report-placeholder-figure conjunction-figure">
              <LineOfSightWidget />
            </figure>
            <p>
            To find out how often a conjunction happens, we need to ask how often Venus and Jupiter appear in the same direction from Earth. We need to know how long each planet, including Earth, takes to go around the Sun. Kepler&apos;s Third Law gives us that, but first it helps to understand his First Law.
            </p>
          </div>

          <div>
            <h2>Kepler&apos;s First Law</h2>
            <p>
              Kepler&apos;s First Law says that planets move around the Sun along an elliptical path called an orbit, which is a squished circle (Stern 2004). The Sun sits at one of two special points inside the ellipse called foci, not at its centre.
            </p>
            <KeplersFirstLawFigure />
            <ul className="report-bullets">
              <li>The semi-major axis is half of the ellipse&apos;s longest width.</li>
              <li>The semi-minor axis is half of the ellipse&apos;s shortest width.</li>
            </ul>
            <p>
              The orbits of Venus and Jupiter are only slightly squashed, so the semi-major axis is very close to each planet&apos;s average distance from the Sun.
            </p>
          </div>

          <div>
            <h2>Kepler&apos;s Third Law: why the planets move at different speeds</h2>
            <p>
              Kepler&apos;s Third Law links how far a planet is from the Sun to how long it takes to orbit (Stern 2004). It says that the square of a planet&apos;s orbital period, T, is proportional to the cube of its semi-major axis, a:
            </p>
            <p className="law-equation">T² = ka³</p>
            <ul className="report-bullets">
              <li>a is the semi-major axis, measured in astronomical units (AU).</li>
              <li>T is the period, the time taken to complete a single orbit, measured in years.</li>
              <li>k is the proportionality constant that relates T² to a³ for planets orbiting a star.</li>
            </ul>
            <p>
              Planets further out take longer to go around and move more slowly along their path. Newton&apos;s version of the law builds on Kepler&apos;s and lets us calculate the periods (Nave n.d.):
            </p>
          <p className="law-equation">T² = 4π²a³ / [G(M + m)]</p>
          <ul className="report-bullets">
            <li>T is the orbital period in seconds.</li>
            <li>a is the semi-major axis in metres (1 AU = 1.496 × 10¹¹ m) (Williams 2024c).</li>
            <li>G is the gravitational constant, 6.674 × 10⁻¹¹ m³ kg⁻¹ s⁻² (NIST 2018).</li>
            <li>M is the mass of the Sun, 1.989 × 10³⁰ kg (Williams 2024c).</li>
            <li>m is the mass of the planet.</li>
          </ul>
          </div>

          <div>
          <h2>Calculating the periods of Venus and Jupiter</h2>
          <p>
            Venus has a semi-major axis of 0.723 AU, or 1.082 × 10¹¹ m, and a mass of 4.867 × 10²⁴ kg (Williams 2024a). This gives T² ≈ 3.76 × 10¹⁴ s², so T ≈ 1.94 × 10⁷ s, about 224.5 days or 0.615 years.
          </p>
          <p>
            Jupiter has a semi-major axis of 5.203 AU, or 7.784 × 10¹¹ m, and a mass of 1.898 × 10²⁷ kg (Williams 2024b). This gives T² ≈ 1.40 × 10¹⁷ s², so T ≈ 3.74 × 10⁸ s, about 4,332 days or 11.86 years.
          </p>
          <p>
            These match the simpler form T² = a³, with T in years and a in AU, where k = 1. This shows Kepler&apos;s Third Law at work.
          </p>
          </div>

          <div>
            <h2>How far each planet travels in one Earth year</h2>
            <p>A full lap is 360°.</p>
            <ul className="report-bullets">
              <li>Jupiter: 360° ÷ 11.86 ≈ 30° per year, only about one-twelfth of the way around.</li>
              <li>Venus: 360° ÷ 0.615 ≈ 586° per year, about 1.6 laps.</li>
            </ul>
            <figure className="report-placeholder-figure conjunction-figure">
              <OrbitsInOneYearWidget />
            </figure>
            <p>
              Venus is a fast runner on the inside track, and Jupiter is a slow walker on the outside. Jupiter acts almost like a fixed backdrop while Venus keeps sweeping past its direction.
            </p>
          </div>

          <div>
            <h2>Venus and Jupiter conjunctions and synodic periods</h2>
            <p>
              This is important because, when Jupiter is within the range where a Venus-Jupiter conjunction might occur and can be seen from Earth, Venus may quickly move out of alignment. However, the range creates multiple opportunities for Venus to move into alignment with Jupiter and Earth, allowing a conjunction to occur.
            </p>
            <p>
              Therefore, the period during which Earth and Jupiter are positioned so that Jupiter is within the zone where Venus-Jupiter conjunctions can occur can be found by calculating Earth and Jupiter&apos;s synodic period. The synodic period is the time taken for two planets orbiting the same mass to return to the same relative positions. For Earth and Jupiter, it is the time taken for Jupiter to return to the same position in the sky as seen from Earth.
            </p>
          </div>
        </section>


        <section className='flex flex-col gap-2'>
          <div>
            <h1>Possibility for Life on Venus and Jupiter</h1>
            <p>
              Although environments on other planets in our solar system are harsh, a family of organisms called Extremophiles found in the harsh environments on Earth could prove an example of similar organisms on other planets. Table 1.0 shows the types of Extremophiles which have been found on Earth. If the Extremophiles can be found in extreme environments on Earth and there are similar environments in the solar system, there could be life present.
            </p>
          <figure className="report-placeholder-figure">
            <table className="extremophile-table">
              <caption>Table 1.0: Types of extremophiles</caption>
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
          </div>

          <div>
            <h2>Life on Venus</h2>
            <p>
              Venus looks an unlikely home for life. Its dense carbon dioxide atmosphere traps heat and exerts crushing pressure at the surface, which is far too extreme for life as we know it (NASA 2024a). Instead Venus’s upper atmosphere has conditions much closer to Earth’s, with temperatures below 100 °C and pressure of around one atmosphere (NASA 2024). Figure 4.0 shows how temperature and pressure change with altitude, and why the cloud layer stands out. This is where extremophiles come in.
            </p>

            <figure className="report-placeholder-figure venus-atmosphere-figure">
              <VenusAltitudeProfile />
            </figure>
          </div>

          <div>
          <h3>Why Venus's upper atmosphere is a candidate</h3>
          <p>
            Several things make the cloud layer a plausible niche:
          </p>
          <ul className="report-bullets">
            <li>Temperature and pressure. Moderate altitudes are still within what many microbes tolerate, and well below the limits of known thermophiles (NASA 2024; Shrestha 2026).</li>
            <li>A suspended habitat. Microbes could live inside or on the surface of cloud droplets, in the way that microbes on Earth are found drifting in clouds (ICU 2022).</li>
            <li>Energy and a possible shield. Sunlight is abundant at cloud height. The clouds also contain unidentified particles that absorb ultraviolet light, and some researchers have speculated that these could be biological (Cooper 2024b).</li>
          </ul>
          </div>

          <div>
            <h3>Extremophiles and existence of phosphine on Venus</h3>
            <p>
              Phosphine is where the extremophile idea became testable. On Earth, it is a known metabolic product of anaerobic bacteria, which live without oxygen in places such as swamps, sewage plants, lake sediments and animal guts (East Asian Observatory 2020). Nothing else known on a rocky planet like Venus produces phosphine in significant amounts (East Asian Observatory 2020).
            </p>
          </div>

          <div> 
            <h3>Jupiter's atmosphere</h3>
            <p>
              The 2020 proposal was that acid-loving, oxygen-avoiding microbes in the cloud droplets might do this, so that an atmosphere beneath the clouds might be the right place. East Asian Observatory 2020 gave a spectrum of phosphine from the original report to its current status.
            </p>
            <figure className="report-placeholder-figure continuation-figure">
              <PhosphineFlowchart />
            </figure>

            <p>
              The detection itself failed to hold up, since follow-up observations with the James Clerk Maxwell Telescope and ALMA found no phosphine, although the original analysis is still contested (NASA 2023; Snelten et al. 2020).
            </p>
          </div>

          <div>
            <h2>Life on Jupiter</h2>
            <p>
              In spite of Venus's clouds potentially supporting life, could Jupiter? The answer is no. It falls because the Venus speculation depends on a cloud layer that is stable enough for microbes to stay in. Jupiter's atmosphere does not offer that.
            </p>
          </div>

          <div>
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
              The problem goes beyond the clouds. Jupiter is a Jovian planet, and the features of such a planet leave no plausible place for life to begin, let alone persist, and the points below explain the entries for Jupiter.
            </p>

          <ul className="report-bullets">
            <li>No solid surface. Terrestrial planets can have rock, which allows volcanism and tectonics. These processes release gases trapped in the interior and replenish an atmosphere, and they can power hydrothermal vents, where water meets chemical energy (NASA 2026). Life on Earth probably began in such ocean environments, Jupiter has no rock surface for this because it gathers gas that is a cloud of hydrogen and helium with no rocky layer in its middle (NASA 2026, Laboratory for Atmospheric and Space Physics 2026).</li>
            <li>Space physics and jet streams. Habitability starts with liquid water being able to exist on a surface, which depends on temperature and atmospheric pressure (NASA 2024b). Jupiter has no surface for water to pool on, so there is no stable liquid environment.</li>
            <li>Where it does exist, lakes and rivers form chemistry to concentrate it (NASA 2026). Where it formed, Jovian planets form far from the Sun, beyond the point where water and other compounds freeze into ice, and there may accumulate large amounts of ice.</li>
            <li>Space physics: The Jovian planet composition described above, and the floating nature of its clouds, means there is no dense or stable niche in which life can remain.</li>
            <li>Extreme weather. Rapid rotation in a deep atmosphere produces intense storms positioned above, a poor setting for any delicate chemistry (Southeast Research Institute n.d.).</li>
          </ul>
          </div>
        </section>
      </article>
    </main>
  )
}

export default App
