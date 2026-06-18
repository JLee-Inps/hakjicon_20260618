'use client'

import { useEffect, useState } from 'react'
import { searchContents, type Content } from '@/lib/searchContents'
import { getPopular } from '@/lib/popular'
import { getBookmarkedIds } from '@/lib/bookmarks'
import { getClientId } from '@/lib/clientId'
import ResultCard from '@/components/ResultCard'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Content[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [popular, setPopular] = useState<Content[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  // 홈 진입 시 인기 추천 + 내 북마크 로드 (검색과 독립)
  useEffect(() => {
    ;(async () => {
      try {
        const [pop, ids] = await Promise.all([
          getPopular(6),
          getBookmarkedIds(getClientId()),
        ])
        setPopular(pop)
        setBookmarkedIds(ids)
      } catch (e) {
        console.error('인기/북마크 로드 실패', e)
      }
    })()
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()

    // 빈 검색어: 쿼리 미전송, 초기(인기 추천) 상태 유지
    if (!q) {
      setStatus('idle')
      setResults([])
      return
    }

    setStatus('loading')
    setErrorMsg('')
    try {
      const data = await searchContents(q)
      setResults(data)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.')
      setStatus('error')
    }
  }

  return (
    <main className="container">
      <h1 className="title">학지사 콘텐츠 검색</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목이나 설명으로 검색 (예: 상담, 놀이치료)"
          aria-label="검색어"
        />
        <button className="search-button" type="submit">
          검색
        </button>
      </form>

      {status === 'idle' && (
        <section>
          <h2 className="section-title">인기 추천</h2>
          {popular.length === 0 ? (
            <p className="hint">인기 도서를 불러오는 중…</p>
          ) : (
            <div className="result-list">
              {popular.map((c) => (
                <ResultCard key={c.id} content={c} bookmarked={bookmarkedIds.has(c.id)} />
              ))}
            </div>
          )}
        </section>
      )}

      {status === 'loading' && <p className="hint">검색 중…</p>}
      {status === 'error' && <p className="error">{errorMsg}</p>}
      {status === 'done' && results.length === 0 && (
        <p className="hint">검색 결과가 없습니다.</p>
      )}
      {status === 'done' && results.length > 0 && (
        <>
          <p className="result-count">{results.length}건의 결과</p>
          <div className="result-list">
            {results.map((c) => (
              <ResultCard key={c.id} content={c} bookmarked={bookmarkedIds.has(c.id)} />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
