import { useEffect, useMemo, useState } from 'react'
import { Check, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const EXP_CAP = 200

export default function DailyQuests() {
  const { t, i18n } = useTranslation()
  const { user, exp, addExp } = useAuth()
  const tasksData = useMemo(() => {
    const localizedTasks = t('quests.tasks', { returnObjects: true })
    return Array.isArray(localizedTasks) ? localizedTasks : []
  }, [i18n.language, t])
  const [warning, setWarning] = useState('')
  const [tasks, setTasks] = useState(
    tasksData.map((task) => ({
      ...task,
      completed: false,
      rewardValue: Number(String(task.reward).replace(/[^0-9]/g, '')) || 0,
    })),
  )

  useEffect(() => {
    setTasks((prevTasks) =>
      tasksData.map((task) => {
        const existing = prevTasks.find((item) => item.id === task.id)
        return {
          ...task,
          completed: existing?.completed ?? false,
          rewardValue: Number(String(task.reward).replace(/[^0-9]/g, '')) || 0,
        }
      }),
    )
  }, [tasksData, i18n.language])

  const currentExp = exp % EXP_CAP
  const level = Math.floor(exp / EXP_CAP) + 1
  const expPercent = useMemo(() => Math.min((currentExp / EXP_CAP) * 100, 100), [currentExp])

  const handleCompleteTask = (taskId) => {
    if (!user) {
      setWarning(t('quests.loginRequired'))
      setTimeout(() => setWarning(''), 2200)
      return
    }

    setTasks((prevTasks) => {
      const targetTask = prevTasks.find((task) => task.id === taskId)
      if (!targetTask || targetTask.completed) {
        return prevTasks
      }

      addExp(targetTask.rewardValue)

      return prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      )
    })
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Target size={18} className="text-teal-300" />
            {t('quests.title')}
          </h2>
        </div>

        <div className="min-w-[160px] rounded-lg border border-slate-700 bg-slate-950/70 p-2">
          <p className="text-right text-xs font-semibold text-teal-200">
            {t('auth.expBadge', { level, current: currentExp })}
          </p>
          <p className="mt-1 text-right text-[11px] text-slate-400">
            {user ? t('quests.level') : t('auth.login')}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-400 transition-all duration-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>
      </div>

      {warning ? <p className="mt-3 text-xs text-amber-300">{warning}</p> : null}

      <div className="mt-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-3 border-b border-slate-800 py-3 last:border-b-0"
          >
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={() => handleCompleteTask(task.id)}
                className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                  task.completed
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-500 text-transparent hover:border-teal-300'
                }`}
                aria-label={t('quests.actionText')}
              >
                <Check size={12} />
              </button>

              <div className="min-w-0">
                <p
                  className={`text-sm ${
                    task.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                  }`}
                >
                  {task.title}
                </p>

                {!task.completed &&
                  (task.actionLink.startsWith('/') ? (
                    <Link to={task.actionLink} className="mt-1 inline-block text-xs text-teal-300 hover:text-teal-200">
                      {t('quests.actionText')}
                    </Link>
                  ) : (
                    <a href={task.actionLink} className="mt-1 inline-block text-xs text-teal-300 hover:text-teal-200">
                      {t('quests.actionText')}
                    </a>
                  ))}
              </div>
            </div>

            <span className="shrink-0 rounded bg-yellow-400/10 px-2 py-1 text-xs text-yellow-400">
              {task.reward}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
