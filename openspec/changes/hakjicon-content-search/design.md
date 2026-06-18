## Context

학지사 콘텐츠 미니서비스의 Must-have 블루프린트. 검색은 선행 MVP(`add-content-search`)로 구현·Vercel 배포 완료. 본 change는 검색을 포함해 Must 3개(검색·인기추천·북마크)로 스코프를 확정하고, 인기추천·북마크를 추가 구현하기 위한 데이터 모델·접근 방식을 정의한다. 인증은 도입하지 않는다(Won't 인접). 스택은 Next.js + Supabase 고정, 브라우저에서 Supabase 직접 호출.

## Goals / Non-Goals

**Goals:**
- 검색·인기추천·북마크 세 기능을 8시간 내 구현 가능한 최소 데이터 모델로 설계.
- 인증 없이 익명 북마크를 동작시킨다(브라우저별 client id).
- 검색 구현(ILIKE, 브라우저 직접 호출)을 재사용한다.

**Non-Goals:**
- 사용자 인증/계정, 북마크 목록·삭제 화면(Should).
- 태그 필터, 정렬, AI 요약, 소셜 공유(Should/Could).
- 의미검색·추천 엔진(향후).

## Decisions

### 결정 1: 데이터 모델 (2 테이블)
```
contents
├─ id          (uuid, pk)
├─ title       (text)         ← 검색 대상
├─ author      (text)
├─ category    (text)
├─ description (text)         ← 검색 대상
├─ cover_url   (text, null)
└─ view_count  (int, default 0)   ← 인기 점수 (신규)

bookmarks
├─ id          (uuid, pk)
├─ content_id  (uuid, fk → contents.id)
├─ client_id   (uuid)             ← 브라우저 localStorage 식별자
└─ created_at  (timestamptz, default now())
   unique (content_id, client_id)  ← 중복 북마크 방지
```
- **이유**: 인기추천은 `contents`에 컬럼 1개 추가로 해결, 북마크는 단일 테이블로 충분. unique 제약으로 중복 방지를 DB 레벨에서 보장.

### 결정 2: 인기 추천 = view_count 내림차순
홈에서 `contents`를 `view_count desc`로 정렬해 상위 6개를 노출. 상세 조회 시 `increment_view_count(content_id)` RPC로 +1.
- **이유**: 별도 집계 테이블·배치 없이 단일 컬럼으로 인기 신호 구현. 시드 데이터에 초기 `view_count`를 넣어 빈 화면을 피한다.
- **대안**: 북마크 수 기준 인기 — 북마크가 쌓이기 전엔 비어 보임. view_count 시드가 더 즉시 동작.

### 결정 3: 익명 북마크 (localStorage client id + 확장 RLS)
인증 대신 첫 방문 시 `crypto.randomUUID()`로 client id를 만들어 localStorage에 보관, 북마크 행에 함께 저장. 쿼리는 client id로 스코프.
- **RLS**: `contents` SELECT(anon) + RPC 실행 허용. `bookmarks`는 anon에게 INSERT/SELECT/DELETE 허용(MVP, 행 소유 스코프는 쿼리의 client_id로 처리).
- **이유**: 인증 없이 "내 북마크" 경험을 제공하는 최소 방법.
- **트레이드오프**: client id를 알면 타인 북마크 조작 가능 → 데모/MVP 한정. 실제 멀티유저화 시 Supabase Auth + user_id 기반 RLS로 전환.

### 결정 4: 데이터 접근 = 브라우저 → Supabase 직접 (기존 유지)
별도 API route 없이 `@supabase/supabase-js`로 클라이언트에서 조회/쓰기. publishable key 사용.
- **이유**: 검색 MVP와 동일 패턴 유지, 코드 최소. 북마크 쓰기는 확장된 RLS로 허용.

## Risks / Trade-offs

- [익명 북마크 위조 가능] → MVP/데모 한정, 멀티유저화 시 Auth 전환(결정 3).
- [view_count 증가가 브라우저 직접 update] → 어뷰징으로 부풀려질 수 있음. MVP 수용, 필요 시 RPC에 rate limit/서버화.
- [bookmarks anon write RLS] → 쓰기 허용 범위가 넓음. contents는 읽기전용 유지해 콘텐츠 변조는 차단.

## Open Questions

- 인기 추천을 "조회수"로 둘지 "북마크 수"로 둘지 — 현재 조회수(view_count)로 확정. 추후 가중 합산 가능.
