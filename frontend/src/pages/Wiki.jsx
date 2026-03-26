import { ExternalLink, FileText, ImageOff } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import { fetchWikiArticles } from '../lib/wikiArticles'

function isValidExternalLink(url) {
  if (!url) {
    return false
  }

  return /^https?:\/\//i.test(url)
}

function buildContentTabHtml(title, content) {
  const safeTitle = (title || 'No title')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  const safeContent = (content || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br/>')

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <style>
      body { margin: 0; font-family: Segoe UI, sans-serif; background: #020617; color: #e2e8f0; }
      main { max-width: 900px; margin: 0 auto; padding: 24px; }
      h1 { margin: 0 0 16px; font-size: 28px; color: #f8fafc; }
      article { line-height: 1.8; font-size: 16px; white-space: normal; }
    </style>
  </head>
  <body>
    <main>
      <h1>${safeTitle}</h1>
      <article>${safeContent || 'Bai viet khong co noi dung.'}</article>
    </main>
  </body>
</html>`
}

function ArticleImage({ src, title }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className="flex h-36 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400">
        <span className="inline-flex items-center gap-2 text-sm">
          <ImageOff size={15} /> Khong co anh
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={title}
      className="h-36 w-full rounded-lg object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

export default function Wiki() {
  const { i18n } = useTranslation()
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const isVietnamese = i18n.language === 'vi'
  const loadingLabel = isVietnamese ? 'Đang tải dữ liệu học thuât...' : 'Loading scholarly data...'
  const externalArticleLabel = isVietnamese ? 'Đọc bài báo ngoài' : 'Read external article'

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {
        const result = await fetchWikiArticles()

        if (!isMounted) {
          return
        }

        setArticles(result)
        setErrorMessage('')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setArticles([])
        setErrorMessage(error.message || 'Khong the tai du lieu bai viet.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime() || 0
      const bTime = new Date(b.createdAt).getTime() || 0

      return bTime - aTime
    })
  }, [articles])

  const openArticle = (article) => {
    if (isValidExternalLink(article.externalLink)) {
      window.open(article.externalLink, '_blank', 'noopener,noreferrer')
      return
    }

    if (article.content?.trim()) {
      const popup = window.open('', '_blank', 'noopener,noreferrer')

      if (!popup) {
        alert('Trinh duyet dang chan popup. Hay cho phep popup de xem noi dung bai viet.')
        return
      }

      popup.document.write(buildContentTabHtml(article.title, article.content))
      popup.document.close()
      return
    }

    alert('Bai viet chua co link ngoai hoac noi dung chi tiet.')
  }

  return (
    <section className="py-8">
      <Card>
        {isLoading ? (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-slate-300">
            {loadingLabel}
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">
            Loi tai bai viet: {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && sortedArticles.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-slate-300">
            Chua co bai viet nao phu hop dieu kien loc.
          </div>
        ) : null}

        {!isLoading && !errorMessage && sortedArticles.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {sortedArticles.map((article) => {
              const hasExternalLink = isValidExternalLink(article.externalLink)
              const hasContent = Boolean(article.content?.trim())

              return (
                <article
                  key={article.id}
                  className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 transition hover:border-cyan-400/50"
                >
                  <ArticleImage src={article.coverImageUrl} title={article.title} />

                  <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-100">{article.title}</h2>

                  <button
                    type="button"
                    onClick={() => openArticle(article)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    {hasExternalLink ? (
                      <>
                        <ExternalLink size={15} /> {externalArticleLabel}
                      </>
                    ) : hasContent ? (
                      <>
                        <FileText size={15} /> Mo noi dung trong tab
                      </>
                    ) : (
                      <>
                        <FileText size={15} /> Khong co du lieu chi tiet
                      </>
                    )}
                  </button>
                </article>
              )
            })}
          </div>
        ) : null}
      </Card>
    </section>
  )
}
