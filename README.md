# hakjicon

학지사 콘텐츠 검색 미니서비스 (MVP). Next.js + Supabase, 키워드 검색.

## 로컬 실행

### 1. Supabase 준비

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
2. **SQL Editor** 에서 순서대로 실행:
   - `supabase/schema.sql` — `contents` 테이블 + 읽기전용 RLS
   - `supabase/seed.sql` — 더미 도서 14건
3. **Project Settings > API Keys** 에서 Project URL 과 **publishable key**(`sb_publishable_...`) 복사

### 2. 환경변수

```bash
cp .env.local.example .env.local
```

`.env.local` 을 실제 값으로 채운다:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 3. 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

## 구조

| 경로 | 역할 |
|------|------|
| `app/page.tsx` | 검색 페이지 (검색창 + 결과/상태 렌더링) |
| `lib/searchContents.ts` | `title`/`description` ILIKE 부분일치 조회 |
| `lib/supabaseClient.ts` | Supabase 클라이언트 (지연 생성) |
| `components/ResultCard.tsx` | 결과 카드 |
| `supabase/*.sql` | 테이블·RLS·시드 SQL |

스펙·설계의 단일 출처는 `openspec/changes/add-content-search/` 다.
