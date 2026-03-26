import { useMemo, useState } from 'react'
import { Award, BookOpen, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FILTERS = [
  { key: 'all', code: 'ALL' },
  { key: 'vn', code: 'VN' },
  { key: 'ru', code: 'RU' },
]

const imageModules = import.meta.glob('../images/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const imageByFilename = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [path.split('/').pop(), url])
)

export default function Universities() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('ALL')

  const universities = t('universities', { returnObjects: true })
  const safeUniversities = Array.isArray(universities) ? universities : []

  const filteredUniversities = useMemo(() => {
    if (activeFilter === 'ALL') {
      return safeUniversities
    }

    return safeUniversities.filter((school) => school.countryCode === activeFilter)
  }, [activeFilter, safeUniversities])

  const resolveImageSrc = (imageValue) => {
    if (!imageValue) {
      return ''
    }

    if (imageValue.startsWith('http://') || imageValue.startsWith('https://') || imageValue.startsWith('/')) {
      return imageValue
    }

    const filename = imageValue.split('/').pop()
    return imageByFilename[filename] || ''
  }

  const getFlagIconSrc = (countryCode) => {
    if (!countryCode) {
      return ''
    }

    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
  }

  return (
    <section className="py-8">
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 lg:p-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-white md:text-3xl">{t('universitiesPage.title')}</h1>
          <p className="mt-2 text-slate-300">{t('universitiesPage.subtitle')}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.code

            return (
              <button
                key={filter.code}
                type="button"
                onClick={() => setActiveFilter(filter.code)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-teal-400/70 bg-teal-400/20 text-teal-100'
                    : 'border-slate-600 bg-slate-800/70 text-slate-200 hover:border-slate-400 hover:text-white'
                }`}
              >
                {t(`universitiesPage.filters.${filter.key}`)}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUniversities.map((school) => {
            const imageSrc = resolveImageSrc(school.image)
            const flagIconSrc = getFlagIconSrc(school.countryCode)

            return (
              <article
                key={school.id}
                className="group overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-lg shadow-slate-950/30 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-600/40 via-cyan-500/20 to-emerald-500/30">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={school.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center">
                      <p className="text-sm font-semibold text-white/85">{school.name}</p>
                    </div>
                  )}

                  <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-slate-100/20 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-slate-100 backdrop-blur-sm">
                    {flagIconSrc ? (
                      <img
                        src={flagIconSrc}
                        alt={`${school.country} flag`}
                        className="h-3.5 w-5 rounded-[2px] object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    {school.country}
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold text-white">{school.name}</h3>

                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      <span>
                        <strong className="text-slate-100">{t('universitiesPage.major')}: </strong>
                        {school.major}
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-100">{t('universitiesPage.fit')}: </strong>
                      {school.fit}
                    </p>
                    <p className="flex items-start gap-2 text-amber-100/95">
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      <span>
                        <strong className="text-amber-200">{t('universitiesPage.scholarship')}: </strong>
                        {school.scholarship}
                      </span>
                    </p>
                  </div>

                  <a
                    href={school.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-teal-400/45 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-100 transition-colors hover:bg-teal-400/20"
                  >
                    {t('universitiesPage.learnMore')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
