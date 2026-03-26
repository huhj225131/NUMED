import { useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Player from './Player'

const obstaclePositions = [26, 50, 74]
const CASTLE_IMAGE = 'https://placehold.co/760x260/3aa6ff/ffffff/png?text=VICTORY+CASTLE'

export default function MarioLevel({ questions, onExitLevel, onExitHome }) {
  const { t } = useTranslation()
  const [currentObstacle, setCurrentObstacle] = useState(0)
  const [playerState, setPlayerState] = useState('idle')
  const [showQuestion, setShowQuestion] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const [playerX, setPlayerX] = useState(6)
  const [playerY, setPlayerY] = useState(0)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [clearedObstacles, setClearedObstacles] = useState([false, false, false])
  const [hitObstacleIndex, setHitObstacleIndex] = useState(null)
  const [victory, setVictory] = useState(false)
  const [showDust, setShowDust] = useState(false)
  const [coinBurstIndex, setCoinBurstIndex] = useState(null)

  const timersRef = useRef([])

  const totalQuestions = questions.length
  const progress = ((currentObstacle + 1) / totalQuestions) * 100

  const currentQuestion = useMemo(() => questions[activeQuestionIndex], [questions, activeQuestionIndex])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => clearTimeout(timerId))
      timersRef.current = []
    }
  }, [])

  const schedule = (callback, delay) => {
    const timerId = setTimeout(callback, delay)
    timersRef.current.push(timerId)
  }

  const runToObstacle = (obstacleIndex) => {
    if (obstacleIndex >= totalQuestions || gameOver || victory || showQuestion) return

    const stopBeforeObstacleX = obstaclePositions[obstacleIndex] - 6
    setPlayerState('running')
    setShowDust(true)
    setPlayerX(stopBeforeObstacleX)

    schedule(() => {
      setShowDust(false)
      setPlayerState('jumping')
      setPlayerY(-36)

      // Ground-only collision: hop and bump obstacle while staying on same floor.
      schedule(() => {
        const collisionDetected = Math.abs(stopBeforeObstacleX - (obstaclePositions[obstacleIndex] - 6)) <= 1

        if (!collisionDetected) {
          setPlayerY(0)
          setPlayerState('idle')
          return
        }

        setHitObstacleIndex(obstacleIndex)

        schedule(() => {
          setPlayerY(0)
          setPlayerState('idle')
          setActiveQuestionIndex(obstacleIndex)
          setSelectedOption('')
          setAnswerCorrect(null)
          setShowQuestion(true)
        }, 220)
      }, 240)
    }, 1000)
  }

  const onAdvance = () => {
    if (showQuestion || gameOver || victory || playerState === 'running' || playerState === 'jumping') return
    runToObstacle(currentObstacle)
  }

  const onAnswer = (option) => {
    if (selectedOption) return
    setSelectedOption(option.key)
    setAnswerCorrect(option.correct === true)
  }

  const onContinueAfterAnswer = () => {
    if (answerCorrect === null) return

    if (!answerCorrect) {
      setShowQuestion(false)
      setGameOver(true)
      setPlayerState('dead')
      setPlayerY(88)
      setHitObstacleIndex(null)
      return
    }

    setClearedObstacles((prev) => {
      const next = [...prev]
      next[activeQuestionIndex] = true
      return next
    })

    setCoinBurstIndex(activeQuestionIndex)
    setShowQuestion(false)
    setHitObstacleIndex(null)

    const nextObstacle = activeQuestionIndex + 1

    if (nextObstacle >= totalQuestions) {
      setPlayerState('running')
      setShowDust(true)
      setPlayerX(92)
      schedule(() => {
        setShowDust(false)
        setPlayerState('celebrating')
        setVictory(true)
      }, 1000)
      return
    }

    setCurrentObstacle(nextObstacle)
    schedule(() => {
      setCoinBurstIndex(null)
      runToObstacle(nextObstacle)
    }, 420)
  }

  const onRestart = () => {
    setCurrentObstacle(0)
    setPlayerState('idle')
    setShowQuestion(false)
    setGameOver(false)
    setPlayerX(6)
    setPlayerY(0)
    setActiveQuestionIndex(0)
    setSelectedOption('')
    setAnswerCorrect(null)
    setClearedObstacles([false, false, false])
    setHitObstacleIndex(null)
    setVictory(false)
    setShowDust(false)
    setCoinBurstIndex(null)
  }

  const renderOptionClass = (option) => {
    if (!selectedOption) return 'option-idle'
    if (option.correct) return 'option-correct'
    if (selectedOption === option.key) return 'option-wrong'
    return 'option-disabled'
  }

  if (victory) {
    return (
      <section className="retro-games py-8">
        <div className="retro-sky retro-pop mx-auto max-w-5xl p-5 md:p-8">
          <div className="game-box game-box-shell p-8 text-center md:p-12">
            <button type="button" className="exit-pixel" onClick={onExitLevel}>
              {t('game.exit')}
            </button>
            <h2 className="retro-title mt-4">{t('game.victory')}</h2>
            <p className="retro-sub mt-4">{t('game.victoryDesc')}</p>
            <img src={CASTLE_IMAGE} alt="Lâu đài đích pixel" className="retro-castle mt-6" />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="pixel-button-muted" onClick={onRestart}>
                {t('game.restart')}
              </button>
              <button type="button" className="start-brick" onClick={onExitHome}>
                {t('game.home')}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="retro-games py-8">
      <div className="retro-sky retro-pop mx-auto max-w-6xl p-5 md:p-8">
        <div className="game-box game-box-shell p-6 md:p-10">
          <button type="button" className="exit-pixel" onClick={onExitLevel}>
            {t('game.exit')}
          </button>

          <div className="w-full max-w-4xl">
            <div className="retro-progress-head mb-3">
              <span>
                LEVEL 1 | {Math.min(currentObstacle + 1, totalQuestions)}/{totalQuestions}
              </span>
              <span>{Math.min(100, Math.round(progress))}%</span>
            </div>

            <div className="retro-health-hearts">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <span key={`heart-${idx}`} className={`heart-pixel ${idx <= currentObstacle ? 'heart-on' : ''}`}>
                  <Heart size={16} />
                </span>
              ))}
            </div>
          </div>

          <div className="platform-stage mt-6 w-full max-w-5xl">
            <div className="pixel-ground" />

            {obstaclePositions.map((position, index) => (
              <div
                key={`obstacle-${index}`}
                className={`obstacle-box ${
                  clearedObstacles[index] ? 'obstacle-cleared' : 'obstacle-question'
                } ${hitObstacleIndex === index ? 'obstacle-hit' : ''}`}
                style={{ left: `${position}%` }}
              >
                {!clearedObstacles[index] ? '?' : ''}
                {coinBurstIndex === index ? <span className="coin-burst" aria-hidden="true" /> : null}
              </div>
            ))}

            <div className="goal-flag">🏁</div>

            <div className="player-track transition-transform duration-1000 ease-linear" style={{ transform: `translateX(${playerX}%)` }}>
              <div
                className={`player-sprite ${
                  playerState === 'celebrating' ? 'player-win' : ''
                } ${playerState === 'dead' ? 'player-dead player-zap' : ''}`}
                style={{ transform: `translateY(${playerY}px)` }}
              >
                <Player state={playerState} />
              </div>
            </div>

            {showDust ? (
              <div className="dust-cloud" style={{ left: `${Math.max(2, playerX - 2)}%` }}>
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          {!showQuestion && !gameOver ? (
            <button type="button" className="start-brick mt-6" onClick={onAdvance}>
              <Sparkles size={16} /> {t('game.advance')}
            </button>
          ) : null}

          {gameOver ? (
            <div className="mt-6 w-full max-w-4xl rounded-none border-4 border-black bg-red-300 p-4 text-center">
              <p className="retro-title-sm text-red-700">{t('game.gameOver')}</p>
              <p className="retro-sub mt-2 text-red-900">{t('game.gameOverDesc')}</p>
              <button type="button" className="pixel-button-muted mt-4" onClick={onRestart}>
                {t('game.restart')}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {showQuestion ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm">
          <div className="quiz-card retro-transition w-full max-w-3xl p-5 md:p-6">
            <p className="quiz-index">{t('game.questionLabel', { id: currentQuestion.id })}</p>
            <h3 className="quiz-title mt-3">{currentQuestion.title}</h3>
            <p className="quiz-prompt mt-4">{currentQuestion.prompt}</p>

            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  disabled={Boolean(selectedOption)}
                  onClick={() => onAnswer(option)}
                  className={`option-block ${renderOptionClass(option)}`}
                >
                  <span className="option-key">{option.key}</span>
                  <span>{option.text}</span>
                  {selectedOption && option.correct ? <span className="coin-pop" aria-hidden="true" /> : null}
                </button>
              ))}
            </div>

            {selectedOption ? (
              <div
                className={`mt-5 rounded-none border-4 p-4 ${
                  answerCorrect ? 'border-green-900 bg-green-200' : 'border-red-900 bg-red-200'
                }`}
              >
                <p className={`secret-title ${answerCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {answerCorrect ? t('game.reveal') : t('game.wrongReveal')}
                </p>
                <p className="secret-text mt-3">{currentQuestion.explain}</p>
                <button type="button" className="start-brick mt-4" onClick={onContinueAfterAnswer}>
                  {answerCorrect ? t('game.continue') : t('game.close')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
