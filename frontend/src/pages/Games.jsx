import { useState } from 'react'
import { Lock, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MarioLevel from '../components/MarioLevel'

export default function Games() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [phase, setPhase] = useState('waiting')
  const [level, setLevel] = useState(null)

  const questions = t('game.questions', { returnObjects: true })

  const onStartLevelOne = () => {
    setLevel(1)
    setPhase('playing')
  }

  const onExitToLevelSelect = () => {
    setPhase('level-select')
  }

  if (phase === 'waiting') {
    return (
      <section className="retro-games py-8">
        <div className="retro-sky retro-pop mx-auto max-w-6xl p-5 md:p-8">
          <div className="game-box game-box-shell p-8 text-center md:p-12">
            <button type="button" className="exit-pixel" onClick={() => navigate('/')}>
              {t('game.exit')}
            </button>
            <p className="retro-label">{t('game.title')}</p>
            <h1 className="retro-title mt-4">{t('game.challengeTitle')}</h1>
            <p className="retro-sub mt-5">{t('game.intro')}</p>

            <button type="button" onClick={() => setPhase('level-select')} className="start-brick mt-8">
              <Sparkles size={18} /> {t('game.start')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (phase === 'level-select') {
    return (
      <section className="retro-games py-8">
        <div className="retro-sky retro-pop mx-auto max-w-5xl p-5 md:p-8">
          <div className="game-box game-box-shell p-8 md:p-12">
            <button type="button" className="exit-pixel" onClick={() => navigate('/')}>
              {t('game.exit')}
            </button>
            <h2 className="retro-title-sm">{t('game.levelSelect')}</h2>
            <p className="retro-sub mt-4">{t('game.levelHint')}</p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <button type="button" onClick={onStartLevelOne} className="warp-pipe pipe-open">
                <span className="pipe-level">{t('game.level', { number: 1 })}</span>
                <span className="pipe-body" />
              </button>

              <div className="warp-pipe pipe-locked">
                <span className="pipe-level">{t('game.level', { number: 2 })}</span>
                <span className="pipe-body" />
                <span className="pipe-lock">
                  <Lock size={16} /> {t('game.locked')}
                </span>
              </div>

              <div className="warp-pipe pipe-locked">
                <span className="pipe-level">{t('game.level', { number: 3 })}</span>
                <span className="pipe-body" />
                <span className="pipe-lock">
                  <Lock size={16} /> {t('game.locked')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (phase === 'playing' && level === 1) {
    return (
      <MarioLevel
        questions={questions}
        onExitLevel={onExitToLevelSelect}
        onExitHome={() => navigate('/')}
      />
    )
  }

  return null
}
