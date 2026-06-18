'use client'

import { useState } from 'react'
import { searchContents, type Content } from '@/lib/searchContents'
import ResultCard from '@/components/ResultCard'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Content[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()

    // 빈 검색어: 쿼리를 보내지 않고 초기 안내 상태 유지 (spec)
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
        <p className="hint">검색어를 입력해 학지사 도서를 찾아보세요.</p>
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
              <ResultCard key={c.id} content={c} />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
