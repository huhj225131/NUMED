import { useEffect, useState } from 'react'
import { Bot, ChevronLeft, ChevronRight, Lock, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import characterImg from '../images/character.png'

const journeyVideoModules = import.meta.glob('../videos/Dao_*.mp4', {
  eager: true,
  import: 'default',
})

const journeyVideoByIsland = Object.fromEntries(
  Object.entries(journeyVideoModules).map(([path, url]) => {
    const match = path.match(/Dao_(\d+)\.mp4$/)
    return [match ? Number(match[1]) : 0, url]
  })
)

const CONTENT_PREVIEW_LENGTH = 230

export default function JourneyMap({ onClose }) {
  const { t } = useTranslation()
  const islandData = t('journey.islands', { returnObjects: true })
  const normalizedIslands = (Array.isArray(islandData) ? islandData : []).map((island, index) => ({
    ...island,
    id: index + 1,
    emoji: island.emoji ?? ['🏝️', '🔄', '🤝', '🔭'][index] ?? '🏝️',
  }))
  const [currentIsland, setCurrentIsland] = useState(1)
  const [maxUnlockedIsland, setMaxUnlockedIsland] = useState(1)
  const [showMap, setShowMap] = useState(true)
  const [expandedByIsland, setExpandedByIsland] = useState({})
  const [showGlossary, setShowGlossary] = useState(false)

  const current = normalizedIslands[currentIsland - 1]
  const videoSrc = journeyVideoByIsland[currentIsland]
  const isExpanded = expandedByIsland[currentIsland] === true
  const contentText = current?.content ?? ''
  const glossaryTerm = t('journey.glossary.radiopharmaceutical.term')
  const glossaryTitle = t('journey.glossary.title')
  const glossaryIntro = t('journey.glossary.radiopharmaceutical.intro')
  const glossaryPartsTitle = t('journey.glossary.radiopharmaceutical.partsTitle')
  const glossaryParts = t('journey.glossary.radiopharmaceutical.parts', { returnObjects: true })
  const glossaryFormula = t('journey.glossary.radiopharmaceutical.formula')
  const glossaryConclusion = t('journey.glossary.radiopharmaceutical.conclusion')
  const safeGlossaryParts = Array.isArray(glossaryParts) ? glossaryParts : []
  const isGlossaryIsland = currentIsland === 3
  const shouldShowToggle = contentText.length > CONTENT_PREVIEW_LENGTH
  const previewText = shouldShowToggle && !isExpanded
    ? `${contentText.slice(0, CONTENT_PREVIEW_LENGTH).trimEnd()}...`
    : contentText

  useEffect(() => {
    setShowGlossary(false)
  }, [currentIsland])

  const handleIslandClick = (islandId) => {
    if (islandId <= maxUnlockedIsland) {
      setCurrentIsland(islandId)
      setShowMap(false)
    }
  }

  const handleNavigate = (direction) => {
    const nextIsland = currentIsland + direction

    if (direction === 1) {
      // Bấm nút "Tiếp tục"
      if (currentIsland < normalizedIslands.length) {
        // Nếu chưa phải đảo cuối, mở khóa đảo tiếp theo và chuyển sang
        if (nextIsland > maxUnlockedIsland) {
          setMaxUnlockedIsland(nextIsland)
        }
        setCurrentIsland(nextIsland)
      } else {
        // Nếu là đảo cuối, quay lại bản đồ
        setShowMap(true)
      }
    } else if (direction === -1) {
      // Bấm nút "Quay lại"
      if (nextIsland >= 1) {
        setCurrentIsland(nextIsland)
      }
    }
  }

  if (showMap) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-[min(95vw,1000px)] rounded-3xl border-2 border-slate-700 bg-gradient-to-b from-slate-900 via-blue-900/40 to-slate-950 p-8 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">{t('journey.mapTitle')}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-700/50 p-2 hover:bg-slate-700 transition"
            >
              <X size={24} className="text-slate-200" />
            </button>
          </div>

          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-300 via-blue-400 to-teal-300 p-8">
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path
                d="M 10% 50% Q 30% 30%, 50% 50% T 90% 50%"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,10"
              />
            </svg>

            <div className="relative h-full flex items-center justify-between px-4">
              {normalizedIslands.map((island) => {
                const isUnlocked = island.id <= maxUnlockedIsland
                const isCurrent = island.id === currentIsland && !showMap
                const isActive = island.id === currentIsland

                return (
                  <button
                    key={island.id}
                    type="button"
                    onClick={() => handleIslandClick(island.id)}
                    disabled={!isUnlocked}
                    className={`relative flex flex-col items-center gap-2 transition-all ${
                      isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
                        isUnlocked
                          ? isActive
                            ? 'bg-yellow-300 shadow-lg shadow-yellow-400/50 scale-125'
                            : 'bg-amber-200 hover:scale-110'
                          : 'bg-gray-400 grayscale'
                      }`}
                    >
                      {isUnlocked ? (
                        island.emoji
                      ) : (
                        <Lock size={32} className="text-gray-600" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full animate-pulse border-2 border-yellow-400" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white text-center max-w-20">
                      {island.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => handleIslandClick(currentIsland)}
              disabled={currentIsland > maxUnlockedIsland}
              className="rounded-xl bg-teal-400 px-6 py-3 font-bold text-slate-950 hover:bg-teal-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('journey.exploreIsland', { id: currentIsland })}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const toggleContent = () => {
    setExpandedByIsland((prev) => ({
      ...prev,
      [currentIsland]: !prev[currentIsland],
    }))
  }

  const renderContentWithKeyword = (text) => {
    if (!isGlossaryIsland || !glossaryTerm || !text) {
      return text
    }

    const lowerText = text.toLowerCase()
    const lowerTerm = glossaryTerm.toLowerCase()
    const matchIndex = lowerText.indexOf(lowerTerm)

    if (matchIndex === -1) {
      return text
    }

    const before = text.slice(0, matchIndex)
    const matched = text.slice(matchIndex, matchIndex + glossaryTerm.length)
    const after = text.slice(matchIndex + glossaryTerm.length)

    return (
      <>
        {before}
        <button
          type="button"
          onClick={() => setShowGlossary((prev) => !prev)}
          className="font-semibold text-teal-600 underline decoration-2 underline-offset-2 hover:text-teal-700"
        >
          {matched}
        </button>
        {after}
      </>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(95vw,1200px)] max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{current.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-700/50 p-2 hover:bg-slate-700 transition"
          >
            <X size={24} className="text-slate-200" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="w-full bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
              {videoSrc ? (
                <video
                  key={videoSrc}
                  src={videoSrc}
                  controls
                  preload="metadata"
                  className="h-96 w-full bg-black object-contain"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <p className="text-slate-400 text-center px-4">
                    {t('journey.videoPlaceholder')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="animate-fade-in bg-white text-slate-800 p-5 pr-20 rounded-2xl shadow-xl relative min-h-[188px] w-full max-w-sm">
              <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
              <img
                src={characterImg}
                alt={t('journey.characterAlt')}
                className="absolute bottom-1 right-1 h-24 w-24 object-contain drop-shadow-lg"
              />

              <div className="max-h-48 overflow-y-auto pr-1">
                <p className="text-sm leading-relaxed">{renderContentWithKeyword(previewText)}</p>
              </div>

              {shouldShowToggle && (
                <button
                  type="button"
                  onClick={toggleContent}
                  className="mt-3 inline-flex rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {isExpanded ? t('journey.buttons.readLess') : t('journey.buttons.readMore')}
                </button>
              )}

              {isGlossaryIsland && showGlossary && (
                <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-3 text-left text-xs text-slate-700">
                  <p className="flex items-center gap-2 font-semibold text-teal-700">
                    <Bot size={14} />
                    {glossaryTitle}
                  </p>
                  <p className="mt-2 leading-relaxed">{glossaryIntro}</p>
                  <p className="mt-2 font-semibold">{glossaryPartsTitle}</p>
                  <ul className="mt-1 space-y-1.5 pl-4">
                    {safeGlossaryParts.map((part, idx) => (
                      <li key={`${part}-${idx}`} className="list-disc leading-relaxed">{part}</li>
                    ))}
                  </ul>
                  <p className="mt-2 rounded-md bg-white/80 p-2 font-semibold text-teal-800">{glossaryFormula}</p>
                  <p className="mt-2 leading-relaxed">{glossaryConclusion}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-700 pt-6">
          <button
            type="button"
            onClick={() => handleNavigate(-1)}
            disabled={currentIsland === 1}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} /> {t('journey.buttons.prev')}
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              {t('journey.islandProgress', { current: currentIsland, total: normalizedIslands.length })}
            </p>
            <div className="mt-2 flex gap-1">
              {normalizedIslands.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    idx + 1 <= currentIsland ? 'bg-teal-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleNavigate(1)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white hover:bg-teal-600 transition"
            >
              {currentIsland === normalizedIslands.length ? t('journey.mapTitle') : t('journey.buttons.next')} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
