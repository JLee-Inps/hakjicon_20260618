import { getSupabaseClient } from './supabaseClient'
import type { Content } from './searchContents'

/**
 * 인기 추천: view_count 내림차순 상위 N개 (design 결정 2).
 */
export async function getPopular(limit = 6): Promise<Content[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('contents')
    .select('id, title, author, category, description, cover_url')
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Content[]
}
