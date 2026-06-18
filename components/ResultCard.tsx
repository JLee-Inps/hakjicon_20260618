import type { Content } from '@/lib/searchContents'

export default function ResultCard({ content }: { content: Content }) {
  return (
    <article className="card">
      {content.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="card-cover" src={content.cover_url} alt={`${content.title} 표지`} />
      ) : (
        <div className="card-cover card-cover--placeholder" aria-hidden="true">
          학지사
        </div>
      )}
      <div className="card-body">
        <h3 className="card-title">{content.title}</h3>
        <p className="card-meta">
          {content.author ?? '저자 미상'}
          {content.category ? ` · ${content.category}` : ''}
        </p>
        {content.description ? <p className="card-desc">{content.description}</p> : null}
      </div>
    </article>
  )
}
