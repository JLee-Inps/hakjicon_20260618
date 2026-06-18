const KEY = 'hakjicon_client_id'

/**
 * 브라우저별 익명 식별자. 첫 방문 시 생성해 localStorage에 보관한다.
 * (인증 없이 "내 북마크"를 구분하기 위한 MVP 수단 — design 결정 3)
 */
export function getClientId(): string {
  if (typeof window === 'undefined') return ''
  let id = window.localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    window.localStorage.setItem(KEY, id)
  }
  return id
}
