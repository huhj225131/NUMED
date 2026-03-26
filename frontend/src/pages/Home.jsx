import { useMemo, useState } from 'react'
import {
  Cpu,
  Medal,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import Card from '../components/Card'
import DailyQuests from '../components/DailyQuests'
import JourneyMap from '../components/JourneyMap'
import SkillTree from '../components/SkillTree'
import { useAuth } from '../context/AuthContext'
import atomIcon from '../images/atom.png'
import characterImg from '../images/character.png'
import heroBgImg from '../images/image.png'

export default function Home() {
  const { t } = useTranslation()
  const { progress } = useAuth()
  const [interest, setInterest] = useState('code')
  const [showJourney, setShowJourney] = useState(false)

  const matchOptions = useMemo(() => {
    const options = t('home.matchmaker.options', { returnObjects: true })
    return Object.keys(options ?? {})
  }, [t])

  const whyCards = useMemo(() => t('home.why.cards', { returnObjects: true }) ?? {}, [t])

  const whyIcons = {
    curiosity: Cpu,
    impact: ShieldCheck,
    future: Rocket,
  }

  const careerResult = useMemo(
    () => ({
      title: t(`home.matchmaker.results.${interest}.title`),
      detail: t(`home.matchmaker.results.${interest}.detail`),
    }),
    [interest, t],
  )

  return (
    <div className="space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-950 via-sky-950 to-teal-950 p-7 md:p-10 md:pr-72 lg:pr-80">
        <div className="relative z-10">
          <h1 className="mt-4 flex max-w-4xl items-center gap-3 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            <img src={atomIcon} alt="Atom icon" className="h-8 w-8 shrink-0 rounded-md object-contain md:h-10 md:w-10" />
            <span>{t('home.hero.title')}</span>
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setShowJourney(true)}>
              {t('home.hero.ctaExplore')}
              <Rocket className="ml-2" size={16} />
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-teal-400/30 bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
              <span>{t('home.progress.label')}</span>
              <span className="font-semibold text-teal-300">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-400" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-slate-300">
              <Medal size={14} className="text-amber-300" />
              {t('home.progress.badge')}
            </p>
          </div>
        </div>

        <img
          src={heroBgImg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[72%] w-[46%] object-contain opacity-75 md:block"
        />

        <img
          src={characterImg}
          alt="NuMed character"
          className="pointer-events-none absolute right-3 top-3 z-10 hidden h-56 w-56 object-contain drop-shadow-2xl md:block lg:right-5 lg:top-4 lg:h-72 lg:w-72"
        />
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-teal-500/30">
            <h2 className="text-xl font-bold text-white">{t('home.matchmaker.title')}</h2>
            <p className="mt-2 text-sm text-slate-300">{t('home.matchmaker.description')}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {matchOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setInterest(option)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    interest === option
                      ? 'border-teal-300 bg-teal-300/20 text-teal-100'
                      : 'border-slate-600 bg-slate-900/40 text-slate-300 hover:border-teal-400'
                  }`}
                >
                  {t(`home.matchmaker.options.${option}`)}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="font-semibold text-teal-200">{careerResult.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{careerResult.detail}</p>
            </div>
          </Card>

          <DailyQuests />
        </div>

        <Card>
          <h2 className="text-xl font-bold text-white">{t('home.why.title')}</h2>
          <div className="mt-4 grid gap-3">
            {Object.entries(whyCards).map(([key, card]) => {
              const Icon = whyIcons[key] || Sparkles

              return (
                <div key={key} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="flex items-center gap-2 font-semibold text-emerald-300">
                    <Icon size={16} /> {card.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{card.detail}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      <SkillTree />

      {showJourney && <JourneyMap onClose={() => setShowJourney(false)} />}
    </div>
  )
}
