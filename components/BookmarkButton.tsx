'use client'

import { useEffect, useState } from 'react'
import { getClientId } from '@/lib/clientId'
import { addBookmark, removeBookmark } from '@/lib/bookmarks'

export default function BookmarkButton({
  contentId,
  initialBookmarked = false,
}: {
  contentId: string
  initialBookmarked?: boolean
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [busy, setBusy] = useState(false)

  // 부모가 북마크 상태를 비동기로 로드한 뒤 내려줄 수 있으므로 동기화
  useEffect(() => setBookmarked(initialBookmarked), [initialBookmarked])

  async function toggle() {
    if (busy) return
    setBusy(true)
    const next = !bookmarked
    setBookmarked(next) // 낙관적 업데이트
    try {
      const clientId = getClientId()
      if (next) await addBookmark(contentId, clientId)
      else await removeBookmark(contentId, clientId)
    } catch {
      setBookmarked(!next) // 실패 시 롤백
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className={`bookmark-btn${bookmarked ? ' bookmark-btn--on' : ''}`}
      onClick={toggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? '북마크 해제' : '북마크 저장'}
      disabled={busy}
    >
      {bookmarked ? '★ 저장됨' : '☆ 저장'}
    </button>
  )
}
