## 1. Supabase 설정 및 데이터

- [x] 1.1 Supabase 프로젝트 생성/연결 및 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) 설정
- [x] 1.2 `contents` 테이블 생성 (id, title, author, category, description, cover_url)
- [x] 1.3 읽기전용 RLS 정책 설정 (anon select 허용)
- [x] 1.4 더미 도서 데이터 10~20건 시드 (학지사 분야: 심리·상담·교육·특수교육 등) — 14건 시드 확인

## 2. 앱 기반 설정

- [x] 2.1 Next.js 프로젝트 초기화 및 `@supabase/supabase-js` 설치
- [x] 2.2 Supabase 클라이언트 초기화 모듈 작성

## 3. 검색 기능 구현

- [x] 3.1 검색 페이지 레이아웃 (검색창 + 검색 버튼/엔터 처리)
- [x] 3.2 검색어로 `title`/`description` ILIKE 부분일치 조회 함수 작성
- [x] 3.3 결과 카드 컴포넌트 (제목·저자·분류, cover_url 있으면 썸네일)
- [x] 3.4 빈 검색어 처리 (쿼리 미전송, 초기 안내 상태 유지)
- [x] 3.5 결과 없음 안내 메시지 표시

## 4. 검증

- [x] 4.1 일치 키워드 → 결과 노출 확인 ("상담" → 4건)
- [x] 4.2 미일치 키워드 → "결과 없음" 메시지 확인 (0건 경로)
- [x] 4.3 빈 검색어 → 오류 없이 초기 상태 유지 확인 (idle 가드)
