import { CheckCircle2, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const COMMUNITY_JOIN_URL = 'https://zalo.me'

const personaImageModules = import.meta.glob('../images/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const personaImageByFilename = Object.fromEntries(
  Object.entries(personaImageModules).map(([path, url]) => [path.split('/').pop(), url])
)

export default function Community() {
  const { t } = useTranslation()

  const personas = t('community.personas', { returnObjects: true })
  const benefits = t('community.join.benefits', { returnObjects: true })

  const safePersonas = Array.isArray(personas) ? personas : []
  const safeBenefits = Array.isArray(benefits) ? benefits : []

  const getImageSrc = (persona) => {
    if (!persona?.image) {
      return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(persona?.name || 'NucleoHub')}&backgroundType=gradientLinear`
    }

    if (persona.image.startsWith('http://') || persona.image.startsWith('https://') || persona.image.startsWith('/')) {
      return persona.image
    }

    const filename = persona.image.split('/').pop()
    if (filename && personaImageByFilename[filename]) {
      return personaImageByFilename[filename]
    }

    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(persona.name)}&backgroundType=gradientLinear`
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(COMMUNITY_JOIN_URL)}`

  return (
    <section className="py-8 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white md:text-4xl">{t('community.title')}</h1>
        <p className="mt-3 text-slate-300 md:text-lg">{t('community.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {safePersonas.map((persona) => (
          <article
            key={persona.id}
            className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg shadow-slate-950/35"
          >
            <div className="flex h-full flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={getImageSrc(persona)}
                  alt={persona.name}
                  className="h-64 w-full object-cover md:h-full"
                  loading="lazy"
                />
              </div>

              <div className="space-y-3 p-5 md:w-2/3">
                <h2 className="text-xl font-semibold text-white">{persona.name}</h2>
                <p className="text-sm font-semibold text-teal-300">{persona.role}</p>
                <p className="text-sm text-slate-400">{persona.workplace}</p>

                <blockquote className="rounded-lg border border-slate-700/80 bg-slate-800/80 p-3 text-[15px] italic text-slate-100">
                  <p className="flex items-start gap-2">
                    <Quote className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                    <span>{persona.quote}</span>
                  </p>
                </blockquote>

                <p className="text-sm leading-6 text-slate-300">{persona.story}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="w-full rounded-2xl bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-900 p-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-2xl space-y-4">
            <h3 className="text-2xl font-bold text-white">{t('community.join.title')}</h3>
            <p className="text-slate-100/95">{t('community.join.description')}</p>

            <ul className="space-y-2">
              {safeBenefits.map((benefit, index) => (
                <li key={`${benefit}-${index}`} className="flex items-start gap-2 text-slate-50/95">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-200" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-center rounded-2xl bg-white p-4 shadow-2xl shadow-slate-950/40">
            <img src={qrSrc} alt="Community QR code" className="h-48 w-48 rounded-lg object-cover" loading="lazy" />
            <p className="mt-3 animate-pulse text-sm font-semibold text-teal-700">{t('community.join.scanText')}</p>
          </div>
        </div>
      </section>
    </section>
  )
}
