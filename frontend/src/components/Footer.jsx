import { useTranslation } from 'react-i18next'
import logoGd from '../images/gd.png'
import logoKhcn from '../images/khcn.png'
import logoNga from '../images/nga.png'
import logoRosatom from '../images/rosatom.png'

const collaboratorLogos = [
  { key: 'rosatom', src: logoRosatom },
  { key: 'russianCenter', src: logoNga },
  { key: 'moet', src: logoGd },
  { key: 'most', src: logoKhcn },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-12 border-t border-slate-800 bg-slate-950 px-6 py-12 text-center">
      <p className="text-2xl font-extrabold tracking-tight text-white">{t('footer.title')}</p>
      <p className="mx-auto mt-3 max-w-2xl text-slate-400">{t('footer.description')}</p>

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300/90">{t('footer.collaborators')}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
          {collaboratorLogos.map((logo) => (
            <div
              key={logo.key}
              className="flex h-24 w-44 items-center justify-center rounded-xl border border-slate-700/60 bg-white/95 p-3 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <img
                src={logo.src}
                alt={t(`footer.sponsors.${logo.key}`)}
                className="h-14 w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <hr className="my-8 border-slate-800" />
      <p className="text-sm text-slate-500">{t('footer.copyright')}</p>
    </footer>
  )
}
