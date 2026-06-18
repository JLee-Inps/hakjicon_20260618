## Why

학지사 콘텐츠(도서)를 찾으려는 사용자가 제목·설명 일부만 알아도 빠르게 도서를 찾을 수 있는 가장 단순한 검색 경험이 필요하다. MVP 단계에서는 의미 검색·추천 같은 복잡한 기능 없이, 키워드 한 줄로 동작하는 검색을 먼저 검증한다.

## What Changes

- Supabase에 도서 콘텐츠를 담는 `contents` 테이블을 추가하고, 데모용 더미 도서 데이터(10~20건)를 시드한다.
- Next.js에 검색 페이지(검색창 1개 + 결과 카드 리스트)를 추가한다.
- 검색어로 `title`과 `description`을 부분일치(ILIKE) 검색해 결과를 노출한다.
- 빈 검색어, 결과 없음 등의 기본 상태를 처리한다.

비목표(Non-goals): 의미 기반(임베딩/벡터) 검색, 추천 엔진, 사용자 인증, 콘텐츠 등록/수정(쓰기) 기능은 이번 범위에서 제외한다.

## Capabilities

### New Capabilities
- `content-search`: 키워드로 학지사 도서 콘텐츠를 검색하고 결과 목록을 보여주는 기능.

### Modified Capabilities
<!-- 없음: 신규 프로젝트로 기존 스펙 변경 없음 -->

## Impact

- **데이터**: Supabase Postgres에 `contents` 테이블 신규 생성 + 더미 시드.
- **앱**: Next.js 검색 페이지 및 Supabase 조회 연동 신규 추가.
- **의존성**: `@supabase/supabase-js`, Supabase 프로젝트(anon key, 읽기전용 RLS).
- **운영**: 읽기전용 데모이므로 마이그레이션/롤백 부담 낮음.
