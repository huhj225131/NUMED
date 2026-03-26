import Card from '../components/Card'
import { useTranslation } from 'react-i18next'

export default function University() {
  const { t } = useTranslation()
  const universityList = t('university.items', { returnObjects: true })

  return (
    <section className="py-8">
      <Card>
        <h1 className="text-2xl font-bold text-white">{t('university.title')}</h1>
        <p className="mt-2 text-slate-300">{t('university.description')}</p>

        <div className="mt-5 grid gap-3">
          {universityList.map((school) => (
            <article key={school.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="font-semibold text-teal-200">{school.name}</p>
              <p className="mt-1 text-sm text-slate-300">{t('university.country')}: {school.country}</p>
              <p className="mt-1 text-sm text-slate-300">{t('university.focus')}: {school.focus}</p>
              <p className="mt-1 text-sm text-slate-400">{t('university.scholarship')}: {school.scholarshipHint}</p>
            </article>
          ))}
        </div>
      </Card>
    </section>
  )
}
