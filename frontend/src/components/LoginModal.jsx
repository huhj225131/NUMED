import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) {
    return null
  }

  const handleLogin = (event) => {
    event.preventDefault()
    login(email, password)
    onClose()
  }

  const handleQuickLogin = () => {
    login('demo@nucleohub.ai', 'demo')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/70 p-4 pt-16 md:pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{t('auth.modalTitle')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:border-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-slate-300" htmlFor="auth-email">
              {t('auth.email')}
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300" htmlFor="auth-password">
              {t('auth.password')}
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-teal-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            {t('auth.login')}
          </button>
        </form>

        <button
          type="button"
          onClick={handleQuickLogin}
          className="mt-3 w-full rounded-lg border border-teal-400/70 bg-teal-400/15 px-4 py-2.5 font-semibold text-teal-100 transition hover:bg-teal-400/25"
        >
          {t('auth.quickLogin')}
        </button>
      </div>
    </div>
  )
}
