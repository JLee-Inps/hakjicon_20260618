'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getBook, incrementView } from '@/lib/book'
import { getBookmarkedIds } from '@/lib/bookmarks'
import { getClientId } from '@/lib/clientId'
import type { Content } from '@/lib/searchContents'
import BookmarkButton from '@/components/BookmarkButton'

type Status = 'loading' | 'done' | 'notfound' | 'error'

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [book, setBook] = useState<Content | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [status, setStatus] = useState<Status>('loading')
  const counted = useRef(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getBook(id)
        if (!data) {
          setStatus('notfound')
          return
        }
        setBook(data)
        const ids = await getBookmarkedIds(getClientId())
        setBookmarked(ids.has(id))
        setStatus('done')

        // 상세 조회 시 인기 점수 +1 (StrictMode 이중 실행 방지)
        if (!counted.current) {
          counted.current = true
          incrementView(id).catch(() => {})
        }
      } catch {
        setStatus('error')
      }
    })()
  }, [id])

  return (
    <main className="container">
      <p>
        <Link href="/" className="back-link">
          ← 홈으로
        </Link>
      </p>

      {status === 'loading' && <p className="hint">불러오는 중…</p>}
      {status === 'notfound' && <p className="hint">도서를 찾을 수 없습니다.</p>}
      {status === 'error' && <p className="error">도서를 불러오지 못했습니다.</p>}

      {status === 'done' && book && (
        <article className="detail">
          <h1 className="title">{book.title}</h1>
          <p className="card-meta">
            {book.author ?? '저자 미상'}
            {book.category ? ` · ${book.category}` : ''}
          </p>
          {book.description && <p className="detail-desc">{book.description}</p>}
          <BookmarkButton contentId={book.id} initialBookmarked={bookmarked} />
        </article>
      )}
    </main>
  )
}
