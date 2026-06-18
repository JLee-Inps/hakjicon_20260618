## Context

학지사 콘텐츠 검색·추천 미니서비스의 첫 MVP. 신규 그린필드 프로젝트이며 스택은 Next.js + Supabase로 고정. 이번 단계 목표는 "키워드 검색"만 동작시키는 것으로, 데이터는 실데이터 연동 없이 더미를 Supabase에 시드해 사용한다. 읽기전용 데모 성격이라 보안·성능·마이그레이션 부담이 낮다.

## Goals / Non-Goals

**Goals:**
- 가장 단순한 키워드 검색 경로를 빠르게 작동시킨다.
- 더미 데이터로 검색 UX(검색창 → 결과 카드)를 검증한다.
- 이후 추천/의미검색으로 확장 가능한 데이터 모델을 남긴다.

**Non-Goals:**
- 의미 기반(임베딩/pgvector) 검색.
- 추천 엔진.
- 사용자 인증, 콘텐츠 쓰기(등록/수정/삭제) 기능.
- 한국어 형태소 기반 전문검색(tsvector) 튜닝.

## Decisions

### 결정 1: 검색은 ILIKE 부분일치
`title`/`description`에 대해 `ILIKE '%검색어%'`로 부분일치 검색한다.
- **이유**: 설정 0, 한국어 형태소 분석 없이 즉시 동작. 더미 규모(10~20건)에서 충분.
- **대안**: Postgres 전문검색(tsvector) — 한국어 토크나이저 설정 필요해 MVP엔 과함. 벡터 검색 — 추천 단계에서 도입 예정이므로 지금은 제외.

### 결정 2: 브라우저 → Supabase 직접 호출 (A안)
별도 API route 없이 `@supabase/supabase-js`로 클라이언트에서 직접 조회한다.
- **이유**: 읽기전용 더미 데이터라 publishable key(`sb_publishable_...`, legacy anon 키 대체) + 읽기전용 RLS로 충분. 코드 최소.
- **대안**: Next.js API route 경유(B안) — 키 은닉/쿼리 통제 이점 있으나 MVP엔 한 겹 과함. 추후 쓰기·집계가 생기면 전환 검토.

### 결정 3: 데이터 모델 (contents 단일 테이블)
```
contents
├─ id          (uuid, pk)
├─ title       (text)         ← 검색 대상
├─ author      (text)
├─ category    (text)         ← 분류/추후 필터
├─ description (text)         ← 검색 대상
└─ cover_url   (text, null)   ← 결과 카드 썸네일(선택)
```
- **이유**: 검색·카드 표시에 필요한 최소 컬럼만. 추후 임베딩 컬럼(vector) 추가 여지.

## Risks / Trade-offs

- [ILIKE는 데이터가 커지면 느려짐(풀스캔)] → MVP 규모에선 무시. 확장 시 인덱스/전문검색/벡터로 전환.
- [publishable key 노출] → 브라우저 노출이 설계상 안전한 키이며, 읽기전용 RLS와 더미 데이터로 영향 최소. 민감/쓰기 데이터 도입 시 B안(API route + secret key)으로 전환.
- [한국어 부분일치라 동의어·오타 대응 불가] → 추천/의미검색 단계의 과제로 명시적으로 미룸.

## Open Questions

- 분류(category)별 필터 UI를 이번에 넣을지, 다음 단계로 미룰지. (현재 가정: 다음 단계)
