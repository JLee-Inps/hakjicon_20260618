## Why

학지사 콘텐츠를 빠르게 찾고(검색), 무엇을 볼지 모를 때 좋은 출발점을 주고(인기 추천), 관심 콘텐츠를 다시 찾을 수 있게(북마크) 하는 것이 미니서비스의 핵심 가치다. 이 세 가지를 Must-have로 확정하고, 이 change를 이후 전 구간의 단일 설계도(SSoT)로 삼는다. (검색은 선행 MVP `add-content-search`로 이미 구현·배포됨 — 본 change는 이를 포함해 Must 3개로 스코프를 재확정한다.)

## What Changes

- **검색 (Search)**: 키워드로 도서 `title`/`description`을 부분일치 검색해 결과를 보여준다. *(구현 완료)*
- **인기 추천 (Popular recommendations)**: 홈에서 인기 점수 기준 상위 N개 도서를 추천 목록으로 보여준다.
- **북마크 저장 (Bookmark save)**: 사용자가 도서를 북마크로 저장한다(익명, localStorage 기반 client id).

## Capabilities

### New Capabilities
- `content`: 학지사 도서 콘텐츠의 검색 · 인기 추천 · 북마크 저장을 제공하는 핵심 기능.

### Modified Capabilities
<!-- 없음 -->

## Out of Scope (향후)

Must-have 확정을 위해 아래는 이번 스코프에서 제외한다(MoSCoW).

- **Should (다음 우선)**: 태그/분류 필터, 북마크 목록 화면·삭제.
- **Could (여력 시)**: AI 요약, 정렬 옵션, 소셜 공유.
- **Won't (이번 제품 아님)**: 다국어, 모바일 앱, 결제.

## Impact

- **데이터**: `contents` 테이블에 인기 점수 컬럼(`view_count`) 추가, `bookmarks` 테이블 신규.
- **앱**: 홈에 인기 추천 섹션, 결과/상세에 북마크 버튼 추가. 검색은 기존 구현 재사용.
- **데이터 접근**: 브라우저 → Supabase 직접(`@supabase/supabase-js`). 북마크는 익명 쓰기가 필요하므로 RLS를 읽기전용에서 "읽기 + 북마크 insert/delete 허용"으로 확장.
- **의존성**: 기존과 동일(`@supabase/supabase-js`, publishable key).
