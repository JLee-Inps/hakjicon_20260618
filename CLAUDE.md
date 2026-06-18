# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`hakjicon` — 학지사 콘텐츠 검색·추천 미니서비스 (MVP). Planned stack: **Next.js + Supabase**.

As of now there is **no application code yet**. The repository currently contains only OpenSpec planning artifacts. All work is driven through the OpenSpec **spec-driven** workflow: plan first (proposal → specs → design → tasks), then implement. Do not write application code without a corresponding OpenSpec change.

## OpenSpec workflow (this is the primary way work happens here)

The lifecycle, surfaced as `/opsx:*` slash commands (backed by skills in `.claude/skills/`):

```
explore → propose → apply → verify → archive
```

- **explore** (`/opsx:explore`) — thinking/discovery only, never implement.
- **propose** (`/opsx:propose`) — scaffold a change and write all planning artifacts.
- **apply** (`/opsx:apply`) — implement the change by working through `tasks.md`.
- **verify** (`/opsx:verify`) — check implementation matches specs/tasks/design.
- **archive** (`/opsx:archive`) — finalize a completed change.

### CLI commands

```bash
openspec list --json                          # active changes + task progress
openspec new change "<name>"                  # scaffold a change (kebab-case name)
openspec status --change "<name>" --json      # artifact build order, applyRequires, paths
openspec instructions <artifact> --change "<name>" --json   # how to write proposal|specs|design|tasks|apply
openspec validate <name> [--strict]           # validate a change
```

A change is **apply-ready** when every artifact in `applyRequires` (typically `tasks`) has `status: "done"`. Drive decisions off the `status --json` output (`changeRoot`, `artifactPaths`, `actionContext`) rather than assuming paths.

### Authoring artifacts — non-obvious rules

- Always run `openspec instructions <artifact> ...` and use its `template` as the file structure. `context`/`rules` in that output are constraints for you — never copy them into the artifact file.
- Spec scenarios MUST use exactly **four** hashtags (`#### Scenario:`). Three hashtags or bullets fail silently at validation/archive time.
- Every requirement needs at least one scenario; use SHALL/MUST (avoid should/may).
- `MODIFIED Requirements` in a delta spec must paste the **entire** requirement block, not a partial — partial content loses detail at archive.

## Repository layout

```
openspec/
  config.yaml                    # schema: spec-driven (+ optional project context / per-artifact rules)
  changes/<name>/                # one dir per change
    proposal.md  design.md  tasks.md
    specs/<capability>/spec.md
  changes/archive/               # completed changes
.claude/
  commands/opsx/*.md             # /opsx slash commands
  skills/openspec-*/SKILL.md     # the skills those commands invoke
```

## Active change: `hakjicon-content-search` (Must-have 블루프린트)

선행 MVP `add-content-search`(검색만)는 구현 → Vercel 배포 → 아카이브 완료
(`openspec/changes/archive/2026-06-18-add-content-search/`). 현재 활성 설계도는
`hakjicon-content-search` 로, Must 3개를 다룬다:

- **검색 (Search)** — `title`/`description` ILIKE 부분일치. *(구현 완료, 배포됨)*
- **인기 추천 (Popular)** — `view_count` 기준 상위 N개. *(미구현)*
- **북마크 저장 (Bookmark)** — 인증 없이 localStorage client id 기반 익명 저장. *(미구현)*

Should/Could/Won't 범위는 `proposal.md` 의 **Out of Scope** 참조. 데이터 모델·RLS·RPC는
`design.md` 가 SSoT다 — **CLAUDE.md에 SQL/스키마를 복사하지 않는다**(어긋남 방지).

**데이터 접근**: 브라우저 → Supabase 직접 (`@supabase/supabase-js`, publishable key). 북마크
쓰기를 위해 RLS는 "콘텐츠 읽기전용 + bookmarks anon write" 로 확장(자세한 정책은 design.md).

**Env (`.env.local`)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable key(`sb_publishable_...`, legacy anon 대체). 브라우저 노출 안전. (secret 키 `sb_secret_...`는 서버 전용, 본 MVP 미사용.)


## 스펙 (Single Source of Truth)

이 프로젝트의 스펙·설계·작업은 OpenSpec change가 SSoT다. 코드보다 스펙이 상류다.

- 활성 change: `openspec/changes/hakjicon-content-search/`
  - 요구사항: `specs/content/spec.md`
  - 데이터 모델·API: `design.md`
  - 작업 목록: `tasks.md` (구현하며 `- [ ]` → `- [x]`로 체크)
- 새 작업은 `openspec list`로 change를 확인하고 `tasks.md`를 따른다.
- 스펙을 바꾸려면 코드가 아니라 **change 파일을 먼저 고친다.**