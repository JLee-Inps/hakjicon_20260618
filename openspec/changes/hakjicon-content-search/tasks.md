> Must-have 3개(검색·인기추천·북마크) 범위. 합계 목표 ≤ 8h.
> 검색은 선행 MVP(`add-content-search`)로 이미 구현·배포됨 → `[x]`.

## 1. 데이터 모델 (Supabase) — ~2h

- [x] 1.1 `contents` 테이블 + 읽기전용 RLS + 더미 시드 (검색 MVP에서 완료)
- [x] 1.2 `contents`에 `view_count int not null default 0` 컬럼 추가 + 시드에 초기값 부여 (라이브 확인)
- [x] 1.3 `bookmarks` 테이블 생성 (content_id, client_id, created_at, unique(content_id, client_id)) (라이브 확인)
- [x] 1.4 RLS 확장: bookmarks anon INSERT/SELECT/DELETE 허용, contents 읽기전용 유지 (라이브 확인)
- [x] 1.5 `increment_view_count(content_id uuid)` RPC(함수) 생성 + anon execute 허용 (RPC +1 확인)

## 2. 데이터 접근 (쿼리/함수) — ~2h

- [x] 2.1 검색: `title`/`description` ILIKE 부분일치 조회 (완료)
- [x] 2.2 인기 추천: `view_count desc` 상위 6개 조회 함수 (`lib/popular.ts`)
- [x] 2.3 북마크 추가/제거: client_id 기준 upsert/delete 함수 (중복 방지) (`lib/bookmarks.ts`)
- [x] 2.4 상세 조회 시 `increment_view_count` RPC 호출 (`lib/book.ts`)
- [x] 2.5 client id 유틸: 첫 방문 시 localStorage에 uuid 생성·보관 (`lib/clientId.ts`)

## 3. 화면 (UI) — ~3h

- [x] 3.1 검색 페이지 (검색창 + 결과 카드 + 결과없음/빈검색어 처리) (완료)
- [x] 3.2 홈 "인기 추천" 섹션 (상위 6개 카드) (`app/page.tsx`)
- [x] 3.3 도서 카드 북마크 버튼 (저장/저장됨 토글, 중복 방지) (`components/BookmarkButton.tsx`, `ResultCard.tsx`)
- [x] 3.4 상세 진입 동선에서 조회수 증가 연결 (`app/book/[id]/page.tsx`)

## 4. 통합·배포 — ~1h

- [x] 4.1 인기추천·북마크 라이브 검증 (조회수 반영 / 북마크 저장·중복방지)
- [ ] 4.2 Supabase 마이그레이션 적용(컬럼·테이블·RLS·RPC) 후 Vercel 재배포
