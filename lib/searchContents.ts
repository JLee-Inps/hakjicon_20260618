import { getSupabaseClient } from './supabaseClient'

export type Content = {
  id: string
  title: string
  author: string | null
  category: string | null
  description: string | null
  cover_url: string | null
}

/**
 * 키워드로 title/description을 ILIKE 부분일치 검색한다 (design 결정 1).
 * 빈 검색어는 쿼리를 보내지 않고 빈 배열을 반환한다 (spec: 빈 검색어 처리).
 */
export async function searchContents(rawQuery: string): Promise<Content[]> {
  const q = rawQuery.trim()
  if (!q) return []

  // PostgREST의 .or() 필터는 쉼표로 조건을 구분하므로, 입력의 쉼표는 공백으로 치환해 깨짐을 방지.
  const safe = q.replace(/,/g, ' ')

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('contents')
    .select('id, title, author, category, description, cover_url')
    .or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)
    .order('title', { ascending: true })

  if (error) throw error
  return (data ?? []) as Content[]
}
