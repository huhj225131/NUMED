import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Player from './Player'

const obstaclePositions = [26, 50, 74]
const CASTLE_IMAGE = 'https://placehold.co/760x260/3aa6ff/ffffff/png?text=VICTORY+CASTLE'

const HARD_WRONG_FEEDBACK_VI = {
  1: {
    A: "Ồ! Bạn đang mơ về một bộ phim siêu anh hùng rồi. Dù Kali-40 là đồng vị phóng xạ thật đấy, nhưng nó không đủ sức biến bạn thành một chiếc 'đèn lồng' đâu. Thử lại để xem cơ thể chúng ta thực sự phản ứng thế nào nhé!",
    B: 'Tiếc quá! Nếu ăn chuối mà nhìn được xuyên tường thì các bác sĩ đã không cần đến máy SPECT/CT đắt tiền rồi. Câu trả lời thực tế hơn nhiều, thử lại xem nào!',
    D: "Bình tĩnh nào! Bạn không 'đáng sợ' đến thế đâu. Lượng phóng xạ trong chuối nhỏ đến mức máy đo nhạy nhất cũng khó lòng phát hiện ra trên cơ thể bạn. Đừng lo lắng quá, chọn lại nhé!",
  },
  2: {
    A: "Nhầm rồi nhé! Đó là nguyên lý của máy X-quang hoặc CT thông thường. Trong Y học hạt nhân, chiếc máy này lại cực kỳ 'hiền lành' vì nó không chủ động phát ra tia gì cả. Thử lại xem nó thực sự làm gì nhé!",
    B: "Gần đúng rồi, nhưng chưa chính xác hoàn toàn! Nó không phải là một chiếc camera chụp ảnh bằng ánh sáng thường mà chúng ta thấy. Nó đang chờ đợi một thứ 'vô hình' hơn nhiều. Đoán lại xem!",
    D: "Nghe có vẻ rất 'ngầu' nhưng đây không phải là phim viễn tưởng đâu! Máy chụp chỉ làm nhiệm vụ 'quan sát' thôi chứ không dùng lực hút nào cả. Thử chọn phương án khác xem sao!",
  },
  3: {
    A: "Ước gì điều này là thật nhỉ? Tiếc là dược chất phóng xạ chỉ giúp bác sĩ 'thấy' bạn rõ hơn chứ không giúp bạn 'biến mất' đâu. Thử lại nhé!",
    C: 'Bạn đang nhầm sang năng lượng hạt nhân của tàu ngầm hay nhà máy điện rồi! Lượng năng lượng y tế này chỉ đủ để phát tín hiệu thôi, không đủ để biến bạn thành The Flash đâu. Thử lại nào!',
    D: "Về vẻ ngoài thì đúng là bạn trông vẫn bình thường, nhưng bên trong cơ thể bạn lúc này đang có một 'bí mật' mà máy móc có thể nhận ra đấy. Chọn lại để khám phá bí mật đó là gì nhé!",
  },
}

const HARD_WRONG_FEEDBACK_EN = {
  1: {
    A: "Whoa, you are imagining a superhero movie. Potassium-40 is a real radioactive isotope, but it is nowhere near strong enough to turn you into a glowing lantern. Try again to see how the body actually responds.",
    B: 'Nice try. If bananas gave x-ray vision, doctors would not need expensive SPECT/CT scanners. The real answer is much more practical, so give it another shot.',
    D: "Take it easy. You are not a walking radiation hazard. The radioactivity in bananas is so tiny that even sensitive detectors can barely notice it in your body. No need to panic, choose again.",
  },
  2: {
    A: "Not quite. That is the principle of standard X-ray or CT imaging. In nuclear medicine, this scanner is actually passive because it does not actively emit that radiation itself. Try again and think about what it really does.",
    B: 'Close, but not fully correct. It is not a regular light camera taking photos like the ones we use every day. It is waiting for something much more invisible. Guess again.',
    D: "Sounds cool, but this is not science fiction. The scanner only observes and records signals; it does not use magnetic force to pull cells. Try another option.",
  },
  3: {
    A: "If only that were true. Radiopharmaceuticals help doctors see you more clearly, but they do not make you disappear. Try again.",
    C: "You are mixing this up with nuclear power plants or submarines. Medical tracer energy is only enough to emit detectable signals, not enough to turn you into The Flash. Try again.",
    D: "From the outside you still look normal, but inside your body there is a temporary 'secret' that imaging systems can detect. Choose again to discover what that secret is.",
  },
}

export default function MarioLevel({ questions, onExitLevel, onExitHome }) {
  const { t, i18n } = useTranslation()
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

  const getWrongFeedback = () => {
    if (!currentQuestion || !selectedOption) {
      return ''
    }

    if (i18n.language === 'vi') {
      const customMessage = HARD_WRONG_FEEDBACK_VI[currentQuestion.id]?.[selectedOption]
      if (customMessage) {
        return customMessage
      }
    } else {
      const customMessage = HARD_WRONG_FEEDBACK_EN[currentQuestion.id]?.[selectedOption]
      if (customMessage) {
        return customMessage
      }
    }

    return currentQuestion.explain
  }

  const playWrongBeep = () => {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext

    if (!AudioContextCtor) {
      return
    }

    const audioContext = new AudioContextCtor()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(420, audioContext.currentTime)
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.21)

    schedule(() => {
      audioContext.close()
    }, 260)
  }

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

    if (!option.correct) {
      playWrongBeep()
    }
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
                <p className="secret-text mt-3">{answerCorrect ? currentQuestion.explain : getWrongFeedback()}</p>
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
