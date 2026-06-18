import { getSupabaseClient } from './supabaseClient'

/** 현재 브라우저(client_id)가 북마크한 content_id 집합 */
export async function getBookmarkedIds(clientId: string): Promise<Set<string>> {
  if (!clientId) return new Set()
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('content_id')
    .eq('client_id', clientId)

  if (error) throw error
  return new Set((data ?? []).map((r) => r.content_id as string))
}

/** 북마크 저장. unique(content_id, client_id) + ignoreDuplicates 로 중복 방지 */
export async function addBookmark(contentId: string, clientId: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('bookmarks')
    .upsert(
      { content_id: contentId, client_id: clientId },
      { onConflict: 'content_id,client_id', ignoreDuplicates: true }
    )
  if (error) throw error
}

/** 북마크 해제 */
export async function removeBookmark(contentId: string, clientId: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('content_id', contentId)
    .eq('client_id', clientId)
  if (error) throw error
}
