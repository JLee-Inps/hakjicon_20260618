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

## Active change: `add-content-search`

The first MVP change. Key decisions already locked in its `design.md` — honor these when implementing:

- **Search**: `title` + `description` via `ILIKE '%term%'` partial match. No tsvector/full-text, no vector/semantic search (Korean tokenization deliberately skipped for MVP).
- **Data access**: browser → Supabase **direct** via `@supabase/supabase-js` (publishable key + read-only RLS). No Next.js API route layer yet.
- **Data model**: single `contents` table (`id, title, author, category, description, cover_url`), seeded with ~10–20 dummy 학지사 books.
- **Out of scope (backlog)**: recommendation engine, auth, write/CRUD, category filter, sorting.

Implementation needs Supabase env vars (`.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the new publishable key (prefix `sb_publishable_...`), which replaces the legacy `anon` JWT key. Safe to expose in the browser; pair with read-only RLS. (Secret keys, prefix `sb_secret_...`, replace `service_role` and must stay server-side only — not used in this MVP.)


## 스펙 (Single Source of Truth)

이 프로젝트의 스펙·설계·작업은 OpenSpec change가 SSoT다. 코드보다 스펙이 상류다.

- 활성 change: `openspec/changes/hakjicon-content-search/`
  - 요구사항: `specs/content/spec.md`
  - 데이터 모델·API: `design.md`
  - 작업 목록: `tasks.md` (구현하며 `- [ ]` → `- [x]`로 체크)
- 새 작업은 `openspec list`로 change를 확인하고 `tasks.md`를 따른다.
- 스펙을 바꾸려면 코드가 아니라 **change 파일을 먼저 고친다.**