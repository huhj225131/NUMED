import { useState } from 'react'
import { Atom, CircleUserRound, Globe } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

const EXP_CAP = 200

export default function Navbar() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user, exp } = useAuth()
  const [openLogin, setOpenLogin] = useState(false)

  const level = Math.floor(exp / EXP_CAP) + 1
  const currentExp = exp % EXP_CAP

  const menuItems = [
    { path: '/', label: t('navbar.menu.explore'), end: true },
    { path: '/wiki', label: t('navbar.menu.wiki') },
    { path: '/games', label: t('navbar.menu.games') },
    { path: '/education', label: t('navbar.menu.university') },
    { path: '/community', label: t('navbar.menu.community') },
  ]

  return (
    <header className="sticky top-3 z-30 border border-slate-700/70 bg-slate-900/85 backdrop-blur-xl rounded-2xl">
      <nav className="w-full">
        <div className="w-full flex items-center justify-between px-6 py-4 gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-left hover:border-teal-400 shrink-0"
          >
            <span className="rounded-lg bg-teal-400/20 p-2 text-teal-300">
              <Atom size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-100">{t('common.brand')}</span>
              <span className="block text-xs text-slate-400">{t('common.brandTagline')}</span>
            </span>
          </button>

          <ul className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {menuItems.map((item) => (
              <li key={item.path} className="whitespace-nowrap">
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-teal-400/20 text-teal-200'
                        : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-4 shrink-0">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-700 px-3 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 whitespace-nowrap"
              onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
              aria-label={t('navbar.language.label')}
            >
              <Globe size={14} />
              {i18n.language === 'vi' ? 'VN' : 'EN'}
            </button>

            {!user ? (
              <button
                type="button"
                onClick={() => setOpenLogin(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-200 transition-colors hover:bg-slate-800"
                aria-label={t('auth.login')}
              >
                <CircleUserRound size={18} />
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-2 py-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/25 text-xs font-bold text-teal-100">
                  {user.name?.[0] ?? 'U'}
                </span>
                <div className="hidden leading-tight md:block">
                  <p className="text-xs font-semibold text-slate-100">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.role} • {user.university}</p>
                </div>
                <span className="hidden rounded border border-teal-400/50 bg-teal-400/10 px-2 py-0.5 text-[11px] font-semibold text-teal-200 whitespace-nowrap md:inline-flex">
                  {t('auth.expBadge', { level, current: currentExp })}
                </span>
              </div>
            )}
          </div>
        </div>

        <ul className="mt-1 flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {menuItems.map((item) => (
            <li key={`mobile-${item.path}`} className="shrink-0 whitespace-nowrap">
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-teal-400/20 text-teal-200'
                      : 'border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
    </header>
  )
}
