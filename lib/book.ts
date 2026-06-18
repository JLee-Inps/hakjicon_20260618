import { getSupabaseClient } from './supabaseClient'
import type { Content } from './searchContents'

/** id로 단일 도서 조회 */
export async function getBook(id: string): Promise<Content | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('contents')
    .select('id, title, author, category, description, cover_url')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return (data as Content) ?? null
}

/** 상세 조회 시 인기 점수 +1 (RPC, security definer) */
export async function incrementView(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.rpc('increment_view_count', { content_id: id })
  if (error) throw error
}
