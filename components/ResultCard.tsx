import Link from 'next/link'
import type { Content } from '@/lib/searchContents'
import BookmarkButton from './BookmarkButton'

export default function ResultCard({
  content,
  bookmarked = false,
}: {
  content: Content
  bookmarked?: boolean
}) {
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
        <h3 className="card-title">
          <Link href={`/book/${content.id}`} className="card-link">
            {content.title}
          </Link>
        </h3>
        <p className="card-meta">
          {content.author ?? '저자 미상'}
          {content.category ? ` · ${content.category}` : ''}
        </p>
        {content.description ? <p className="card-desc">{content.description}</p> : null}
      </div>
      <BookmarkButton contentId={content.id} initialBookmarked={bookmarked} />
    </article>
  )
}
