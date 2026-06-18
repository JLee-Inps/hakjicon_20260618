import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Supabase 클라이언트를 지연 생성한다(첫 호출 시 1회).
 * 모듈 로드 시점이 아니라 호출 시점에 생성하므로,
 * 환경변수가 없는 빌드/프리렌더 단계에서 throw 하지 않는다.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase 환경변수가 없습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 ' +
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 설정하세요. (.env.local.example 참고)'
    )
  }

  client = createClient(url, key)
  return client
}
