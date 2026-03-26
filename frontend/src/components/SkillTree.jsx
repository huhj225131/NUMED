import { useMemo, useState } from 'react'
import { Atom, CheckCircle2, Code2, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const flowIcons = {
  ai: Code2,
  radiation: Atom,
}

export default function SkillTree() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('ai')
  const [unlockedNodes, setUnlockedNodes] = useState([1])
  const [selectedNodeId, setSelectedNodeId] = useState(1)

  const skillFlows = t('skillTree.flows', { returnObjects: true })
  const tabLabels = t('skillTree.tabs', { returnObjects: true })

  const currentFlow = useMemo(() => skillFlows?.[activeTab] ?? [], [activeTab, skillFlows])
  const selectedNode = useMemo(
    () => currentFlow.find((node) => node.id === selectedNodeId) ?? currentFlow[0],
    [currentFlow, selectedNodeId],
  )

  const detailPoints = useMemo(() => {
    if (Array.isArray(selectedNode?.details) && selectedNode.details.length > 0) {
      return selectedNode.details
    }

    if (selectedNode?.description) {
      return [selectedNode.description]
    }

    return []
  }, [selectedNode])

  const onSwitchTab = (tabId) => {
    setActiveTab(tabId)
    setUnlockedNodes([1])
    setSelectedNodeId(1)
  }

  const onClickNode = (nodeId) => {
    if (!unlockedNodes.includes(nodeId)) {
      return
    }

    setSelectedNodeId(nodeId)

    const nextNodeId = nodeId + 1
    if (nextNodeId <= currentFlow.length && !unlockedNodes.includes(nextNodeId)) {
      setUnlockedNodes((prev) => [...prev, nextNodeId])
    }
  }

  return (
    <section>
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900 p-6 shadow-lg shadow-slate-950/30">
        <h2 className="text-xl font-bold text-white">{t('skillTree.title')}</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.keys(flowIcons).map((key) => {
            const Icon = flowIcons[key]
            const isActive = key === activeTab

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSwitchTab(key)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition-all duration-300 ${
                  isActive
                    ? 'border-teal-300 bg-teal-400/20 text-teal-100 shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                    : 'border-slate-700 bg-slate-950/50 text-slate-300 hover:border-teal-500/60'
                }`}
              >
                <Icon size={18} />
                {tabLabels?.[key]}
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative pl-10">
            <div className="absolute left-5 top-4 h-[calc(100%-2rem)] w-px bg-slate-700" />

            <div className="space-y-4">
              {currentFlow.map((node) => {
                const isUnlocked = unlockedNodes.includes(node.id)
                const isSelected = node.id === selectedNodeId

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => onClickNode(node.id)}
                    className={`group relative w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                      isUnlocked
                        ? isSelected
                          ? 'border-teal-300 bg-slate-800 text-slate-100 shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                          : 'border-teal-700/60 bg-slate-800/80 text-slate-200 hover:border-teal-400/80'
                        : 'border-slate-700 bg-slate-800/60 text-slate-500 opacity-50'
                    }`}
                  >
                    <span
                      className={`absolute -left-7 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] ${
                        isUnlocked
                          ? 'border-teal-300 bg-teal-400/20 text-teal-200'
                          : 'border-slate-600 bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? node.id : <Lock size={10} />}
                    </span>

                    <p className="font-semibold">{node.title}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-5 transition-all duration-300">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">{t('skillTree.detailLabel')}</p>
            <h3 className="mt-2 text-lg font-bold text-white">{selectedNode?.title}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {detailPoints.map((point, index) => (
                <li key={`${selectedNode?.id ?? 'node'}-${index}`} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
