import Card from '../components/Card'
import { useTranslation } from 'react-i18next'

export default function Career() {
  const { t } = useTranslation()

  return (
    <section className="py-8">
      <Card>
        <h1 className="text-2xl font-bold text-white">{t('career.title')}</h1>
        <p className="mt-2 text-slate-300">{t('career.description')}</p>
      </Card>
    </section>
  )
}
